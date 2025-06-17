/**
 * Edge case and error handling tests
 */

import { MathematicalUniverseDB } from '../math-universe';
import { LargeNumberFieldAnalysis, FieldCollapseFactorization } from '../math-universe-large';

describe('Edge Cases and Error Handling', () => {
  let db: MathematicalUniverseDB;

  beforeEach(() => {
    db = new MathematicalUniverseDB();
  });

  describe('Boundary Values', () => {
    test('should handle zero correctly', () => {
      const zero = db.createNumber(0);
      expect(zero.value).toBe(0);
      expect(zero.computed.field_signature).toBe('∅');
      expect(zero.computed.resonance).toBe(1.0); // Empty product is 1
      expect(zero.integrity.is_normalized).toBe(false);
      expect(zero.integrity.is_primitive).toBe(false);
    });

    test('should handle one correctly', () => {
      const one = db.createNumber(1);
      expect(one.value).toBe(1);
      expect(one.computed.field_signature).toBe('I');
      expect(one.computed.resonance).toBe(1.0);
      expect(one.integrity.is_normalized).toBe(false); // 1 is not prime
      expect(one.integrity.is_primitive).toBe(true); // Single field active
    });

    test('should handle MAX_SAFE_INTEGER', () => {
      const maxSafe = Number.MAX_SAFE_INTEGER;
      const num = db.createNumber(maxSafe);

      expect(num.value).toBe(maxSafe);
      expect(num.computed.field_signature).toBeDefined();
      expect(num.computed.resonance).toBeGreaterThan(0);
    });

    test('should handle all fields active (255)', () => {
      const allFields = db.createNumber(255);
      expect(allFields.computed.field_signature).toBe('I+T+φ+½+1/2π+2π+θ+ζ');

      // Calculate expected resonance (product of all field alphas)
      let expectedResonance = 1.0;
      const alphas = [
        1.0, 1.8392867552141612, 1.618033988749895, 0.5, 0.15915494309189535, 6.283185307179586, 0.199612, 0.014134725
      ];
      for (const alpha of alphas) {
        expectedResonance *= alpha;
      }

      expect(allFields.computed.resonance).toBeCloseTo(expectedResonance, 5);
    });
  });

  describe('Special Mathematical Constants', () => {
    test('should handle powers of 2 as primitives', () => {
      const powersOf2 = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

      for (const p of powersOf2) {
        const num = db.createNumber(p);
        if (p <= 128) {
          expect(num.integrity.is_primitive).toBe(true);
        }
        // After 256, patterns repeat
        if (p === 256) {
          expect(num.computed.field_signature).toBe('∅'); // 256 % 256 = 0
        }
      }
    });

    test('should handle Fibonacci numbers', () => {
      const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
      const hasGoldenField: number[] = [];

      for (const fib of fibonacci) {
        const num = db.createNumber(fib);
        if (num.fields.golden.active) {
          hasGoldenField.push(fib);
        }
      }

      // Some Fibonacci numbers should have golden field active
      expect(hasGoldenField.length).toBeGreaterThan(0);
    });
  });

  describe('Normalization Edge Cases', () => {
    test('should handle normalization of 0', () => {
      const result = db.normalize(0);
      expect(result.original.value).toBe(0);
      expect(result.normalized_form).toEqual([]);
    });

    test('should handle normalization of 1', () => {
      const result = db.normalize(1);
      expect(result.original.value).toBe(1);
      expect(result.normalized_form).toEqual([]);
    });

    test('should handle perfect squares', () => {
      const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100];

      for (const square of squares) {
        const result = db.normalize(square);
        
        // Perfect squares should factor correctly
        const product = result.normalized_form.reduce((acc, n) => acc * n.value, 1);
        expect(product).toBe(square);
        
        // Should have at least 2 factors (since it's a square)
        expect(result.normalized_form.length).toBeGreaterThanOrEqual(2);
      }
    });

    test('should handle large prime normalization', () => {
      const largePrime = 997; // Largest 3-digit prime
      const result = db.normalize(largePrime);

      expect(result.normalized_form.length).toBe(1);
      expect(result.normalized_form[0].value).toBe(largePrime);
    });
  });

  describe('Search Pattern Edge Cases', () => {
    test('should handle empty search results', () => {
      // Search for impossible pattern in small range
      const results = db.searchPatterns({
        field_pattern: '11111111', // All fields active
        resonance_range: { min: 0.0001, max: 0.0002 }, // Very specific range
        page_range: { start: 0, end: 0 }
      });

      // Might be empty or very few results
      expect(results).toBeInstanceOf(Array);
    });

    test('should handle search with only resonance range', () => {
      const results = db.searchPatterns({
        resonance_range: { min: 1.0, max: 1.0 },
        page_range: { start: 0, end: 2 }
      });

      // Should find numbers with exact resonance 1.0
      for (const num of results) {
        expect(num.computed.resonance).toBe(1.0);
      }
    });

    test('should handle search with only field pattern', () => {
      const results = db.searchPatterns({
        field_pattern: '10000000', // Only identity field
        page_range: { start: 0, end: 1 }
      });

      // Should find 1
      expect(results.some(n => n.value === 1)).toBe(true);
    });
  });

  describe('Page Analysis Edge Cases', () => {
    test('should handle page 0 correctly', () => {
      const page0 = db.analyzePage(0);

      expect(page0.page_number).toBe(0);
      expect(page0.total_numbers).toBe(48);

      // Should include 0 through 47
      expect(page0.prime_count).toBeGreaterThan(0); // Has primes like 2, 3, 5, 7...
      expect(page0.composite_count).toBeGreaterThan(0); // Has composites
    });

    test('should handle very large page numbers', () => {
      const largePage = db.analyzePage(1000000);

      expect(largePage.page_number).toBe(1000000);
      expect(largePage.total_numbers).toBe(48);

      // Should still compute statistics
      expect(largePage.field_activation_rates).toBeDefined();
      expect(largePage.resonance_distribution).toBeDefined();
    });
  });

  describe('Large Number Edge Cases', () => {
    let analyzer: LargeNumberFieldAnalysis;
    let factorizer: FieldCollapseFactorization;

    beforeEach(() => {
      analyzer = new LargeNumberFieldAnalysis();
      factorizer = new FieldCollapseFactorization();
    });

    test('should handle very small numbers in large number analyzer', () => {
      const analysis = analyzer.analyzeFieldHarmonics(BigInt(7));

      expect(analysis.primary).toBe(7);
      expect(analysis.harmonics.length).toBeGreaterThan(0);
      expect(analysis.resonance_signature).toBeGreaterThan(0);
    });

    test('should handle powers of 2 in large number analyzer', () => {
      const power = BigInt(1) << BigInt(100); // 2^100
      const analysis = analyzer.analyzeFieldHarmonics(power);

      // Should have specific pattern for powers of 2
      expect(analysis.primary).toBeDefined();
      expect(analysis.resonance_signature).toBeDefined();
    });

    test('should handle primality check for small primes', () => {
      const smallPrimes = [BigInt(2), BigInt(3), BigInt(5), BigInt(7)];

      for (const p of smallPrimes) {
        const result = analyzer.isProbablePrime(p);
        expect(result.is_probable_prime).toBe(true);
      }
    });

    test('should handle factorization of prime', async () => {
      const result = await factorizer.attemptFactorization(BigInt(97));

      expect(result.factors).toEqual([BigInt(97)]);
      expect(result.method).toContain('Prime');
      expect(result.iterations).toBe(0);
    });

    test.skip('should handle factorization timeout gracefully', async () => {
      // Very large number that might not factor easily
      const veryLarge = BigInt('123456789012345678901234567890123456789012345678901234567890');
      const result = await factorizer.attemptFactorization(veryLarge);

      // Should return something even if can't fully factor
      expect(result.factors.length).toBeGreaterThan(0);
      expect(result.iterations).toBeLessThanOrEqual(100); // Respects iteration limit
    });
  });

  describe('Database Operation Edge Cases', () => {
    test('should handle multiplication by 0', () => {
      const result = db.multiply(42, 0);
      expect(result.value).toBe(0);
      expect(result.computed.field_signature).toBe('∅');
    });

    test('should handle multiplication by 1', () => {
      const num = db.createNumber(42);
      const result = db.multiply(42, 1);

      expect(result.value).toBe(42);
      expect(result.computed.field_signature).toBe(num.computed.field_signature);
    });

    test('should handle addition with 0', () => {
      const num = db.createNumber(42);
      const result = db.add(42, 0);

      expect(result.value).toBe(42);
      expect(result.computed.field_signature).toBe(num.computed.field_signature);
    });

    test('should handle self-multiplication', () => {
      const result = db.multiply(7, 7);
      expect(result.value).toBe(49);

      // Square should have different field pattern than original
      const seven = db.createNumber(7);
      expect(result.computed.field_signature).not.toBe(seven.computed.field_signature);
    });
  });

  describe('Type Safety and Validation', () => {
    test('should handle string inputs for large numbers', () => {
      const largeString = '999999999999999999999999999999';
      const analysis = db.analyzeLargeNumber(largeString);

      expect(analysis.primary_pattern).toMatch(/^[01]{8}$/);
      expect(analysis.resonance_signature).toBeGreaterThan(0);
    });

    test('should handle BigInt inputs', async () => {
      const bigIntValue = BigInt('123456789012345678901234567890');
      const result = await db.isPrimeLarge(bigIntValue);

      expect(result.is_prime).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Performance Considerations', () => {
    test('should handle rapid repeated calculations', () => {
      const iterations = 1000;
      const start = Date.now();

      for (let i = 0; i < iterations; i++) {
        db.createNumber(i % 256); // Use modulo to test pattern repetition
      }

      const elapsed = Date.now() - start;

      // Should complete reasonably quickly (less than 1 second)
      expect(elapsed).toBeLessThan(1000);
    });

    test('should efficiently handle page analysis', () => {
      const start = Date.now();

      // Analyze multiple pages
      for (let page = 0; page < 10; page++) {
        db.analyzePage(page);
      }

      const elapsed = Date.now() - start;

      // Should be efficient
      expect(elapsed).toBeLessThan(500);
    });
  });
});
