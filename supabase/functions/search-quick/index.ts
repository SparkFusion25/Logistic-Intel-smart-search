import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? '';
    const limit = parseInt(url.searchParams.get('limit') ?? '8');

    console.log('Quick search request:', { q, limit });

    if (!q || q.length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock quick search results
    const mockResults = [
      {
        type: 'company',
        id: '1',
        name: 'Samsung Electronics Co Ltd',
        subtitle: 'Seoul, KR • Consumer Electronics',
        url: '/dashboard/company/1'
      },
      {
        type: 'company',
        id: '2',
        name: 'Apple Inc',
        subtitle: 'Cupertino, CA • Technology',
        url: '/dashboard/company/2'
      },
      {
        type: 'contact',
        id: '1',
        name: 'Sarah Chen',
        subtitle: 'VP of Procurement at Apple Inc',
        url: '/dashboard/crm/contact/1'
      }
    ];

    // Simple filtering by query
    const filteredResults = mockResults
      .filter(result => 
        result.name.toLowerCase().includes(q.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(q.toLowerCase())
      )
      .slice(0, limit);

    console.log(`Quick search completed: ${filteredResults.length} results`);

    return new Response(JSON.stringify({
      results: filteredResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-quick function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});