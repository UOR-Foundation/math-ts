/**
 * Discrete Calculus on the Integer Lattice
 *
 * Implements derivatives, differences, and limits for discrete functions
 * defined on integers, respecting the fundamental discrete nature of
 * the Mathematical Universe.
 */

import type { LimitResult, DerivativeResult } from './index';

/**
 * Compute the forward difference (discrete derivative) at position n
 * �f(n) = f(n + 1) - f(n)
 */
export function forwardDifference(f: (n: bigint) => number, n: bigint): number {
  return f(n + 1n) - f(n);
}

/**
 * Compute the backward difference at position n
 * f(n) = f(n) - f(n - 1)
 */
export function backwardDifference(f: (n: bigint) => number, n: bigint): number {
  return f(n) - f(n - 1n);
}

/**
 * Compute the central difference (symmetric derivative) at position n
 * �f(n) = (f(n + 1) - f(n - 1)) / 2
 */
export function centralDifference(f: (n: bigint) => number, n: bigint): number {
  return (f(n + 1n) - f(n - 1n)) / 2;
}

/**
 * Compute the second difference (discrete second derivative)
 * ��f(n) = �f(n+1) - �f(n) = f(n+2) - 2f(n+1) + f(n)
 *
 * This measures the "curvature" of change and is used to detect
 * Lagrange points where ��Resonance H 0
 */
export function secondDifference(f: (n: bigint) => number, n: bigint): number {
  return f(n + 2n) - 2 * f(n + 1n) + f(n);
}

/**
 * Compute higher-order differences recursively
 * �Of(n) = �O{�f(n+1) - �O{�f(n)
 */
export function higherOrderDifference(f: (n: bigint) => number, n: bigint, order: number): number {
  if (order === 0) {
    return f(n);
  }

  if (order === 1) {
    return forwardDifference(f, n);
  }

  if (order === 2) {
    return secondDifference(f, n);
  }

  // Recursive computation for higher orders
  const prevOrder = (m: bigint): number => higherOrderDifference(f, m, order - 1);
  return forwardDifference(prevOrder, n);
}

/**
 * Discrete Laplacian operator
 * �f(n) = f(n+1) - 2f(n) + f(n-1)
 *
 * Used for detecting wells and ridges in the resonance landscape
 */
export function discreteLaplacian(f: (n: bigint) => number, n: bigint): number {
  return f(n + 1n) - 2 * f(n) + f(n - 1n);
}

/**
 * Analyze convergence of a sequence
 * Returns the limit if it exists, along with convergence information
 */
export function analyzeSequenceLimit(sequence: number[]): LimitResult {
  if (sequence.length < 10) {
    return {
      exists: false,
      error: 'Sequence too short to analyze convergence',
    };
  }

  const tolerance = 1e-10;
  const relaxedTolerance = 1e-3; // Practical convergence tolerance

  // Look at the last portion of the sequence
  const tailLength = Math.min(20, Math.floor(sequence.length / 2));
  const tail = sequence.slice(-tailLength);

  // Check for convergence by examining differences
  const differences: number[] = [];
  for (let i = 0; i < tail.length - 1; i++) {
    differences.push(Math.abs(tail[i + 1] - tail[i]));
  }

  // Check if differences are decreasing
  let decreasing = 0;
  for (let i = 1; i < differences.length; i++) {
    if (differences[i] < differences[i - 1]) {
      decreasing++;
    }
  }

  const isDecreasing = decreasing > differences.length * 0.6; // 60% decreasing

  // Check the last few values for stability
  const lastFew = tail.slice(-5);
  const mean = lastFew.reduce((a, b) => a + b) / lastFew.length;
  const maxDev = Math.max(...lastFew.map((v) => Math.abs(v - mean)));

  // Also check if the last difference is small
  const lastDiff = differences[differences.length - 1];

  if (isDecreasing && (maxDev < relaxedTolerance || lastDiff < relaxedTolerance)) {
    // Try to extrapolate to the limit using Richardson extrapolation
    // For sequences like 1 + 1/n, we can estimate the limit better
    let limitEstimate = mean;

    if (tail.length >= 3) {
      // Use the last three values to extrapolate
      const a1 = tail[tail.length - 3];
      const a2 = tail[tail.length - 2];
      const a3 = tail[tail.length - 1];

      // Richardson extrapolation for sequences with 1/n convergence
      const diff1 = a2 - a1;
      const diff2 = a3 - a2;

      if (Math.abs(diff2) < Math.abs(diff1) && diff1 * diff2 > 0) {
        // Consistent direction and decreasing
        const ratio = diff2 / diff1;
        if (ratio > 0 && ratio < 1) {
          // Geometric decrease suggests limit is a3 + diff2/(1-ratio)
          const extrapolated = a3 + (diff2 * ratio) / (1 - ratio);
          if (Math.abs(extrapolated - a3) < Math.abs(a3 - a1)) {
            limitEstimate = extrapolated;
          }
        }
      }
    }

    // Estimate convergence rate
    let rate = 0;
    if (differences.length > 5) {
      const recentRatios: number[] = [];
      for (let i = differences.length - 5; i < differences.length - 1; i++) {
        if (differences[i] > tolerance) {
          recentRatios.push(differences[i + 1] / differences[i]);
        }
      }
      if (recentRatios.length > 0) {
        rate = recentRatios.reduce((a, b) => a + b) / recentRatios.length;
      }
    }

    return {
      exists: true,
      value: limitEstimate,
      convergenceRate: rate,
    };
  }

  // Try Cauchy criterion as last resort
  if (differences.length >= 10) {
    // Check if last differences are small
    const lastFewDiffs = differences.slice(-10);
    const allSmall = lastFewDiffs.every((d) => d < relaxedTolerance);

    if (allSmall) {
      const lastValues = sequence.slice(-10);
      const finalValue = lastValues.reduce((a, b) => a + b) / lastValues.length;

      // Estimate convergence rate from differences
      let rate = 0;
      if (differences.length > 5) {
        const ratios: number[] = [];
        for (let i = differences.length - 5; i < differences.length - 1; i++) {
          if (differences[i] > tolerance) {
            ratios.push(differences[i + 1] / differences[i]);
          }
        }
        if (ratios.length > 0) {
          rate = ratios.reduce((a, b) => a + b) / ratios.length;
        }
      }

      return {
        exists: true,
        value: finalValue,
        convergenceRate: rate,
      };
    }
  }

  // Check for oscillating behavior
  const signs: number[] = [];
  for (let i = 1; i < sequence.length; i++) {
    signs.push(Math.sign(sequence[i] - sequence[i - 1]));
  }

  let oscillating = true;
  for (let i = 1; i < Math.min(20, signs.length); i++) {
    if (signs[signs.length - i] === signs[signs.length - i - 1]) {
      oscillating = false;
      break;
    }
  }

  if (oscillating) {
    return {
      exists: false,
      error: 'Sequence appears to be oscillating',
    };
  }

  // No clear convergence pattern
  return {
    exists: false,
    error: 'Sequence does not appear to converge',
  };
}

/**
 * Compute finite differences table for polynomial interpolation
 * Used for Newton's forward difference formula
 */
export function differencesTable(values: number[], maxOrder?: number): number[][] {
  const n = values.length;
  const order = maxOrder ?? n - 1;
  const table: number[][] = [values.slice()];

  for (let i = 1; i <= order && i < n; i++) {
    const row: number[] = [];
    const prevRow = table[i - 1];

    for (let j = 0; j < prevRow.length - 1; j++) {
      row.push(prevRow[j + 1] - prevRow[j]);
    }

    if (row.length === 0) break;
    table.push(row);
  }

  return table;
}

/**
 * Newton's forward difference interpolation formula
 * Useful for approximating functions from discrete values
 */
export function newtonForwardInterpolation(x0: bigint, values: number[], x: bigint): number {
  const table = differencesTable(values);
  // Step size in integer lattice is always 1 for discrete functions
  const s = Number(x - x0);

  let result = table[0][0];
  let binomialCoeff = 1;

  for (let i = 1; i < table.length && table[i].length > 0; i++) {
    binomialCoeff *= (s - i + 1) / i;
    result += binomialCoeff * table[i][0];
  }

  return result;
}

/**
 * Estimate rate of change using finite differences
 * Provides discrete analog of derivative at various orders
 */
export function estimateRateOfChange(
  f: (n: bigint) => number,
  n: bigint,
  method: 'forward' | 'backward' | 'central' = 'central',
): DerivativeResult {
  let value: number;

  switch (method) {
    case 'forward':
      value = forwardDifference(f, n);
      break;
    case 'backward':
      value = backwardDifference(f, n);
      break;
    case 'central':
      value = centralDifference(f, n);
      break;
  }

  return {
    value,
    order: 1,
    position: n,
  };
}

/**
 * Detect local extrema using discrete derivatives
 * A point n is a local extremum if �f changes sign
 */
export function isLocalExtremum(
  f: (n: bigint) => number,
  n: bigint,
): { isExtremum: boolean; type?: 'minimum' | 'maximum' } {
  const prev = forwardDifference(f, n - 1n);
  const curr = forwardDifference(f, n);
  const next = forwardDifference(f, n + 1n);
  const laplacian = discreteLaplacian(f, n);

  // Check for sign change in derivative or derivative close to zero
  const signChange = Math.sign(prev) !== Math.sign(next);
  const nearZero = Math.abs(curr) < 1e-10;

  if (signChange || nearZero) {
    // Use Laplacian to determine type
    if (laplacian > 1e-10) {
      return { isExtremum: true, type: 'minimum' };
    } else if (laplacian < -1e-10) {
      return { isExtremum: true, type: 'maximum' };
    }
  }

  return { isExtremum: false };
}

/**
 * Compute discrete gradient for multidimensional functions
 * In the context of field space (8 dimensions)
 */
export function discreteGradient(f: (pattern: boolean[]) => number, pattern: boolean[]): number[] {
  const gradient: number[] = [];

  for (let i = 0; i < pattern.length; i++) {
    // Flip bit i to compute partial derivative
    const patternPlus = [...pattern];
    patternPlus[i] = !patternPlus[i];

    const diff = f(patternPlus) - f(pattern);
    gradient.push(diff);
  }

  return gradient;
}
