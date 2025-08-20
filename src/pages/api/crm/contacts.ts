import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Add or update contact
    try {
      const contactData = req.body;
      
      const { data, error } = await supabase
        .from('crm_contacts')
        .upsert(contactData, { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, contact: data });
    } catch (error) {
      console.error('Handler error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // Get contacts with pagination
    try {
      const { page = 0, limit = 50, search } = req.query;
      
      let query = supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(Number(page) * Number(limit), (Number(page) + 1) * Number(limit) - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, contacts: data });
    } catch (error) {
      console.error('Handler error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}