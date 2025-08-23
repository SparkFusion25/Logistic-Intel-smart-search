/**
 * Canonical header aliasing for Bulk Importer
 * Maps many real-world header variations to unified schema columns
 */

// Canonical keys used by our importer and Edge Function
export const CANONICAL_KEYS = [
  'unified_company_name',
  'shipper_name', 
  'consignee_name',
  'origin_country',
  'destination_country',
  'hs_code',
  'description',
  'gross_weight_kg',
  'value_usd',
  'unified_date',
  'mode',
  // Optional but common
  'quantity',
  'container_count',
  'vessel_name',
  'bill_of_lading_number'
] as const;

// Comprehensive alias mapping - keys are normalized headers, values are canonical keys
export const ALIAS_MAP: Record<string, string> = {
  // unified_company_name aliases
  'company': 'unified_company_name',
  'companyname': 'unified_company_name', 
  'name': 'unified_company_name',
  'account': 'unified_company_name',
  'accountname': 'unified_company_name',
  'buyer': 'unified_company_name',
  'importer': 'unified_company_name',
  'consignee': 'unified_company_name',
  'organization': 'unified_company_name',
  'org': 'unified_company_name',
  'firm': 'unified_company_name',
  'client': 'unified_company_name',
  'customer': 'unified_company_name',
  'unifiedcompanyname': 'unified_company_name',

  // shipper_name aliases
  'shipper': 'shipper_name',
  'shippername': 'shipper_name',
  'exporter': 'shipper_name',
  'supplier': 'shipper_name',
  'vendor': 'shipper_name',

  // consignee_name aliases  
  'consigneename': 'consignee_name',
  'receiver': 'consignee_name',
  'buyername': 'consignee_name',

  // origin_country aliases
  'origin': 'origin_country',
  'origincountry': 'origin_country',
  'countryoforigin': 'origin_country',
  'shipfromcountry': 'origin_country',
  'fromcountry': 'origin_country',

  // destination_country aliases
  'destination': 'destination_country',
  'destinationcountry': 'destination_country',
  'countyofdestination': 'destination_country',
  'shiptocountry': 'destination_country',
  'tocountry': 'destination_country',

  // hs_code aliases
  'hs': 'hs_code',
  'hscode': 'hs_code',
  'tariff': 'hs_code',
  'tariffcode': 'hs_code',
  'harmonizedcode': 'hs_code',
  'scheduleb': 'hs_code',
  'hts': 'hs_code',
  'htscode': 'hs_code',

  // description aliases
  'description': 'description',
  'commoditydescription': 'description',
  'goodsdescription': 'description',
  'productdescription': 'description',
  'itemdescription': 'description',
  'desc': 'description',

  // gross_weight_kg aliases
  'weight': 'gross_weight_kg',
  'weightkg': 'gross_weight_kg',
  'grossweight': 'gross_weight_kg',
  'grossweightkg': 'gross_weight_kg',
  'netweightkg': 'gross_weight_kg',
  'totalweight': 'gross_weight_kg',
  'totalweightkg': 'gross_weight_kg',
  'kg': 'gross_weight_kg',

  // value_usd aliases
  'value': 'value_usd',
  'declaredvalue': 'value_usd',
  'customsvalue': 'value_usd',
  'invoicevalue': 'value_usd',
  'valueusd': 'value_usd',
  'usdvalue': 'value_usd',
  'totalvalue': 'value_usd',
  'amountusd': 'value_usd',

  // unified_date aliases
  'date': 'unified_date',
  'shipmentdate': 'unified_date',
  'shipdate': 'unified_date',
  'exportdate': 'unified_date',
  'importdate': 'unified_date',
  'arrivaldate': 'unified_date',
  'departuredate': 'unified_date',
  'etd': 'unified_date',
  'eta': 'unified_date',
  'unifieddate': 'unified_date',

  // mode aliases
  'mode': 'mode',
  'transportmode': 'mode',
  'shipmentmode': 'mode',
  'movementmode': 'mode',
  'via': 'mode',
  'servicemode': 'mode',

  // quantity aliases
  'qty': 'quantity',
  'quantity': 'quantity',
  'unit': 'quantity',
  'piece': 'quantity',
  'pkg': 'quantity',
  'package': 'quantity',

  // container_count aliases
  'containercount': 'container_count',
  'container': 'container_count',
  'numcontainer': 'container_count',
  'numberofcontainer': 'container_count',

  // vessel_name aliases
  'vessel': 'vessel_name',
  'vesselname': 'vessel_name',
  'shipname': 'vessel_name',

  // bill_of_lading_number aliases
  'bol': 'bill_of_lading_number',
  'billoflading': 'bill_of_lading_number',
  'billofladingnumber': 'bill_of_lading_number',
  'masterbol': 'bill_of_lading_number',
  'housebol': 'bill_of_lading_number',
  'mbl': 'bill_of_lading_number',
  'hbl': 'bill_of_lading_number'
};

/**
 * Normalize header string for consistent lookups
 * - Lowercase
 * - Trim whitespace
 * - Collapse inner whitespace
 * - Remove punctuation: _, -, ., /, (, ), spaces
 * - Convert plurals where obvious
 */
export function normalizeHeader(rawHeader: string): string {
  const normalized = rawHeader
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')  // Collapse whitespace
    .replace(/[_\-./\(\)\s]/g, '');  // Remove punctuation and spaces
    
  // Handle specific plurals, but avoid converting acronyms
  return normalized
    .replace(/ies$/g, 'y')  // companies -> company
    .replace(/^(.{3,})s$/g, '$1');  // Only remove 's' from words with 3+ chars
}

/**
 * Resolve a header to its canonical key
 * Returns the canonical key if found, null if unknown
 */
export function resolveAlias(header: string): string | null {
  const normalized = normalizeHeader(header);
  return ALIAS_MAP[normalized] || null;
}