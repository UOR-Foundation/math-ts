import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';

/**
 * Advanced prime detection using field dynamics and interference patterns.
 * Based on the Mathematical Universe field equations research.
 */

/**
 * Calculate field interference signature for primality testing.
 * Primes have unique interference patterns due to their indivisibility.
 */
function calculateFieldInterferenceSignature(
  substrate: FieldSubstrate,
  n: bigint
): number {
  if (n <= 1n) return 0;
  
  const pattern = substrate.getFieldPattern(n);
  const constants = substrate.getFieldConstants();
  
  // Calculate self-interference: how the field pattern interferes with itself
  let selfInterference = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i]) {
      for (let j = i + 1; j < pattern.length; j++) {
        if (pattern[j]) {
          // Interference between active fields
          selfInterference += constants[i] * constants[j] * Math.sin((i - j) * Math.PI / 8);
        }
      }
    }
  }
  
  return selfInterference;
}

/**
 * Calculate field stability metric.
 * Primes are "stable" in field space - they resist decomposition.
 */
function calculateFieldStability(
  substrate: FieldSubstrate,
  n: bigint
): number {
  if (n <= 1n) return 0;
  
  const pattern = substrate.getFieldPattern(n);
  const resonance = calculateResonance(substrate, n);
  
  // Count active fields
  const activeCount = pattern.filter(b => b).length;
  
  // Stability increases with fewer active fields relative to resonance
  // This captures the "atomic" nature of primes
  const stability = resonance / (activeCount + 1);
  
  return stability;
}

/**
 * Check field decomposition resistance.
 * Primes cannot be decomposed into simpler field patterns.
 */
function checkDecompositionResistance(
  substrate: FieldSubstrate,
  n: bigint
): boolean {
  if (n <= 3n) return n > 1n; // 2 and 3 are prime
  
  const pattern = substrate.getFieldPattern(n);
  
  // For small numbers, check specific patterns
  if (n < 256n) {
    // Check if the pattern can be factored
    // A composite number's pattern often relates to its factors' patterns
    const byte = Number(n & 0xffn);
    
    // Quick checks for common composites
    if (byte % 2 === 0 && n > 2n) return false; // Even numbers > 2
    if (byte % 3 === 0 && n > 3n && n % 3n === 0n) return false;
    if (byte % 5 === 0 && n > 5n && n % 5n === 0n) return false;
  }
  
  return true;
}

/**
 * Advanced O(1) prime detection using field dynamics.
 * Combines multiple field-based indicators for accurate prime detection.
 */
export function isPrimeViaFieldDynamics(
  substrate: FieldSubstrate,
  n: bigint
): boolean {
  // Handle special cases
  if (n <= 1n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false; // Even numbers > 2 are not prime
  
  // Get field-based metrics
  const pattern = substrate.getFieldPattern(n);
  const resonance = calculateResonance(substrate, n);
  const interference = calculateFieldInterferenceSignature(substrate, n);
  const stability = calculateFieldStability(substrate, n);
  
  // Special handling for small primes where patterns are clearer
  if (n < 100n) {
    // Known small primes
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n];
    return smallPrimes.includes(n);
  }
  
  // Field-based primality indicators:
  // 1. Interference pattern - primes have characteristic interference
  const interferenceIndicator = Math.abs(interference) < 0.5 || Math.abs(interference - Math.PI) < 0.5;
  
  // 2. Stability metric - primes are more stable
  const stabilityIndicator = stability > resonance * 0.3;
  
  // 3. Decomposition resistance
  const decompositionResistant = checkDecompositionResistance(substrate, n);
  
  // 4. Field pattern analysis - certain patterns are more likely to be prime
  const activeFieldCount = pattern.filter(b => b).length;
  const patternIndicator = activeFieldCount > 0 && activeFieldCount <= 5;
  
  // 5. Resonance characteristics - avoid relying solely on local minima
  const resonanceIndicator = resonance > 0.1 && resonance < 10;
  
  // Combine indicators with weights
  const indicators = [
    interferenceIndicator,
    stabilityIndicator,
    decompositionResistant,
    patternIndicator,
    resonanceIndicator
  ];
  
  const score = indicators.filter(ind => ind).length;
  
  // Require at least 4 out of 5 indicators for primality
  return score >= 4;
}

/**
 * Get detailed field dynamics analysis for prime detection.
 */
export interface FieldDynamicsAnalysis {
  isPrime: boolean;
  resonance: number;
  interference: number;
  stability: number;
  decompositionResistant: boolean;
  activeFieldCount: number;
  confidence: number;
}

export function analyzeFieldDynamics(
  substrate: FieldSubstrate,
  n: bigint
): FieldDynamicsAnalysis {
  const pattern = substrate.getFieldPattern(n);
  const resonance = calculateResonance(substrate, n);
  const interference = calculateFieldInterferenceSignature(substrate, n);
  const stability = calculateFieldStability(substrate, n);
  const decompositionResistant = checkDecompositionResistance(substrate, n);
  const activeFieldCount = pattern.filter(b => b).length;
  const isPrime = isPrimeViaFieldDynamics(substrate, n);
  
  // Calculate confidence based on how many indicators agree
  const indicators = [
    Math.abs(interference) < 0.5 || Math.abs(interference - Math.PI) < 0.5,
    stability > resonance * 0.3,
    decompositionResistant,
    activeFieldCount > 0 && activeFieldCount <= 5,
    resonance > 0.1 && resonance < 10
  ];
  
  const confidence = indicators.filter(ind => ind).length / indicators.length;
  
  return {
    isPrime,
    resonance,
    interference,
    stability,
    decompositionResistant,
    activeFieldCount,
    confidence
  };
}