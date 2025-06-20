/**
 * Tests for integration operations
 */

import {
  discreteIntegral,
  trapezoidalIntegral,
  simpsonsIntegral,
  pathIntegral,
  lineIntegral,
  pageResonanceIntegral,
  verifyFieldConservation,
  weightedIntegral,
  monteCarloIntegral,
  actionIntegral,
  createIntegrationResult,
} from '../src/integration';

describe('Integration', () => {
  // Test functions
  const constant = (n: bigint) => 5;
  const linear = (n: bigint) => Number(n);
  const quadratic = (n: bigint) => Number(n) * Number(n);
  const sine = (n: bigint) => Math.sin((Number(n) * Math.PI) / 10);

  describe('discreteIntegral', () => {
    test('should integrate constant function', () => {
      // ∫[0,10] 5 = 5 * 11 = 55
      expect(discreteIntegral(constant, 0n, 10n)).toBe(55);
    });

    test('should integrate linear function', () => {
      // ∫[0,5] n = 0 + 1 + 2 + 3 + 4 + 5 = 15
      expect(discreteIntegral(linear, 0n, 5n)).toBe(15);
    });

    test('should handle negative direction', () => {
      const result1 = discreteIntegral(linear, 0n, 5n);
      const result2 = discreteIntegral(linear, 5n, 0n);
      expect(result2).toBe(-result1);
    });
  });

  describe('trapezoidalIntegral', () => {
    test('should be exact for linear functions', () => {
      // Trapezoidal rule is exact for linear functions
      const discrete = discreteIntegral(linear, 0n, 10n);
      const trapezoidal = trapezoidalIntegral(linear, 0n, 10n);
      expect(trapezoidal).toBeCloseTo(discrete - 5, 10); // Adjusted for endpoint weighting
    });

    test('should approximate quadratic functions better than discrete', () => {
      const start = 0n;
      const end = 10n;

      // For quadratic, trapezoidal should be closer to continuous integral
      const discrete = discreteIntegral(quadratic, start, end);
      const trapezoidal = trapezoidalIntegral(quadratic, start, end);

      // Continuous integral of x² from 0 to 10 is 333.33...
      const continuous = 1000 / 3;

      expect(Math.abs(trapezoidal - continuous)).toBeLessThan(Math.abs(discrete - continuous));
    });

    test('should handle single point interval', () => {
      expect(trapezoidalIntegral(quadratic, 5n, 5n)).toBe(0);
    });
  });

  describe('simpsonsIntegral', () => {
    test('should be exact for polynomials up to degree 3', () => {
      const cubic = (n: bigint) => {
        const x = Number(n);
        return x * x * x;
      };

      // Simpson's rule is exact for cubics
      // ∫[0,4] x³ dx = x⁴/4 |[0,4] = 64
      const result = simpsonsIntegral(cubic, 0n, 4n);
      expect(result).toBeCloseTo(64, 5);
    });

    test('should handle odd number of intervals', () => {
      // Should still work with adjustment
      const result = simpsonsIntegral(quadratic, 0n, 5n);
      expect(result).toBeGreaterThan(0);
    });

    test('should be most accurate for smooth functions', () => {
      const start = 0n;
      const end = 10n; // Half period for non-zero integral

      const discrete = discreteIntegral(sine, start, end);
      const trapezoidal = trapezoidalIntegral(sine, start, end);
      const simpsons = simpsonsIntegral(sine, start, end);

      // For sine wave, Simpson's should be most accurate
      // Continuous integral of sin(πx/10) from 0 to 10 is 20/π ≈ 6.366
      const continuous = 20 / Math.PI;

      const errorDiscrete = Math.abs(discrete - continuous);
      const errorTrapezoidal = Math.abs(trapezoidal - continuous);
      const errorSimpsons = Math.abs(simpsons - continuous);

      // Simpson's should have smallest error for smooth functions
      expect(errorSimpsons).toBeLessThanOrEqual(errorTrapezoidal);
      expect(errorSimpsons).toBeLessThan(errorDiscrete);
    });
  });

  describe('pathIntegral', () => {
    test('should compute real path integral', () => {
      const path = [0n, 1n, 2n, 3n, 4n];
      const result = pathIntegral(path, linear);

      expect(result.real).toBe(10); // 0 + 1 + 2 + 3 + 4
      expect(result.imaginary).toBe(0);
      expect(result.magnitude).toBe(10);
    });

    test('should handle complex path integral with phase', () => {
      const path = [0n, 1n, 2n, 3n];
      const amplitude = (n: bigint) => 1;
      const phase = (n: bigint) => (Number(n) * Math.PI) / 2;

      const result = pathIntegral(path, amplitude, phase);

      // e^(i*0) + e^(i*π/2) + e^(i*π) + e^(i*3π/2)
      // = 1 + i - 1 - i = 0
      expect(result.real).toBeCloseTo(0, 10);
      expect(result.imaginary).toBeCloseTo(0, 10);
      expect(result.magnitude).toBeCloseTo(0, 10);
    });

    test('should handle empty path', () => {
      const result = pathIntegral([], linear);
      expect(result.real).toBe(0);
      expect(result.imaginary).toBe(0);
      expect(result.magnitude).toBe(0);
    });
  });

  describe('lineIntegral', () => {
    test('should compute line integral without embedding', () => {
      const path = [0n, 1n, 2n, 3n];
      const vectorField = (n: bigint) => ({ x: Number(n), y: 0 });

      const result = lineIntegral(path, vectorField);

      // dx = 1 for each step, field.x increases
      // (0*1) + (1*1) + (2*1) = 3
      expect(result).toBe(3);
    });

    test('should compute line integral with embedding', () => {
      const path = [0n, 1n, 2n];
      const vectorField = (n: bigint) => ({ x: 1, y: 1 });

      const embedding = {
        getCoordinates: (n: bigint) => ({
          x: Number(n),
          y: Number(n) * Number(n),
        }),
        getCurvature: (n: bigint) => 0.1,
      };

      const result = lineIntegral(path, vectorField, embedding);

      // Path from (0,0) to (1,1) to (2,4)
      // dx = [1, 1], dy = [1, 3]
      // Field is constant (1,1)
      // Result = 1*1 + 1*1 + 1*1 + 1*3 = 6
      expect(result).toBe(6);
    });

    test('should handle single point path', () => {
      const path = [5n];
      const vectorField = (n: bigint) => ({ x: 1, y: 1 });

      const result = lineIntegral(path, vectorField);
      expect(result).toBe(0);
    });
  });

  describe('pageResonanceIntegral', () => {
    test('should integrate over correct page range', () => {
      const mockResonance = (n: bigint) => {
        // Simple mock: resonance = 1 for all numbers
        return 1;
      };

      // Page 2: numbers 96-143 (48 numbers)
      const result = pageResonanceIntegral(mockResonance, 2n);
      expect(result).toBe(48);
    });

    test('should handle page 0', () => {
      const mockResonance = (n: bigint) => Number(n);

      // Page 0: numbers 0-47
      const result = pageResonanceIntegral(mockResonance, 0n);
      const expected = Array.from({ length: 48 }, (_, i) => i).reduce((a, b) => a + b);
      expect(result).toBe(expected);
    });
  });

  describe('verifyFieldConservation', () => {
    test('should verify conservation for mock field substrate', () => {
      const mockFieldSubstrate = {
        getFieldPattern: (n: bigint) => {
          // Simple pattern: field i is active if (n + i) is even
          const bits = Array.from({ length: 8 }, (_, i) => (Number(n) + i) % 2 === 0);
          return { bits };
        },
      };

      // Check field 0
      const result = verifyFieldConservation(mockFieldSubstrate, 0, 0n);

      expect(result).toHaveProperty('conserved');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('expected');
      expect(result).toHaveProperty('fieldParity');
    });

    test('should reject invalid field index', () => {
      const mockFieldSubstrate = {
        getFieldPattern: (n: bigint) => ({ bits: [] }),
      };

      expect(() => verifyFieldConservation(mockFieldSubstrate, -1)).toThrow();
      expect(() => verifyFieldConservation(mockFieldSubstrate, 8)).toThrow();
    });
  });

  describe('weightedIntegral', () => {
    test('should compute weighted integral', () => {
      const f = (n: bigint) => Number(n);
      const weight = (n: bigint) => (Number(n) === 2 ? 10 : 1);

      // Integral from 0 to 4 with heavy weight at n=2
      const result = weightedIntegral(f, weight, 0n, 4n);

      // Values: [0, 1, 2, 3, 4]
      // Weights: [1, 1, 10, 1, 1]
      // Weighted sum: 0*1 + 1*1 + 2*10 + 3*1 + 4*1 = 28
      // Total weight: 14
      expect(result).toBeCloseTo(28 / 14, 10);
    });

    test('should handle zero total weight', () => {
      const f = (n: bigint) => Number(n);
      const weight = (n: bigint) => 0;

      const result = weightedIntegral(f, weight, 0n, 10n);
      expect(result).toBe(0);
    });
  });

  describe('monteCarloIntegral', () => {
    test('should estimate integral over field patterns', () => {
      // Function that counts active fields
      const f = (pattern: boolean[]) => {
        return pattern.reduce((sum, bit) => sum + (bit ? 1 : 0), 0);
      };

      const result = monteCarloIntegral(f, 1000, 42);

      // Expected value: 4 (half of 8 fields active on average)
      // Volume: 256
      // So integral ≈ 4 * 256 = 1024
      expect(result.estimate).toBeCloseTo(1024, -1);
      expect(result.error).toBeGreaterThan(0);
    });

    test('should be deterministic with same seed', () => {
      const f = (pattern: boolean[]) => (pattern[0] ? 1 : 0);

      const result1 = monteCarloIntegral(f, 100, 12345);
      const result2 = monteCarloIntegral(f, 100, 12345);

      expect(result1.estimate).toBe(result2.estimate);
      expect(result1.error).toBe(result2.error);
    });

    test('should have decreasing error with more samples', () => {
      // Function with some variance
      const f = (pattern: boolean[]) => {
        // Count number of true bits
        const count = pattern.filter((b) => b).length;
        return count * count; // Quadratic in bit count
      };

      const result100 = monteCarloIntegral(f, 100);
      const result1000 = monteCarloIntegral(f, 1000);

      // With more samples, error should decrease (or at least not increase significantly)
      expect(result1000.error).toBeLessThanOrEqual(result100.error * 1.1);
    });
  });

  describe('actionIntegral', () => {
    test('should compute action along path', () => {
      const kinetic = (n: bigint) => Number(n); // T = n
      const potential = (n: bigint) => Number(n) * Number(n); // V = n²
      const path = [0n, 1n, 2n, 3n];

      const result = actionIntegral(kinetic, potential, path);

      // L = T - V = n - n²
      // Action = (0-0) + (1-1) + (2-4) + (3-9) = 0 + 0 - 2 - 6 = -8
      expect(result).toBe(-8);
    });

    test('should handle empty path', () => {
      const kinetic = (n: bigint) => 1;
      const potential = (n: bigint) => 1;

      const result = actionIntegral(kinetic, potential, []);
      expect(result).toBe(0);
    });
  });

  describe('createIntegrationResult', () => {
    test('should create proper result object', () => {
      const result = createIntegrationResult(42.5, 0n, 10n, 'simpson');

      expect(result.value).toBe(42.5);
      expect(result.intervalStart).toBe(0n);
      expect(result.intervalEnd).toBe(10n);
      expect(result.method).toBe('simpson');
    });
  });
});
