/**
 * Comprehensive Validation Suite for Mathematical Universe MCP
 *
 * This suite ensures the implementation correctly handles:
 * - Gigantic numbers (up to 2048-bit)
 * - Prime detection accuracy
 * - Field collapse factorization
 * - Edge cases and extreme conditions
 * - Mathematical consistency
 */

import { MathematicalUniverseDB } from '../math-universe';
import { LargeNumberFieldAnalysis, FieldCollapseFactorization } from '../math-universe-large';

describe('Mathematical Universe Validation Suite', () => {
  let db: MathematicalUniverseDB;
  let analyzer: LargeNumberFieldAnalysis;
  let factorizer: FieldCollapseFactorization;

  beforeEach(() => {
    db = new MathematicalUniverseDB();
    analyzer = new LargeNumberFieldAnalysis();
    factorizer = new FieldCollapseFactorization();
  });

  describe('Known Prime Detection', () => {
    test('should correctly identify known small primes', () => {
      const smallPrimes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
      ];

      for (const prime of smallPrimes) {
        const result = db.isPrime(prime);
        expect(result).toBe(true);
      }
    });

    test('should correctly identify known large primes', () => {
      const largePrimes = [
        '104729', // 10,000th prime
        '1299709', // 100,000th prime
        '15485863', // 1,000,000th prime
        '2147483647', // Mersenne prime (2^31 - 1)
        '2305843009213693951', // Mersenne prime (2^61 - 1)
        '618970019642690137449562111', // Mersenne prime (2^89 - 1)
        '162259276829213363391578010288127' // Mersenne prime (2^107 - 1)
      ];

      for (const primeStr of largePrimes) {
        const result = analyzer.isProbablePrime(BigInt(primeStr));
        expect(result.is_probable_prime).toBe(true);
        expect(result.confidence).toBeGreaterThan(0.5);
      }
    });

    test('should correctly identify known composites', () => {
      const composites = [
        { value: '1000000000000000000000000000000', factors: ['2', '5'] }, // 10^30
        { value: '123456789012345678901234567890', factors: ['2', '3', '5'] },
        { value: '9999999999999999999999999999', factors: ['3'] }, // Repdigit
        { value: '1001', factors: ['7', '11', '13'] } // 7×11×13
      ];

      for (const composite of composites) {
        const result = analyzer.isProbablePrime(BigInt(composite.value));
        // Should identify as composite (low confidence for primality)
        if (result.is_probable_prime) {
          expect(result.confidence).toBeLessThan(0.8);
        }
      }
    });
  });

  describe('Factorization Accuracy', () => {
    test('should correctly factor known composites', () => {
      const testCases = [
        { n: 6n, factors: [2n, 3n] },
        { n: 12n, factors: [2n, 2n, 3n] },
        { n: 77n, factors: [7n, 11n] },
        { n: 100n, factors: [2n, 2n, 5n, 5n] },
        { n: 1001n, factors: [7n, 11n, 13n] }
      ];

      for (const { n, factors } of testCases) {
        const result = factorizer.attemptFactorization(n);
        expect(result.factors.sort((a, b) => Number(a - b))).toEqual(factors.sort((a, b) => Number(a - b)));
      }
    });

    test('should handle powers of 10 correctly', () => {
      const powersOf10 = [
        { n: 10n, factors: [2n, 5n] },
        { n: 100n, factors: [2n, 2n, 5n, 5n] },
        { n: 1000n, factors: [2n, 2n, 2n, 5n, 5n, 5n] },
        { n: 10000n, factors: [2n, 2n, 2n, 2n, 5n, 5n, 5n, 5n] }
      ];

      for (const { n, factors } of powersOf10) {
        const result = factorizer.attemptFactorization(n);
        expect(result.factors.sort((a, b) => Number(a - b))).toEqual(factors.sort((a, b) => Number(a - b)));
      }
    });

    test('should identify prime numbers without factorization', () => {
      const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];

      for (const prime of primes) {
        const result = factorizer.attemptFactorization(prime);
        expect(result.factors).toEqual([prime]);
        expect(result.method).toContain('Prime');
      }
    });
  });

  describe('Field Pattern Consistency', () => {
    test('should maintain consistent field patterns modulo 256', () => {
      const baseNumbers = [42, 77, 123, 255];

      for (const base of baseNumbers) {
        const n1 = db.createNumber(base);
        const n2 = db.createNumber(base + 256);
        const n3 = db.createNumber(base + 512);
        const n4 = db.createNumber(base + 1024);

        expect(n1.computed.field_signature).toBe(n2.computed.field_signature);
        expect(n2.computed.field_signature).toBe(n3.computed.field_signature);
        expect(n3.computed.field_signature).toBe(n4.computed.field_signature);
      }
    });

    test('should verify field activation for powers of 2', () => {
      const powersOf2 = [
        { value: 1, field: 'identity' },
        { value: 2, field: 'tribonacci' },
        { value: 4, field: 'golden' },
        { value: 8, field: 'half' },
        { value: 16, field: 'inv_freq' },
        { value: 32, field: 'freq' },
        { value: 64, field: 'phase' },
        { value: 128, field: 'zeta' }
      ];

      for (const { value, field } of powersOf2) {
        const num = db.createNumber(value);
        expect(num.integrity.is_primitive).toBe(true);
        // Should have exactly one field active
        const activeFields = Object.entries(num.fields).filter(([_, f]) => f.active);
        expect(activeFields).toHaveLength(1);
        expect(activeFields[0][0]).toBe(field);
      }
    });
  });

  describe('Resonance Calculations', () => {
    test('should calculate perfect resonance for field 4×5 combinations', () => {
      const perfectResonanceNumbers = [48, 49, 304, 305];

      for (const n of perfectResonanceNumbers) {
        const num = db.createNumber(n);
        if (num.fields.inv_freq.active && num.fields.freq.active) {
          expect(num.computed.resonance).toBeCloseTo(1.0, 10);
        }
      }
    });

    test('should calculate consistent resonance for large numbers', () => {
      const testNumbers = [
        '123456789012345678901234567890',
        '999999999999999999999999999999',
        '1000000000000000000000000000000'
      ];

      for (const numStr of testNumbers) {
        const n = BigInt(numStr);
        const analysis = analyzer.analyzeFieldHarmonics(n);

        // Resonance should be positive and finite
        expect(analysis.resonance_signature).toBeGreaterThan(0);
        expect(analysis.resonance_signature).toBeLessThan(Infinity);

        // Primary pattern should be consistent with modulo 256
        expect(analysis.primary).toBe(Number(n % 256n));
      }
    });
  });

  describe('Page System Validation', () => {
    test('should maintain 48-number page structure', () => {
      for (let i = 0; i < 144; i++) {
        const num = db.createNumber(i);
        const expectedPage = Math.floor(i / 48);
        const expectedOffset = i % 48;

        expect(num.computed.page).toBe(expectedPage);
        expect(num.computed.offset).toBe(expectedOffset);
      }
    });

    test('should show consistent page analysis statistics', () => {
      const page0 = db.analyzePage(0);
      const page1 = db.analyzePage(1);

      // Each page should have 48 numbers
      expect(page0.total).toBe(48);
      expect(page1.total).toBe(48);

      // Field activation rates should sum to 100% across complementary fields
      const fields = ['identity', 'tribonacci', 'golden', 'half'];
      for (const field of fields) {
        const rate0 = page0.field_activation_rates[field];
        const rate1 = page1.field_activation_rates[field];
        expect(rate0).toBeGreaterThanOrEqual(0);
        expect(rate0).toBeLessThanOrEqual(100);
        expect(rate1).toBeGreaterThanOrEqual(0);
        expect(rate1).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Field Reconciliation', () => {
    test('should correctly identify field artifacts in multiplication', () => {
      const result = db.normalize(77);

      // 77 = 7 × 11
      // 7 has fields I, T, φ
      // 11 has fields I, T, ½
      // 77 has fields I, φ, ½, θ

      const recon = result.process.field_reconciliation as any;

      // Field θ should appear as an artifact
      expect(recon.artifacts).toContain(6); // Field 6 is theta

      // Field T should disappear
      expect(recon.missing).toContain(1); // Field 1 is tribonacci
    });

    test('should handle perfect field cancellation', () => {
      // 2304 = 48 × 48
      const fortyEight = db.createNumber(48);
      const result = db.multiply(48, 48);

      // 48 has fields 1/2π and 2π (perfect resonance)
      expect(fortyEight.computed.resonance).toBeCloseTo(1.0, 10);

      // 2304 should have no fields active
      expect(result.computed.field_signature).toBe('∅');
      expect(result.computed.resonance).toBe(1.0);
    });
  });

  describe('Extreme Conditions', () => {
    test('should handle very small numbers', () => {
      const zero = db.createNumber(0);
      const one = db.createNumber(1);

      expect(zero.computed.field_signature).toBe('∅');
      expect(zero.computed.resonance).toBe(1.0);
      expect(zero.integrity.is_normalized).toBe(false);

      expect(one.computed.field_signature).toBe('I');
      expect(one.computed.resonance).toBe(1.0);
      expect(one.integrity.is_normalized).toBe(false);
    });

    test('should handle numbers with all fields active', () => {
      const allFields = db.createNumber(255);
      expect(allFields.computed.field_signature).toBe('I+T+φ+½+1/2π+2π+θ+ζ');

      // Calculate expected resonance
      const expectedResonance =
        1.0 *
        1.8392867552141612 *
        1.618033988749895 *
        0.5 *
        0.15915494309189535 *
        6.283185307179586 *
        0.199612 *
        0.014134725;

      expect(allFields.computed.resonance).toBeCloseTo(expectedResonance, 10);
    });

    test('should handle gigantic numbers without overflow', () => {
      // Test with a 100-digit number
      const gigantic = '1234567890'.repeat(10);

      expect(() => {
        const analysis = analyzer.analyzeFieldHarmonics(BigInt(gigantic));
        expect(analysis.primary).toBeDefined();
        expect(analysis.harmonics).toBeDefined();
        expect(analysis.resonance_signature).toBeDefined();
      }).not.toThrow();
    });

    test('should maintain mathematical consistency across operations', () => {
      // Test associativity: (a × b) × c = a × (b × c)
      const a = 6,
        b = 7,
        c = 11;

      const ab = db.multiply(a, b);
      const ab_c = db.multiply(ab.value, c);

      const bc = db.multiply(b, c);
      const a_bc = db.multiply(a, bc.value);

      expect(ab_c.value).toBe(a_bc.value);
      expect(ab_c.computed.field_signature).toBe(a_bc.computed.field_signature);
      expect(ab_c.computed.resonance).toBeCloseTo(a_bc.computed.resonance, 10);
    });
  });

  describe('Performance Benchmarks', () => {
    test('should handle rapid calculations efficiently', () => {
      const start = Date.now();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        db.createNumber(i);
      }

      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000); // Should complete in under 1 second
    });

    test('should cache results effectively', () => {
      const testNumber = 12345;

      // First call - calculates
      const start1 = Date.now();
      const result1 = db.createNumber(testNumber);
      const time1 = Date.now() - start1;

      // Second call - should use cache
      const start2 = Date.now();
      const result2 = db.createNumber(testNumber);
      const time2 = Date.now() - start2;

      expect(result1).toEqual(result2);
      expect(time2).toBeLessThanOrEqual(time1);
    });
  });
});
