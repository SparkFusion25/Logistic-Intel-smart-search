import { supabase } from '@/lib/supabaseClient';

export type ColumnInfo = { column_name: string; data_type: string; is_nullable: 'YES'|'NO' };

export async function fetchTableColumns(table: string): Promise<ColumnInfo[]> {
  // Query information_schema for the current DB
  const { data, error } = await supabase
    .from('information_schema.columns' as any)
    .select('column_name,data_type,is_nullable')
    .eq('table_schema','public')
    .eq('table_name', table);
  if (error) throw error;
  // @ts-ignore (information_schema typed as any)
  return (data ?? []).map((r: any) => ({
    column_name: String(r.column_name),
    data_type: String(r.data_type),
    is_nullable: (String(r.is_nullable).toUpperCase() === 'YES' ? 'YES' : 'NO')
  }));
}

// Define table schemas for import mapping
export const TABLE_SCHEMAS: Record<string, ColumnInfo[]> = {
  crm_contacts: [
    { column_name: 'company_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'full_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'title', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'email', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'phone', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'linkedin', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'country', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'city', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'tags', data_type: 'jsonb', is_nullable: 'YES' },
    { column_name: 'notes', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'source', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'panjiva_id', data_type: 'text', is_nullable: 'YES' }
  ],
  unified_shipments: [
    // Core identifiers
    { column_name: 'org_id', data_type: 'uuid', is_nullable: 'YES' },
    { column_name: 'unified_id', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'unified_company_name', data_type: 'text', is_nullable: 'YES' },
    
    // Transport details
    { column_name: 'mode', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipment_type', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'transport_mode', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipment_mode', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'transport_method', data_type: 'text', is_nullable: 'YES' },
    
    // Company information  
    { column_name: 'shipper_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee', data_type: 'text', is_nullable: 'YES' },
    
    // Commodity information
    { column_name: 'hs_code', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'description', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'hs_description', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'commodity_description', data_type: 'text', is_nullable: 'YES' },
    
    // Geographic information
    { column_name: 'origin_country', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'destination_country', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'destination_city', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'destination_state', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipment_origin', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipment_destination', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipment_destination_region', data_type: 'text', is_nullable: 'YES' },
    
    // Port information
    { column_name: 'port_of_loading', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'port_of_discharge', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'port_of_unlading', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'port_of_lading', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'port_of_lading_country', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'port_of_lading_region', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'port_of_unlading_region', data_type: 'text', is_nullable: 'YES' },
    
    // Carrier and vessel
    { column_name: 'unified_carrier', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'carrier_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'vessel_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'vessel', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'vessel_voyage_id', data_type: 'text', is_nullable: 'YES' },
    
    // BOL information
    { column_name: 'bol_number', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'bill_of_lading_number', data_type: 'text', is_nullable: 'YES' },
    
    // Dates
    { column_name: 'unified_date', data_type: 'date', is_nullable: 'YES' },
    { column_name: 'shipment_date', data_type: 'date', is_nullable: 'YES' },
    { column_name: 'arrival_date', data_type: 'date', is_nullable: 'YES' },
    { column_name: 'departure_date', data_type: 'date', is_nullable: 'YES' },
    
    // Measurements
    { column_name: 'unified_value', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'unified_weight', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'value_usd', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'gross_weight_kg', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'weight_kg', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'container_count', data_type: 'integer', is_nullable: 'YES' },
    { column_name: 'quantity', data_type: 'integer', is_nullable: 'YES' },
    
    // Address details
    { column_name: 'shipper_address', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_city', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_state_region', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_postal_code', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_full_address', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_address', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_city', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_state_region', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_postal_code', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_full_address', data_type: 'text', is_nullable: 'YES' },
    
    // Contact information
    { column_name: 'shipper_email_1', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_phone_1', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_email_1', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_phone_1', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_website_1', data_type: 'text', is_nullable: 'YES' },
    
    // Company metadata
    { column_name: 'shipper_industry', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_revenue', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_employees', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'shipper_trade_roles', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_industry', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_revenue', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_employees', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'consignee_trade_roles', data_type: 'text', is_nullable: 'YES' },
    
    // Additional fields
    { column_name: 'matching_fields', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'is_likely_air_shipper', data_type: 'boolean', is_nullable: 'YES' },
    { column_name: 'air_confidence_score', data_type: 'integer', is_nullable: 'YES' }
  ]
};