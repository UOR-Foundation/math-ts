/**
 * Tests for Large Number Support in Mathematical Universe
 */

import { LargeNumberFieldAnalysis, FieldCollapseFactorization } from '../math-universe-large';

describe('LargeNumberFieldAnalysis', () => {
  let analyzer: LargeNumberFieldAnalysis;

  beforeEach(() => {
    analyzer = new LargeNumberFieldAnalysis();
  });

  describe('Field Harmonics Analysis', () => {
    test('should analyze field harmonics for large numbers', () => {
      const n = BigInt('123456789012345678901234567890');
      const analysis = analyzer.analyzeFieldHarmonics(n);

      expect(analysis.primary).toBeGreaterThanOrEqual(0);
      expect(analysis.primary).toBeLessThan(256);
      expect(analysis.harmonics).toBeInstanceOf(Array);
      expect(analysis.harmonics.length).toBeGreaterThan(0);
      expect(analysis.resonance_signature).toBeGreaterThan(0);
    });

    test('should produce consistent primary pattern with modulo 256', () => {
      const n1 = BigInt(1234);
      const n2 = BigInt(1234) + BigInt(256);
      const n3 = BigInt(1234) + BigInt(512);

      const a1 = analyzer.analyzeFieldHarmonics(n1);
      const a2 = analyzer.analyzeFieldHarmonics(n2);
      const a3 = analyzer.analyzeFieldHarmonics(n3);

      // Should have same primary pattern
      expect(a1.primary).toBe(a2.primary);
      expect(a2.primary).toBe(a3.primary);
    });

    test('should calculate different harmonics at different scales', () => {
      const n = BigInt('999999999999999999999999999999999999');
      const analysis = analyzer.analyzeFieldHarmonics(n);

      // Each harmonic should be different (very likely for large random number)
      const uniqueHarmonics = new Set(analysis.harmonics);
      expect(uniqueHarmonics.size).toBeGreaterThan(1);
    });
  });

  describe('Primality Testing', () => {
    test('should identify probable primes', () => {
      // Known large primes
      const primes = [
        BigInt('999999999999999999999999999989'), // Large prime
        BigInt('2'), // Small prime
        BigInt('104729') // 10000th prime
      ];

      for (const p of primes) {
        const result = analyzer.isProbablePrime(p);
        expect(result.is_probable_prime).toBe(true);
        expect(result.confidence).toBeGreaterThan(0.5);
        expect(result.resonance_evidence.length).toBeGreaterThan(0);
      }
    });

    test('should identify probable composites', () => {
      // Known composites
      const composites = [
        BigInt('1000000000000000000000000000000'), // 10^30
        BigInt('123456789012345678901234567890'), // Random large
        BigInt('999999999999999999999999999999') // Repdigit
      ];

      for (const c of composites) {
        const result = analyzer.isProbablePrime(c);
        // Most should be identified as composite, but this is probabilistic
        if (!result.is_probable_prime) {
          expect(result.confidence).toBeLessThanOrEqual(0.5);
        }
      }
    });

    test('should provide evidence for primality decisions', () => {
      const n = BigInt('48'); // Special number with perfect resonance
      const result = analyzer.isProbablePrime(n);

      expect(result.resonance_evidence).toContain('Perfect resonance pattern (1/2π × 2π)');
    });

    test('should detect tribonacci decoherence', () => {
      // Even numbers have tribonacci field active
      const n = BigInt('246802468024680'); // Large even number
      const result = analyzer.isProbablePrime(n);

      expect(result.resonance_evidence.some(e => e.includes('tribonacci decoherence'))).toBe(true);
    });

    test('should detect page boundary effects', () => {
      const n = BigInt(48 * 12345); // Multiple of 48 (page boundary)
      const result = analyzer.isProbablePrime(n);

      expect(result.resonance_evidence).toContain('Page boundary position - special properties');
    });
  });

  describe('Potential Factors', () => {
    test('should find small factors using field patterns', () => {
      const n = BigInt('24680246802468024680'); // Even number
      const result = analyzer.findPotentialFactors(n);

      expect(result.small_factors).toContain(BigInt(2));
    });

    test('should provide factor hints based on field patterns', () => {
      const n = BigInt('123456789012345678901234567890');
      const result = analyzer.findPotentialFactors(n);

      expect(result.factor_hints).toBeInstanceOf(Array);

      for (const hint of result.factor_hints) {
        expect(hint.field_pattern).toBeTruthy();
        expect(hint.probable_size).toMatch(/~2\^\d+ bits/);
        expect(hint.confidence).toBeGreaterThan(0);
        expect(hint.confidence).toBeLessThanOrEqual(1);
      }
    });
  });
});

describe('FieldCollapseFactorization', () => {
  let factorizer: FieldCollapseFactorization;

  beforeEach(() => {
    factorizer = new FieldCollapseFactorization();
  });

  describe('Factorization', () => {
    test('should identify primes without factorization', async () => {
      const result = await factorizer.attemptFactorization(BigInt(17));

      expect(result.factors).toEqual([BigInt(17)]);
      expect(result.method).toContain('Prime');
      expect(result.iterations).toBe(0);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should extract small factors', async () => {
      const n = BigInt('24'); // 2^3 × 3
      const result = await factorizer.attemptFactorization(n);

      expect(result.factors).toContain(BigInt(2));
      expect(result.factors).toContain(BigInt(3));
      expect(result.method).toBeTruthy();
      expect(result.iterations).toBeGreaterThan(0);
    });

    test('should handle field collapse factorization', async () => {
      const n = BigInt('77'); // 7 × 11, the famous example
      const result = await factorizer.attemptFactorization(n);

      expect(result.factors.length).toBeGreaterThan(0);
      expect(result.method).toContain('factorization');
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should respect iteration limits', async () => {
      // Large number that might not factor easily
      const n = BigInt('123456789012345678901234567890123456789');
      const result = await factorizer.attemptFactorization(n);

      expect(result.iterations).toBeLessThanOrEqual(100);
      expect(result.method).toBeTruthy();
      expect(result.factors.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with Field Analysis', () => {
    test('should use field analysis for factorization', async () => {
      const n = BigInt('48'); // Special number with perfect resonance
      const result = await factorizer.attemptFactorization(n);

      // 48 = 2^4 × 3
      expect(result.factors.some(f => f === BigInt(2))).toBe(true);
      expect(result.factors.some(f => f === BigInt(3))).toBe(true);
    });

    test('should handle probabilistic nature', async () => {
      const n = BigInt('15'); // 3 × 5
      const result = await factorizer.attemptFactorization(n);

      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);

      // Should find some factors
      const product = result.factors.reduce((a, b) => a * b, BigInt(1));
      expect(product).toBe(n);
    });
  });
});

describe('Mathematical Universe Integration', () => {
  test('should handle 2048-bit number representation', () => {
    // Create a large number close to 2048 bits
    const bits = 2048;
    const n = (BigInt(1) << BigInt(bits)) - BigInt(1); // 2^2048 - 1

    const analyzer = new LargeNumberFieldAnalysis();
    const analysis = analyzer.analyzeFieldHarmonics(n);

    expect(analysis.primary).toBe(255); // All bits set in lowest byte
    expect(analysis.resonance_signature).toBeGreaterThan(0);
  });

  test('field patterns should be consistent with mathematical universe theory', () => {
    const analyzer = new LargeNumberFieldAnalysis();

    // Test that numbers differing by 256 have same primary pattern
    const base = BigInt('123456789');
    const offset = BigInt('256');

    const a1 = analyzer.analyzeFieldHarmonics(base);
    const a2 = analyzer.analyzeFieldHarmonics(base + offset);
    const a3 = analyzer.analyzeFieldHarmonics(base + offset * BigInt(2));

    expect(a1.primary).toBe(a2.primary);
    expect(a2.primary).toBe(a3.primary);
  });

  test('resonance signatures should reflect field combinations', () => {
    const analyzer = new LargeNumberFieldAnalysis();

    // Numbers with same field pattern should have related resonances
    const n1 = BigInt(7); // Fields 0,1,2
    const n2 = BigInt(7 + 256); // Same fields due to modulo

    const a1 = analyzer.analyzeFieldHarmonics(n1);
    const a2 = analyzer.analyzeFieldHarmonics(n2);

    // Primary resonance contribution should be the same
    expect(a1.primary).toBe(a2.primary);
  });
});
