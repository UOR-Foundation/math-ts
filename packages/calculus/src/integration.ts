/**
 * Discrete Integration and Path Integrals
 *
 * Implements integration over integer intervals and path integrals
 * in field space, accumulating computational work.
 */

import type { IntegrationResult } from './index';

/**
 * Discrete integration over integer interval [a, b]
 * [k=a to b] f(k) = +[a to b] f(n) dn
 *
 * This is the fundamental accumulation operation in the discrete universe
 */
export function discreteIntegral(f: (n: bigint) => number, start: bigint, end: bigint): number {
  if (start > end) {
    // Swap limits and negate
    return -discreteIntegral(f, end, start);
  }

  let sum = 0;
  for (let n = start; n <= end; n++) {
    sum += f(n);
  }

  return sum;
}

/**
 * Trapezoidal rule for discrete integration
 * Better approximation when function varies smoothly
 */
export function trapezoidalIntegral(f: (n: bigint) => number, start: bigint, end: bigint): number {
  if (start > end) {
    return -trapezoidalIntegral(f, end, start);
  }

  if (start === end) {
    return 0;
  }

  // First and last terms weighted by 0.5
  let sum = 0.5 * (f(start) + f(end));

  // Middle terms with full weight
  for (let n = start + 1n; n < end; n++) {
    sum += f(n);
  }

  return sum;
}

/**
 * Simpson's rule for discrete integration
 * Uses quadratic interpolation for better accuracy
 */
export function simpsonsIntegral(f: (n: bigint) => number, start: bigint, end: bigint): number {
  if (start > end) {
    return -simpsonsIntegral(f, end, start);
  }

  const length = Number(end - start);
  if (length === 0) return 0;
  if (length === 1) return f(start);
  if (length === 2) return trapezoidalIntegral(f, start, end);

  // Ensure even number of intervals
  const numIntervals = length;
  const useIntervals = numIntervals % 2 === 0 ? numIntervals : numIntervals - 1;
  const adjustedEnd = start + BigInt(useIntervals);

  let sum = f(start) + f(adjustedEnd);

  // Odd points (coefficient 4)
  for (let i = 1; i < useIntervals; i += 2) {
    sum += 4 * f(start + BigInt(i));
  }

  // Even points (coefficient 2)
  for (let i = 2; i < useIntervals; i += 2) {
    sum += 2 * f(start + BigInt(i));
  }

  sum = sum / 3; // Simpson's 1/3 rule

  // Add remaining interval if we had odd number of intervals
  if (adjustedEnd !== end) {
    // Use trapezoidal rule for the last interval
    sum += 0.5 * (f(adjustedEnd) + f(end));
  }

  return sum;
}

/**
 * Path integral in field space
 * Integrates a field function along a path through integer space
 *
 * +_path field_amplitude * e^(i*phase) dpath
 *
 * This implements quantum-like sum over paths where different
 * paths can interfere constructively or destructively
 */
export function pathIntegral(
  path: bigint[],
  fieldFunction: (n: bigint) => number,
  phaseFunction?: (n: bigint) => number,
): { real: number; imaginary: number; magnitude: number } {
  if (path.length === 0) {
    return { real: 0, imaginary: 0, magnitude: 0 };
  }

  let realSum = 0;
  let imagSum = 0;

  for (let i = 0; i < path.length; i++) {
    const n = path[i];
    const amplitude = fieldFunction(n);

    if (phaseFunction) {
      const phase = phaseFunction(n);
      realSum += amplitude * Math.cos(phase);
      imagSum += amplitude * Math.sin(phase);
    } else {
      // No phase function means pure real integration
      realSum += amplitude;
    }
  }

  const magnitude = Math.sqrt(realSum * realSum + imagSum * imagSum);

  return { real: realSum, imaginary: imagSum, magnitude };
}

/**
 * Line integral along a discrete path
 * Integrates vector field dot product with path direction
 *
 * For paths in the geometric embedding, this accounts for the
 * curvature-based 2D structure from the 16-bit folio embedding
 */
export function lineIntegral(
  path: bigint[],
  vectorField: (n: bigint) => { x: number; y: number },
  embedding?: {
    getCoordinates: (n: bigint) => { x: number; y: number };
    getCurvature: (n: bigint) => number;
  },
): number {
  if (path.length < 2) return 0;

  let sum = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    let dx: number, dy: number;

    if (embedding) {
      // Use actual 2D embedding coordinates
      const currentCoords = embedding.getCoordinates(current);
      const nextCoords = embedding.getCoordinates(next);
      dx = nextCoords.x - currentCoords.x;
      dy = nextCoords.y - currentCoords.y;
    } else {
      // Default to 1D path (integer line)
      dx = Number(next - current);
      dy = 0;
    }

    // Field at midpoint (can be improved with better interpolation)
    const midpoint = current + (next - current) / 2n;
    const field = vectorField(midpoint);

    // Dot product of field with path tangent
    sum += field.x * dx + field.y * dy;
  }

  return sum;
}

/**
 * Total resonance in a page (important conservation quantity)
 * PageResonance = [k=48p to 48p+47] Resonance(k)
 */
export function pageResonanceIntegral(
  resonanceFunction: (n: bigint) => number,
  pageNumber: bigint,
): number {
  const pageStart = 48n * pageNumber;
  const pageEnd = pageStart + 47n;

  return discreteIntegral(resonanceFunction, pageStart, pageEnd);
}

/**
 * Conservation law verification via integration
 * Total field activation is conserved mod 256
 * ∫[0 to 255] field_pattern(n) dn = constant
 *
 * According to the field-parity conservation law:
 * For every 48-number page, the XOR of all field activation vectors
 * is constant: ⊕_{n∈𝒫_p} β(n) ≡ (1,1,1,1,0,0,0,0) (mod 2)
 */
export function verifyFieldConservation(
  fieldSubstrate: { getFieldPattern: (n: bigint) => { bits: boolean[] } },
  fieldIndex: number,
  cycleStart: bigint = 0n,
): { conserved: boolean; total: number; expected: number; fieldParity: number } {
  if (fieldIndex < 0 || fieldIndex > 7) {
    throw new Error(`Invalid field index: ${fieldIndex}. Must be between 0 and 7.`);
  }

  const cycleEnd = cycleStart + 255n;
  let total = 0;
  let paritySum = 0;

  // Count activations for the specific field across the cycle
  for (let n = cycleStart; n <= cycleEnd; n++) {
    const pattern = fieldSubstrate.getFieldPattern(n);
    if (pattern.bits[fieldIndex]) {
      total++;
    }
  }

  // Verify page-wise conservation
  // For a complete cycle (256 numbers = 5.33... pages), check each complete page
  const pagesInCycle = 5; // 5 complete pages in 256 numbers
  const pageSize = 48;

  for (let page = 0; page < pagesInCycle; page++) {
    let pageFieldCount = 0;
    const pageStart = cycleStart + BigInt(page * pageSize);
    const pageEnd = pageStart + BigInt(pageSize - 1);

    for (let n = pageStart; n <= pageEnd; n++) {
      const pattern = fieldSubstrate.getFieldPattern(n);
      if (pattern.bits[fieldIndex]) {
        pageFieldCount++;
      }
    }

    // Each page should have odd parity for fields 0-3, even for fields 4-7
    paritySum += pageFieldCount % 2;
  }

  // Expected values based on field index
  // Fields 0-3: Each appears in exactly (24 + 2k) numbers per page (odd count)
  // Fields 4-7: Each appears in exactly (24 + 2k') numbers per page (even count)
  const isLowerField = fieldIndex < 4;
  const expectedPageCount = isLowerField ? 25 : 24; // Approximate average per page
  const expected = expectedPageCount * pagesInCycle;

  // Check if field parity matches expected pattern
  const parityConserved = paritySum === (isLowerField ? pagesInCycle : 0);

  const tolerance = 3; // Allow small variation due to incomplete last page
  const conserved = Math.abs(total - expected) < tolerance && parityConserved;

  return {
    conserved,
    total,
    expected,
    fieldParity: paritySum,
  };
}

/**
 * Weighted integration with importance sampling
 * Useful for focusing on significant regions
 */
export function weightedIntegral(
  f: (n: bigint) => number,
  weight: (n: bigint) => number,
  start: bigint,
  end: bigint,
): number {
  let sum = 0;
  let totalWeight = 0;

  for (let n = start; n <= end; n++) {
    const w = weight(n);
    sum += w * f(n);
    totalWeight += w;
  }

  // Normalize by total weight
  return totalWeight > 0 ? sum / totalWeight : 0;
}

/**
 * Monte Carlo integration for high-dimensional field space
 * Randomly samples points to estimate integral
 */
export function monteCarloIntegral(
  f: (pattern: boolean[]) => number,
  numSamples: number,
  seed: number = 42,
): { estimate: number; error: number } {
  // Simple linear congruential generator for reproducibility
  let rng = seed;
  const nextRandom = (): number => {
    rng = (rng * 1664525 + 1013904223) % 2147483648;
    return rng / 2147483648;
  };

  let sum = 0;
  let sumSquares = 0;

  for (let i = 0; i < numSamples; i++) {
    // Generate random 8-bit pattern
    const pattern: boolean[] = [];
    for (let j = 0; j < 8; j++) {
      pattern.push(nextRandom() < 0.5);
    }

    const value = f(pattern);
    sum += value;
    sumSquares += value * value;
  }

  const mean = sum / numSamples;
  const variance = sumSquares / numSamples - mean * mean;
  const error = Math.sqrt(variance / numSamples);

  // Scale by volume of integration domain (2^8 for 8-bit patterns)
  const volume = 256;

  return {
    estimate: mean * volume,
    error: error * volume,
  };
}

/**
 * Action integral for variational principles
 * S = + (Kinetic - Potential) dt
 */
export function actionIntegral(
  kineticEnergy: (n: bigint) => number,
  potentialEnergy: (n: bigint) => number,
  path: bigint[],
): number {
  let action = 0;

  for (const n of path) {
    const lagrangian = kineticEnergy(n) - potentialEnergy(n);
    action += lagrangian;
  }

  return action;
}

/**
 * Create an integration result object with metadata
 */
export function createIntegrationResult(
  value: number,
  start: bigint,
  end: bigint,
  method: string,
): IntegrationResult {
  return {
    value,
    intervalStart: start,
    intervalEnd: end,
    method,
  };
}
