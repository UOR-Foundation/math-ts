/**
 * Tests for discrete calculus operations
 */

import {
  forwardDifference,
  backwardDifference,
  centralDifference,
  secondDifference,
  higherOrderDifference,
  discreteLaplacian,
  analyzeSequenceLimit,
  differencesTable,
  newtonForwardInterpolation,
  estimateRateOfChange,
  isLocalExtremum,
  discreteGradient,
} from '../src/discrete';

describe('Discrete Calculus', () => {
  // Test function: f(n) = n²
  const quadratic = (n: bigint) => Number(n) * Number(n);

  // Test function: f(n) = 2n + 3
  const linear = (n: bigint) => 2 * Number(n) + 3;

  // Test function: f(n) = n³ - 6n² + 11n - 6
  const cubic = (n: bigint) => {
    const x = Number(n);
    return x * x * x - 6 * x * x + 11 * x - 6;
  };

  describe('forwardDifference', () => {
    test('should compute forward difference for linear function', () => {
      // For linear function, difference should be constant
      expect(forwardDifference(linear, 5n)).toBe(2);
      expect(forwardDifference(linear, 10n)).toBe(2);
      expect(forwardDifference(linear, 100n)).toBe(2);
    });

    test('should compute forward difference for quadratic function', () => {
      // For f(n) = n², Δf(n) = (n+1)² - n² = 2n + 1
      expect(forwardDifference(quadratic, 5n)).toBe(11); // 2*5 + 1
      expect(forwardDifference(quadratic, 10n)).toBe(21); // 2*10 + 1
    });
  });

  describe('backwardDifference', () => {
    test('should compute backward difference for linear function', () => {
      expect(backwardDifference(linear, 5n)).toBe(2);
      expect(backwardDifference(linear, 10n)).toBe(2);
    });

    test('should compute backward difference for quadratic function', () => {
      // For f(n) = n², ∇f(n) = n² - (n-1)² = 2n - 1
      expect(backwardDifference(quadratic, 5n)).toBe(9); // 2*5 - 1
      expect(backwardDifference(quadratic, 10n)).toBe(19); // 2*10 - 1
    });
  });

  describe('centralDifference', () => {
    test('should compute central difference for quadratic function', () => {
      // For f(n) = n², δf(n) = ((n+1)² - (n-1)²)/2 = 2n
      expect(centralDifference(quadratic, 5n)).toBe(10); // 2*5
      expect(centralDifference(quadratic, 10n)).toBe(20); // 2*10
    });

    test('should be average of forward and backward differences', () => {
      const n = 7n;
      const forward = forwardDifference(cubic, n);
      const backward = backwardDifference(cubic, n);
      const central = centralDifference(cubic, n);
      expect(central).toBeCloseTo((forward + backward) / 2, 10);
    });
  });

  describe('secondDifference', () => {
    test('should be zero for linear functions', () => {
      expect(secondDifference(linear, 5n)).toBe(0);
      expect(secondDifference(linear, 10n)).toBe(0);
    });

    test('should be constant for quadratic functions', () => {
      // For f(n) = n², Δ²f(n) = 2
      expect(secondDifference(quadratic, 5n)).toBe(2);
      expect(secondDifference(quadratic, 10n)).toBe(2);
    });

    test('should detect curvature', () => {
      // Positive curvature (convex)
      const convex = (n: bigint) => Number(n) * Number(n);
      expect(secondDifference(convex, 0n)).toBeGreaterThan(0);

      // Negative curvature (concave)
      const concave = (n: bigint) => -Number(n) * Number(n);
      expect(secondDifference(concave, 0n)).toBeLessThan(0);
    });
  });

  describe('higherOrderDifference', () => {
    test('should match specific difference functions', () => {
      const n = 5n;
      expect(higherOrderDifference(cubic, n, 0)).toBe(cubic(n));
      expect(higherOrderDifference(cubic, n, 1)).toBe(forwardDifference(cubic, n));
      expect(higherOrderDifference(cubic, n, 2)).toBe(secondDifference(cubic, n));
    });

    test('should eventually become zero for polynomials', () => {
      // For a degree-3 polynomial, 4th difference should be 0
      expect(higherOrderDifference(cubic, 5n, 4)).toBe(0);
      expect(higherOrderDifference(cubic, 10n, 4)).toBe(0);
    });
  });

  describe('discreteLaplacian', () => {
    test('should equal second difference', () => {
      const n = 5n;
      expect(discreteLaplacian(quadratic, n)).toBe(secondDifference(quadratic, n));
    });

    test('should detect wells and ridges', () => {
      // Well function (minimum at n=5)
      const well = (n: bigint) => {
        const x = Number(n) - 5;
        return x * x;
      };

      // At minimum, Laplacian > 0
      expect(discreteLaplacian(well, 5n)).toBeGreaterThan(0);

      // Ridge function (maximum at n=5)
      const ridge = (n: bigint) => {
        const x = Number(n) - 5;
        return -x * x;
      };

      // At maximum, Laplacian < 0
      expect(discreteLaplacian(ridge, 5n)).toBeLessThan(0);
    });
  });

  describe('analyzeSequenceLimit', () => {
    test('should detect convergent sequences', () => {
      // Sequence converging to 1: 1 + 1/n
      const convergent = Array.from({ length: 100 }, (_, i) => 1 + 1 / (i + 1));
      const result = analyzeSequenceLimit(convergent);

      expect(result.exists).toBe(true);
      expect(result.value).toBeCloseTo(1, 1); // With finite terms, we can't get arbitrarily close
      expect(result.convergenceRate).toBeLessThan(1);
    });

    test('should detect non-convergent sequences', () => {
      // Oscillating sequence
      const oscillating = Array.from({ length: 20 }, (_, i) => (i % 2 === 0 ? 1 : -1));
      const result = analyzeSequenceLimit(oscillating);

      expect(result.exists).toBe(false);
      expect(result.error).toContain('oscillating');
    });

    test('should handle short sequences', () => {
      const tooShort = [1, 2];
      const result = analyzeSequenceLimit(tooShort);

      expect(result.exists).toBe(false);
      expect(result.error).toContain('too short');
    });
  });

  describe('differencesTable', () => {
    test('should compute correct difference table', () => {
      const values = [1, 4, 9, 16, 25]; // n²
      const table = differencesTable(values);

      expect(table[0]).toEqual([1, 4, 9, 16, 25]);
      expect(table[1]).toEqual([3, 5, 7, 9]); // First differences
      expect(table[2]).toEqual([2, 2, 2]); // Second differences (constant)
      expect(table[3]).toEqual([0, 0]); // Third differences
    });

    test('should handle maxOrder parameter', () => {
      const values = [1, 2, 4, 8, 16];
      const table = differencesTable(values, 2);

      expect(table.length).toBe(3); // Original + 2 orders
    });
  });

  describe('newtonForwardInterpolation', () => {
    test('should interpolate polynomial exactly at nodes', () => {
      const values = [1, 4, 9, 16, 25]; // f(n) = (n+1)²
      const x0 = 0n;

      // Check at nodes
      expect(newtonForwardInterpolation(x0, values, 0n)).toBeCloseTo(1, 10);
      expect(newtonForwardInterpolation(x0, values, 1n)).toBeCloseTo(4, 10);
      expect(newtonForwardInterpolation(x0, values, 2n)).toBeCloseTo(9, 10);
    });

    test('should extrapolate reasonably', () => {
      const values = [1, 4, 9, 16]; // f(n) = (n+1)²
      const x0 = 0n;

      // Extrapolate to n=4: should give 25
      const result = newtonForwardInterpolation(x0, values, 4n);
      expect(result).toBeCloseTo(25, 5);
    });
  });

  describe('estimateRateOfChange', () => {
    test('should compute derivatives with different methods', () => {
      const n = 5n;

      const forward = estimateRateOfChange(quadratic, n, 'forward');
      const backward = estimateRateOfChange(quadratic, n, 'backward');
      const central = estimateRateOfChange(quadratic, n, 'central');

      expect(forward.value).toBe(forwardDifference(quadratic, n));
      expect(backward.value).toBe(backwardDifference(quadratic, n));
      expect(central.value).toBe(centralDifference(quadratic, n));

      expect(forward.order).toBe(1);
      expect(forward.position).toBe(n);
    });
  });

  describe('isLocalExtremum', () => {
    test('should detect local minimum', () => {
      // Parabola with minimum at n=5
      const parabola = (n: bigint) => {
        const x = Number(n) - 5;
        return x * x;
      };

      const result = isLocalExtremum(parabola, 5n);
      expect(result.isExtremum).toBe(true);
      expect(result.type).toBe('minimum');
    });

    test('should detect local maximum', () => {
      // Inverted parabola with maximum at n=5
      const invParabola = (n: bigint) => {
        const x = Number(n) - 5;
        return -x * x + 10;
      };

      const result = isLocalExtremum(invParabola, 5n);
      expect(result.isExtremum).toBe(true);
      expect(result.type).toBe('maximum');
    });

    test('should not detect extremum on monotonic function', () => {
      const result = isLocalExtremum(linear, 5n);
      expect(result.isExtremum).toBe(false);
    });
  });

  describe('discreteGradient', () => {
    test('should compute gradient in field space', () => {
      // Test function: sum of active fields
      const f = (pattern: boolean[]) => {
        return pattern.reduce((sum, bit) => sum + (bit ? 1 : 0), 0);
      };

      const pattern = [true, false, true, false, false, true, false, true];
      const gradient = discreteGradient(f, pattern);

      // Gradient should be -1 for active fields, +1 for inactive
      pattern.forEach((bit, i) => {
        expect(gradient[i]).toBe(bit ? -1 : 1);
      });
    });

    test('should handle nonlinear field functions', () => {
      // Test function: product of indices of active fields
      const f = (pattern: boolean[]) => {
        let product = 1;
        pattern.forEach((bit, i) => {
          if (bit) product *= i + 1;
        });
        return product;
      };

      const pattern = [true, true, false, false, false, false, false, false];
      const gradient = discreteGradient(f, pattern);

      // For this pattern, f = 1 * 2 = 2
      // Flipping bit 0: f = 2 (no change), so gradient[0] = 0
      // Flipping bit 1: f = 1, so gradient[1] = 1 - 2 = -1
      // Flipping bit 2: f = 1 * 2 * 3 = 6, so gradient[2] = 6 - 2 = 4
      expect(gradient[0]).toBe(0);
      expect(gradient[1]).toBe(-1);
      expect(gradient[2]).toBe(4);
    });
  });
});
