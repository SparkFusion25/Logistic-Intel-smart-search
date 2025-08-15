import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface SearchFilters {
  mode?: string
  range?: string
  origin_country?: string
  dest_country?: string
  hs_codes?: string
  entity?: string
  min_shipments?: string
  min_confidence?: string
}

interface SearchOptions {
  tab?: 'companies' | 'shipments' | 'routes' | 'contacts'
  filters?: SearchFilters
  pagination?: { limit: number; offset: number }
  sort?: { field: string; dir: 'asc' | 'desc' }
}

export const useSearchAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = useCallback(async (query: string, options: SearchOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: searchError } = await supabase.functions.invoke('search-run', {
        body: {
          q: query,
          tab: options.tab || 'companies',
          filters: options.filters || {},
          pagination: options.pagination || { limit: 20, offset: 0 },
          sort: options.sort || { field: 'shipment_count', dir: 'desc' }
        }
      })

      if (searchError) throw searchError

      return data
    } catch (err: any) {
      setError(err.message || 'Search failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const quickSearch = useCallback(async (query: string, limit = 8) => {
    if (!query || query.length < 2) return { results: [] }

    try {
      const { data, error: searchError } = await supabase.functions.invoke('search-quick', {
        body: { q: query, limit }
      })

      if (searchError) throw searchError

      return data
    } catch (err: any) {
      console.error('Quick search failed:', err)
      return { results: [] }
    }
  }, [])

  return {
    runSearch,
    quickSearch,
    loading,
    error
  }
}

export const useCRMAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addContact = useCallback(async (contactData: {
    company_name: string
    full_name?: string
    title?: string
    email?: string
    phone?: string
    linkedin?: string
    country?: string
    city?: string
    tags?: string[]
    notes?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: addError } = await supabase.functions.invoke('crm-add-contact', {
        body: contactData
      })

      if (addError) throw addError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to add contact')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    addContact,
    loading,
    error
  }
}

export const useDashboardAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSummary = useCallback(async (range = '30d') => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: summaryError } = await supabase.functions.invoke('dashboard-summary', {
        body: { range }
      })

      if (summaryError) throw summaryError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getSummary,
    loading,
    error
  }
}