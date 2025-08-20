import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    contact_id,
    event_type, // 'apollo_enrichment', 'phantombuster_enrichment', 'manual_add', etc.
    source_data,
    enrichment_provider,
    success,
    error_message,
    metadata
  } = req.body;

  if (!contact_id || !event_type) {
    return res.status(400).json({ 
      success: false, 
      error: 'contact_id and event_type are required' 
    });
  }

  try {
    const { data, error } = await supabase
      .from('enrichment_events')
      .insert({
        contact_id,
        event_type,
        source_data,
        enrichment_provider,
        success: success !== undefined ? success : true,
        error_message,
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to track enrichment event:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, event: data });

  } catch (error) {
    console.error('Enrichment tracking error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}