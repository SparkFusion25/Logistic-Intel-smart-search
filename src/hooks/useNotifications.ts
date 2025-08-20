import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationPrefs {
  email: boolean;
  browser: boolean;
  mobile: boolean;
  weekly: boolean;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export function useNotifications() {
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    email: true,
    browser: false,
    mobile: false,
    weekly: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);
  const { toast } = useToast();

  // Check if push notifications are supported
  useEffect(() => {
    setIsPushSupported(
      'serviceWorker' in navigator && 
      'PushManager' in window && 
      'Notification' in window
    );
  }, []);

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_notification_prefs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          email: data.email ?? true,
          browser: data.browser ?? false,
          mobile: data.mobile ?? false,
          weekly: data.weekly ?? false
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to database
  const savePreferences = useCallback(async (newPrefs: NotificationPrefs) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_notification_prefs')
        .upsert({
          user_id: user.id,
          ...newPrefs,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving preferences:', error);
        toast({
          title: "Error",
          description: "Failed to save notification preferences",
          variant: "destructive"
        });
        return;
      }

      setPreferences(newPrefs);
      toast({
        title: "Success",
        description: "Notification preferences saved"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!isPushSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        return true;
      } else if (permission === 'denied') {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Permission Required",
          description: "Please grant permission to receive notifications",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "Error",
        description: "Failed to request notification permission",
        variant: "destructive"
      });
      return false;
    }
  }, [isPushSupported, toast]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!isPushSupported) return false;

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Get VAPID public key from environment
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key not found');
        return false;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      const subscriptionObject = subscription.toJSON();
      setPushSubscription(subscriptionObject as PushSubscription);

      // Save subscription to database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscriptionObject.endpoint!,
          keys: subscriptionObject.keys!
        });

      if (error) {
        console.error('Error saving push subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to push notifications",
        variant: "destructive"
      });
      return false;
    }
  }, [isPushSupported, toast]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      // Remove from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user && pushSubscription) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', pushSubscription.endpoint);
      }

      setPushSubscription(null);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  }, [pushSubscription]);

  // Toggle browser notifications
  const toggleBrowserNotifications = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      const subscribed = await subscribeToPush();
      if (!subscribed) return;
    } else {
      await unsubscribeFromPush();
    }

    const newPrefs = { ...preferences, browser: enabled };
    await savePreferences(newPrefs);
  }, [preferences, savePreferences, requestNotificationPermission, subscribeToPush, unsubscribeFromPush]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    setPreferences,
    savePreferences,
    toggleBrowserNotifications,
    isLoading,
    isPushSupported
  };
}