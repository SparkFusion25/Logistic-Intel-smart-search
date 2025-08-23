import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SimilarCompanyRow } from '@/features/search/SimilarCompanyRow';

interface Company {
  id: string;
  company_id: string;
  company_name: string;
  hs6_code: string;
  trade_volume: number;
  trade_value: number;
  country: string;
  confidence_score: number;
  last_seen: string;
}



interface SimilarCompaniesListProps {
  hsCode?: string;
  companyName?: string;
  limit?: number;
  className?: string;
}

export default function SimilarCompaniesList({ 
  hsCode, 
  companyName, 
  limit = 10, 
  className = '' 
}: SimilarCompaniesListProps) {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Load companies from v_company_hs6 view
  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('v_company_hs6')
          .select('*')
          .order('trade_value', { ascending: false })
          .limit(limit);

        // Filter by HS code if provided
        if (hsCode) {
          query = query.eq('hs6_code', hsCode);
        }

        // Filter by company name if provided (similar companies)
        if (companyName) {
          query = query.ilike('company_name', `%${companyName}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error loading companies:', error);
          toast({
            title: "Error",
            description: "Failed to load similar companies",
            variant: "destructive"
          });
          setCompanies([]);
        } else {
          setCompanies(data || []);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [hsCode, companyName, limit, toast]);



  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="card p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No similar companies found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {companies.map((company) => (
        <SimilarCompanyRow 
          key={company.id} 
          company={company} 
        />
      ))}
    </div>
  );
}