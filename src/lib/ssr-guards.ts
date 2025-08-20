export const isBrowser = () => typeof window !== 'undefined';
export const safeLocalStorageGet = (k: string): string | null => {
  try { return typeof window !== 'undefined' ? window.localStorage.getItem(k) : null; } catch { return null; }
};
export const safeLocalStorageSet = (k: string, v: string) => {
  try { if (typeof window !== 'undefined') window.localStorage.setItem(k, v); } catch {}
};