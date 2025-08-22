import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyAnalysisRequest {
  importId: string;
  companyName: string;
  filename: string;
  orgId?: string;
}

interface OpenAICompanyInsight {
  industry?: string;
  company_size?: string;
  business_model?: string;
  trade_patterns?: string[];
  risk_factors?: string[];
  opportunities?: string[];
  competitive_advantage?: string;
  market_position?: string;
  key_strengths?: string[];
  growth_indicators?: string[];
}

// @ts-ignore
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Company Processor invoked');
    
    const { importId, companyName, filename, orgId }: CompanyAnalysisRequest = await req.json();
    
    if (!importId || !companyName) {
      throw new Error('Missing required parameters: importId and companyName');
    }

    console.log(`Processing AI analysis for company: ${companyName}, import: ${importId}`);

    // Initialize Supabase URLs
    // @ts-ignore
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    // @ts-ignore
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get OpenAI API key
    // @ts-ignore
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Query shipment data for the company
    console.log('Querying shipments for company...');
    const shipmentsUrl = `${supabaseUrl}/rest/v1/unified_shipments?select=*&unified_company_name=ilike.%25${encodeURIComponent(companyName)}%25&limit=50&order=unified_date.desc`;
    const shipmentsResponse = await fetch(shipmentsUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    let shipments: any[] = [];
    let shipmentError: { message: string } | null = null;
    
    if (!shipmentsResponse.ok) {
      shipmentError = { message: `HTTP ${shipmentsResponse.status}` };
    } else {
      shipments = await shipmentsResponse.json();
    }

    if (shipmentError) {
      console.error('Error querying shipments:', shipmentError);
      throw new Error(`Database query failed: ${shipmentError.message}`);
    }

    console.log(`Found ${shipments?.length || 0} shipments for analysis`);

    // Prepare data for AI analysis
    const shipmentSummary = shipments?.map((s: any) => ({
      mode: s.mode,
      date: s.unified_date,
      origin: s.origin_country,
      destination: s.destination_country,
      commodity: s.description || s.commodity_description,
      value: s.value_usd,
      carrier: s.unified_carrier
    })) || [];

    // Create AI analysis prompt
    const prompt = `Analyze the following company's trade data and provide business insights:

Company: ${companyName}
Recent Shipments: ${JSON.stringify(shipmentSummary, null, 2)}

Please provide a structured analysis with the following insights:
1. Primary industry/business sector
2. Company size estimation (small/medium/large)
3. Business model characteristics
4. Trade patterns and preferences
5. Potential risk factors
6. Growth opportunities
7. Competitive advantages
8. Market position
9. Key operational strengths
10. Growth indicators

Return your analysis as valid JSON with these keys:
{
  "industry": "primary industry sector",
  "company_size": "small/medium/large",
  "business_model": "description of business model",
  "trade_patterns": ["pattern1", "pattern2"],
  "risk_factors": ["risk1", "risk2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "competitive_advantage": "main competitive advantage",
  "market_position": "market position description",
  "key_strengths": ["strength1", "strength2"],
  "growth_indicators": ["indicator1", "indicator2"]
}`;

    // Call OpenAI API
    console.log('Calling OpenAI API for company analysis...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst specializing in international trade and logistics. Analyze trade data to provide actionable business insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API failed: ${openaiResponse.status}`);
    }

    const aiResult = await openaiResponse.json();
    const aiContent = aiResult.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content received from OpenAI');
    }

    console.log('AI analysis completed, processing results...');

    // Parse AI response
    let aiInsights: OpenAICompanyInsight = {};
    try {
      aiInsights = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: create basic insights from available data
      const modes = shipments?.map((s: any) => s.mode).filter((m: any) => m) || [];
      const uniqueModes = Array.from(new Set(modes));
      
      aiInsights = {
        industry: 'Trade & Logistics',
        company_size: shipments && shipments.length > 20 ? 'large' : shipments && shipments.length > 5 ? 'medium' : 'small',
        business_model: 'International trade company',
        trade_patterns: uniqueModes as string[],
        risk_factors: ['Market volatility', 'Regulatory changes'],
        opportunities: ['Market expansion', 'Digital transformation']
      };
    }

    // Calculate trade metrics
    const totalShipments = shipments?.length || 0;
    const totalValue = shipments?.reduce((sum: number, s: any) => sum + (s.value_usd || 0), 0) || 0;
    const avgValue = totalShipments > 0 ? totalValue / totalShipments : 0;
    const airShipments = shipments?.filter((s: any) => s.mode === 'air').length || 0;
    const oceanShipments = shipments?.filter((s: any) => s.mode === 'ocean').length || 0;
    
    const origins = shipments?.map((s: any) => s.origin_country).filter((c: any) => c) || [];
    const destinations = shipments?.map((s: any) => s.destination_country).filter((c: any) => c) || [];
    const commodities = shipments?.map((s: any) => s.description || s.commodity_description).filter((c: any) => c) || [];
    
    const uniqueOrigins = Array.from(new Set(origins));
    const uniqueDestinations = Array.from(new Set(destinations));
    const topCommodities = Array.from(new Set(commodities));

    // Update or create company trade profile
    const profileData = {
      org_id: orgId || 'bb997b6b-fa1a-46c8-9957-fabe835eee55',
      company_name: companyName,
      total_shipments: totalShipments,
      total_air_shipments: airShipments,
      total_ocean_shipments: oceanShipments,
      total_trade_value_usd: totalValue,
      avg_shipment_value_usd: avgValue,
      top_origin_countries: uniqueOrigins.slice(0, 5),
      top_destination_countries: uniqueDestinations.slice(0, 5),
      top_commodities: topCommodities.slice(0, 5),
      enriched_company_data: {
        ai_insights: aiInsights,
        analysis_metadata: {
          processed_at: new Date().toISOString(),
          import_id: importId,
          filename: filename,
          shipments_analyzed: totalShipments,
          ai_model: 'gpt-4o-mini'
        }
      },
      contact_enrichment_status: 'ai_completed',
      updated_at: new Date().toISOString()
    };

    // Upsert company trade profile
    console.log('Saving company trade profile...');
    const profileUrl = `${supabaseUrl}/rest/v1/company_trade_profiles`;
    const profileResponse = await fetch(profileUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(profileData)
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Error upserting company profile:', errorText);
      throw new Error(`Failed to save company profile: HTTP ${profileResponse.status}`);
    }

    // Update bulk import status
    console.log('Updating bulk import status...');
    const updateData = {
      ai_processing_status: 'completed',
      processing_metadata: {
        companies_processed: 1,
        last_processed_company: companyName,
        completed_at: new Date().toISOString()
      }
    };

    const importUpdateUrl = `${supabaseUrl}/rest/v1/bulk_imports?id=eq.${importId}`;
    const importUpdateResponse = await fetch(importUpdateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!importUpdateResponse.ok) {
      console.error('Error updating import status - non-fatal');
      // Don't throw here - the main processing succeeded
    }

    console.log(`AI processing completed successfully for ${companyName}`);

    return new Response(JSON.stringify({
      success: true,
      company: companyName,
      insights: aiInsights,
      metrics: {
        total_shipments: totalShipments,
        total_value_usd: totalValue,
        avg_value_usd: avgValue,
        air_shipments: airShipments,
        ocean_shipments: oceanShipments,
        unique_origins: uniqueOrigins.length,
        unique_destinations: uniqueDestinations.length
      },
      processed_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-company-processor:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});