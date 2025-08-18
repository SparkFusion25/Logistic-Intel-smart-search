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

  const getPipelines = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: pipelineError } = await supabase.functions.invoke('crm-pipelines', {
        body: {}
      })

      if (pipelineError) throw pipelineError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to load pipelines')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createPipeline = useCallback(async (name: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: createError } = await supabase.functions.invoke('crm-pipelines', {
        body: { name },
        method: 'POST'
      })

      if (createError) throw createError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to create pipeline')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getStages = useCallback(async (pipelineId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: stageError } = await supabase.functions.invoke('crm-stages', {
        body: { pipeline_id: pipelineId }
      })

      if (stageError) throw stageError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to load stages')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createStage = useCallback(async (pipelineId: string, name: string, stageOrder?: number) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: createError } = await supabase.functions.invoke('crm-stages', {
        body: { pipeline_id: pipelineId, name, stage_order: stageOrder },
        method: 'POST'
      })

      if (createError) throw createError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to create stage')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const moveDeal = useCallback(async (dealId: string, stageId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: moveError } = await supabase.functions.invoke('crm-deal-move', {
        body: { deal_id: dealId, stage_id: stageId }
      })

      if (moveError) throw moveError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to move deal')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPipelineAnalytics = useCallback(async (pipelineId: string, range = '30') => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: analyticsError } = await supabase.functions.invoke('crm-pipeline-analytics', {
        body: { pipeline_id: pipelineId, range }
      })

      if (analyticsError) throw analyticsError

      return data
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDeal = useCallback(async (dealId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error

      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Failed to delete deal')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    addContact,
    getPipelines,
    createPipeline,
    getStages,
    createStage,
    moveDeal,
    getPipelineAnalytics,
    deleteDeal,
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

export const useAPI = () => {
  const makeRequest = useCallback(async (endpoint: string, options: {
    method?: string;
    body?: any;
    params?: Record<string, any>;
  } = {}) => {
    const { method = 'GET', body, params } = options;
    
    console.log('🔧 useAPI: Making request to:', endpoint)
    console.log('🔧 useAPI: Method:', method)
    console.log('🔧 useAPI: Body:', body)
    console.log('🔧 useAPI: Params:', params)
    
    try {
      const { data, error } = await supabase.functions.invoke(endpoint.replace('/', ''), {
        body: method === 'GET' ? undefined : body,
        method: method as any
      });

      console.log('🔧 useAPI: Supabase response data:', data)
      console.log('🔧 useAPI: Supabase response error:', error)

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error(`🔧 useAPI: API request failed for ${endpoint}:`, err);
      throw err;
    }
  }, []);

  return { makeRequest };
};