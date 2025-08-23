import { supabaseServer } from '@/lib/supabase-server';
import { s, lower, trim } from '@/lib/strings';

export interface ContactData {
  org_id: string;
  company_name?: string;
  full_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  country?: string;
  city?: string;
  panjiva_id?: string;
  source?: string;
  tags?: string[];
  notes?: string;
}

export interface CRMResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export async function upsertContact(contactData: ContactData): Promise<CRMResponse> {
  const supabase = supabaseServer();

  try {
    // Normalize email for matching
    const normalizedEmail = contactData.email ? lower(trim(contactData.email)) : null;
    
    // Prepare contact data
    const contact = {
      org_id: contactData.org_id,
      company_name: s(contactData.company_name),
      full_name: s(contactData.full_name),
      title: s(contactData.title),
      email: normalizedEmail,
      phone: s(contactData.phone),
      linkedin: s(contactData.linkedin),
      country: s(contactData.country),
      city: s(contactData.city),
      panjiva_id: s(contactData.panjiva_id) || null,
      source: contactData.source || 'trade-search',
      tags: contactData.tags || [],
      notes: s(contactData.notes)
    };

    // First try to find existing contact by panjiva_id (if provided)
    let existingContact = null;
    if (contact.panjiva_id) {
      const { data: panivaMatch } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('org_id', contact.org_id)
        .eq('panjiva_id', contact.panjiva_id)
        .single();
      
      existingContact = panivaMatch;
    }

    // If no panjiva match, try by email
    if (!existingContact && normalizedEmail) {
      const { data: emailMatch } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('org_id', contact.org_id)
        .ilike('email', normalizedEmail)
        .single();
      
      existingContact = emailMatch;
    }

    if (existingContact) {
      // Update existing contact
      const updateData = {
        ...contact,
        // Merge tags if they exist
        tags: [...new Set([...(existingContact.tags || []), ...(contact.tags || [])])],
        // Update notes if provided
        notes: contact.notes || existingContact.notes
      };

      const { data, error } = await supabase
        .from('crm_contacts')
        .update(updateData)
        .eq('id', existingContact.id)
        .select()
        .single();

      if (error) {
        console.error('Contact update error:', error);
        return {
          success: false,
          error: 'Failed to update contact'
        };
      }

      return {
        success: true,
        message: `Contact ${contact.full_name || contact.company_name} updated successfully`,
        data
      };
    } else {
      // Create new contact
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert(contact)
        .select()
        .single();

      if (error) {
        console.error('Contact creation error:', error);
        return {
          success: false,
          error: 'Failed to create contact'
        };
      }

      return {
        success: true,
        message: `Contact ${contact.full_name || contact.company_name} added to CRM`,
        data
      };
    }

  } catch (error) {
    console.error('CRM upsert error:', error);
    return {
      success: false,
      error: 'Failed to process contact'
    };
  }
}