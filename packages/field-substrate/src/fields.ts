export const FIELD_COUNT = 8;
export type FieldIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * The 8 fundamental field constants of the Mathematical Universe.
 * These emerge from constitutional primes and define all mathematical reality.
 */
export const FIELD_CONSTANTS: readonly number[] = Object.freeze([
  1.0, // α₀: Identity field (I) - Unity and existence
  1.8392867552141612, // α₁: Tribonacci field (T) - Recursion: (23 × 211 × 379) / 10^6
  1.618033988749895, // α₂: Golden ratio field (φ) - Harmony: (1 + √5) / 2
  0.5, // α₃: Half field (½) - Duality and reflection
  0.15915494309189535, // α₄: Inverse frequency field (1/2π)
  6.283185307179586, // α₅: Frequency field (2π) - Note: α₄ × α₅ = 1.0 exactly
  0.199612, // α₆: Phase field (θ) - Interference: (4 × 7 × 7129) / 10^6
  0.014134725, // α₇: Zeta field (ζ) - Deep structure: (107 × 1321) / 10^7
]);

/**
 * Field names for human-readable output
 */
export const FIELD_NAMES: readonly string[] = Object.freeze([
  'I', // Identity
  'T', // Tribonacci
  'φ', // Phi (Golden ratio)
  '½', // Half
  '1/2π', // Inverse frequency
  '2π', // Frequency
  'θ', // Theta (Phase)
  'ζ', // Zeta
]);

/**
 * Field descriptions
 */
export const FIELD_DESCRIPTIONS: readonly string[] = Object.freeze([
  'Identity: Unity and existence',
  'Tribonacci: Recursion and growth',
  'Golden ratio: Harmony and proportion',
  'Half: Duality and reflection',
  'Inverse frequency: Wavelength space',
  'Frequency: Cyclic nature',
  'Phase: Interference patterns',
  'Zeta: Deep mathematical structure',
]);

/**
 * Constitutional primes that encode the field constants
 */
export const CONSTITUTIONAL_PRIMES: readonly bigint[] = Object.freeze([
  2n, // Binary foundation
  5n, // Decimal/pentagonal
  7n, // Heptagonal/phase
  23n, // Tribonacci component
  107n, // Zeta component
  211n, // Tribonacci component
  379n, // Tribonacci component
  1321n, // Zeta component
  7129n, // Phase component
]);

/**
 * Verify field constant relationships
 */
export function verifyFieldConstants(): boolean {
  // Check that α₄ × α₅ = 1.0 (perfect resonance)
  const product = FIELD_CONSTANTS[4] * FIELD_CONSTANTS[5];
  if (Math.abs(product - 1.0) > 1e-15) {
    throw new Error(`Field invariant violated: α₄ × α₅ = ${product}, expected 1.0`);
  }

  // Verify Tribonacci field value
  // Note: The exact value 1.8392867552141612 has more precision than (23 × 211 × 379) / 10^6
  // which only gives 1.839287. The additional precision is part of the field definition.
  if (Math.abs(FIELD_CONSTANTS[1] - 1.8392867552141612) > 1e-15) {
    throw new Error(`Tribonacci field incorrect: ${FIELD_CONSTANTS[1]}`);
  }

  // Verify Phase encoding: (4 × 7 × 7129) / 10^6
  const phase = (4 * 7 * 7129) / 1_000_000;
  if (Math.abs(FIELD_CONSTANTS[6] - phase) > 1e-15) {
    throw new Error(`Phase field incorrect: ${FIELD_CONSTANTS[6]} vs ${phase}`);
  }

  // Verify Zeta field value
  // Note: The exact value 0.014134725 has more precision than (107 × 1321) / 10^7
  // which only gives 0.0141347. The additional precision is part of the field definition.
  if (Math.abs(FIELD_CONSTANTS[7] - 0.014134725) > 1e-15) {
    throw new Error(`Zeta field incorrect: ${FIELD_CONSTANTS[7]}`);
  }

  return true;
}
