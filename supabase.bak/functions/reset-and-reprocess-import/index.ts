import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { import_id } = await req.json();
    
    if (!import_id) {
      return new Response(JSON.stringify({ error: 'import_id is required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Resetting and reprocessing import ${import_id} with flexible validation`);

    // Reset the import status
    const { error: resetError } = await supabaseClient
      .from('bulk_imports')
      .update({ 
        status: 'uploaded',
        processed_records: 0,
        error_records: 0,
        total_records: 0,
        error_details: '{}',
        processing_metadata: '{}',
        completed_at: null
      })
      .eq('id', import_id);

    if (resetError) {
      console.error('Error resetting import:', resetError);
      return new Response(JSON.stringify({ error: resetError.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the import details
    const { data: importData, error: fetchError } = await supabaseClient
      .from('bulk_imports')
      .select('*')
      .eq('id', import_id)
      .single();

    if (fetchError || !importData) {
      console.error('Error fetching import data:', fetchError);
      return new Response(JSON.stringify({ error: 'Import not found' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Import reset successfully. Triggering reprocessing with flexible validation...`);

    // Trigger the bulk import processor with the flexible validation
    const { data: processResult, error: processError } = await supabaseClient.functions.invoke('bulk-import-processor', {
      body: {
        import_id: import_id,
        file_path: importData.file_path,
        file_type: importData.file_type
      }
    });

    if (processError) {
      console.error('Error triggering processor:', processError);
      return new Response(JSON.stringify({ 
        error: 'Failed to trigger processor', 
        details: processError.message 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Reprocessing triggered successfully with flexible validation');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Import reset and reprocessing triggered with flexible validation',
      import_id: import_id,
      processor_response: processResult
    }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in reset-and-reprocess-import:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});