import { describe, it, expect } from 'vitest';
import { normalizeHeader, resolveAlias, ALIAS_MAP } from './aliases';

describe('Header Aliasing', () => {
  describe('normalizeHeader', () => {
    it('should trim and lowercase headers', () => {
      expect(normalizeHeader('  COMPANY NAME  ')).toBe('companyname');
      expect(normalizeHeader('Company_Name')).toBe('companyname');
    });

    it('should collapse inner whitespace', () => {
      expect(normalizeHeader('company   name')).toBe('companyname');
      expect(normalizeHeader('total  weight  kg')).toBe('totalweightkg');
    });

    it('should remove punctuation', () => {
      expect(normalizeHeader('HS-Code')).toBe('hscode');
      expect(normalizeHeader('Company_Name')).toBe('companyname');
      expect(normalizeHeader('Total.Weight.KG')).toBe('totalweightkg');
      expect(normalizeHeader('Bill/of/Lading')).toBe('billoflading');
      expect(normalizeHeader('Weight (KG)')).toBe('weightkg');
    });

    it('should handle plurals', () => {
      expect(normalizeHeader('HS Codes')).toBe('hscode');
      expect(normalizeHeader('Companies')).toBe('company');
      expect(normalizeHeader('Containers')).toBe('container');
    });

    it('should handle complex real-world headers', () => {
      expect(normalizeHeader('  HS-Code ')).toBe('hscode');
      expect(normalizeHeader('Total Weight (KG)')).toBe('totalweightkg');
      expect(normalizeHeader('Company / Shipper')).toBe('companyshipper');
      expect(normalizeHeader('Bill_of_Lading_Number')).toBe('billofladingnumber');
    });
  });

  describe('resolveAlias', () => {
    it('should resolve basic company name aliases', () => {
      expect(resolveAlias('Company')).toBe('unified_company_name');
      expect(resolveAlias('Company Name')).toBe('unified_company_name');
      expect(resolveAlias('Account')).toBe('unified_company_name');
      expect(resolveAlias('Organization')).toBe('unified_company_name');
      expect(resolveAlias('Buyer')).toBe('unified_company_name');
    });

    it('should resolve HS code aliases', () => {
      expect(resolveAlias('HS Code')).toBe('hs_code');
      expect(resolveAlias('HS-Code')).toBe('hs_code');
      expect(resolveAlias('Tariff Code')).toBe('hs_code');
      expect(resolveAlias('HTS')).toBe('hs_code');
      expect(resolveAlias('Schedule B')).toBe('hs_code');
    });

    it('should resolve weight aliases', () => {
      expect(resolveAlias('Total Weight (KG)')).toBe('gross_weight_kg');
      expect(resolveAlias('Weight')).toBe('gross_weight_kg');
      expect(resolveAlias('Gross Weight')).toBe('gross_weight_kg');
      expect(resolveAlias('Weight KG')).toBe('gross_weight_kg');
    });

    it('should resolve value aliases', () => {
      expect(resolveAlias('Value')).toBe('value_usd');
      expect(resolveAlias('Declared Value')).toBe('value_usd');
      expect(resolveAlias('Invoice Value')).toBe('value_usd');
      expect(resolveAlias('USD Value')).toBe('value_usd');
    });

    it('should resolve country aliases', () => {
      expect(resolveAlias('Origin')).toBe('origin_country');
      expect(resolveAlias('Origin Country')).toBe('origin_country');
      expect(resolveAlias('Country of Origin')).toBe('origin_country');
      expect(resolveAlias('Destination')).toBe('destination_country');
      expect(resolveAlias('Destination Country')).toBe('destination_country');
    });

    it('should resolve date aliases', () => {
      expect(resolveAlias('Date')).toBe('unified_date');
      expect(resolveAlias('Shipment Date')).toBe('unified_date');
      expect(resolveAlias('Ship Date')).toBe('unified_date');
      expect(resolveAlias('ETD')).toBe('unified_date');
      expect(resolveAlias('ETA')).toBe('unified_date');
    });

    it('should resolve shipper/consignee aliases', () => {
      expect(resolveAlias('Shipper')).toBe('shipper_name');
      expect(resolveAlias('Exporter')).toBe('shipper_name');
      expect(resolveAlias('Supplier')).toBe('shipper_name');
      expect(resolveAlias('Consignee')).toBe('unified_company_name'); // Note: consignee maps to company
      expect(resolveAlias('Consignee Name')).toBe('consignee_name');
      expect(resolveAlias('Receiver')).toBe('consignee_name');
    });

    it('should resolve optional field aliases', () => {
      expect(resolveAlias('Quantity')).toBe('quantity');
      expect(resolveAlias('QTY')).toBe('quantity');
      expect(resolveAlias('Containers')).toBe('container_count');
      expect(resolveAlias('Container Count')).toBe('container_count');
      expect(resolveAlias('Vessel')).toBe('vessel_name');
      expect(resolveAlias('Vessel Name')).toBe('vessel_name');
      expect(resolveAlias('BOL')).toBe('bill_of_lading_number');
      expect(resolveAlias('Bill of Lading')).toBe('bill_of_lading_number');
    });

    it('should handle case-insensitive matching', () => {
      expect(resolveAlias('COMPANY NAME')).toBe('unified_company_name');
      expect(resolveAlias('hs code')).toBe('hs_code');
      expect(resolveAlias('Total WEIGHT (kg)')).toBe('gross_weight_kg');
    });

    it('should return null for unknown headers', () => {
      expect(resolveAlias('Unknown Column')).toBeNull();
      expect(resolveAlias('Random Header')).toBeNull();
      expect(resolveAlias('NotAValidField')).toBeNull();
    });

    it('should handle edge cases', () => {
      expect(resolveAlias('')).toBeNull();
      expect(resolveAlias('   ')).toBeNull();
      expect(resolveAlias('___')).toBeNull();
    });
  });

  describe('ALIAS_MAP integrity', () => {
    it('should have consistent structure', () => {
      // All values should be valid canonical keys
      const canonicalKeys = [
        'unified_company_name', 'shipper_name', 'consignee_name',
        'origin_country', 'destination_country', 'hs_code', 'description',
        'gross_weight_kg', 'value_usd', 'unified_date', 'mode',
        'quantity', 'container_count', 'vessel_name', 'bill_of_lading_number'
      ];
      
      Object.values(ALIAS_MAP).forEach(canonicalKey => {
        expect(canonicalKeys).toContain(canonicalKey);
      });
    });

    it('should have all keys normalized', () => {
      Object.keys(ALIAS_MAP).forEach(key => {
        expect(key).toBe(normalizeHeader(key));
      });
    });
  });
});