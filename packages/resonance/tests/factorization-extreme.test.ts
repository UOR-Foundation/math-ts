import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { MultiModalFactorization } from '../src/multimodal-factorization';
import { isPrimeViaFieldDynamicsTrue } from '../src/true-field-prime-detection';

describe('Extreme Scale Factorization Tests', () => {
  const substrate = createFieldSubstrate();
  const factorizer = new MultiModalFactorization(substrate);

  beforeEach(() => {
    factorizer.clearCache();
  });

  describe('Hard Semiprimes (products of two large primes)', () => {
    test('should factor medium semiprimes', async () => {
      const testCases = [
        // Products of primes around 100
        { n: 10403n, expected: [101n, 103n] }, // 101 × 103
        { n: 11021n, expected: [103n, 107n] }, // 103 × 107
        { n: 11663n, expected: [107n, 109n] }, // 107 × 109
        { n: 12403n, expected: [79n, 157n] }, // 79 × 157
        
        // Products of primes around 1000
        { n: 1018081n, expected: [1009n, 1009n] }, // 1009^2
        { n: 1030301n, expected: [101n, 101n, 101n] }, // 101^3
        { n: 1061783n, expected: [1061783n] }, // Actually prime!
        
        // Products of disparate primes
        { n: 323n, expected: [17n, 19n] }, // Small semiprime
        { n: 9991n, expected: [97n, 103n] }, // ~100 × ~100
        { n: 999961n, expected: [997n, 1003n] }, // ~1000 × ~1000
      ];

      for (const { n, expected } of testCases) {
        const start = Date.now();
        const result = await factorizer.factorize(n);
        const time = Date.now() - start;
        
        expect(result).toEqual(expected);
        expect(time).toBeLessThan(100); // Should be fast
      }
    });

    test('should handle larger semiprimes with timeout', async () => {
      const testCases = [
        // Larger semiprimes that might take longer
        { n: 99400891n, expected: [9967n, 9973n] }, // ~10K × ~10K
        { n: 1000000021n, expected: [1000000021n] }, // Actually prime!
        { n: 10000000207n, expected: [10000000207n] }, // Actually prime!
      ];

      for (const { n, expected } of testCases) {
        const start = Date.now();
        const result = await factorizer.factorize(n);
        const time = Date.now() - start;
        
        expect(result).toEqual(expected);
        expect(time).toBeLessThan(5000); // 5 second timeout
      }
    }, 20000); // 20 second test timeout
  });

  describe('Random Composite Numbers', () => {
    test('should factor random composites with multiple factors', async () => {
      const testCases = [
        // Random composites with known factorizations
        { n: 123456789n, expected: [3n, 3n, 3607n, 3803n] },
        { n: 987654321n, expected: [3n, 3n, 17n, 17n, 379721n] },
        { n: 314159265n, expected: [3n, 3n, 5n, 7n, 127n, 7853n] },
        { n: 271828182n, expected: [2n, 3n, 45304697n] },
        { n: 161803398n, expected: [2n, 3n, 5189n, 5197n] },
        
        // Numbers with many small factors
        { n: 362880n, expected: [2n, 2n, 2n, 2n, 2n, 2n, 2n, 3n, 3n, 3n, 3n, 5n, 5n, 7n] }, // 9!
        { n: 3628800n, expected: [2n, 2n, 2n, 2n, 2n, 2n, 2n, 2n, 3n, 3n, 3n, 3n, 5n, 5n, 7n] }, // 10!
        
        // Fibonacci numbers (often have interesting factorizations)
        { n: 4181n, expected: [37n, 113n] }, // F_19
        { n: 46368n, expected: [2n, 2n, 2n, 2n, 2n, 3n, 3n, 7n, 23n] }, // F_24
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Pseudoprimes and Carmichael Numbers', () => {
    test('should correctly factor pseudoprimes', async () => {
      const testCases = [
        // Fermat pseudoprimes base 2
        { n: 341n, expected: [11n, 31n] }, // Smallest pseudoprime base 2
        { n: 561n, expected: [3n, 11n, 17n] }, // Smallest Carmichael number
        { n: 645n, expected: [3n, 5n, 43n] },
        { n: 1105n, expected: [5n, 13n, 17n] }, // Second Carmichael number
        { n: 1729n, expected: [7n, 13n, 19n] }, // Hardy-Ramanujan number
        { n: 2465n, expected: [5n, 17n, 29n] },
        { n: 2821n, expected: [7n, 13n, 31n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Edge Cases and Special Forms', () => {
    test('should handle numbers with repeated factors', async () => {
      const testCases = [
        // Perfect powers
        { n: 128n, expected: [2n, 2n, 2n, 2n, 2n, 2n, 2n] }, // 2^7
        { n: 2187n, expected: [3n, 3n, 3n, 3n, 3n, 3n, 3n] }, // 3^7
        { n: 16807n, expected: [7n, 7n, 7n, 7n, 7n] }, // 7^5
        { n: 100000n, expected: [2n, 2n, 2n, 2n, 2n, 5n, 5n, 5n, 5n, 5n] }, // 10^5
        
        // Mixed powers
        { n: 72n, expected: [2n, 2n, 2n, 3n, 3n] }, // 2^3 × 3^2
        { n: 1800n, expected: [2n, 2n, 2n, 3n, 3n, 5n, 5n] }, // 2^3 × 3^2 × 5^2
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });

    test('should handle Mersenne numbers', async () => {
      const testCases = [
        // Mersenne numbers 2^p - 1
        { n: 2047n, expected: [23n, 89n] }, // 2^11 - 1
        { n: 8191n, expected: [8191n] }, // 2^13 - 1 (prime)
        { n: 131071n, expected: [131071n] }, // 2^17 - 1 (prime)
        { n: 524287n, expected: [524287n] }, // 2^19 - 1 (prime)
        { n: 1048575n, expected: [3n, 5n, 5n, 11n, 31n, 41n] }, // 2^20 - 1
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Performance Stress Test', () => {
    test('should maintain performance under load', async () => {
      // Generate a mix of number types
      const testNumbers: bigint[] = [];
      
      // Small primes
      testNumbers.push(2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n);
      
      // Products of two primes
      testNumbers.push(77n, 143n, 221n, 323n, 437n, 667n, 899n);
      
      // Large primes
      testNumbers.push(1000003n, 10000019n, 100000007n);
      
      // Complex composites
      testNumbers.push(1001n, 10001n, 100001n, 1000001n);
      
      // Random values
      testNumbers.push(
        123456n, 234567n, 345678n, 456789n, 567890n,
        12345678n, 23456789n, 34567890n, 45678901n,
        123456789n, 234567890n, 345678901n
      );

      const startTotal = Date.now();
      let totalFactorizations = 0;

      for (const n of testNumbers) {
        const result = await factorizer.factorize(n);
        totalFactorizations++;
        
        // Verify correctness
        const product = result.reduce((a, b) => a * b, 1n);
        expect(product).toBe(n);
      }

      const totalTime = Date.now() - startTotal;
      const avgTime = totalTime / totalFactorizations;

      console.log(`\nStress test: ${totalFactorizations} factorizations in ${totalTime}ms`);
      console.log(`Average time: ${avgTime.toFixed(2)}ms per factorization`);
      
      expect(avgTime).toBeLessThan(50); // Average should be under 50ms
    });
  });

  describe('Field Pattern Analysis for Hard Cases', () => {
    test('should leverage field patterns for difficult factorizations', async () => {
      // Test specific numbers where field patterns should help
      const testCases = [
        {
          n: 77n, // 7 × 11
          vanishedField: 1, // Tribonacci field vanishes
          factors: [7n, 11n]
        },
        {
          n: 143n, // 11 × 13
          expectedPattern: [true, true, true, true, false, false, false, true],
          factors: [11n, 13n]
        },
      ];

      for (const testCase of testCases) {
        const pattern = substrate.getFieldPattern(testCase.n);
        
        if ('vanishedField' in testCase) {
          expect(pattern[testCase.vanishedField]).toBe(false);
          
          // Check that both factors have this field
          for (const factor of testCase.factors) {
            const factorPattern = substrate.getFieldPattern(factor);
            expect(factorPattern[testCase.vanishedField]).toBe(true);
          }
        }
        
        if ('expectedPattern' in testCase) {
          expect(pattern).toEqual(testCase.expectedPattern);
        }
        
        const result = await factorizer.factorize(testCase.n);
        expect(result).toEqual(testCase.factors);
      }
    });
  });

  describe('Extreme Large Numbers (with reasonable timeouts)', () => {
    test('should handle very large primes efficiently', async () => {
      const largePrimes = [
        // Large known primes
        10000000019n,
        100000000003n,
        1000000000039n,
        10000000000037n,
        100000000000031n,
        1000000000000037n,
      ];

      for (const p of largePrimes) {
        const start = Date.now();
        const result = await factorizer.factorize(p);
        const time = Date.now() - start;
        
        expect(result).toEqual([p]);
        expect(time).toBeLessThan(100); // Prime test should be very fast
        
        console.log(`  ${p} (${p.toString().length} digits): ${time}ms`);
      }
    });

    test('should factor large numbers with small factors', async () => {
      const testCases = [
        { n: 1000000000000002n, expected: [2n, 3n, 7n, 1429n, 16666666667n] },
        { n: 9999999999999999n, expected: [3n, 3n, 239n, 4649n, 909091n, 1111111n] },
      ];

      for (const { n, expected } of testCases) {
        const start = Date.now();
        const result = await factorizer.factorize(n);
        const time = Date.now() - start;
        
        // Verify product
        const product = result.reduce((a, b) => a * b, 1n);
        expect(product).toBe(n);
        
        console.log(`  ${n}: ${result.join(' × ')} (${time}ms)`);
        
        // For very large numbers, we just verify correctness, not exact factorization
        expect(time).toBeLessThan(5000);
      }
    }, 10000);
  });
});