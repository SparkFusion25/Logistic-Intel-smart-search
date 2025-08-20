import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  contacts_visible: boolean;
  email_reveals: number;
  phone_reveals: number;
  enrichment_calls: number;
  pdf_exports: number;
  campaign_sends: number;
  advanced_filters: boolean;
  api_access: boolean;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    contacts_visible: false, // Masked contacts
    email_reveals: 0,
    phone_reveals: 0,
    enrichment_calls: 5,
    pdf_exports: 1,
    campaign_sends: 0,
    advanced_filters: false,
    api_access: false
  },
  pro: {
    contacts_visible: true, // Full contact visibility
    email_reveals: 100,
    phone_reveals: 50,
    enrichment_calls: 500,
    pdf_exports: 50,
    campaign_sends: 1000,
    advanced_filters: true,
    api_access: false
  },
  enterprise: {
    contacts_visible: true,
    email_reveals: -1, // Unlimited
    phone_reveals: -1,
    enrichment_calls: -1,
    pdf_exports: -1,
    campaign_sends: -1,
    advanced_filters: true,
    api_access: true
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { user_id, action, feature } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id required' });
  }

  try {
    // Get user's current plan (default to free if not found)
    const { data: userPlan, error: planError } = await supabase
      .from('user_plans')
      .select('plan_type, usage_counts')
      .eq('user_id', user_id)
      .single();

    const currentPlan: PlanType = userPlan?.plan_type || 'free';
    const limits = PLAN_LIMITS[currentPlan];
    const usage = userPlan?.usage_counts || {};

    // Check specific feature limits
    let allowed = true;
    let reason = '';

    switch (feature) {
      case 'contact_view':
        allowed = limits.contacts_visible;
        reason = allowed ? '' : 'Upgrade to Pro to view full contact details';
        break;

      case 'email_reveal':
        if (limits.email_reveals === -1) {
          allowed = true;
        } else {
          const used = usage.email_reveals || 0;
          allowed = used < limits.email_reveals;
          reason = allowed ? '' : `Email reveal limit reached (${limits.email_reveals}/month)`;
        }
        break;

      case 'enrichment':
        if (limits.enrichment_calls === -1) {
          allowed = true;
        } else {
          const used = usage.enrichment_calls || 0;
          allowed = used < limits.enrichment_calls;
          reason = allowed ? '' : `Enrichment limit reached (${limits.enrichment_calls}/month)`;
        }
        break;

      case 'pdf_export':
        if (limits.pdf_exports === -1) {
          allowed = true;
        } else {
          const used = usage.pdf_exports || 0;
          allowed = used < limits.pdf_exports;
          reason = allowed ? '' : `PDF export limit reached (${limits.pdf_exports}/month)`;
        }
        break;

      case 'campaign_send':
        if (limits.campaign_sends === -1) {
          allowed = true;
        } else {
          const used = usage.campaign_sends || 0;
          allowed = used < limits.campaign_sends;
          reason = allowed ? '' : `Campaign send limit reached (${limits.campaign_sends}/month)`;
        }
        break;

      case 'advanced_filters':
        allowed = limits.advanced_filters;
        reason = allowed ? '' : 'Upgrade to Pro for advanced filtering';
        break;

      case 'api_access':
        allowed = limits.api_access;
        reason = allowed ? '' : 'API access available in Enterprise plan';
        break;

      default:
        allowed = true;
    }

    // If action is 'increment', update usage
    if (action === 'increment' && allowed) {
      const newUsage = { ...usage };
      const usageKey = `${feature}s` as keyof typeof usage;
      newUsage[usageKey] = (newUsage[usageKey] || 0) + 1;

      await supabase
        .from('user_plans')
        .upsert({
          user_id,
          plan_type: currentPlan,
          usage_counts: newUsage
        }, { onConflict: 'user_id' });
    }

    return res.status(200).json({
      success: true,
      allowed,
      reason,
      current_plan: currentPlan,
      limits: limits,
      usage: usage
    });

  } catch (error) {
    console.error('Plan check error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}