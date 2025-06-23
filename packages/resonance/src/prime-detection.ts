import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';

/**
 * Result of resonance minimum analysis
 */
export interface ResonanceMinimumAnalysis {
  isLocalMinimum: boolean;
  discreteLaplacian: number;
  resonance: number;
  neighborResonances: Array<{ position: bigint; resonance: number }>;
}

/**
 * Check if a number is a local minimum in the resonance landscape.
 * According to field equation theory, primes are characterized as local minima.
 * 
 * @param substrate - The field substrate interface
 * @param n - The number to analyze
 * @returns Analysis result including whether it's a local minimum
 */
export function isResonanceMinimum(
  substrate: FieldSubstrate,
  n: bigint
): ResonanceMinimumAnalysis {
  // Handle edge cases
  if (n <= 1n) {
    return {
      isLocalMinimum: false,
      discreteLaplacian: 0,
      resonance: calculateResonance(substrate, n),
      neighborResonances: []
    };
  }

  // Calculate resonances for n and its neighbors
  const resonance = calculateResonance(substrate, n);
  const resonancePrev = n > 1n ? calculateResonance(substrate, n - 1n) : Infinity;
  const resonanceNext = calculateResonance(substrate, n + 1n);

  // Calculate discrete Laplacian: ∇²R(n) = R(n+1) - 2R(n) + R(n-1)
  const discreteLaplacian = resonanceNext - 2 * resonance + resonancePrev;

  // A local minimum has lower resonance than both neighbors
  const isLocalMinimum = resonance < resonancePrev && resonance < resonanceNext;

  // Collect neighbor data
  const neighborResonances: Array<{ position: bigint; resonance: number }> = [];
  if (n > 1n) {
    neighborResonances.push({ position: n - 1n, resonance: resonancePrev });
  }
  neighborResonances.push({ position: n, resonance });
  neighborResonances.push({ position: n + 1n, resonance: resonanceNext });

  return {
    isLocalMinimum,
    discreteLaplacian,
    resonance,
    neighborResonances
  };
}

/**
 * Find resonance harmonics that could be factors of n.
 * If n = a × b, then R(n) relates to R(a) × R(b) with interference.
 * 
 * @param substrate - The field substrate interface
 * @param n - The number to find harmonics for
 * @param targetResonance - The target resonance to match
 * @returns Array of potential factor candidates
 */
export function findResonanceHarmonics(
  substrate: FieldSubstrate,
  n: bigint,
  targetResonance: number
): bigint[] {
  const candidates: bigint[] = [];
  
  // Search for numbers whose resonance could multiply to give target
  // Start with small factors up to sqrt(n)
  const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
  
  for (let candidate = 2n; candidate <= sqrtN && candidate < n; candidate++) {
    if (n % candidate === 0n) {
      // Check if this is a valid factor via resonance
      const candidateResonance = calculateResonance(substrate, candidate);
      const complementResonance = calculateResonance(substrate, n / candidate);
      
      // The product of resonances should approximate the target with interference
      const resonanceProduct = candidateResonance * complementResonance;
      const interference = Math.abs(resonanceProduct - targetResonance) / targetResonance;
      
      // If interference is reasonable (allowing for field effects), it's a candidate
      if (interference < 2.0) { // Allow up to 200% interference
        candidates.push(candidate);
      }
    }
  }
  
  return candidates;
}

/**
 * Detect if a number is prime using resonance-based detection.
 * This is the O(log n) field-based detection method from field equation theory.
 * 
 * @param substrate - The field substrate interface
 * @param n - The number to check
 * @returns True if the number is prime
 */
export function isPrimeViaResonance(substrate: FieldSubstrate, n: bigint): boolean {
  // Use the true field dynamics approach that scales to large numbers
  return isPrimeViaFieldDynamicsTrue(substrate, n);
}

// Import the improved implementation
import { isPrimeViaFieldDynamics } from './field-prime-detection';
import { isPrimeViaFieldDynamicsTrue } from './true-field-prime-detection';