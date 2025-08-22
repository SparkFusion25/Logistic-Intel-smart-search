import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showNewShipperToast } from '@/components/alerts/NewShipperToast';
import { toast } from 'sonner';

type NewShipperAlert = {
  id: string;
  company_name: string;
  detected_at: string;
  window_months: number;
  emailed: boolean;
  viewed: boolean;
  payload: any;
};

export function useNewShipperAlerts() {
  const [alerts, setAlerts] = useState<NewShipperAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch alerts
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('new_shipper_alerts')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const alertsData = data as NewShipperAlert[];
      setAlerts(alertsData);
      setUnreadCount(alertsData.filter(alert => !alert.viewed).length);

      // Show toast for new unread alerts
      const newAlerts = alertsData.filter(alert => !alert.viewed);
      newAlerts.slice(0, 3).forEach(alert => { // Limit to 3 toasts
        showNewShipperToast(
          {
            companyName: alert.company_name,
            shipments30d: alert.payload?.shipments_30d || 1,
            lastDate: new Date(alert.detected_at).toLocaleDateString(),
            originPort: alert.payload?.top_origin || 'Unknown',
            destinationPort: alert.payload?.top_destination || 'Unknown',
            mode: alert.payload?.primary_mode || 'ocean',
            tradeValue: alert.payload?.trade_value_30d,
          },
          {
            onViewCompany: (companyName) => {
              // Navigate to company details
              console.log('View company:', companyName);
            },
            onAddToCRM: async (companyName) => {
              await addCompanyToCRM(companyName);
            },
            onDismiss: () => {
              markAsViewed(alert.id);
            }
          }
        );
      });

    } catch (error) {
      console.error('Error fetching new shipper alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark alert as viewed
  const markAsViewed = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('new_shipper_alerts')
        .update({ viewed: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, viewed: true } : alert
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as viewed:', error);
    }
  };

  // Add company to CRM
  const addCompanyToCRM = async (companyName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to add companies to CRM');
        return;
      }

      const { error } = await supabase.from('crm_contacts').insert({
        org_id: user.id,
        company_name: companyName,
        source: 'new_shipper_alert',
        notes: `Added from new shipper alert on ${new Date().toLocaleDateString()}`,
        tags: ['new_shipper', 'alert', 'prospect']
      });

      if (error) throw error;
      
      toast.success(`Added ${companyName} to CRM successfully!`);
    } catch (error) {
      console.error('Error adding company to CRM:', error);
      toast.error('Failed to add company to CRM');
    }
  };

  // Update user alert preferences
  const updateAlertPreferences = async (preferences: {
    new_shipper_threshold_days?: number;
    email_alerts?: boolean;
    inapp_alerts?: boolean;
    daily_digest?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Alert preferences updated successfully');
    } catch (error) {
      console.error('Error updating alert preferences:', error);
      toast.error('Failed to update alert preferences');
    }
  };

  // Real-time subscription for new alerts
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('new_shipper_alerts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'new_shipper_alerts',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newAlert = payload.new as NewShipperAlert;
            setAlerts(prev => [newAlert, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show toast for new alert
            showNewShipperToast(
              {
                companyName: newAlert.company_name,
                shipments30d: newAlert.payload?.shipments_30d || 1,
                lastDate: new Date(newAlert.detected_at).toLocaleDateString(),
                originPort: newAlert.payload?.top_origin || 'Unknown',
                destinationPort: newAlert.payload?.top_destination || 'Unknown',
                mode: newAlert.payload?.primary_mode || 'ocean',
                tradeValue: newAlert.payload?.trade_value_30d,
              },
              {
                onViewCompany: (companyName) => {
                  console.log('View company:', companyName);
                },
                onAddToCRM: addCompanyToCRM,
                onDismiss: () => markAsViewed(newAlert.id)
              }
            );
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupSubscription();
    
    // Initial fetch
    fetchAlerts();
  }, []);

  return {
    alerts,
    unreadCount,
    loading,
    fetchAlerts,
    markAsViewed,
    addCompanyToCRM,
    updateAlertPreferences
  };
}