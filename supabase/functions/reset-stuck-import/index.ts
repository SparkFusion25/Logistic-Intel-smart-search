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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { import_id } = await req.json();

    if (!import_id) {
      return new Response(JSON.stringify({ error: 'import_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Resetting stuck import: ${import_id}`);

    // Reset the import status to uploaded so it can be reprocessed
    const { data, error } = await supabaseClient
      .from('bulk_imports')
      .update({ 
        status: 'uploaded',
        processed_records: 0,
        duplicate_records: 0,
        error_records: 0,
        processing_metadata: {},
        error_details: {},
        updated_at: new Date().toISOString()
      })
      .eq('id', import_id)
      .select();

    if (error) {
      console.error('Reset error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully reset import ${import_id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Import reset successfully',
      data 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in reset-stuck-import:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});