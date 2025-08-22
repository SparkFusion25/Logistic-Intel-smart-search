import { useEffect } from 'react';

export default function ClientErrorHooks() {
  useEffect(() => {
    // Handle unhandled JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      // In production, you might want to send this to a logging service
      if (import.meta.env.PROD) {
        // Example: Send to logging service
        // logError(event.error);
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // In production, you might want to send this to a logging service
      if (import.meta.env.PROD) {
        // Example: Send to logging service
        // logError(event.reason);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}