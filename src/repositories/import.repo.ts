
import { supabase } from '@/lib/supabaseClient';

export type ImportMapping = {
  id?: string;
  org_id: string | null;
  table_name: string;          // e.g., 'crm_contacts'
  source_label: string;        // e.g., filename pattern or user-given name
  mapping: Record<string, string | null>; // header -> column
};

export async function saveImportMapping(m: ImportMapping) {
  const { data, error } = await supabase
    .from('import_mappings')
    .upsert({
      org_id: m.org_id,
      table_name: m.table_name,
      source_label: m.source_label,
      mapping: m.mapping
    }, { onConflict: 'org_id,table_name,source_label' })
    .select('*').single();
  if (error) return { success: false, error: error.message } as const;
  return { success: true, data } as const;
}

export async function loadImportMapping(orgId: string | null, tableName: string, sourceLabel: string) {
  const { data, error } = await supabase
    .from('import_mappings')
    .select('*')
    .eq('table_name', tableName)
    .eq('source_label', sourceLabel)
    .eq('org_id', orgId || '') // Convert null to empty string to avoid the type error
    .maybeSingle();
  if (error) return { success: false, error: error.message } as const;
  return { success: true, data } as const;
}
