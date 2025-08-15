// Analytics Configuration - Public Keys (Safe to store in code)
export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA_ID: 'G-XXXXXXXXXX', // Replace with your actual GA4 ID
  
  // Google Tag Manager
  GTM_ID: 'GTM-XXXXXXX', // Replace with your actual GTM ID
  
  // Hotjar
  HOTJAR_ID: '12345678', // Replace with your actual Hotjar ID
  
  // API Configuration
  API_URL: 'https://api.logistic-intel.com',
  
  // Site Configuration
  SITE_URL: 'https://logistic-intel.com',
  SITE_NAME: 'Logistic Intel',
}

// Analytics utilities
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

export const trackPageView = (pagePath: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA_ID, {
      page_path: pagePath,
    })
  }
}

// Type declarations for global analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    hj: (...args: any[]) => void
    dataLayer: any[]
  }
}