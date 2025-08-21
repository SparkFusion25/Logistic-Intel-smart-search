
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  company_name: string;
  website?: string | null;
  industry?: string | null;
  country?: string | null;
  total_shipments?: number | null;
  last_activity?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface UseCompanyDataResult {
  company: Company | null | undefined;
  loading: boolean;
  error: string | null;
}

export const useCompanyData = (companyName?: string) => {
  const [company, setCompany] = useState<Company | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyName) {
      setCompany(null);
      return;
    }

    const fetchCompanyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('company_name', companyName)
          .maybeSingle();

        if (error) {
          setError(error.message);
        } else {
          setCompany(data);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyName]);

  return { company, loading, error };
};
