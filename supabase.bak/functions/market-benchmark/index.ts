import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BenchmarkRequest {
  origin_country: string
  hs?: string
  date_from?: string
  date_to?: string
  mode?: 'all' | 'ocean' | 'air'
}

serve(async (req) => {
  console.log('Market benchmark function called')
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { origin_country, hs = '', date_from, date_to, mode = 'all' }: BenchmarkRequest = await req.json()

    if (!origin_country) {
      return new Response(
        JSON.stringify({ error: 'origin_country is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Fetching benchmark data for ${origin_country}, HS: ${hs}, mode: ${mode}`)

    // Build Census API query
    const CENSUS_BASE = 'https://api.census.gov/data/timeseries/intltrade/imports/hs'
    const params: Record<string, string> = {
      get: 'CTY_CODE,CTY_NAME,ALL_VAL_YR,ALL_VAL_MO,COMM_LVL,MONTH',
      time: date_from && date_to ? `${date_from}:${date_to}` : 'from 2024-01',
      'CTY_CODE': origin_country.toUpperCase()
    }

    if (hs) {
      params['I_COMMODITY'] = hs
      params['COMM_LVL'] = 'HS6'
    }

    // Add API key if available
    const censusApiKey = Deno.env.get('CENSUS_API_KEY')
    if (censusApiKey) {
      params['key'] = censusApiKey
    }

    const queryString = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    
    const censusUrl = `${CENSUS_BASE}?${queryString}`
    console.log(`Census API URL: ${censusUrl}`)

    const response = await fetch(censusUrl)
    
    if (!response.ok) {
      console.error(`Census API error: ${response.status} ${response.statusText}`)
      return new Response(
        JSON.stringify({ error: 'Census API error', status: response.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const rawData = await response.json()
    console.log(`Census API returned ${rawData.length} rows`)

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return new Response(
        JSON.stringify({ 
          source: 'census', 
          series: [], 
          totals: { value: 0 },
          message: 'No data available for the specified parameters'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process Census data
    const headers = rawData[0]
    const dataRows = rawData.slice(1)
    
    const headerIndexes = Object.fromEntries(
      headers.map((header: string, index: number) => [header, index])
    )

    const series = dataRows.map((row: any[]) => ({
      month: row[headerIndexes['MONTH']] || '',
      value: Number(row[headerIndexes['ALL_VAL_MO']] || 0)
    })).filter(item => item.month && item.value > 0)

    const totals = {
      value: series.reduce((sum, item) => sum + item.value, 0)
    }

    // Calculate statistics
    const values = series.map(s => s.value).sort((a, b) => a - b)
    const stats = {
      count: values.length,
      min: values[0] || 0,
      max: values[values.length - 1] || 0,
      median: values.length > 0 ? values[Math.floor(values.length / 2)] : 0,
      p25: values.length > 0 ? values[Math.floor(values.length * 0.25)] : 0,
      p75: values.length > 0 ? values[Math.floor(values.length * 0.75)] : 0
    }

    const result = {
      source: 'census',
      parameters: {
        origin_country,
        hs: hs || 'all',
        mode,
        date_range: date_from && date_to ? `${date_from} to ${date_to}` : '2024-01 onwards'
      },
      series: series.slice(-12), // Last 12 months
      totals,
      statistics: stats,
      metadata: {
        api_key_used: !!censusApiKey,
        total_records: dataRows.length,
        processed_records: series.length
      }
    }

    console.log(`Benchmark result: ${series.length} data points, total value: $${totals.value.toLocaleString()}`)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in market benchmark:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})