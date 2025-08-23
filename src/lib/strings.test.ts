import { s, upper, lower, trim, has } from './strings';

describe('String Utilities', () => {
  describe('s (stringify)', () => {
    it('should return string as-is', () => {
      expect(s('hello')).toBe('hello');
    });

    it('should convert numbers to strings', () => {
      expect(s(123)).toBe('123');
      expect(s(0)).toBe('0');
    });

    it('should handle null and undefined', () => {
      expect(s(null)).toBe('');
      expect(s(undefined)).toBe('');
    });

    it('should convert objects to strings', () => {
      expect(s({})).toBe('[object Object]');
      expect(s([])).toBe('');
    });
  });

  describe('upper', () => {
    it('should convert to uppercase', () => {
      expect(upper('hello')).toBe('HELLO');
      expect(upper('Hello World')).toBe('HELLO WORLD');
    });

    it('should handle non-strings', () => {
      expect(upper(123)).toBe('123');
      expect(upper(null)).toBe('');
      expect(upper(undefined)).toBe('');
    });
  });

  describe('lower', () => {
    it('should convert to lowercase', () => {
      expect(lower('HELLO')).toBe('hello');
      expect(lower('Hello World')).toBe('hello world');
    });

    it('should handle non-strings', () => {
      expect(lower(123)).toBe('123');
      expect(lower(null)).toBe('');
      expect(lower(undefined)).toBe('');
    });
  });

  describe('trim', () => {
    it('should trim whitespace', () => {
      expect(trim('  hello  ')).toBe('hello');
      expect(trim('\n\tworld\n\t')).toBe('world');
    });

    it('should handle non-strings', () => {
      expect(trim(123)).toBe('123');
      expect(trim(null)).toBe('');
      expect(trim(undefined)).toBe('');
    });
  });

  describe('has', () => {
    it('should return true for non-empty strings', () => {
      expect(has('hello')).toBe(true);
      expect(has(' ')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(has('')).toBe(false);
      expect(has(null)).toBe(false);
      expect(has(undefined)).toBe(false);
    });

    it('should handle non-strings', () => {
      expect(has(123)).toBe(true);
      expect(has(0)).toBe(true);
    });
  });
});