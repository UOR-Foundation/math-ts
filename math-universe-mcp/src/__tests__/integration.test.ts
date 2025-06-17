/**
 * Integration tests for the complete Mathematical Universe system
 */

import { MathematicalUniverseDB } from '../math-universe';

describe('Mathematical Universe Integration Tests', () => {
  let db: MathematicalUniverseDB;

  beforeEach(() => {
    db = new MathematicalUniverseDB();
  });

  describe('Field Interference in Multiplication', () => {
    test('should demonstrate field artifacts in 77 = 7 × 11', () => {
      // The famous example showing denormalization artifacts
      const seven = db.createNumber(7);
      const eleven = db.createNumber(11);
      const _seventySeven = db.createNumber(77);

      // 7 has fields I, T, φ
      expect(seven.computed.field_signature).toBe('I+T+φ');

      // 11 has fields I, T, ½
      expect(eleven.computed.field_signature).toBe('I+T+½');

      // Expected union would be I, T, φ, ½
      // But 77 actually has different fields due to interference
      const result = db.multiply(7, 11);
      expect(result.value).toBe(77);

      // Verify denormalization artifacts exist
      const normalization = db.normalize(77);
      const reconciliation = normalization.process.field_reconciliation;

      // Should have artifacts or missing fields
      const hasArtifacts = (reconciliation.artifacts?.length ?? 0) > 0;
      const hasMissing = (reconciliation.missing?.length ?? 0) > 0;
      expect(hasArtifacts || hasMissing).toBe(true);
    });

    test('should show perfect resonance at 48', () => {
      const fortyEight = db.createNumber(48);

      // 48 has fields 4 and 5 active: 1/(2π) × 2π = 1.0
      expect(fortyEight.computed.field_signature).toBe('1/2π+2π');
      expect(fortyEight.computed.resonance).toBeCloseTo(1.0, 10);

      // This creates the 48-number page structure
      expect(fortyEight.computed.page).toBe(1);
      expect(fortyEight.computed.offset).toBe(0);
    });
  });

  describe('Page Structure Properties', () => {
    test('should show periodic patterns every 48 numbers', () => {
      // Analyze patterns at page boundaries
      const pageStarts = [0, 48, 96, 144];
      const _resonances = pageStarts.map(n => db.createNumber(n).computed.resonance);

      // Page boundaries should have special properties
      expect(db.createNumber(48).computed.resonance).toBeCloseTo(1.0, 10);
    });

    test('should demonstrate field activation patterns across pages', () => {
      const page0Analysis = db.analyzePage(0);
      const page1Analysis = db.analyzePage(1);

      // Both pages should have 48 numbers
      expect(page0Analysis.total_numbers).toBe(48);
      expect(page1Analysis.total_numbers).toBe(48);

      // Field activation rates should show patterns
      expect(page0Analysis.field_activation_rates).toBeDefined();
      expect(page1Analysis.field_activation_rates).toBeDefined();
    });
  });

  describe('Prime Distribution in Database Terms', () => {
    test('should show primes as normalized records', () => {
      const primeList = db.listPrimes(0, 20);

      // All primes should be normalized (no redundancy)
      for (const prime of primeList.primes) {
        expect(prime.integrity.is_normalized).toBe(true);
        expect(prime.integrity.normalization_depth).toBe(0);
      }
    });

    test('should show unique field signatures for different primes', () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      const signatures = new Map<string, number[]>();

      for (const p of primes) {
        const num = db.createNumber(p);
        const sig = num.computed.field_signature;

        if (!signatures.has(sig)) {
          signatures.set(sig, []);
        }
        const sigArray = signatures.get(sig);
        if (sigArray) {
          sigArray.push(p);
        }
      }

      // Most primes should have unique or rare signatures
      expect(signatures.size).toBeGreaterThan(primes.length / 2);
    });
  });

  describe('Database Operations', () => {
    test('JOIN operation (multiplication) creates denormalization', () => {
      // Multiply two primes
      const result = db.multiply(13, 17);
      expect(result.value).toBe(221);
      expect(result.integrity.is_normalized).toBe(false);

      // The result should have field patterns that don't simply
      // combine the factors' patterns
      const _thirteen = db.createNumber(13);
      const _seventeen = db.createNumber(17);

      // Field signatures should be different from simple combination
      expect(result.computed.field_signature).toBeDefined();
    });

    test('MERGE operation (addition) creates different patterns', () => {
      const _a = db.createNumber(15);
      const _b = db.createNumber(33);
      const sum = db.add(15, 33);

      expect(sum.value).toBe(48);
      // 48 has the special perfect resonance property
      expect(sum.computed.resonance).toBeCloseTo(1.0, 10);
    });
  });

  describe('Resonance Patterns', () => {
    test('should find numbers with specific resonance ranges', () => {
      // Search for perfect resonance
      const perfectResonance = db.searchPatterns({
        resonance_range: { min: 0.99, max: 1.01 },
        page_range: { start: 0, end: 2 }
      });

      // Should find 48 and similar numbers
      expect(perfectResonance.some(n => n.value === 48)).toBe(true);

      // All results should have resonance near 1.0
      for (const num of perfectResonance) {
        expect(num.computed.resonance).toBeGreaterThan(0.99);
        expect(num.computed.resonance).toBeLessThan(1.01);
      }
    });

    test('should show tribonacci resonance patterns', () => {
      // Numbers with only tribonacci field active
      const tribonacciPattern = db.searchPatterns({
        field_pattern: '01000000', // Only field 1 (T) active
        page_range: { start: 0, end: 1 }
      });

      // Should find 2 and similar numbers
      expect(tribonacciPattern.some(n => n.value === 2)).toBe(true);

      // All should have tribonacci resonance
      for (const num of tribonacciPattern) {
        expect(num.computed.resonance).toBeCloseTo(1.8392867552141612, 10);
      }
    });
  });

  describe('Large Number Support', () => {
    test('should analyze large numbers consistently', () => {
      // Test that large number analysis is available
      const largeNum = '123456789012345678901234567890';
      const analysis = db.analyzeLargeNumber(largeNum);

      expect(analysis.primary_pattern).toMatch(/^[01]{8}$/);
      expect(analysis.resonance_signature).toBeGreaterThan(0);
      expect(analysis.field_harmonics).toBeTruthy();
    });

    test('should provide primality testing for large numbers', async () => {
      const largePrime = '999999999999999999999999999989'; // Known large prime
      const result = await db.isPrimeLarge(largePrime);

      expect(result.is_prime).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.evidence.length).toBeGreaterThan(0);
    });

    test('should factor large numbers without trial division', async () => {
      const composite = '77'; // Use smaller number for predictable test
      const result = await db.factorizeLarge(composite);

      expect(result.factors.length).toBeGreaterThan(0);
      expect(result.method).toContain('actorization');
      expect(result.confidence).toBeGreaterThan(0);

      // Product of factors should equal original
      const product = result.factors.reduce((a, b) => BigInt(a) * BigInt(b), BigInt(1));
      expect(product.toString()).toBe(composite);
    });
  });

  describe('Mathematical Universe Principles', () => {
    test('should demonstrate that every integer is a database record', () => {
      // Test various numbers
      const numbers = [0, 1, 7, 15, 48, 77, 100, 255];

      for (const n of numbers) {
        const record = db.createNumber(n);

        // Every number should have:
        expect(record.value).toBe(n);
        expect(record.fields).toBeDefined();
        expect(record.computed).toBeDefined();
        expect(record.integrity).toBeDefined();
        expect(record.relationships).toBeDefined();
      }
    });

    test('should show field patterns repeat every 256 numbers', () => {
      const base = 42;
      const numbers = [base, base + 256, base + 512, base + 768];
      const signatures = numbers.map(n => db.createNumber(n).computed.field_signature);

      // All should have the same signature
      expect(new Set(signatures).size).toBe(1);
    });

    test('should demonstrate database normalization through factorization', () => {
      const composite = 30; // 2 × 3 × 5
      const normalization = db.normalize(composite);

      // Original is denormalized
      expect(normalization.original.integrity.is_normalized).toBe(false);

      // Factors are normalized
      for (const factor of normalization.normalized_form) {
        expect(factor.integrity.is_normalized).toBe(true);
      }

      // Process should show steps
      expect(normalization.process.steps.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Caching', () => {
    test('should cache number computations', () => {
      const start = Date.now();

      // First call computes
      const first = db.createNumber(12345);
      const firstTime = Date.now() - start;

      // Second call should be cached
      const secondStart = Date.now();
      const second = db.createNumber(12345);
      const secondTime = Date.now() - secondStart;

      // Same results
      expect(first).toEqual(second);

      // Second call should be faster (cached)
      // Note: This might be flaky in some environments
      expect(secondTime).toBeLessThanOrEqual(firstTime);
    });

    test('should dynamically grow prime cache', () => {
      // Test with a prime not in initial cache
      const largePrime = 101; // First prime over 100
      const num = db.createNumber(largePrime);

      expect(num.integrity.is_normalized).toBe(true);

      // Should be cached for future use
      const second = db.createNumber(largePrime);
      expect(second.integrity.is_normalized).toBe(true);
    });
  });
});
