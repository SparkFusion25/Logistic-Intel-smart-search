import { useState, useCallback } from 'react';

interface CommodityOption {
  value: string;
  label: string;
  hs_code?: string;
  description?: string;
}

export function useCommodityAutocomplete() {
  const [loading, setLoading] = useState(false);
  const [commodities, setCommodities] = useState<CommodityOption[]>([]);

  const searchCommodities = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setCommodities([]);
      return [];
    }

    setLoading(true);
    try {
      // In a real implementation, this would call your commodity search API
      // For now, we'll use mock data based on common trade commodities
      const mockCommodities = [
        { value: 'electronics', label: 'Electronics', hs_code: '85', description: 'Electronic equipment and components' },
        { value: 'automotive-parts', label: 'Automotive Parts', hs_code: '87', description: 'Motor vehicle parts and accessories' },
        { value: 'textiles', label: 'Textiles', hs_code: '63', description: 'Textile articles and fabrics' },
        { value: 'machinery', label: 'Machinery', hs_code: '84', description: 'Industrial machinery and equipment' },
        { value: 'chemicals', label: 'Chemicals', hs_code: '38', description: 'Chemical products' },
        { value: 'plastics', label: 'Plastics', hs_code: '39', description: 'Plastic products and materials' },
        { value: 'pharmaceuticals', label: 'Pharmaceuticals', hs_code: '30', description: 'Medical and pharmaceutical products' },
        { value: 'furniture', label: 'Furniture', hs_code: '94', description: 'Furniture and furnishings' },
        { value: 'steel', label: 'Steel Products', hs_code: '72', description: 'Iron and steel products' },
        { value: 'food-products', label: 'Food Products', hs_code: '19', description: 'Prepared food products' }
      ];

      const filtered = mockCommodities.filter(commodity =>
        commodity.label.toLowerCase().includes(query.toLowerCase()) ||
        commodity.hs_code?.includes(query) ||
        commodity.description?.toLowerCase().includes(query.toLowerCase())
      );

      setCommodities(filtered);
      return filtered;
    } catch (error) {
      console.error('Failed to search commodities:', error);
      setCommodities([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCommodityByHsCode = useCallback(async (hsCode: string) => {
    if (!hsCode) return null;

    try {
      // Mock implementation - in real app, this would query your HS code database
      const hsCodeMap: Record<string, CommodityOption> = {
        '84': { value: 'machinery', label: 'Machinery', hs_code: '84', description: 'Industrial machinery and equipment' },
        '85': { value: 'electronics', label: 'Electronics', hs_code: '85', description: 'Electronic equipment and components' },
        '87': { value: 'automotive-parts', label: 'Automotive Parts', hs_code: '87', description: 'Motor vehicle parts and accessories' },
        '39': { value: 'plastics', label: 'Plastics', hs_code: '39', description: 'Plastic products and materials' },
        '72': { value: 'steel', label: 'Steel Products', hs_code: '72', description: 'Iron and steel products' },
        '30': { value: 'pharmaceuticals', label: 'Pharmaceuticals', hs_code: '30', description: 'Medical and pharmaceutical products' },
        '94': { value: 'furniture', label: 'Furniture', hs_code: '94', description: 'Furniture and furnishings' },
        '63': { value: 'textiles', label: 'Textiles', hs_code: '63', description: 'Textile articles and fabrics' },
        '38': { value: 'chemicals', label: 'Chemicals', hs_code: '38', description: 'Chemical products' },
        '19': { value: 'food-products', label: 'Food Products', hs_code: '19', description: 'Prepared food products' }
      };

      // Try exact match first, then partial match
      let match = hsCodeMap[hsCode];
      if (!match) {
        const partialMatch = Object.keys(hsCodeMap).find(code => 
          hsCode.startsWith(code) || code.startsWith(hsCode)
        );
        if (partialMatch) {
          match = hsCodeMap[partialMatch];
        }
      }

      return match || null;
    } catch (error) {
      console.error('Failed to get commodity by HS code:', error);
      return null;
    }
  }, []);

  return {
    searchCommodities,
    getCommodityByHsCode,
    commodities,
    loading
  };
}
