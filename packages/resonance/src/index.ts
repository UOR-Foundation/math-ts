export * from './resonance';
export * from './interference';
export * from './prime-detection';
export * from './agent-factorization';
export * from './scalable-agent-factorization';
export * from './multimodal-factorization';
export * from './artifact-based-factorization';

import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import {
  calculateResonance,
  getResonanceEvidence,
  getResonanceSignature,
  type ResonanceSignature,
} from './resonance';
import { fieldInterference, type InterferenceResult } from './interference';
import {
  isResonanceMinimum,
  isPrimeViaResonance,
  type ResonanceMinimumAnalysis,
} from './prime-detection';

/**
 * Resonance Dynamics Interface - Layer 1 of the Mathematical Universe
 *
 * This interface provides resonance calculation and field interference,
 * revealing how fields create computational mass and energy.
 */
export interface ResonanceDynamics {
  /**
   * Calculate the resonance (computational mass) of a number
   */
  calculateResonance(n: bigint): number;

  /**
   * Calculate field interference between two numbers
   */
  fieldInterference(a: bigint, b: bigint): InterferenceResult;

  /**
   * Get evidence for how resonance was calculated
   */
  getResonanceEvidence(n: bigint): string[];

  /**
   * Get complete resonance signature
   */
  getResonanceSignature(n: bigint): ResonanceSignature;

  /**
   * Check if a number is a resonance local minimum (prime indicator)
   */
  isResonanceMinimum(n: bigint): ResonanceMinimumAnalysis;

  /**
   * Detect if a number is prime using resonance-based O(1) detection
   */
  isPrimeViaResonance(n: bigint): boolean;
}

/**
 * Default implementation of Resonance Dynamics.
 * Uses only Layer 0 (Field Substrate) interface.
 */
export class DefaultResonanceDynamics implements ResonanceDynamics {
  constructor(private substrate: FieldSubstrate) {}

  calculateResonance(n: bigint): number {
    return calculateResonance(this.substrate, n);
  }

  fieldInterference(a: bigint, b: bigint): InterferenceResult {
    const patternA = this.substrate.getFieldPattern(a);
    const patternB = this.substrate.getFieldPattern(b);
    return fieldInterference(patternA, patternB);
  }

  getResonanceEvidence(n: bigint): string[] {
    return getResonanceEvidence(this.substrate, n);
  }

  getResonanceSignature(n: bigint): ResonanceSignature {
    return getResonanceSignature(this.substrate, n);
  }

  isResonanceMinimum(n: bigint): ResonanceMinimumAnalysis {
    return isResonanceMinimum(this.substrate, n);
  }

  isPrimeViaResonance(n: bigint): boolean {
    return isPrimeViaResonance(this.substrate, n);
  }
}

/**
 * Create a resonance dynamics instance.
 *
 * @param substrate - The field substrate to use
 * @returns Resonance dynamics implementation
 */
export function createResonanceDynamics(substrate: FieldSubstrate): ResonanceDynamics {
  return new DefaultResonanceDynamics(substrate);
}
