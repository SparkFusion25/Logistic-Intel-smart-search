// String utility functions

export const s = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
export const upper = (v: unknown) => s(v).toUpperCase();
export const lower = (v: unknown) => s(v).toLowerCase();
export const trim = (v: unknown) => s(v).trim();
export const has = (v: unknown) => s(v).length > 0;

// Capitalize first letter of each word
export function title(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Capitalize first letter only
export function capitalize(str: string | null | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Convert camelCase or PascalCase to kebab-case
export function kebabCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// Convert kebab-case or snake_case to camelCase
export function camelCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/[\s\-_]+/g, '');
}

// Convert to snake_case
export function snakeCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s\-]+/g, '_')
    .toLowerCase();
}

// Remove extra whitespace and trim
export function cleanWhitespace(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

// Truncate string with ellipsis
export function truncate(str: string | null | undefined, length = 100, suffix = '...'): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

// Truncate string at word boundary
export function truncateWords(str: string | null | undefined, maxWords = 20, suffix = '...'): string {
  if (!str) return '';
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + suffix;
}

// Extract numbers from string
export function extractNumbers(str: string | null | undefined): number[] {
  if (!str) return [];
  const matches = str.match(/\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
}

// Check if string is email
export function isEmail(str: string | null | undefined): boolean {
  if (!str) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

// Check if string is URL
export function isUrl(str: string | null | undefined): boolean {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Generate slug from string
export function slugify(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Escape HTML characters
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

// Remove HTML tags
export function stripHtml(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
}

// Count words in string
export function wordCount(str: string | null | undefined): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Generate random string
export function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Mask sensitive information (like credit cards, SSN)
export function mask(str: string | null | undefined, visibleChars = 4, maskChar = '*'): string {
  if (!str) return '';
  if (str.length <= visibleChars) return str;
  
  const visible = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return masked + visible;
}

// Pluralize word based on count
export function pluralize(word: string, count: number, suffix = 's'): string {
  return count === 1 ? word : word + suffix;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
