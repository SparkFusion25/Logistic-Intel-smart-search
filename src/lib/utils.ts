// src/lib/utils.ts
export function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}
export const clamp = (n: number, min = 0, max = Number.POSITIVE_INFINITY) => Math.min(max, Math.max(min, n));
export const noop = () => {};
export const isBrowser = typeof window !== 'undefined';