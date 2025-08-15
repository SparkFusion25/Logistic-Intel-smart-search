// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.', event);

  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[Service Worker] Push data:', data);

      const options = {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: data.data || {},
        actions: data.actions || [],
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        tag: data.tag || 'default',
        timestamp: Date.now(),
        ...data.options
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Logistic Intel', options)
      );
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
      // Fallback notification
      event.waitUntil(
        self.registration.showNotification('Logistic Intel', {
          body: 'You have a new notification',
          icon: '/favicon.ico'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click received.');

  event.notification.close();

  // Handle notification click
  const clickAction = event.action || 'default';
  const notificationData = event.notification.data || {};

  let url = '/';
  
  // Route to specific pages based on notification data
  if (notificationData.url) {
    url = notificationData.url;
  } else if (notificationData.type) {
    switch (notificationData.type) {
      case 'campaign':
        url = '/dashboard/campaigns';
        break;
      case 'crm':
        url = '/dashboard/crm';
        break;
      case 'search':
        url = '/dashboard/search-intelligence';
        break;
      default:
        url = '/dashboard';
    }
  }

  event.waitUntil(
    clients.matchAll().then(function(clientList) {
      // Check if a window is already open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle background sync if needed in the future
self.addEventListener('sync', function(event) {
  console.log('[Service Worker] Background sync:', event.tag);
  // Future implementation for offline sync
});