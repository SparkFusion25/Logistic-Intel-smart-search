export const n = {
  str: (v: string | null | undefined) => v ?? '',
  num: (v: number | null | undefined) => v ?? 0,
  json: (v: unknown) => (v ?? null) as any,
  dt:  (v: string | null | undefined) => (v ? new Date(v) : null),
};