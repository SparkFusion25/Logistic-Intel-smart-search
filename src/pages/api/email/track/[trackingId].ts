import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

// 1x1 transparent pixel
const TRACKING_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { trackingId } = req.query;

  if (req.method === 'GET') {
    // Track email open
    try {
      await supabase
        .from('tracking_events')
        .insert({
          tracking_id: trackingId as string,
          event_type: 'email_opened',
          opened_at: new Date().toISOString(),
          user_agent: req.headers['user-agent'],
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          metadata: {
            referer: req.headers.referer
          }
        });
    } catch (error) {
      console.error('Failed to track email open:', error);
    }

    // Return tracking pixel
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.send(TRACKING_PIXEL);
  }

  if (req.method === 'POST') {
    // Track email click
    const { url, linkText } = req.body;
    
    try {
      await supabase
        .from('tracking_events')
        .insert({
          tracking_id: trackingId as string,
          event_type: 'email_clicked',
          clicked_at: new Date().toISOString(),
          user_agent: req.headers['user-agent'],
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          metadata: {
            clicked_url: url,
            link_text: linkText,
            referer: req.headers.referer
          }
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to track email click:', error);
      return res.status(500).json({ success: false, error: 'Tracking failed' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}