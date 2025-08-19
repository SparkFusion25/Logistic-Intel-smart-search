import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface LocationData {
  countries: string[]
  cities: string[]
  states: string[]
  ports: string[]
  zipCodes: string[]
}

interface AutocompleteOption {
  value: string
  label: string
  group?: string
}

export function useLocationAutocomplete() {
  const [locationData, setLocationData] = useState<LocationData>({
    countries: [],
    cities: [],
    states: [],
    ports: [],
    zipCodes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLocationData()
  }, [])

  const loadLocationData = async () => {
    try {
      setLoading(true)
      
      // Get comprehensive location data from all shipment tables
      const [unifiedData, oceanData, airData, tradeData] = await Promise.all([
        supabase.from('unified_shipments').select('origin_country, destination_country, destination_city, destination_state, port_of_loading, port_of_discharge').limit(1000),
        supabase.from('ocean_shipments').select('origin_country, destination_country, destination_city, port_of_lading, port_of_unlading').limit(1000),
        supabase.from('airfreight_shipments').select('shipper_country, consignee_country, consignee_city, consignee_state, consignee_zip, port_of_lading, port_of_unlading').limit(1000),
        supabase.from('trade_shipments').select('origin_country, destination_country, destination_city, port_of_loading, port_of_discharge').limit(1000)
      ])

      const countries = new Set<string>()
      const cities = new Set<string>()
      const states = new Set<string>()
      const ports = new Set<string>()
      const zipCodes = new Set<string>()

      // Process unified shipments
      unifiedData.data?.forEach((item: any) => {
        if (item.origin_country) countries.add(item.origin_country)
        if (item.destination_country) countries.add(item.destination_country)
        if (item.destination_city) cities.add(item.destination_city)
        if (item.destination_state) states.add(item.destination_state)
        if (item.port_of_loading) ports.add(item.port_of_loading)
        if (item.port_of_discharge) ports.add(item.port_of_discharge)
      })

      // Process ocean shipments
      oceanData.data?.forEach((item: any) => {
        if (item.origin_country) countries.add(item.origin_country)
        if (item.destination_country) countries.add(item.destination_country)
        if (item.destination_city) cities.add(item.destination_city)
        if (item.port_of_lading) ports.add(item.port_of_lading)
        if (item.port_of_unlading) ports.add(item.port_of_unlading)
      })

      // Process air shipments
      airData.data?.forEach((item: any) => {
        if (item.shipper_country) countries.add(item.shipper_country)
        if (item.consignee_country) countries.add(item.consignee_country)
        if (item.consignee_city) cities.add(item.consignee_city)
        if (item.consignee_state) states.add(item.consignee_state)
        if (item.consignee_zip) zipCodes.add(item.consignee_zip)
        if (item.port_of_lading) ports.add(item.port_of_lading)
        if (item.port_of_unlading) ports.add(item.port_of_unlading)
      })

      // Process trade shipments
      tradeData.data?.forEach((item: any) => {
        if (item.origin_country) countries.add(item.origin_country)
        if (item.destination_country) countries.add(item.destination_country)
        if (item.destination_city) cities.add(item.destination_city)
        if (item.port_of_loading) ports.add(item.port_of_loading)
        if (item.port_of_discharge) ports.add(item.port_of_discharge)
      })

      setLocationData({
        countries: Array.from(countries).filter(Boolean).sort(),
        cities: Array.from(cities).filter(Boolean).sort(),
        states: Array.from(states).filter(Boolean).sort(),
        ports: Array.from(ports).filter(Boolean).sort(),
        zipCodes: Array.from(zipCodes).filter(Boolean).sort()
      })
    } catch (error) {
      console.error('Error loading location data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLocationOptions = useMemo((): AutocompleteOption[] => {
    const options: AutocompleteOption[] = []
    
    // Add countries
    locationData.countries.forEach(country => {
      options.push({
        value: country,
        label: country,
        group: 'Countries'
      })
    })

    // Add major cities
    locationData.cities.slice(0, 50).forEach(city => {
      options.push({
        value: city,
        label: city,
        group: 'Cities'
      })
    })

    // Add states/regions
    locationData.states.slice(0, 30).forEach(state => {
      options.push({
        value: state,
        label: state,
        group: 'States/Regions'
      })
    })

    // Add major ports
    locationData.ports.slice(0, 30).forEach(port => {
      options.push({
        value: port,
        label: port,
        group: 'Ports'
      })
    })

    return options
  }, [locationData])

  const searchLocations = (query: string): AutocompleteOption[] => {
    if (!query || query.length < 2) return getLocationOptions.slice(0, 20)
    
    const lowerQuery = query.toLowerCase()
    return getLocationOptions.filter(option =>
      option.label.toLowerCase().includes(lowerQuery)
    ).slice(0, 20)
  }

  return {
    locationData,
    getLocationOptions,
    searchLocations,
    loading
  }
}