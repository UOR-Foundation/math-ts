/**
 * Tests for Mathematical Universe Database Core Implementation
 */

import { MathematicalUniverseDB, MathematicalNumber, FieldActivation, SCHEMA_CONSTANTS } from '../math-universe';

describe('MathematicalUniverseDB', () => {
  let db: MathematicalUniverseDB;

  beforeEach(() => {
    db = new MathematicalUniverseDB();
  });

  describe('Field Activation Patterns', () => {
    test('should correctly identify field patterns for small numbers', () => {
      // Test powers of 2 (single field activation)
      const one = db.createNumber(1);
      expect(one.computed.field_signature).toBe('I');
      expect(one.fields.identity.active).toBe(true);
      expect(one.fields.tribonacci.active).toBe(false);

      const two = db.createNumber(2);
      expect(two.computed.field_signature).toBe('T');
      expect(two.fields.tribonacci.active).toBe(true);
      expect(two.fields.identity.active).toBe(false);

      const four = db.createNumber(4);
      expect(four.computed.field_signature).toBe('φ');
      expect(four.fields.golden.active).toBe(true);
    });

    test('should handle multi-field patterns', () => {
      // 7 = 0b00000111 = fields 0,1,2
      const seven = db.createNumber(7);
      expect(seven.computed.field_signature).toBe('I+T+φ');
      expect(seven.fields.identity.active).toBe(true);
      expect(seven.fields.tribonacci.active).toBe(true);
      expect(seven.fields.golden.active).toBe(true);
      expect(seven.fields.half.active).toBe(false);
    });

    test('should handle empty field pattern for 0', () => {
      const zero = db.createNumber(0);
      expect(zero.computed.field_signature).toBe('∅');
      expect(Object.values(zero.fields).every(f => !f.active)).toBe(true);
    });

    test('should handle field patterns with modulo 256 for large numbers', () => {
      // 263 = 256 + 7, should have same pattern as 7
      const large = db.createNumber(263);
      expect(large.computed.field_signature).toBe('I+T+φ');

      // 512 = 2 * 256, should have empty pattern like 0
      const multiple256 = db.createNumber(512);
      expect(multiple256.computed.field_signature).toBe('∅');
    });
  });

  describe('Resonance Calculations', () => {
    test('should calculate correct resonance for single fields', () => {
      const one = db.createNumber(1);
      expect(one.computed.resonance).toBe(1.0);

      const two = db.createNumber(2);
      expect(two.computed.resonance).toBeCloseTo(1.8392867552141612, 10);

      const four = db.createNumber(4);
      expect(four.computed.resonance).toBeCloseTo(1.618033988749895, 10);
    });

    test('should calculate perfect resonance for field 4 and 5 combination', () => {
      // 48 = 0b00110000 = fields 4,5 active
      // 1/(2π) × 2π = 1.0
      const fortyEight = db.createNumber(48);
      expect(fortyEight.computed.field_signature).toBe('1/2π+2π');
      expect(fortyEight.computed.resonance).toBeCloseTo(1.0, 10);
    });

    test('should calculate compound resonances correctly', () => {
      // 7 = fields 0,1,2: 1.0 × 1.839... × 1.618...
      const seven = db.createNumber(7);
      const expectedResonance = 1.0 * 1.8392867552141612 * 1.618033988749895;
      expect(seven.computed.resonance).toBeCloseTo(expectedResonance, 10);
    });
  });

  describe('Page System', () => {
    test('should correctly calculate page and offset', () => {
      const zero = db.createNumber(0);
      expect(zero.computed.page).toBe(0);
      expect(zero.computed.offset).toBe(0);

      const fortySeven = db.createNumber(47);
      expect(fortySeven.computed.page).toBe(0);
      expect(fortySeven.computed.offset).toBe(47);

      const fortyEight = db.createNumber(48);
      expect(fortyEight.computed.page).toBe(1);
      expect(fortyEight.computed.offset).toBe(0);

      const ninety = db.createNumber(90);
      expect(ninety.computed.page).toBe(1);
      expect(ninety.computed.offset).toBe(42);
    });
  });

  describe('Primality Testing', () => {
    test('should correctly identify small primes', () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
      for (const p of primes) {
        const num = db.createNumber(p);
        expect(num.integrity.is_normalized).toBe(true);
        expect(num.integrity.normalization_depth).toBe(0);
      }
    });

    test('should correctly identify composites', () => {
      const composites = [4, 6, 8, 9, 10, 12, 14, 15];
      for (const c of composites) {
        const num = db.createNumber(c);
        expect(num.integrity.is_normalized).toBe(false);
        expect(num.integrity.normalization_depth).toBeGreaterThan(0);
      }
    });

    test('should identify primitive numbers (powers of 2)', () => {
      const primitives = [1, 2, 4, 8, 16, 32, 64, 128];
      for (const p of primitives) {
        const num = db.createNumber(p);
        expect(num.integrity.is_primitive).toBe(true);
      }
    });
  });

  describe('Normalization (Factorization)', () => {
    test('should normalize composite numbers correctly', () => {
      const result = db.normalize(12);
      expect(result.original.value).toBe(12);
      expect(result.normalized_form.map(n => n.value)).toEqual([2, 2, 3]);
    });

    test('should handle prime normalization', () => {
      const result = db.normalize(13);
      expect(result.original.value).toBe(13);
      expect(result.normalized_form.map(n => n.value)).toEqual([13]);
    });

    test('should identify field reconciliation for 77', () => {
      // The famous example: 77 = 7 × 11
      const result = db.normalize(77);

      expect(result.normalized_form.map(n => n.value)).toEqual([7, 11]);

      // Check field reconciliation exists
      expect(result.process.field_reconciliation).toBeDefined();
      expect(result.process.field_reconciliation.original_fields).toBeDefined();
      expect(result.process.field_reconciliation.combined_factor_fields).toBeDefined();
    });

    test('should show normalization steps', () => {
      const result = db.normalize(30);
      expect(result.process.steps.length).toBeGreaterThan(0);
      expect(result.process.steps[0].operation).toContain('divide by');
    });
  });

  describe('Database Operations', () => {
    test('multiply operation should work correctly', () => {
      const result = db.multiply(3, 5);
      expect(result.value).toBe(15);
      expect(result.integrity.is_normalized).toBe(false);
    });

    test('add operation should work correctly', () => {
      const result = db.add(7, 11);
      expect(result.value).toBe(18);
    });
  });

  describe('Pattern Search', () => {
    test('should find numbers with specific field patterns', () => {
      // Search for pattern 00000111 (fields 0,1,2 active)
      const results = db.searchPatterns({
        field_pattern: '11100000',
        page_range: { start: 0, end: 1 }
      });

      // Should find 7 in page 0
      expect(results.some(n => n.value === 7)).toBe(true);

      // All results should have the same pattern
      for (const num of results) {
        expect(num.fields.identity.active).toBe(true);
        expect(num.fields.tribonacci.active).toBe(true);
        expect(num.fields.golden.active).toBe(true);
        expect(num.fields.half.active).toBe(false);
      }
    });

    test('should find numbers within resonance range', () => {
      const results = db.searchPatterns({
        resonance_range: { min: 0.9, max: 1.1 },
        page_range: { start: 0, end: 2 }
      });

      // Should find numbers with resonance near 1.0
      for (const num of results) {
        expect(num.computed.resonance).toBeGreaterThanOrEqual(0.9);
        expect(num.computed.resonance).toBeLessThanOrEqual(1.1);
      }

      // Should include 48 (perfect resonance 1.0)
      expect(results.some(n => n.value === 48)).toBe(true);
    });
  });

  describe('Page Analysis', () => {
    test('should analyze page statistics correctly', () => {
      const analysis = db.analyzePage(0);

      expect(analysis.page_number).toBe(0);
      expect(analysis.total_numbers).toBe(48);
      expect(analysis.prime_count + analysis.composite_count).toBe(48);

      // Should have resonance statistics
      expect(analysis.resonance_distribution.mean).toBeGreaterThan(0);
      expect(analysis.resonance_distribution.median).toBeGreaterThan(0);
      expect(analysis.resonance_distribution.std_dev).toBeGreaterThanOrEqual(0);

      // Field activation rates should be between 0 and 1
      for (const rate of Object.values(analysis.field_activation_rates)) {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(1);
      }
    });

    test('should show different patterns for different pages', () => {
      const page0 = db.analyzePage(0);
      const page1 = db.analyzePage(1);

      // Different pages should have different prime counts
      // (unless by extreme coincidence)
      expect(page0.resonance_distribution.mean).not.toBe(page1.resonance_distribution.mean);
    });
  });

  describe('Schema Fields', () => {
    test('should return all 8 field definitions', () => {
      const fields = db.getSchemaFields();
      expect(fields.length).toBe(8);

      // Check each field has required properties
      for (const field of fields) {
        expect(field.index).toBeGreaterThanOrEqual(0);
        expect(field.index).toBeLessThanOrEqual(7);
        expect(field.primitive).toBe(1 << field.index);
        expect(field.alpha).toBeGreaterThan(0);
        expect(field.name).toBeTruthy();
        expect(field.symbol).toBeTruthy();
        expect(field.type).toBeTruthy();
        expect(field.description).toBeTruthy();
      }
    });

    test('should have correct mathematical constants', () => {
      const fields = db.getSchemaFields();

      // Check specific known values
      expect(fields[0].alpha).toBe(1.0); // Identity
      expect(fields[1].alpha).toBeCloseTo(1.8392867552141612, 10); // Tribonacci
      expect(fields[2].alpha).toBeCloseTo(1.618033988749895, 10); // Golden ratio
      expect(fields[3].alpha).toBe(0.5); // Half
    });
  });

  describe('Prime Listing', () => {
    test('should list primes with pagination', () => {
      const result = db.listPrimes(0, 10);

      expect(result.primes.length).toBe(10);
      expect(result.pagination.page).toBe(0);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.has_next).toBe(true);
      expect(result.pagination.has_previous).toBe(false);

      // All results should be prime
      for (const prime of result.primes) {
        expect(prime.integrity.is_normalized).toBe(true);
      }
    });

    test('should handle different pages correctly', () => {
      const page0 = db.listPrimes(0, 5);
      const page1 = db.listPrimes(1, 5);

      // Should return different primes
      const values0 = page0.primes.map(p => p.value);
      const values1 = page1.primes.map(p => p.value);

      expect(values0).toEqual([2, 3, 5, 7, 11]);
      expect(values1[0]).toBeGreaterThan(values0[values0.length - 1]);
    });
  });

  describe('Relationships', () => {
    test('should include factor relationships for composites', () => {
      const twelve = db.createNumber(12);
      expect(twelve.relationships?.factors).toEqual([2, 2, 3]);
    });

    test('should include multiples', () => {
      const five = db.createNumber(5);
      expect(five.relationships?.multiples).toContain(10);
      expect(five.relationships?.multiples).toContain(15);
      expect(five.relationships?.multiples).toContain(20);
    });

    test('should include neighbor relationships', () => {
      const ten = db.createNumber(10);
      expect(ten.relationships?.neighbors?.previous).toBe(9);
      expect(ten.relationships?.neighbors?.next).toBe(11);
    });
  });

  describe('Edge Cases', () => {
    test('should handle 0 correctly', () => {
      const zero = db.createNumber(0);
      expect(zero.value).toBe(0);
      expect(zero.computed.field_signature).toBe('∅');
      expect(zero.integrity.is_normalized).toBe(false);
    });

    test('should handle 1 correctly', () => {
      const one = db.createNumber(1);
      expect(one.value).toBe(1);
      expect(one.computed.field_signature).toBe('I');
      expect(one.integrity.is_normalized).toBe(false); // 1 is not prime
    });

    test('should handle 255 (all fields active)', () => {
      const max8bit = db.createNumber(255);
      expect(max8bit.computed.field_signature).toBe('I+T+φ+½+1/2π+2π+θ+ζ');

      // All fields should be active
      expect(Object.values(max8bit.fields).every(f => f.active)).toBe(true);
    });
  });
});
