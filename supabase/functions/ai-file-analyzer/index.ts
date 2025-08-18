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

    // Create AI prompt for file analysis
    const analysisPrompt = `
You are an expert data analyst specializing in trade and logistics data. Analyze this ${file_type} file sample and provide intelligent insights.

FILENAME: ${filename}
FILE TYPE: ${file_type}
SAMPLE DATA (first 5 rows):
${JSON.stringify(file_sample, null, 2)}

Please analyze this data and provide:

1. FIELD MAPPING: Map the columns to standard trade data fields:
   - shipper_name, consignee_name
   - origin_country, origin_state, origin_city
   - destination_country, destination_state, destination_city
   - commodity_code, commodity_description
   - transportation_mode, weight_kg, value_usd
   - shipment_date, arrival_date

2. DATA QUALITY SCORE: Rate the data quality (1-10) based on:
   - Completeness of fields
   - Consistency of formats
   - Presence of null/empty values

3. SUGGESTED CLEANING: List specific data cleaning recommendations

4. PROCESSING RECOMMENDATIONS: Suggest optimal processing strategies

5. ESTIMATED PROCESSING TIME: Estimate based on data complexity

Respond in valid JSON format only:
{
  "field_mapping": { "original_column": "standard_field" },
  "data_quality_score": 8,
  "suggested_cleaning": ["Remove null values", "Standardize dates"],
  "processing_recommendations": ["Process in batches of 100", "Pre-filter invalid records"],
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
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert data analyst. Always respond with valid JSON only.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3
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
      // Fallback analysis
      analysis = {
        field_mapping: {},
        data_quality_score: 7,
        suggested_cleaning: ['Standard data validation recommended'],
        processing_recommendations: ['Process in standard batches'],
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