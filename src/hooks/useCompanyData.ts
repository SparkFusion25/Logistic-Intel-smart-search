import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyTradeData {
  totalShipments: number;
  totalValue: number;
  avgShipmentValue: number;
  modes: string[];
  topDestinations: string[];
  topCommodities: Array<{ name: string; count: number }>;
  monthlyTrends: Array<{ period: string; shipments: number; value: number }>;
  lastActivity: string | null;
}

export function useCompanyData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = useCallback(async (companyName: string): Promise<CompanyTradeData | null> => {
    if (!companyName) return null;

    setLoading(true);
    setError(null);

    try {
      // Fetch all shipments for the company
      const { data: shipments, error: shipmentsError } = await supabase
        .from('unified_shipments')
        .select(`
          unified_date,
          mode,
          value_usd,
          gross_weight_kg,
          destination_country,
          commodity_description,
          unified_carrier
        `)
        .ilike('unified_company_name', companyName)
        .order('unified_date', { ascending: false })
        .limit(1000);

      if (shipmentsError) throw shipmentsError;

      if (!shipments || shipments.length === 0) {
        return {
          totalShipments: 0,
          totalValue: 0,
          avgShipmentValue: 0,
          modes: [],
          topDestinations: [],
          topCommodities: [],
          monthlyTrends: [],
          lastActivity: null
        };
      }

      // Calculate aggregated data
      const totalShipments = shipments.length;
      const totalValue = shipments.reduce((sum, s) => sum + (s.value_usd || 0), 0);
      const avgShipmentValue = totalShipments > 0 ? totalValue / totalShipments : 0;

      // Get unique modes
      const modes = Array.from(new Set(shipments.map(s => s.mode).filter(Boolean))) as string[];

      // Top destinations
      const destMap = new Map();
      shipments.forEach(s => {
        if (s.destination_country) {
          destMap.set(s.destination_country, (destMap.get(s.destination_country) || 0) + 1);
        }
      });
      const topDestinations = Array.from(destMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([country]) => country);

      // Top commodities
      const commodityMap = new Map();
      shipments.forEach(s => {
        if (s.commodity_description) {
          const commodity = s.commodity_description.trim();
          if (commodity.length > 0) {
            commodityMap.set(commodity, (commodityMap.get(commodity) || 0) + 1);
          }
        }
      });
      const topCommodities = Array.from(commodityMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ 
          name: name.length > 40 ? name.substring(0, 37) + '...' : name, 
          count 
        }));

      // Monthly trends (last 12 months)
      const trendMap = new Map();
      const now = new Date();
      
      shipments.forEach(s => {
        if (!s.unified_date) return;
        
        const date = new Date(s.unified_date);
        const monthsDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        
        if (monthsDiff <= 12) {
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!trendMap.has(key)) {
            trendMap.set(key, { period: key, shipments: 0, value: 0 });
          }
          const existing = trendMap.get(key);
          existing.shipments += 1;
          existing.value += s.value_usd || 0;
        }
      });

      const monthlyTrends = Array.from(trendMap.values())
        .sort((a, b) => a.period.localeCompare(b.period))
        .slice(-12);

      const lastActivity = shipments[0]?.unified_date || null;

      return {
        totalShipments,
        totalValue,
        avgShipmentValue,
        modes,
        topDestinations,
        topCommodities,
        monthlyTrends,
        lastActivity
      };

    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('Failed to fetch company data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCompanies = useCallback(async (query: string, limit = 20) => {
    if (!query || query.length < 2) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`company_name.ilike.%${query}%`)
        .order('total_shipments', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching companies:', err);
      setError('Failed to search companies');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchCompanyData,
    searchCompanies,
    loading,
    error
  };
}