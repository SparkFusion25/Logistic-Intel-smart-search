import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TariffRequest {
  hs_code: string
  origin_country: string
  customs_value: number
  mode?: 'ocean' | 'air' | 'all'
}

const MPF_RATE = 0.003464
const MPF_MIN = 31.67
const MPF_MAX = 614.35
const HMF_RATE = 0.00125

serve(async (req) => {
  console.log('Tariff calculator function called')
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { hs_code, origin_country, customs_value, mode = 'ocean' }: TariffRequest = await req.json()

    if (!hs_code || !origin_country || !customs_value) {
      return new Response(
        JSON.stringify({ error: 'hs_code, origin_country, and customs_value are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Calculating tariff for HS: ${hs_code}, Origin: ${origin_country}, Value: ${customs_value}`)

    // Check cache first
    const cacheKey = `${hs_code}-${origin_country}`
    const { data: cachedData } = await supabase
      .from('tariff_cache')
      .select('*')
      .eq('hs_code', hs_code)
      .eq('origin_country', origin_country.toUpperCase())
      .gte('refreshed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // 30 days
      .single()

    let dutyRate = 0
    let source = 'estimated'
    let description = 'Standard tariff calculation'

    if (cachedData) {
      dutyRate = cachedData.rate || 0
      source = cachedData.provider
      description = cachedData.payload?.description || description
      console.log(`Using cached rate: ${dutyRate}`)
    } else {
      // Try Avalara if API key available
      const avalaraKey = Deno.env.get('AVALARA_XB_KEY')
      const avalaraBase = Deno.env.get('AVALARA_XB_BASE') || 'https://api.avalara.com/crossborder/v1'
      
      if (avalaraKey) {
        try {
          console.log('Attempting Avalara lookup')
          const avalaraUrl = `${avalaraBase}/classifications?hsCode=${encodeURIComponent(hs_code)}&originCountry=${origin_country}&destinationCountry=US`
          const avalaraResponse = await fetch(avalaraUrl, {
            headers: { 'apikey': avalaraKey }
          })
          
          if (avalaraResponse.ok) {
            const avalaraData = await avalaraResponse.json()
            dutyRate = Number(avalaraData?.items?.[0]?.rates?.adValorem ?? 0) / 100
            source = 'avalara'
            description = avalaraData?.items?.[0]?.description || description
            console.log(`Avalara rate found: ${dutyRate}`)
          }
        } catch (error) {
          console.error('Avalara API error:', error)
        }
      }

      // Fallback to USITC
      if (dutyRate === 0) {
        try {
          console.log('Attempting USITC lookup')
          const usitcBase = Deno.env.get('USITC_HTS_API_BASE') || 'https://hts.usitc.gov/api'
          const usitcUrl = `${usitcBase}/search?q=${encodeURIComponent(hs_code)}`
          const usitcResponse = await fetch(usitcUrl)
          
          if (usitcResponse.ok) {
            const usitcData = await usitcResponse.json()
            const firstResult = usitcData?.results?.[0]
            const rateString = String(firstResult?.rate || '0')
            dutyRate = Number(rateString.replace(/[^\d.]/g, '')) / 100
            source = 'usitc'
            description = firstResult?.description || description
            console.log(`USITC rate found: ${dutyRate}`)
          }
        } catch (error) {
          console.error('USITC API error:', error)
        }
      }

      // Cache the result
      if (dutyRate > 0) {
        await supabase.from('tariff_cache').upsert({
          hs_code,
          origin_country: origin_country.toUpperCase(),
          provider: source,
          rate: dutyRate,
          payload: { description },
          refreshed_at: new Date().toISOString()
        })
      }
    }

    // Calculate fees
    const duty = customs_value * dutyRate
    const mpf = Math.min(Math.max(customs_value * MPF_RATE, MPF_MIN), MPF_MAX)
    const hmf = (mode === 'ocean' || mode === 'all') ? (customs_value * HMF_RATE) : 0
    const total = duty + mpf + hmf

    const result = {
      source,
      match: {
        hts: hs_code,
        description
      },
      components: {
        duty: Number(duty.toFixed(2)),
        mpf: Number(mpf.toFixed(2)),
        hmf: Number(hmf.toFixed(2))
      },
      total: Number(total.toFixed(2)),
      duty_rate: dutyRate
    }

    console.log('Calculation result:', result)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in tariff calculator:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})