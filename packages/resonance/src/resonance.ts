import type { FieldSubstrate, FieldPattern, FieldIndex } from '@uor-foundation/field-substrate';

/**
 * Calculate the resonance (computational mass/energy) of a number.
 * Resonance is the product of all active field constants.
 *
 * Formula: Res(n) = ∏ᵢ₌₀⁷ αᵢ^(bᵢ(n))
 *
 * @param substrate - The field substrate interface
 * @param n - The number to calculate resonance for
 * @returns The resonance value
 */
export function calculateResonance(substrate: FieldSubstrate, n: bigint): number {
  const pattern = substrate.getFieldPattern(n);
  const constants = substrate.getFieldConstants();

  let resonance = 1.0;

  // Multiply together all active field constants
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i]) {
      resonance *= constants[i];
    }
  }

  return resonance;
}

/**
 * Calculate resonance from a field pattern directly.
 *
 * @param pattern - The field activation pattern
 * @param constants - The field constants array
 * @returns The resonance value
 */
export function calculateResonanceFromPattern(
  pattern: FieldPattern,
  constants: readonly number[],
): number {
  let resonance = 1.0;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i]) {
      resonance *= constants[i];
    }
  }

  return resonance;
}

/**
 * Get a description of which fields contribute to a number's resonance.
 *
 * @param substrate - The field substrate interface
 * @param n - The number to analyze
 * @returns Array of evidence strings
 */
export function getResonanceEvidence(substrate: FieldSubstrate, n: bigint): string[] {
  const pattern = substrate.getFieldPattern(n);
  const constants = substrate.getFieldConstants();
  const evidence: string[] = [];

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i]) {
      const fieldName = substrate.getFieldName(i as FieldIndex);
      const value = constants[i];
      evidence.push(`Field ${fieldName} active: α${i} = ${value}`);
    }
  }

  const resonance = calculateResonance(substrate, n);
  evidence.push(`Total resonance: ${resonance}`);

  return evidence;
}

/**
 * Classify resonance into categories.
 *
 * @param resonance - The resonance value
 * @returns Classification of the resonance
 */
export function classifyResonance(resonance: number): string {
  if (resonance === 0) return 'void';
  if (resonance < 0.1) return 'ultra-low';
  if (resonance < 0.5) return 'very-low';
  if (resonance < 1.0) return 'low';
  if (Math.abs(resonance - 1.0) < 0.001) return 'unity';
  if (resonance < 2.0) return 'moderate';
  if (resonance < 5.0) return 'high';
  if (resonance < 10.0) return 'very-high';
  return 'ultra-high';
}

/**
 * Check if a number is at a resonance well (attractor point).
 *
 * @param resonance - The resonance value
 * @param tolerance - How close to consider "at" the well
 * @returns True if at a resonance well
 */
export function isAtResonanceWell(resonance: number, tolerance: number = 0.01): boolean {
  const wells = [
    0.5, // Half-field well
    1.0, // Unity well (perfect resonance)
    1.618033989, // Golden ratio well
    Math.PI, // Pi-related well
    2 * Math.PI, // 2π well
  ];

  return wells.some((well) => Math.abs(resonance - well) < tolerance);
}

/**
 * Resonance signature provides multi-scale analysis.
 */
export interface ResonanceSignature {
  primary: number; // Base resonance from active fields
  classification: string; // Category of resonance
  isWell: boolean; // At resonance well?
  activeFieldCount: number; // How many fields are active
}

/**
 * Get the complete resonance signature for a number.
 *
 * @param substrate - The field substrate interface
 * @param n - The number to analyze
 * @returns Complete resonance signature
 */
export function getResonanceSignature(substrate: FieldSubstrate, n: bigint): ResonanceSignature {
  const pattern = substrate.getFieldPattern(n);
  const resonance = calculateResonance(substrate, n);
  const activeCount = pattern.filter((b: boolean) => b).length;

  return {
    primary: resonance,
    classification: classifyResonance(resonance),
    isWell: isAtResonanceWell(resonance),
    activeFieldCount: activeCount,
  };
}
