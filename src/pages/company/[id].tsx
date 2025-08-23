import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { watchCompany, addCompanyToCRM } from '@/lib/companyActions'

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
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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

  async function onWatch() {
    if (!company) return;
    setSaving(true);
    try {
      await watchCompany(company.id);
      setMessage('Added to watchlist');
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function onAddCRM() {
    if (!company) return;
    setSaving(true);
    try {
      await addCompanyToCRM(company.company_name ?? '');
      setMessage('Added to CRM');
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setSaving(false);
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
          <button onClick={onWatch} disabled={saving} className="rounded-md border px-3 py-1.5">
            Watch
          </button>
          <button onClick={onAddCRM} disabled={saving} className="rounded-md bg-black text-white px-3 py-1.5">
            Add to CRM
          </button>
        </div>
      </div>
      {message && <div className="text-sm text-gray-600 mt-2">{message}</div>}

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