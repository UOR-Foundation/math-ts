export * from './resonance';
export * from './interference';

import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import {
  calculateResonance,
  getResonanceEvidence,
  getResonanceSignature,
  type ResonanceSignature,
} from './resonance';
import { fieldInterference, type InterferenceResult } from './interference';

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
