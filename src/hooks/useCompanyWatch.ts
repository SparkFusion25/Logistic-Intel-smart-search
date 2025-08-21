import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type WatchAlertType = 'volume_change' | 'new_destination' | 'seasonal_spike' | 'new_commodity' | 'new_shipper';

export interface WatchAlert {
  id: string;
  company_name: string;
  alert_type: WatchAlertType;
  threshold?: number;
  email_enabled: boolean;
  popup_enabled: boolean;
  created_at: string;
  is_active: boolean;
}

export function useCompanyWatch() {
  const [alerts, setAlerts] = useState<WatchAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const createAlert = useCallback(async (
    companyName: string,
    alertType: WatchAlertType,
    options: {
      threshold?: number;
      emailEnabled?: boolean;
      popupEnabled?: boolean;
    } = {}
  ) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('Please log in to create alerts');
        return { success: false };
      }

      // For now, we'll store these as notifications in a simple format
      // In a real app, you'd have a dedicated alerts/notifications table
      const alertData = {
        org_id: user.user.id,
        type: 'company_watch',
        title: `Watching ${companyName}`,
        message: `Monitoring ${companyName} for ${alertType.replace('_', ' ')}`,
        metadata: {
          company_name: companyName,
          alert_type: alertType,
          threshold: options.threshold,
          email_enabled: options.emailEnabled || false,
          popup_enabled: options.popupEnabled || true
        },
        is_read: false
      };

      // Since we don't have a notifications table in the current schema,
      // we'll simulate this functionality
      const newAlert: WatchAlert = {
        id: `alert_${Date.now()}`,
        company_name: companyName,
        alert_type: alertType,
        threshold: options.threshold,
        email_enabled: options.emailEnabled || false,
        popup_enabled: options.popupEnabled || true,
        created_at: new Date().toISOString(),
        is_active: true
      };

      setAlerts(prev => [...prev, newAlert]);
      
      toast.success(`Now watching ${companyName} for ${alertType.replace('_', ' ')}`);
      
      return { success: true, alert: newAlert };
    } catch (error) {
      console.error('Failed to create alert:', error);
      toast.error('Failed to create alert');
      return { success: false, error: 'Failed to create alert' };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAlert = useCallback(async (alertId: string) => {
    try {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert removed successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to remove alert:', error);
      toast.error('Failed to remove alert');
      return { success: false, error: 'Failed to remove alert' };
    }
  }, []);

  const toggleAlert = useCallback(async (alertId: string, isActive: boolean) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_active: isActive } : alert
        )
      );
      toast.success(`Alert ${isActive ? 'activated' : 'deactivated'}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to toggle alert:', error);
      toast.error('Failed to update alert');
      return { success: false, error: 'Failed to update alert' };
    }
  }, []);

  const getCompanyAlerts = useCallback((companyName: string) => {
    return alerts.filter(alert => 
      alert.company_name.toLowerCase() === companyName.toLowerCase()
    );
  }, [alerts]);

  return {
    alerts,
    loading,
    createAlert,
    removeAlert,
    toggleAlert,
    getCompanyAlerts,
  };
}