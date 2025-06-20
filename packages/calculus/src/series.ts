/**
 * Series Expansions and Approximations
 *
 * Implements Taylor series, Fourier analysis, and other
 * series expansions for local approximations in the Mathematical Universe.
 */

import type { SeriesExpansion } from './index';
import { higherOrderDifference } from './discrete';

/**
 * Taylor series expansion around a center point
 * f(n) = f(L) + f'(L)(n-L) + f''(L)(n-L)²/2! + ...
 *
 * Particularly useful around Lagrange points where series converge
 */
export function taylorExpansion(
  f: (n: bigint) => number,
  center: bigint,
  order: number,
): SeriesExpansion {
  const coefficients: number[] = [];

  // Compute derivatives at center
  for (let k = 0; k <= order; k++) {
    const derivative = higherOrderDifference(f, center, k);
    const factorial = factorialNumber(k);
    coefficients.push(derivative / factorial);
  }

  // Estimate radius of convergence
  const radius = estimateConvergenceRadius(coefficients);

  return {
    center,
    coefficients,
    radius,
    type: 'taylor',
  };
}

/**
 * Fourier analysis for periodic patterns
 * Decomposes patterns into frequencies
 *
 * field_pattern(n) = ∑ a_k * e^(2πikn/256)
 *
 * The 256-periodicity comes from the field cycle
 */
export function fourierAnalysis(pattern: number[], period: number = 256): SeriesExpansion {
  const N = pattern.length;
  const coefficients: number[] = [];

  // Compute Fourier coefficients using DFT
  for (let k = 0; k < Math.min(N, period); k++) {
    let realSum = 0;
    let imagSum = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / period;
      realSum += pattern[n] * Math.cos(angle);
      imagSum += pattern[n] * Math.sin(angle);
    }

    // Store magnitude and phase as consecutive pairs
    const magnitude = Math.sqrt(realSum * realSum + imagSum * imagSum) / N;
    const phase = Math.atan2(imagSum, realSum);

    coefficients.push(magnitude);
    coefficients.push(phase);
  }

  return {
    center: 0n,
    coefficients,
    radius: period / 2, // Nyquist frequency
    type: 'fourier',
  };
}

/**
 * Discrete Fourier Transform for field patterns
 * Specialized for 8-bit field patterns with 256-periodicity
 */
export function fieldPatternFourier(
  getFieldValue: (n: bigint) => number,
  fieldIndex: number,
  cycleStart: bigint = 0n,
  numCycles: number = 1,
): SeriesExpansion {
  const period = 256;
  const totalLength = period * numCycles;
  const pattern: number[] = [];

  // Sample the field pattern
  for (let i = 0; i < totalLength; i++) {
    const n = cycleStart + BigInt(i);
    pattern.push(getFieldValue(n));
  }

  return fourierAnalysis(pattern, period);
}

/**
 * Chebyshev series expansion
 * Often converges faster than Taylor series for smooth functions
 */
export function chebyshevExpansion(
  f: (n: bigint) => number,
  start: bigint,
  end: bigint,
  order: number,
): SeriesExpansion {
  const N = order + 1;
  const coefficients: number[] = [];

  // Map interval [start, end] to [-1, 1]
  const a = Number(start);
  const b = Number(end);
  // const mapToStandard = (n: number): number => (2 * n - a - b) / (b - a); // Unused
  const mapFromStandard = (x: number): number => (x * (b - a) + a + b) / 2;

  // Chebyshev nodes
  const nodes: number[] = [];
  for (let k = 0; k < N; k++) {
    const x = Math.cos((Math.PI * (k + 0.5)) / N);
    nodes.push(mapFromStandard(x));
  }

  // Function values at nodes
  const values = nodes.map((n) => f(BigInt(Math.round(n))));

  // Compute Chebyshev coefficients
  for (let j = 0; j < N; j++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      sum += values[k] * Math.cos((Math.PI * j * (k + 0.5)) / N);
    }
    coefficients.push((2 / N) * sum * (j === 0 ? 0.5 : 1));
  }

  return {
    center: (start + end) / 2n,
    coefficients,
    radius: Number(end - start) / 2,
    type: 'other',
  };
}

/**
 * Padé approximation - rational function approximation
 * Often better than Taylor series for functions with poles
 */
export function padeApproximation(
  taylorCoeffs: number[],
  numeratorDegree: number,
  denominatorDegree: number,
): { numerator: number[]; denominator: number[] } {
  const n = numeratorDegree;
  const m = denominatorDegree;

  if (taylorCoeffs.length < n + m + 1) {
    throw new Error('Not enough Taylor coefficients for requested Padé approximation');
  }

  // Build the linear system for denominator coefficients
  // We need to solve: c_{n+1} + b_1*c_n + ... + b_m*c_{n+1-m} = 0
  // for k = n+1, ..., n+m

  if (m === 0) {
    // Simple polynomial approximation
    return {
      numerator: taylorCoeffs.slice(0, n + 1),
      denominator: [1],
    };
  }

  // Build matrix A and vector b for the system Ab = -c
  const A: number[][] = [];
  const c: number[] = [];

  for (let i = 0; i < m; i++) {
    const row: number[] = [];
    for (let j = 0; j < m; j++) {
      const index = n + i - j;
      row.push(index >= 0 ? taylorCoeffs[index] : 0);
    }
    A.push(row);
    c.push(taylorCoeffs[n + i + 1]);
  }

  // Solve the linear system using Gaussian elimination
  const b = gaussianElimination(
    A,
    c.map((x) => -x),
  );

  // Construct denominator: b_0 = 1, b_1, ..., b_m
  const denominator = [1, ...b];

  // Compute numerator coefficients a_0, ..., a_n
  const numerator: number[] = [];
  for (let i = 0; i <= n; i++) {
    let sum = taylorCoeffs[i];
    for (let j = 1; j <= Math.min(i, m); j++) {
      sum -= b[j - 1] * (i - j >= 0 ? taylorCoeffs[i - j] : 0);
    }
    numerator.push(sum);
  }

  return { numerator, denominator };
}

/**
 * Gaussian elimination for solving linear systems
 */
function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    // Swap rows
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Check for singular matrix
    if (Math.abs(augmented[i][i]) < 1e-10) {
      // Try partial pivoting
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }

      if (Math.abs(augmented[maxRow][i]) < 1e-10) {
        // Matrix is singular, return zero solution
        console.warn('Singular matrix in Gaussian elimination');
        return new Array(n).fill(0) as number[];
      }

      // Swap rows
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    }

    // Eliminate column
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Back substitution
  const x: number[] = new Array(n).fill(0) as number[];
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }

  return x;
}

/**
 * Evaluate a series expansion at a given point
 */
export function evaluateSeries(expansion: SeriesExpansion, n: bigint): number {
  const x = Number(n - expansion.center);

  if (Math.abs(x) > expansion.radius) {
    console.warn('Evaluating series outside radius of convergence');
  }

  switch (expansion.type) {
    case 'taylor':
      return evaluateTaylorSeries(expansion.coefficients, x);

    case 'fourier':
      return evaluateFourierSeries(expansion.coefficients, x, expansion.radius * 2);

    default:
      return evaluateChebyshevSeries(expansion.coefficients, x, expansion.radius);
  }
}

/**
 * Evaluate Taylor series
 */
function evaluateTaylorSeries(coefficients: number[], x: number): number {
  let sum = 0;
  let xPower = 1;

  for (const coeff of coefficients) {
    sum += coeff * xPower;
    xPower *= x;
  }

  return sum;
}

/**
 * Evaluate Fourier series
 */
function evaluateFourierSeries(coefficients: number[], x: number, period: number): number {
  let sum = 0;

  for (let k = 0; k < coefficients.length / 2; k++) {
    const magnitude = coefficients[2 * k];
    const phase = coefficients[2 * k + 1];
    const angle = (2 * Math.PI * k * x) / period + phase;
    sum += magnitude * Math.cos(angle);
  }

  return sum;
}

/**
 * Evaluate Chebyshev series
 */
function evaluateChebyshevSeries(coefficients: number[], x: number, halfWidth: number): number {
  // Map x to [-1, 1]
  const t = x / halfWidth;

  if (Math.abs(t) > 1) {
    console.warn('Evaluating Chebyshev series outside domain');
  }

  // Clenshaw algorithm for efficient evaluation
  let b1 = 0;
  let b2 = 0;

  for (let k = coefficients.length - 1; k >= 0; k--) {
    const b0 = coefficients[k] + 2 * t * b1 - b2;
    b2 = b1;
    b1 = b0;
  }

  return b1 - t * b2;
}

/**
 * Estimate radius of convergence for Taylor series
 */
function estimateConvergenceRadius(coefficients: number[]): number {
  const ratios: number[] = [];

  for (let k = 1; k < coefficients.length; k++) {
    if (coefficients[k] !== 0 && coefficients[k - 1] !== 0) {
      ratios.push(Math.abs(coefficients[k - 1] / coefficients[k]));
    }
  }

  if (ratios.length === 0) {
    return Infinity;
  }

  // Use root test estimate
  const avgRatio = ratios.reduce((a, b) => a + b) / ratios.length;
  return avgRatio;
}

/**
 * Compute factorial (cached for efficiency)
 */
const factorialCache: number[] = [1];
function factorialNumber(n: number): number {
  if (n < 0) return NaN;

  while (factorialCache.length <= n) {
    const last = factorialCache.length - 1;
    factorialCache.push(factorialCache[last] * (last + 1));
  }

  return factorialCache[n];
}

/**
 * Asymptotic expansion for large arguments
 * Useful when regular series don't converge
 */
export function asymptoticExpansion(
  f: (n: bigint) => number,
  order: number,
  samplePoints?: bigint[],
): SeriesExpansion {
  // Generate sample points if not provided
  if (!samplePoints || samplePoints.length < order + 2) {
    samplePoints = [];
    const basePoint = 10000n;
    for (let i = 0; i <= order + 1; i++) {
      samplePoints.push(basePoint * BigInt(i + 1));
    }
  }

  // Fit asymptotic form: f(n) ~ n^α * (c₀ + c₁/n + c₂/n² + ...)

  // Estimate leading power α
  const values = samplePoints.map((n) => ({ n: Number(n), f: f(n) }));
  const alpha = estimateLeadingPower(values);

  // Remove the leading power to get g(n) = f(n) / n^α
  const gValues = values.map((v) => ({
    n: v.n,
    g: v.f / Math.pow(v.n, alpha),
  }));

  // Now fit g(n) ~ c₀ + c₁/n + c₂/n² + ...
  // This is a linear system in the coefficients
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i <= order; i++) {
    const row: number[] = [];
    for (let j = 0; j <= order; j++) {
      row.push(Math.pow(gValues[i].n, -j));
    }
    A.push(row);
    b.push(gValues[i].g);
  }

  // Solve for coefficients using least squares if overdetermined
  let coeffs: number[];
  if (gValues.length > order + 1) {
    coeffs = leastSquares(A, b);
  } else {
    coeffs = gaussianElimination(A, b);
  }

  // Combine results: first coefficient is the power, rest are series coefficients
  const coefficients = [alpha, ...coeffs];

  return {
    center: 0n, // Expansion around infinity
    coefficients,
    radius: Number(samplePoints[0]), // Valid for n > this
    type: 'other',
  };
}

/**
 * Least squares solution for overdetermined systems
 */
function leastSquares(A: number[][], b: number[]): number[] {
  const m = A.length;
  const n = A[0].length;

  // Compute A^T * A
  const ATA: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += A[k][i] * A[k][j];
      }
      row.push(sum);
    }
    ATA.push(row);
  }

  // Compute A^T * b
  const ATb: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let k = 0; k < m; k++) {
      sum += A[k][i] * b[k];
    }
    ATb.push(sum);
  }

  // Solve normal equations: (A^T * A) * x = A^T * b
  return gaussianElimination(ATA, ATb);
}

/**
 * Estimate leading power in asymptotic behavior
 */
function estimateLeadingPower(values: { n: number; f: number }[]): number {
  if (values.length < 2) return 0;

  // Use log-log regression
  const logValues = values
    .filter((v) => v.n > 0 && v.f > 0)
    .map((v) => ({ x: Math.log(v.n), y: Math.log(v.f) }));

  if (logValues.length < 2) return 0;

  // Simple linear regression on log-log data
  const n = logValues.length;
  const sumX = logValues.reduce((sum, v) => sum + v.x, 0);
  const sumY = logValues.reduce((sum, v) => sum + v.y, 0);
  const sumXY = logValues.reduce((sum, v) => sum + v.x * v.y, 0);
  const sumX2 = logValues.reduce((sum, v) => sum + v.x * v.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return slope;
}
