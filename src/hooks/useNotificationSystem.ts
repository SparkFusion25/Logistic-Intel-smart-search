import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'volume_change' | 'new_destination' | 'seasonal_spike' | 'new_commodity' | 'new_shipper';

export interface NotificationPreference {
  id: string;
  type: NotificationType;
  enabled: boolean;
  threshold?: number;
  email_enabled: boolean;
  popup_enabled: boolean;
}

export interface AlertRule {
  id: string;
  company_name: string;
  type: NotificationType;
  threshold?: number;
  created_at: string;
  is_active: boolean;
}

export function useNotificationSystem() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);

  const createAlert = useCallback(async (
    companyName: string,
    type: NotificationType,
    threshold?: number
  ) => {
    setLoading(true);
    try {
      // In a real implementation, this would call a Supabase function
      // For now, we'll simulate the alert creation
      const newAlert: AlertRule = {
        id: `alert_${Date.now()}`,
        company_name: companyName,
        type,
        threshold,
        created_at: new Date().toISOString(),
        is_active: true,
      };

      setAlerts(prev => [...prev, newAlert]);
      
      // Simulate API call to create alert
      console.log('Alert created:', newAlert);
      
      return { success: true, alert: newAlert };
    } catch (error) {
      console.error('Failed to create alert:', error);
      return { success: false, error: 'Failed to create alert' };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAlert = useCallback(async (alertId: string) => {
    setLoading(true);
    try {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      console.log('Alert removed:', alertId);
      return { success: true };
    } catch (error) {
      console.error('Failed to remove alert:', error);
      return { success: false, error: 'Failed to remove alert' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (
    type: NotificationType,
    updates: Partial<NotificationPreference>
  ) => {
    setLoading(true);
    try {
      setPreferences(prev => 
        prev.map(pref => 
          pref.type === type ? { ...pref, ...updates } : pref
        )
      );
      console.log('Preferences updated:', type, updates);
      return { success: true };
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return { success: false, error: 'Failed to update preferences' };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkNewShippers = useCallback(async () => {
    try {
      // This would typically query the database for companies that started shipping recently
      // For demo purposes, we'll return mock data
      const newShippers = [
        {
          company_name: 'New Tech Solutions Ltd',
          first_shipment_date: '2024-01-15',
          shipment_count: 3,
        },
        {
          company_name: 'Global Innovations Inc',
          first_shipment_date: '2024-01-10',
          shipment_count: 1,
        }
      ];

      return { success: true, data: newShippers };
    } catch (error) {
      console.error('Failed to check new shippers:', error);
      return { success: false, error: 'Failed to check new shippers' };
    }
  }, []);

  const detectVolumeChanges = useCallback(async (companyName: string) => {
    try {
      // This would analyze shipment volume trends for the company
      // For demo purposes, we'll return mock trend analysis
      const analysis = {
        company_name: companyName,
        current_month_volume: Math.floor(Math.random() * 100) + 50,
        previous_month_volume: Math.floor(Math.random() * 100) + 30,
        percentage_change: Math.floor(Math.random() * 60) - 30,
        trend: 'increasing' as const,
        significance: 'high' as const,
      };

      return { success: true, data: analysis };
    } catch (error) {
      console.error('Failed to detect volume changes:', error);
      return { success: false, error: 'Failed to detect volume changes' };
    }
  }, []);

  return {
    preferences,
    alerts,
    loading,
    createAlert,
    removeAlert,
    updatePreferences,
    checkNewShippers,
    detectVolumeChanges,
  };
}