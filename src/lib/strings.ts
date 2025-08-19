// src/lib/strings.ts
export const s = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
export const upper = (v: unknown): string => s(v).toUpperCase();
export const lower = (v: unknown): string => s(v).toLowerCase();
export const trim = (v: unknown): string => s(v).trim();
export const has = (v: unknown): boolean => s(v).length > 0;
export const maybe = (v: unknown): string | null => {
  const t = trim(v);
  return t.length ? t : null;
};
export const toISODate = (v: string | Date | null | undefined): string | null => {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v.toISOString().slice(0, 10);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};