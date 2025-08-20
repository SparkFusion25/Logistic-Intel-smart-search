import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ANALYTICS_CONFIG, trackPageView } from '@/lib/analytics'

export function useAnalytics() {
  const router = useRouter()

  useEffect(() => {
    // Track page views on route changes
    trackPageView(router.pathname)
  }, [router.pathname])

  // Return analytics functions for components to use
  return {
    trackEvent: (eventName: string, eventParams?: Record<string, any>) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams)
      }
    },
    trackConversion: (conversionId: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: conversionId,
          value: value,
          currency: 'USD'
        })
      }
    }
  }
}