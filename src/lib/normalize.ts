export type Unified = Record<string, any>;

export const norm = (row: any): Unified => ({
  ...row,
  mode: row?.mode ?? null,
  shipment_mode: row?.shipment_mode ?? null,
  shipment_type: row?.shipment_type ?? null,
  transport_mode: row?.transport_mode ?? null,
  unified_company_name: row?.unified_company_name ?? row?.company_name ?? null,
  hs_code: row?.hs_code ?? null
});