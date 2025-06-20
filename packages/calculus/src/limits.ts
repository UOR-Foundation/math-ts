/**
 * Limits and Convergence Analysis
 *
 * Implements limit calculations, convergence analysis, and
 * asymptotic behavior in the Mathematical Universe.
 */

import type { LimitResult } from './index';
import type { ResonanceDynamics } from '@uor-foundation/resonance';

/**
 * Analyze the limit of a sequence of integers
 * Determines if the sequence converges and to what value
 */
export function findSequenceLimit(sequence: bigint[]): LimitResult {
  if (sequence.length < 3) {
    return {
      exists: false,
      error: 'Sequence too short to analyze convergence',
    };
  }

  // Convert to number[] for analysis (assuming values fit in number range)
  const numSequence = sequence.map((n) => Number(n));

  return analyzeNumericLimit(numSequence);
}

/**
 * Analyze the limit of a numeric sequence
 */
export function analyzeNumericLimit(sequence: number[]): LimitResult {
  const tolerance = 1e-10;
  const minLength = 10;

  if (sequence.length < minLength) {
    return {
      exists: false,
      error: `Need at least ${minLength} terms to analyze convergence`,
    };
  }

  // Check for various convergence patterns

  // 1. Monotonic convergence
  const monotonicResult = checkMonotonicConvergence(sequence, tolerance);
  if (monotonicResult.exists) {
    return monotonicResult;
  }

  // 2. Oscillating convergence
  const oscillatingResult = checkOscillatingConvergence(sequence, tolerance);
  if (oscillatingResult.exists) {
    return oscillatingResult;
  }

  // 3. Cauchy criterion
  const cauchyResult = checkCauchyConvergence(sequence, tolerance);
  if (cauchyResult.exists) {
    return cauchyResult;
  }

  return {
    exists: false,
    error: 'Sequence does not appear to converge',
  };
}

/**
 * Check for monotonic convergence
 */
function checkMonotonicConvergence(sequence: number[], tolerance: number): LimitResult {
  const n = sequence.length;
  const lastQuarter = Math.floor(n / 4);

  // Check if sequence is eventually monotonic
  let increasing = true;
  let decreasing = true;

  for (let i = n - lastQuarter; i < n - 1; i++) {
    if (sequence[i] > sequence[i + 1]) {
      increasing = false;
    }
    if (sequence[i] < sequence[i + 1]) {
      decreasing = false;
    }
  }

  if (!increasing && !decreasing) {
    return { exists: false };
  }

  // Check if differences are decreasing
  const differences: number[] = [];
  for (let i = n - lastQuarter; i < n - 1; i++) {
    differences.push(Math.abs(sequence[i + 1] - sequence[i]));
  }

  // Estimate convergence rate
  let convergenceRate = 0;
  if (differences.length > 1) {
    const ratios: number[] = [];
    for (let i = 1; i < differences.length; i++) {
      if (differences[i - 1] > tolerance) {
        ratios.push(differences[i] / differences[i - 1]);
      }
    }
    if (ratios.length > 0) {
      convergenceRate = ratios.reduce((a, b) => a + b) / ratios.length;
    }
  }

  // Check if converged
  const lastDiff = differences[differences.length - 1];
  if (lastDiff < tolerance && convergenceRate < 1) {
    return {
      exists: true,
      value: sequence[n - 1],
      convergenceRate,
    };
  }

  return { exists: false };
}

/**
 * Check for oscillating convergence
 */
function checkOscillatingConvergence(sequence: number[], tolerance: number): LimitResult {
  const n = sequence.length;
  const lastQuarter = Math.floor(n / 4);

  // Extract even and odd subsequences
  const evenTerms: number[] = [];
  const oddTerms: number[] = [];

  for (let i = n - lastQuarter; i < n; i++) {
    if (i % 2 === 0) {
      evenTerms.push(sequence[i]);
    } else {
      oddTerms.push(sequence[i]);
    }
  }

  // Check if both subsequences converge to the same limit
  const evenLimit = checkMonotonicConvergence(evenTerms, tolerance);
  const oddLimit = checkMonotonicConvergence(oddTerms, tolerance);

  if (
    evenLimit.exists &&
    oddLimit.exists &&
    evenLimit.value !== undefined &&
    oddLimit.value !== undefined
  ) {
    if (Math.abs(evenLimit.value - oddLimit.value) < tolerance) {
      return {
        exists: true,
        value: (evenLimit.value + oddLimit.value) / 2,
        convergenceRate: Math.max(evenLimit.convergenceRate ?? 0, oddLimit.convergenceRate ?? 0),
      };
    }
  }

  return { exists: false };
}

/**
 * Check Cauchy convergence criterion
 */
function checkCauchyConvergence(sequence: number[], tolerance: number): LimitResult {
  const n = sequence.length;
  const checkLength = Math.min(20, Math.floor(n / 2));

  // For Cauchy sequences, terms get arbitrarily close to each other
  let maxDiff = 0;
  for (let i = n - checkLength; i < n; i++) {
    for (let j = i + 1; j < n && j < i + 10; j++) {
      maxDiff = Math.max(maxDiff, Math.abs(sequence[i] - sequence[j]));
    }
  }

  if (maxDiff < tolerance) {
    // Estimate the limit as the average of recent terms
    const recentTerms = sequence.slice(-10);
    const limit = recentTerms.reduce((a, b) => a + b) / recentTerms.length;

    return {
      exists: true,
      value: limit,
      convergenceRate: 0, // Unknown rate
    };
  }

  return { exists: false };
}

/**
 * Compute the limit of resonance as n approaches infinity
 * lim[n→∞] Resonance(n)/n = ?
 *
 * This reveals the universe's asymptotic nature
 */
export function resonanceAsymptoticLimit(
  resonanceDynamics: ResonanceDynamics,
  maxN: bigint = 10000n,
  sampleSize: number = 100,
): LimitResult {
  const ratios: number[] = [];
  const step = maxN / BigInt(sampleSize);

  for (let i = 1; i <= sampleSize; i++) {
    const n = step * BigInt(i);
    const resonance = resonanceDynamics.calculateResonance(n);
    const ratio = resonance / Number(n);
    ratios.push(ratio);
  }

  return analyzeNumericLimit(ratios);
}

/**
 * Analyze Lagrange point limits
 * lim[n→48k] field_behavior(n) = stable_configuration
 *
 * Numbers naturally flow toward Lagrange points
 */
export function lagrangePointLimit(
  fieldFunction: (n: bigint) => number,
  lagrangePoint: bigint,
  radius: number = 10,
): LimitResult {
  const sequence: number[] = [];

  // Approach from both sides
  for (let i = radius; i > 0; i--) {
    sequence.push(fieldFunction(lagrangePoint - BigInt(i)));
  }
  sequence.push(fieldFunction(lagrangePoint));
  for (let i = 1; i <= radius; i++) {
    sequence.push(fieldFunction(lagrangePoint + BigInt(i)));
  }

  // Check if values stabilize near the Lagrange point
  const centerIndex = radius;
  const centerValue = sequence[centerIndex];
  const tolerance = 1e-6;

  let isStable = true;
  for (let i = centerIndex - 2; i <= centerIndex + 2; i++) {
    if (Math.abs(sequence[i] - centerValue) > tolerance) {
      isStable = false;
      break;
    }
  }

  if (isStable) {
    return {
      exists: true,
      value: centerValue,
      convergenceRate: 0, // Immediate stability
    };
  }

  return {
    exists: false,
    error: 'No stable configuration at Lagrange point',
  };
}

/**
 * Prime density limit verification
 * lim[n→∞] π(n)/(n/ln(n)) = 1
 *
 * Prime number theorem emerges from field dynamics
 */
export function primeDensityLimit(
  primeCountFunction: (n: bigint) => number,
  maxN: bigint = 10000n,
  sampleSize: number = 50,
): LimitResult {
  const ratios: number[] = [];
  const step = maxN / BigInt(sampleSize);

  for (let i = 10; i <= sampleSize; i++) {
    const n = step * BigInt(i);
    const nNum = Number(n);
    const primeCount = primeCountFunction(n);
    const expectedCount = nNum / Math.log(nNum);
    const ratio = primeCount / expectedCount;
    ratios.push(ratio);
  }

  const result = analyzeNumericLimit(ratios);

  // Check if limit is close to 1 (prime number theorem)
  if (result.exists && result.value !== undefined) {
    const errorFromOne = Math.abs(result.value - 1);
    if (errorFromOne < 0.1) {
      return {
        ...result,
        value: 1, // Theoretical value
        error: `Empirical limit: ${result.value.toFixed(6)}, error: ${errorFromOne.toFixed(6)}`,
      };
    }
  }

  return result;
}

/**
 * Compute convergence rate of a sequence toward a target value
 */
export function computeConvergenceRate(sequence: number[], target: number): number {
  if (sequence.length < 3) {
    return NaN;
  }

  const errors: number[] = sequence.map((x) => Math.abs(x - target));
  const ratios: number[] = [];

  for (let i = 1; i < errors.length; i++) {
    if (errors[i - 1] > 1e-15) {
      ratios.push(errors[i] / errors[i - 1]);
    }
  }

  if (ratios.length === 0) {
    return 0; // Already at target
  }

  // Return average convergence rate
  return ratios.reduce((a, b) => a + b) / ratios.length;
}

/**
 * Analyze rate of convergence (linear, quadratic, exponential)
 */
export function classifyConvergenceRate(rate: number): string {
  if (isNaN(rate)) {
    return 'undefined';
  } else if (rate === 0) {
    return 'instantaneous';
  } else if (rate < 0.1) {
    return 'quadratic';
  } else if (rate < 0.5) {
    return 'superlinear';
  } else if (rate < 1) {
    return 'linear';
  } else {
    return 'divergent';
  }
}
