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
    { column_name: 'unified_company_name', data_type: 'text', is_nullable: 'NO' },
    { column_name: 'mode', data_type: 'text', is_nullable: 'NO' },
    { column_name: 'hs_code', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'origin_country', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'destination_country', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'destination_city', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'unified_carrier', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'unified_date', data_type: 'date', is_nullable: 'YES' },
    { column_name: 'commodity_description', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'bol_number', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'vessel_name', data_type: 'text', is_nullable: 'YES' },
    { column_name: 'gross_weight_kg', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'value_usd', data_type: 'numeric', is_nullable: 'YES' },
    { column_name: 'container_count', data_type: 'integer', is_nullable: 'YES' }
  ]
};