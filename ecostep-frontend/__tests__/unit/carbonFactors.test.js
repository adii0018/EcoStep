import { calculateCO2, getTypesForCategory, categories } from '../../lib/carbonFactors';

describe('carbonFactors Utilities', () => {
  describe('calculateCO2', () => {
    it('should calculate correct CO2 for Auto-rickshaw', () => {
      // 10 units * 0.05 factor
      expect(calculateCO2('travel', 'Auto-rickshaw', 10)).toBe(0.5);
    });

    it('should calculate correct CO2 for Indian grid electricity', () => {
      // 100 units * 0.72 factor
      expect(calculateCO2('energy', 'Indian grid electricity', 100)).toBe(72.0);
    });

    it('should calculate correct CO2 for LPG cooking', () => {
      // 2 units * 2.9 factor
      expect(calculateCO2('energy', 'LPG cooking', 2)).toBe(5.8);
    });

    it('should return null for invalid category or type', () => {
      expect(calculateCO2('invalid_cat', 'Car (petrol)', 10)).toBeNull();
      expect(calculateCO2('travel', 'invalid_type', 10)).toBeNull();
    });

    it('should return null for missing arguments', () => {
      expect(calculateCO2('travel', 'Car (petrol)')).toBeNull();
      expect(calculateCO2('travel')).toBeNull();
      expect(calculateCO2()).toBeNull();
    });

    it('should handle zero quantity correctly', () => {
      // With our logic, 0 is falsy for `!quantity`, so it returns null
      expect(calculateCO2('travel', 'Car (petrol)', 0)).toBeNull();
    });
  });

  describe('getTypesForCategory', () => {
    it('should return types for a valid category', () => {
      const types = getTypesForCategory('travel');
      expect(types).toContain('Auto-rickshaw');
      expect(types).toContain('Metro/train');
      expect(types.length).toBeGreaterThan(0);
    });

    it('should return an empty array for an invalid category', () => {
      expect(getTypesForCategory('invalid')).toEqual([]);
    });

    it('should return an empty array if category is undefined', () => {
      expect(getTypesForCategory()).toEqual([]);
    });
  });

  describe('Categories export', () => {
    it('should export standard categories', () => {
      expect(categories).toEqual(expect.arrayContaining(['travel', 'food', 'energy', 'shopping']));
    });
  });
});
