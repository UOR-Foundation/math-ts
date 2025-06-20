/**
 * Tests for series expansions
 */

import {
  taylorExpansion,
  fourierAnalysis,
  fieldPatternFourier,
  chebyshevExpansion,
  padeApproximation,
  evaluateSeries,
  asymptoticExpansion,
} from '../src/series';

describe('Series Expansions', () => {
  describe('taylorExpansion', () => {
    test('should compute Taylor series for exponential-like function', () => {
      // f(n) = 2^n (discrete exponential)
      const exp2 = (n: bigint) => Math.pow(2, Number(n));
      const center = 0n;
      const order = 4;

      const series = taylorExpansion(exp2, center, order);

      expect(series.center).toBe(center);
      expect(series.type).toBe('taylor');
      expect(series.coefficients.length).toBe(order + 1);

      // At center, f(0) = 1
      expect(series.coefficients[0]).toBe(1);

      // For discrete 2^n, forward difference at 0: 2^1 - 2^0 = 1
      expect(series.coefficients[1]).toBe(1);
    });

    test('should compute Taylor series for polynomial', () => {
      // f(n) = n³ - 2n² + n + 1
      const poly = (n: bigint) => {
        const x = Number(n);
        return x * x * x - 2 * x * x + x + 1;
      };

      const center = 1n;
      const series = taylorExpansion(poly, center, 5);

      // Evaluate at center
      expect(series.coefficients[0]).toBe(poly(center));

      // For polynomials, Taylor series should be exact
      // Coefficients beyond degree 3 should be 0
      expect(series.coefficients[4]).toBeCloseTo(0, 10);
      expect(series.coefficients[5]).toBeCloseTo(0, 10);
    });

    test('should estimate convergence radius', () => {
      const f = (n: bigint) => 1 / (1 + Number(n));
      const series = taylorExpansion(f, 0n, 10);

      // For discrete series, radius estimation is approximate
      expect(series.radius).toBeGreaterThan(0);
      expect(series.radius).toBeLessThan(10);
    });
  });

  describe('fourierAnalysis', () => {
    test('should decompose periodic signal', () => {
      // Create a simple periodic signal
      const period = 8;
      const pattern = Array.from({ length: period }, (_, i) =>
        Math.sin((2 * Math.PI * i) / period),
      );

      const series = fourierAnalysis(pattern, period);

      expect(series.type).toBe('fourier');
      expect(series.center).toBe(0n);
      expect(series.radius).toBe(period / 2);

      // Coefficients stored as [magnitude, phase] pairs
      expect(series.coefficients.length).toBe(period * 2);

      // DC component should be near 0
      expect(series.coefficients[0]).toBeCloseTo(0, 5);

      // Fundamental frequency magnitude at index 2 (k=1)
      // For cos(2πn/8), magnitude should be 0.5 after normalization
      expect(series.coefficients[2]).toBeCloseTo(0.5, 2);
    });

    test('should handle 256-periodic field patterns', () => {
      // Simulate a field pattern
      const pattern = Array.from({ length: 256 }, (_, i) => (i % 2 === 0 ? 1 : 0));

      const series = fourierAnalysis(pattern);

      expect(series.radius).toBe(128); // Nyquist frequency

      // DC component should be 0.5 (average)
      expect(series.coefficients[0]).toBeCloseTo(0.5, 5);
    });

    test('should detect multiple frequencies', () => {
      // Signal with two frequencies
      const pattern = Array.from(
        { length: 64 },
        (_, i) => Math.sin((2 * Math.PI * i) / 64) + 0.5 * Math.sin((6 * Math.PI * i) / 64),
      );

      const series = fourierAnalysis(pattern, 64);

      // Check fundamental frequency (k=1)
      expect(series.coefficients[2]).toBeCloseTo(0.5, 2); // magnitude (normalized)

      // Check third harmonic (k=3)
      expect(series.coefficients[6]).toBeCloseTo(0.25, 2); // magnitude (normalized)
    });
  });

  describe('chebyshevExpansion', () => {
    test('should compute Chebyshev coefficients', () => {
      // f(n) = n² on [0, 10]
      const f = (n: bigint) => Number(n) * Number(n);
      const series = chebyshevExpansion(f, 0n, 10n, 4);

      expect(series.type).toBe('other');
      expect(series.center).toBe(5n); // Center of interval
      expect(series.radius).toBe(5); // Half-width
      expect(series.coefficients.length).toBe(5);
    });

    test('should provide alternative approximation to Taylor', () => {
      // Runge function: 1/(1 + n²)
      const runge = (n: bigint) => 1 / (1 + Number(n) * Number(n));

      const taylor = taylorExpansion(runge, 0n, 6);
      const chebyshev = chebyshevExpansion(runge, -5n, 5n, 6);

      // Both should have non-zero coefficients
      expect(taylor.coefficients.length).toBe(7);
      expect(chebyshev.coefficients.length).toBe(7);

      // Chebyshev coefficients should be different from Taylor
      expect(chebyshev.coefficients[0]).not.toBeCloseTo(taylor.coefficients[0], 5);
    });
  });

  describe('padeApproximation', () => {
    test('should compute Padé [1,1] approximation', () => {
      // Taylor coefficients for e^x: 1, 1, 1/2, 1/6, ...
      const expTaylor = [1, 1, 0.5, 1 / 6, 1 / 24, 1 / 120];

      const pade = padeApproximation(expTaylor, 1, 1);

      expect(pade.numerator.length).toBe(2); // degree 1
      expect(pade.denominator.length).toBe(2); // degree 1
      expect(pade.denominator[0]).toBe(1); // normalized
    });

    test('should handle pure polynomial case', () => {
      const taylor = [1, 2, 3, 4];
      const pade = padeApproximation(taylor, 3, 0);

      expect(pade.numerator).toEqual([1, 2, 3, 4]);
      expect(pade.denominator).toEqual([1]);
    });

    test('should improve convergence for functions with poles', () => {
      // Taylor series for a rational function
      // Use coefficients that won't create a singular matrix
      const taylorCoeffs = [1, 0.5, 0.3, 0.2, 0.15, 0.12, 0.1, 0.08];

      const pade22 = padeApproximation(taylorCoeffs, 2, 2);

      // Padé should have both numerator and denominator
      expect(pade22.numerator.length).toBe(3);
      expect(pade22.denominator.length).toBe(3);
    });

    test('should throw for insufficient coefficients', () => {
      const taylor = [1, 2];

      expect(() => padeApproximation(taylor, 2, 2)).toThrow();
    });
  });

  describe('evaluateSeries', () => {
    test('should evaluate Taylor series', () => {
      const f = (n: bigint) => Number(n) * Number(n);
      const series = taylorExpansion(f, 5n, 3);

      // Should be exact at center
      expect(evaluateSeries(series, 5n)).toBe(25);

      // Should be reasonable near center
      const at6 = evaluateSeries(series, 6n);
      // Taylor approximation may not be exact for discrete functions
      expect(Math.abs(at6 - 36)).toBeLessThan(2);
    });

    test('should evaluate Fourier series', () => {
      const pattern = [0, 1, 0, -1]; // Simple square wave
      const series = fourierAnalysis(pattern, 4);

      // Should reconstruct original at sample points
      expect(evaluateSeries(series, 0n)).toBeCloseTo(0, 5);
      expect(evaluateSeries(series, 1n)).toBeCloseTo(1, 5);
    });

    test('should evaluate Chebyshev series', () => {
      const f = (n: bigint) => Number(n);
      const series = chebyshevExpansion(f, -10n, 10n, 1);

      // Linear function approximation
      expect(evaluateSeries(series, 0n)).toBeCloseTo(0, 1);
      expect(evaluateSeries(series, 5n)).toBeCloseTo(5, 0);
    });

    test('should warn when evaluating outside radius', () => {
      const f = (n: bigint) => 1 / (1 + Number(n));
      const series = taylorExpansion(f, 0n, 5);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Evaluate far outside radius
      evaluateSeries(series, 100n);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('outside radius'));

      consoleSpy.mockRestore();
    });
  });

  describe('asymptoticExpansion', () => {
    test('should fit asymptotic behavior', () => {
      // f(n) ~ n² for large n
      const f = (n: bigint) => {
        const x = Number(n);
        return x * x + 10 * x + 100;
      };

      const series = asymptoticExpansion(f, 2);

      expect(series.type).toBe('other');
      expect(series.center).toBe(0n); // Expansion around infinity

      // Leading power should be close to 2
      expect(series.coefficients[0]).toBeCloseTo(2, 1);
    });

    test('should generate sample points if not provided', () => {
      const f = (n: bigint) => Number(n);
      const series = asymptoticExpansion(f, 3);

      expect(series.coefficients.length).toBeGreaterThan(3);
      expect(series.radius).toBeGreaterThan(0);
    });

    test('should handle logarithmic growth', () => {
      // f(n) ~ ln(n)
      const f = (n: bigint) => Math.log(Number(n));

      const series = asymptoticExpansion(f, 2, [100n, 1000n, 10000n]);

      // Leading power should be close to 0 (logarithmic growth)
      expect(Math.abs(series.coefficients[0])).toBeLessThan(0.5);
    });
  });

  describe('fieldPatternFourier', () => {
    test('should analyze field periodicity', () => {
      // Mock field that alternates every 4 numbers
      const getFieldValue = (n: bigint) => {
        return Number(n) % 8 < 4 ? 1 : 0;
      };

      const series = fieldPatternFourier(getFieldValue, 0, 0n, 1);

      expect(series.type).toBe('fourier');
      expect(series.coefficients.length).toBeGreaterThan(0);

      // Should detect the 8-number period
      // k=32 corresponds to frequency 32/256 = 1/8
      const k32_magnitude = series.coefficients[64]; // 32 * 2
      expect(k32_magnitude).toBeGreaterThan(0.1);
    });

    test('should handle multiple cycles', () => {
      const getFieldValue = (n: bigint) => Number(n) % 2;

      const series1 = fieldPatternFourier(getFieldValue, 0, 0n, 1);
      const series2 = fieldPatternFourier(getFieldValue, 0, 0n, 2);

      // More cycles should give same fundamental frequencies
      // but potentially better resolution
      expect(series2.coefficients.length).toBeGreaterThanOrEqual(series1.coefficients.length);
    });
  });
});
