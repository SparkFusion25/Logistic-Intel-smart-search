import { useState } from 'react'

export function useCRMAPI() {
  const [loading, setLoading] = useState(false)

  async function addContact(payload: {
    company_name: string
    full_name?: string
    title?: string
    email?: string
    phone?: string
    linkedin?: string
    country?: string
    city?: string
    panjiva_id?: string
    source?: string
    tags?: string[]
    notes?: string
  }) {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add contact')
      return await res.json()
    } finally {
      setLoading(false)
    }
  }

  return { addContact, loading }
}