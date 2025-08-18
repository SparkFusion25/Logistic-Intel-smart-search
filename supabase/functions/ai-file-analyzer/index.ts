import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileAnalysisRequest {
  import_id: string;
  file_sample: any[]; // First few rows of the file
  file_type: string;
  filename: string;
}

interface AIAnalysisResult {
  field_mapping: Record<string, string>;
  data_quality_score: number;
  suggested_cleaning: string[];
  processing_recommendations: string[];
  estimated_processing_time: string;
  data_source_type: 'panjiva' | 'bts' | 'census' | 'unknown';
  enrichment_strategy: string[];
  company_identification_method?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { import_id, file_sample, file_type, filename }: FileAnalysisRequest = await req.json();

    console.log(`AI analyzing file: ${filename} for import ${import_id}`);

    // Detect data source from filename and content
    const detectDataSource = (filename: string, sample: any[]) => {
      const lowerFilename = filename.toLowerCase();
      if (lowerFilename.includes('panjiva') || sample.some(row => 
        Object.keys(row || {}).some(key => key.toLowerCase().includes('shipper') || key.toLowerCase().includes('consignee'))
      )) {
        return 'panjiva';
      }
      if (lowerFilename.includes('bts') || lowerFilename.includes('bureau')) {
        return 'bts';
      }
      if (lowerFilename.includes('census') || lowerFilename.includes('trade')) {
        return 'census';
      }
      return 'unknown';
    };

    const dataSource = detectDataSource(filename, file_sample);

    // Create AI prompt for file analysis
    const analysisPrompt = `
You are an expert data analyst specializing in trade and logistics data. Analyze this ${file_type} file sample and provide intelligent insights.

CRITICAL CONTEXT - DATA SOURCE REQUIREMENTS:
- PANJIVA: Contains company names (shipper/consignee). Rich entity data for enrichment.
- BTS (Bureau of Transportation Statistics): NO company names. Uses routes, carriers, airports. Enrichment via route analysis.
- CENSUS: NO company names. Aggregate trade data by commodity/country. Enrichment via pattern matching.

FILENAME: ${filename}
FILE TYPE: ${file_type}
DETECTED SOURCE: ${dataSource}
SAMPLE DATA (first 5 rows):
${JSON.stringify(file_sample, null, 2)}

ANALYSIS REQUIREMENTS:

1. FIELD MAPPING: Map columns to standard fields based on data source:
   PANJIVA: shipper_name, consignee_name, origin_country, destination_country, commodity_code, commodity_description, weight_kg, value_usd, shipment_date, arrival_date
   BTS: carrier_name, origin_airport, destination_airport, freight_kg, route_id
   CENSUS: commodity, commodity_name, country, state, transport_mode, value_usd, weight_kg, year, month

2. DATA SOURCE TYPE: Identify as 'panjiva', 'bts', 'census', or 'unknown'

3. ENRICHMENT STRATEGY: Specify how to enrich missing company data:
   PANJIVA: "Direct company matching via shipper/consignee names"
   BTS: "Route-based inference via airport-to-company mapping"
   CENSUS: "Pattern matching via commodity-country correlation"

4. COMPANY IDENTIFICATION METHOD: For BTS/CENSUS without company names:
   BTS: "Airport location + freight volume analysis"
   CENSUS: "Commodity specialization + geographic patterns"

5. DATA QUALITY SCORE: Rate 1-10 considering:
   - Field completeness for source type
   - Data consistency and format quality
   - Enrichment potential given source limitations

6. SUGGESTED CLEANING: Source-specific recommendations
7. PROCESSING RECOMMENDATIONS: Tailored to source type and enrichment needs
8. ESTIMATED PROCESSING TIME: Based on complexity and enrichment requirements

Respond in valid JSON format only:
{
  "field_mapping": { "original_column": "standard_field" },
  "data_source_type": "panjiva|bts|census|unknown",
  "data_quality_score": 8,
  "enrichment_strategy": ["Strategy 1", "Strategy 2"],
  "company_identification_method": "Method description",
  "suggested_cleaning": ["Clean action 1", "Clean action 2"],
  "processing_recommendations": ["Recommendation 1", "Recommendation 2"],
  "estimated_processing_time": "2-3 minutes"
}`;

    // Call OpenAI API
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
            content: 'You are an expert trade data analyst with deep knowledge of Panjiva, BTS, and Census data sources. Always respond with valid JSON only.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_completion_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0].message.content;

    console.log('Raw AI response:', aiContent);

    // Parse AI response
    let analysis: AIAnalysisResult;
    try {
      analysis = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback analysis with enrichment awareness
      const detectedSource = detectDataSource(filename, file_sample);
      analysis = {
        field_mapping: {},
        data_source_type: detectedSource,
        data_quality_score: 7,
        enrichment_strategy: detectedSource === 'panjiva' 
          ? ['Direct company name matching'] 
          : detectedSource === 'bts'
          ? ['Route-based company inference', 'Airport location mapping']
          : ['Commodity pattern analysis', 'Geographic correlation'],
        company_identification_method: detectedSource === 'panjiva'
          ? 'Direct from shipper/consignee fields'
          : detectedSource === 'bts'
          ? 'Infer from airport routes and cargo volumes'
          : 'Pattern matching via trade specialization',
        suggested_cleaning: ['Standard data validation recommended'],
        processing_recommendations: ['Process in standard batches', 'Apply source-specific enrichment'],
        estimated_processing_time: '3-5 minutes'
      };
    }

    // Store AI analysis in database
    await supabaseClient
      .from('bulk_imports')
      .update({
        processing_metadata: {
          ai_analysis: analysis,
          analyzed_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', import_id);

    console.log(`AI analysis completed for import ${import_id}`);

    return new Response(JSON.stringify({
      success: true,
      analysis,
      message: 'AI analysis completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI file analyzer:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});