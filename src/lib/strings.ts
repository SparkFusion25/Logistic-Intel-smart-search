// src/lib/strings.ts
// Safe string + formatting helpers to avoid runtime crashes like v.toUpperCase() on undefined.

export const s = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

export const upper = (v: unknown): string => s(v).toUpperCase();
export const lower = (v: unknown): string => s(v).toLowerCase();
export const trim = (v: unknown): string => s(v).trim();
export const has = (v: unknown): boolean => trim(v).length > 0;

/** Convert to number or null (no NaN leaking into UI). */
export const toNumber = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : Number(s(v));
  return Number.isFinite(n) ? n : null;
};

/** Format a number with thousands separators, or return "—" */
export const fmtNumber = (v: unknown): string => {
  const n = toNumber(v);
  return n == null ? "—" : n.toLocaleString();
};

/** Format currency in USD (no symbol if value is null/undefined). */
export const fmtUSD = (v: unknown, withCents = false): string => {
  const n = toNumber(v);
  if (n == null) return "—";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });
};

/** Return YYYY-MM-DD or null. */
export const toDateISO = (v: unknown): string | null => {
  const t = s(v);
  if (!t) return null;
  const d = new Date(t);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

/** Join non-empty parts with a separator; skips null/empty. */
export const safeJoin = (parts: Array<unknown>, sep = " "): string => {
  return parts
    .map((p) => trim(p))
    .filter((p) => p.length > 0)
    .join(sep);
};

/** Return null if empty string after trim; otherwise the trimmed value. */
export const nullIfEmpty = (v: unknown): string | null => {
  const t = trim(v);
  return t.length === 0 ? null : t;
};
