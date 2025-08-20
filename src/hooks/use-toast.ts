import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

// Global toast state - in a real app, you might use Context or a state management library
let toastCounter = 0;
const toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toasts]));
}

function addToast(toast: Omit<Toast, 'id'>): string {
  const id = `toast-${++toastCounter}`;
  const newToast: Toast = {
    id,
    duration: 5000, // Default 5 seconds
    ...toast,
  };
  
  toasts.push(newToast);
  notifyListeners();
  
  // Auto-remove toast after duration
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }
  
  return id;
}

function removeToast(id: string) {
  toasts = toasts.filter(toast => toast.id !== id);
  notifyListeners();
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  // Subscribe to toast updates
  useState(() => {
    const listener = (updatedToasts: Toast[]) => {
      setCurrentToasts(updatedToasts);
    };
    
    toastListeners.push(listener);
    
    // Cleanup function
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  });

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, []);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  const dismissAll = useCallback(() => {
    toasts = [];
    notifyListeners();
  }, []);

  return {
    toast,
    dismiss,
    dismissAll,
    toasts: currentToasts,
  };
}

// Convenience methods
export const toast = {
  success: (title: string, description?: string) =>
    addToast({ title, description, variant: 'success' }),
  
  error: (title: string, description?: string) =>
    addToast({ title, description, variant: 'destructive' }),
  
  warning: (title: string, description?: string) =>
    addToast({ title, description, variant: 'warning' }),
  
  info: (title: string, description?: string) =>
    addToast({ title, description, variant: 'default' }),
};
