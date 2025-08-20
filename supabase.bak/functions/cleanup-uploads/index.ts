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

    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get('org_id') || 'bb997b6b-fa1a-46c8-9957-fabe835eee55'
    const since = searchParams.get('since') || '2025-08-19 05:20:00'

    console.log(`Cleaning up uploads since ${since} for org ${orgId}`)

    // Delete unified_shipments records
    const { data: deletedShipments, error: shipmentsError } = await supabaseClient
      .from('unified_shipments')
      .delete()
      .gte('created_at', since)
      .eq('org_id', orgId)
      .select('count')

    if (shipmentsError) {
      console.error('Error deleting shipments:', shipmentsError)
      throw shipmentsError
    }

    // Delete bulk_imports records
    const { data: deletedImports, error: importsError } = await supabaseClient
      .from('bulk_imports')
      .delete()
      .gte('created_at', since)
      .eq('org_id', orgId)
      .select('count')

    if (importsError) {
      console.error('Error deleting imports:', importsError)
      throw importsError
    }

    console.log('Cleanup completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Upload records cleaned up successfully',
        deleted_shipments: deletedShipments?.length || 0,
        deleted_imports: deletedImports?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in cleanup:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})