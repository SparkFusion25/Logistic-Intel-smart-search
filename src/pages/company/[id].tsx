import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { addToWatchlist, removeFromWatchlist } from '@/features/watchlist/api'
import { addCompanyPlaceholder } from '@/features/crm/api'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

type CompanyProfile = {
  id: string
  company_name: string | null
  primary_industry: string | null
  air_match: boolean | null
  air_match_score: number | null
  ocean_match: boolean | null
  ocean_match_score: number | null
  bts_confidence_score: number | null
  last_refreshed: string | null
}

export default function CompanyPage() {
  const { id } = useParams()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWatched, setIsWatched] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)
  const [crmLoading, setCrmLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name, primary_industry, air_match, air_match_score, ocean_match, ocean_match_score, bts_confidence_score, last_refreshed')
          .eq('id', id)
          .single()
        if (error) throw error
        if (!ignore) setCompany(data as CompanyProfile)
      } catch (e: any) {
        if (!ignore) setError(e.message ?? String(e))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    if (id) load()
    return () => { ignore = true }
  }, [id])

  const handleWatch = async () => {
    if (!id) return
    setWatchLoading(true)
    try {
      if (isWatched) {
        await removeFromWatchlist(id)
        setIsWatched(false)
      } else {
        await addToWatchlist(id)
        setIsWatched(true)
      }
    } catch (error) {
      console.error('Error toggling watch status:', error)
      alert('Failed to update watch status')
    } finally {
      setWatchLoading(false)
    }
  }

  const handleAddToCRM = async () => {
    if (!company?.company_name) return
    setCrmLoading(true)
    try {
      await addCompanyPlaceholder(company.company_name)
      alert('Company added to CRM successfully!')
    } catch (error) {
      console.error('Error adding to CRM:', error)
      alert('Failed to add company to CRM')
    } finally {
      setCrmLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading company…</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>
  if (!company) return <div className="p-6">Company not found.</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{company.company_name ?? '—'}</h1>
          <p className="text-sm text-gray-500">
            {company.primary_industry ?? '—'} · Last refreshed: {company.last_refreshed ?? '—'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleWatch}
            disabled={watchLoading}
            className="rounded-md border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
          >
            {watchLoading ? 'Loading...' : isWatched ? 'Unwatch' : 'Watch'}
          </button>
          <button 
            onClick={handleAddToCRM}
            disabled={crmLoading}
            className="rounded-md bg-black text-white px-3 py-1.5 hover:bg-gray-800 disabled:opacity-50"
          >
            {crmLoading ? 'Adding...' : 'Add to CRM'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-medium mb-2">Signals</h2>
          <ul className="text-sm space-y-1">
            <li>Air: {company.air_match ? 'Yes' : 'No'} ({company.air_match_score ?? 0})</li>
            <li>Ocean: {company.ocean_match ? 'Yes' : 'No'} ({company.ocean_match_score ?? 0})</li>
            <li>BTS confidence: {company.bts_confidence_score ?? 0}</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4 md:col-span-2">
          <h2 className="font-medium mb-2">Overview</h2>
          <p className="text-sm text-gray-600">
            Shipments, HS codes, similar companies, contacts, etc. (we'll populate next).
          </p>
        </div>
      </div>
    </div>
  )
}