import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { benchmarkData } = await req.json();
    
    if (!benchmarkData) {
      throw new Error('Benchmark data is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare analysis prompt
    const analysisPrompt = `
      Analyze this trade benchmark data and provide strategic insights:
      
      Data Summary:
      - Origin: ${benchmarkData.parameters.origin_country}
      - Product: ${benchmarkData.parameters.hs || 'All commodities'}
      - Total Trade Value: $${benchmarkData.totals.value}
      - Data Points: ${benchmarkData.statistics.count}
      - Median Monthly: $${benchmarkData.statistics.median}
      - Peak Monthly: $${benchmarkData.statistics.max}
      
      Monthly Trend Data:
      ${benchmarkData.series.map(d => `${d.month}: $${d.value}`).join('\n')}
      
      Provide analysis in this JSON format:
      {
        "opportunity": "One clear market opportunity in 1-2 sentences",
        "trend": "Key trend analysis in 1-2 sentences", 
        "recommendations": [
          "Specific actionable recommendation 1",
          "Specific actionable recommendation 2",
          "Specific actionable recommendation 3"
        ],
        "risk_factors": ["Risk 1", "Risk 2"],
        "seasonal_insights": "Seasonal pattern observation",
        "competitive_landscape": "Market competition insights"
      }
      
      Focus on actionable insights for logistics and trade companies.
    `;

    console.log('Sending request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert trade analyst specializing in logistics and global trade patterns. Always respond with valid JSON only.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_completion_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    console.log('OpenAI response received');

    let insights;
    try {
      insights = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback insights
      insights = {
        opportunity: "Market shows potential for increased trade volume based on historical patterns",
        trend: "Trade values demonstrate seasonal fluctuations with growth potential",
        recommendations: [
          "Monitor trade volume patterns for optimal timing",
          "Consider expanding services in this trade route", 
          "Develop partnerships with key market players"
        ]
      };
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI market insights error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      opportunity: "Analysis currently unavailable",
      trend: "Please try again later",
      recommendations: ["Check back for updated insights"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});