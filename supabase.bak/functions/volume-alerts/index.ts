import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { period = '1month', alert_type } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate date ranges based on period
    const periodMap = {
      '1month': 30,
      '3month': 90,
      '6month': 180,
      '1year': 365
    };
    
    const days = periodMap[period] || 30;
    const currentDate = new Date();
    const periodStart = new Date(currentDate.getTime() - (days * 24 * 60 * 60 * 1000));
    const previousPeriodStart = new Date(periodStart.getTime() - (days * 24 * 60 * 60 * 1000));

    console.log(`Analyzing volume changes for period: ${period} (${days} days)`);

    // Query recent shipment data
    const { data: recentData, error: recentError } = await supabase
      .from('unified_shipments')
      .select('unified_company_name, value_usd, unified_date')
      .gte('unified_date', periodStart.toISOString().split('T')[0])
      .not('unified_company_name', 'is', null)
      .not('value_usd', 'is', null);

    if (recentError) {
      console.error('Recent data query error:', recentError);
      throw recentError;
    }

    // Query previous period data
    const { data: previousData, error: previousError } = await supabase
      .from('unified_shipments') 
      .select('unified_company_name, value_usd, unified_date')
      .gte('unified_date', previousPeriodStart.toISOString().split('T')[0])
      .lt('unified_date', periodStart.toISOString().split('T')[0])
      .not('unified_company_name', 'is', null)
      .not('value_usd', 'is', null);

    if (previousError) {
      console.error('Previous data query error:', previousError);
      throw previousError;
    }

    // Aggregate data by company
    const aggregateByCompany = (data: any[]) => {
      const companies = new Map();
      data.forEach(row => {
        const company = row.unified_company_name;
        const value = parseFloat(row.value_usd) || 0;
        
        if (companies.has(company)) {
          companies.set(company, companies.get(company) + value);
        } else {
          companies.set(company, value);
        }
      });
      return companies;
    };

    const recentVolumes = aggregateByCompany(recentData || []);
    const previousVolumes = aggregateByCompany(previousData || []);

    // Identify alerts
    const alerts = [];
    const significantChangeThreshold = 50; // 50% change threshold
    const newShipperThreshold = 10000; // $10k minimum volume for new shippers

    for (const [company, currentVolume] of recentVolumes) {
      const previousVolume = previousVolumes.get(company) || 0;
      
      let alertType = null;
      let changePercentage = 0;
      
      if (previousVolume === 0 && currentVolume >= newShipperThreshold) {
        alertType = 'new_shipper';
        changePercentage = 100;
      } else if (previousVolume > 0) {
        changePercentage = ((currentVolume - previousVolume) / previousVolume) * 100;
        
        if (Math.abs(changePercentage) >= significantChangeThreshold) {
          alertType = changePercentage > 0 ? 'volume_increase' : 'volume_decrease';
        }
      }
      
      if (alertType && (!alert_type || alert_type === alertType)) {
        alerts.push({
          company_name: company,
          alert_type: alertType,
          current_volume: currentVolume,
          previous_volume: previousVolume,
          change_percentage: changePercentage
        });
      }
    }

    // Sort by significance and limit to top 10
    alerts.sort((a, b) => Math.abs(b.change_percentage) - Math.abs(a.change_percentage));
    const topAlerts = alerts.slice(0, 10);

    // Generate AI insights for each alert
    if (openAIApiKey && topAlerts.length > 0) {
      console.log('Generating AI insights for alerts...');
      
      const alertsWithInsights = await Promise.all(
        topAlerts.map(async (alert, index) => {
          try {
            const insightPrompt = `
              Analyze this trade volume alert and provide a brief insight:
              
              Company: ${alert.company_name}
              Alert Type: ${alert.alert_type}
              Current Volume: $${alert.current_volume.toLocaleString()}
              Previous Volume: $${alert.previous_volume.toLocaleString()}
              Change: ${alert.change_percentage.toFixed(1)}%
              Period: ${period}
              
              Provide a concise 1-2 sentence insight about what this means and any recommendations.
            `;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-5-mini-2025-08-07',
                messages: [
                  { role: 'system', content: 'You are a trade analyst. Provide brief, actionable insights.' },
                  { role: 'user', content: insightPrompt }
                ],
                max_completion_tokens: 150
              }),
            });

            let insights = "Significant volume change detected - worth investigating for business opportunities.";
            if (response.ok) {
              const aiData = await response.json();
              insights = aiData.choices[0].message.content.trim();
            }

            return {
              id: `alert_${index}`,
              ...alert,
              period,
              confidence: Math.min(95, Math.max(60, 100 - Math.abs(alert.change_percentage - 100) / 2)),
              insights,
              first_detected: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error generating insights for alert ${index}:`, error);
            return {
              id: `alert_${index}`,
              ...alert,
              period,
              confidence: 75,
              insights: "Significant volume change detected - worth investigating for business opportunities.",
              first_detected: new Date().toISOString()
            };
          }
        })
      );

      return new Response(JSON.stringify({ 
        alerts: alertsWithInsights,
        period,
        total_companies_analyzed: recentVolumes.size + previousVolumes.size
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return alerts without AI insights if OpenAI not available
    const simpleAlerts = topAlerts.map((alert, index) => ({
      id: `alert_${index}`,
      ...alert,
      period,
      confidence: 75,
      insights: "Significant volume change detected - worth investigating for business opportunities.",
      first_detected: new Date().toISOString()
    }));

    return new Response(JSON.stringify({ 
      alerts: simpleAlerts,
      period,
      total_companies_analyzed: recentVolumes.size + previousVolumes.size
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Volume alerts error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      alerts: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});