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