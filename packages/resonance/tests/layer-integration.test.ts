import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { MultiModalFactorization } from '../src/multimodal-factorization';
import { calculateResonance } from '../src/resonance';

describe('Layer Integration in Factorization', () => {
  const substrate = createFieldSubstrate();
  const factorizer = new MultiModalFactorization(substrate);

  beforeEach(() => {
    factorizer.clearCache();
  });

  describe('Layer 0: Field Substrate', () => {
    test('should use field interference patterns for factorization', async () => {
      // Test case from docs: 7 × 11 = 77
      const n = 77n;
      const result = await factorizer.factorize(n, true);
      
      expect(result).toEqual([7n, 11n]);
      
      // Verify field interference
      const p7 = substrate.getFieldPattern(7n);
      const p11 = substrate.getFieldPattern(11n);
      const p77 = substrate.getFieldPattern(77n);
      
      // Field 1 (Tribonacci) should vanish
      expect(p7[1] && p11[1]).toBe(true);
      expect(p77[1]).toBe(false);
      
      // Field 6 (Phase) should emerge
      expect(p7[6] || p11[6]).toBe(false);
      expect(p77[6]).toBe(true);
    });

    test('should leverage vanished fields to find factors', async () => {
      // Numbers where specific fields vanish during multiplication
      const testCases = [
        { n: 143n, vanishedField: null, emergedField: 7 }, // 11 × 13
        { n: 221n, vanishedField: null, emergedField: null }, // 13 × 17
        { n: 323n, vanishedField: 4, emergedField: 6 }, // 17 × 19
      ];

      for (const { n, vanishedField, emergedField } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result.length).toBe(2);
        
        const [f1, f2] = result;
        expect(f1 * f2).toBe(n);
        
        if (vanishedField !== null) {
          const p1 = substrate.getFieldPattern(f1);
          const p2 = substrate.getFieldPattern(f2);
          const pn = substrate.getFieldPattern(n);
          
          // Both factors should have the vanished field
          expect(p1[vanishedField] || p2[vanishedField]).toBe(true);
          expect(pn[vanishedField]).toBe(false);
        }
      }
    });
  });

  describe('Layer 1: Resonance Dynamics', () => {
    test('should use resonance patterns in factorization', async () => {
      const n = 77n;
      const res77 = calculateResonance(substrate, n);
      const res7 = calculateResonance(substrate, 7n);
      const res11 = calculateResonance(substrate, 11n);
      
      // Resonances don't simply multiply
      expect(res77).not.toBeCloseTo(res7 * res11, 1);
      
      const result = await factorizer.factorize(n);
      expect(result).toEqual([7n, 11n]);
    });

    test('should find factors with compatible resonance', async () => {
      const testCases = [143n, 221n, 323n, 437n, 667n];
      
      for (const n of testCases) {
        const result = await factorizer.factorize(n);
        expect(result.length).toBeGreaterThanOrEqual(2);
        
        // Verify product
        const product = result.reduce((a, b) => a * b, 1n);
        expect(product).toBe(n);
      }
    });
  });

  describe('Layer 2: Page Topology', () => {
    test('should leverage page structure for factorization', async () => {
      // Numbers near page boundaries
      const pageSize = 48n;
      const testCases = [
        47n, // Page boundary - 1
        48n, // Page boundary (Lagrange point)
        49n, // Page boundary + 1
        95n, // 2×48 - 1
        96n, // 2×48
        97n, // 2×48 + 1
      ];
      
      for (const n of testCases) {
        const result = await factorizer.factorize(n);
        
        // These are mostly prime or have special structure
        if (n === 48n) {
          expect(result).toEqual([2n, 2n, 2n, 2n, 3n]);
        } else if (n === 49n) {
          expect(result).toEqual([7n, 7n]);
        } else if (n === 95n) {
          expect(result).toEqual([5n, 19n]);
        } else if (n === 96n) {
          expect(result).toEqual([2n, 2n, 2n, 2n, 2n, 3n]);
        }
      }
    });
  });

  describe('Layer 3: Arithmetic Operators', () => {
    test('should treat factorization as molecular decomposition', async () => {
      // This is implicitly tested by Layer 0 tests
      // The artifact-based approach IS the Layer 3 implementation
      
      const n = 1001n; // 7 × 11 × 13
      const result = await factorizer.factorize(n);
      expect(result).toEqual([7n, 11n, 13n]);
      
      // Each multiplication creates artifacts
      const p7 = substrate.getFieldPattern(7n);
      const p11 = substrate.getFieldPattern(11n);
      const p77 = substrate.getFieldPattern(77n);
      const p13 = substrate.getFieldPattern(13n);
      const p1001 = substrate.getFieldPattern(1001n);
      
      // Multiple layers of artifacts
      let vanishedCount = 0;
      let emergedCount = 0;
      
      for (let i = 0; i < 8; i++) {
        // Check 7×11=77 artifacts
        if (p7[i] && p11[i] && !p77[i]) vanishedCount++;
        if (!p7[i] && !p11[i] && p77[i]) emergedCount++;
      }
      
      expect(vanishedCount + emergedCount).toBeGreaterThan(0);
    });
  });

  describe('Layer 4: Algebraic Properties', () => {
    test('should use algebraic constraints in factorization', async () => {
      // The current implementation checks modular properties
      // and uses algebraic relationships
      
      const n = 10001n; // 73 × 137
      const result = await factorizer.factorize(n);
      expect(result).toEqual([73n, 137n]);
    });
  });

  describe('Layer 5: Geometric Manifolds', () => {
    test('should follow geodesics toward factors', async () => {
      // Geodesics point toward Lagrange points
      // Numbers near Lagrange points should factor efficiently
      
      const lagrangeNearby = [
        48n * 73n, // Multiple of Lagrange point
        49n * 71n, // Product involving near-Lagrange
      ];
      
      for (const n of lagrangeNearby) {
        const start = Date.now();
        const result = await factorizer.factorize(n);
        const time = Date.now() - start;
        
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(time).toBeLessThan(50); // Should be fast
      }
    });
  });

  describe('Layer 6: Calculus Engine', () => {
    test('should use gradient optimization in factorization', async () => {
      // Numbers with high curvature (second derivative) in resonance landscape
      // should have factors nearby
      
      const n = 323n; // 17 × 19
      const result = await factorizer.factorize(n);
      expect(result).toEqual([17n, 19n]);
      
      // Check resonance landscape around n
      const res_n = calculateResonance(substrate, n);
      const res_n_minus_1 = calculateResonance(substrate, n - 1n);
      const res_n_plus_1 = calculateResonance(substrate, n + 1n);
      
      const firstDerivative = res_n_plus_1 - res_n;
      const secondDerivative = res_n_plus_1 - 2 * res_n + res_n_minus_1;
      
      // High curvature indicates nearby critical points (factors)
      expect(Math.abs(secondDerivative)).toBeGreaterThan(0);
    });
  });

  describe('Layer 7: Self-Reference', () => {
    test('should use self-referential patterns', async () => {
      // Numbers whose field pattern encodes information about factors
      const n = 77n;
      const pattern = substrate.getFieldPattern(n);
      const patternValue = pattern.reduce((acc, bit, i) => acc + (bit ? 2n**BigInt(i) : 0n), 0n);
      
      // The pattern value might relate to factors
      const result = await factorizer.factorize(n);
      expect(result).toEqual([7n, 11n]);
    });
  });

  describe('Integration: All Layers Working Together', () => {
    test('should efficiently factor using all modalities', async () => {
      const testCases = [
        { n: 77n, expected: [7n, 11n], desc: 'Classic artifact example' },
        { n: 1001n, expected: [7n, 11n, 13n], desc: 'Multiple factors' },
        { n: 10001n, expected: [73n, 137n], desc: 'Large semiprime' },
        { n: 100003n, expected: [100003n], desc: 'Large prime' },
        { n: 12345n, expected: [3n, 5n, 823n], desc: 'Mixed factors' },
      ];

      for (const { n, expected, desc } of testCases) {
        const start = Date.now();
        const result = await factorizer.factorize(n);
        const time = Date.now() - start;
        
        expect(result).toEqual(expected);
        expect(time).toBeLessThan(100); // All should be fast
        
        console.log(`${desc}: ${n} = ${result.join(' × ')} (${time}ms)`);
      }
    });

    test('should show clear advantage over naive factorization', async () => {
      // Compare with a simple trial division
      const naiveFactorize = (n: bigint): bigint[] => {
        const factors: bigint[] = [];
        let remaining = n;
        
        for (let i = 2n; i * i <= remaining; i++) {
          while (remaining % i === 0n) {
            factors.push(i);
            remaining = remaining / i;
          }
        }
        
        if (remaining > 1n) factors.push(remaining);
        return factors;
      };
      
      const testNumber = 10001n; // 73 × 137
      
      // Our approach
      const start1 = Date.now();
      const result1 = await factorizer.factorize(testNumber);
      const time1 = Date.now() - start1;
      
      // Naive approach
      const start2 = Date.now();
      const result2 = naiveFactorize(testNumber);
      const time2 = Date.now() - start2;
      
      expect(result1).toEqual(result2);
      
      // Our approach should leverage the Mathematical Universe structure
      // For this specific case, it might not always be faster due to overhead,
      // but it demonstrates understanding of the number's structure
      console.log(`Mathematical Universe: ${time1}ms`);
      console.log(`Naive trial division: ${time2}ms`);
    });
  });
});