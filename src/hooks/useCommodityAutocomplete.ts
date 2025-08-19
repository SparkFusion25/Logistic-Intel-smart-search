import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface CommodityData {
  hsCodes: string[]
  descriptions: string[]
}

interface AutocompleteOption {
  value: string
  label: string
  group?: string
}

export function useCommodityAutocomplete() {
  const [commodityData, setCommodityData] = useState<CommodityData>({
    hsCodes: [],
    descriptions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCommodityData()
  }, [])

  const loadCommodityData = async () => {
    try {
      setLoading(true)
      
      // Get commodity data from all shipment tables
      const [unifiedData, oceanData, airData] = await Promise.all([
        supabase.from('unified_shipments').select('hs_code, commodity_description').limit(1000),
        supabase.from('ocean_shipments').select('hs_code, commodity_description').limit(1000),
        supabase.from('airfreight_shipments').select('hs_code, commodity_description').limit(1000)
      ])

      const hsCodes = new Set<string>()
      const descriptions = new Set<string>()

      // Process all data sources
      const allData = [
        ...(unifiedData.data || []),
        ...(oceanData.data || []),
        ...(airData.data || [])
      ]

      allData.forEach((item: any) => {
        if (item.hs_code && item.hs_code.trim()) {
          hsCodes.add(item.hs_code.trim())
        }
        if (item.commodity_description && item.commodity_description.trim()) {
          descriptions.add(item.commodity_description.trim())
        }
      })

      setCommodityData({
        hsCodes: Array.from(hsCodes).filter(Boolean).sort(),
        descriptions: Array.from(descriptions).filter(Boolean).sort()
      })
    } catch (error) {
      console.error('Error loading commodity data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCommodityOptions = useMemo((): AutocompleteOption[] => {
    const options: AutocompleteOption[] = []
    
    // Add HS codes
    commodityData.hsCodes.slice(0, 100).forEach(hsCode => {
      options.push({
        value: hsCode,
        label: `${hsCode}`,
        group: 'HS Codes'
      })
    })

    // Add commodity descriptions
    commodityData.descriptions.slice(0, 50).forEach(description => {
      options.push({
        value: description,
        label: description.length > 50 ? `${description.substring(0, 50)}...` : description,
        group: 'Commodity Descriptions'
      })
    })

    return options
  }, [commodityData])

  const searchCommodities = (query: string): AutocompleteOption[] => {
    if (!query || query.length < 2) return getCommodityOptions.slice(0, 20)
    
    const lowerQuery = query.toLowerCase()
    return getCommodityOptions.filter(option =>
      option.label.toLowerCase().includes(lowerQuery) ||
      option.value.toLowerCase().includes(lowerQuery)
    ).slice(0, 20)
  }

  return {
    commodityData,
    getCommodityOptions,
    searchCommodities,
    loading
  }
}