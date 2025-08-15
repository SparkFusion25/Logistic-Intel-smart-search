import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  userId?: string;
  userIds?: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  options?: {
    icon?: string;
    badge?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    tag?: string;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  };
}

/**
 * Send push notification to users
 */
export async function sendNotification(notification: NotificationData): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: notification
    });

    if (error) {
      console.error('Error sending notification:', error);
      return false;
    }

    console.log('Notification sent:', data);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

/**
 * Send campaign notification
 */
export async function sendCampaignNotification(
  userIds: string[],
  campaignName: string,
  eventType: 'started' | 'completed' | 'opened' | 'clicked'
): Promise<boolean> {
  const titles = {
    started: `Campaign "${campaignName}" Started`,
    completed: `Campaign "${campaignName}" Completed`,
    opened: `Email Opened in "${campaignName}"`,
    clicked: `Link Clicked in "${campaignName}"`
  };

  const bodies = {
    started: `Your email campaign has started and is now sending emails to your contacts.`,
    completed: `Your email campaign has finished. Check the results in your dashboard.`,
    opened: `A recipient has opened an email from your campaign.`,
    clicked: `A recipient has clicked a link in your campaign email.`
  };

  return sendNotification({
    userIds,
    title: titles[eventType],
    body: bodies[eventType],
    data: {
      type: 'campaign',
      campaign: campaignName,
      event: eventType,
      url: '/dashboard/campaigns'
    },
    options: {
      icon: '/favicon.ico',
      tag: `campaign-${eventType}`,
      requireInteraction: eventType === 'completed'
    }
  });
}

/**
 * Send CRM contact notification
 */
export async function sendCRMNotification(
  userIds: string[],
  contactName: string,
  eventType: 'added' | 'updated' | 'enriched'
): Promise<boolean> {
  const titles = {
    added: 'New Contact Added',
    updated: 'Contact Updated', 
    enriched: 'Contact Enriched'
  };

  const bodies = {
    added: `${contactName} has been added to your CRM.`,
    updated: `${contactName}'s information has been updated.`,
    enriched: `Additional data found for ${contactName}.`
  };

  return sendNotification({
    userIds,
    title: titles[eventType],
    body: bodies[eventType],
    data: {
      type: 'crm',
      contact: contactName,
      event: eventType,
      url: '/dashboard/crm'
    },
    options: {
      icon: '/favicon.ico',
      tag: `crm-${eventType}`
    }
  });
}

/**
 * Send search alert notification
 */
export async function sendSearchAlertNotification(
  userIds: string[],
  searchQuery: string,
  newResultsCount: number
): Promise<boolean> {
  return sendNotification({
    userIds,
    title: 'New Search Results',
    body: `${newResultsCount} new shipments found for "${searchQuery}"`,
    data: {
      type: 'search',
      query: searchQuery,
      results: newResultsCount,
      url: '/dashboard/search-intelligence'
    },
    options: {
      icon: '/favicon.ico',
      tag: 'search-alert',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Results'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }
  });
}

/**
 * Test notification - useful for debugging
 */
export async function sendTestNotification(userId: string): Promise<boolean> {
  return sendNotification({
    userId,
    title: 'Test Notification',
    body: 'This is a test notification from Logistic Intel',
    data: {
      type: 'test',
      timestamp: Date.now()
    },
    options: {
      icon: '/favicon.ico',
      tag: 'test'
    }
  });
}