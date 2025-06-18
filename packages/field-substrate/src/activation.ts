import type { FieldIndex } from './fields';
import { FIELD_COUNT } from './fields';

export type FieldPattern = boolean[];

/**
 * Calculate the 8-bit field activation pattern for a number.
 * The pattern is determined by n mod 256, with each bit controlling one field.
 *
 * Formula: bᵢ(n) = ⌊n/2ⁱ⌋ mod 2
 *
 * @param n - The number to analyze
 * @returns 8-element boolean array indicating which fields are active
 */
export function getFieldPattern(n: bigint): FieldPattern {
  // For negative numbers, use absolute value
  const absN = n < 0n ? -n : n;

  // Get the least significant 8 bits (n mod 256)
  const byte = Number(absN & 0xffn);

  // Extract each bit to determine field activation
  const pattern: FieldPattern = new Array<boolean>(FIELD_COUNT);
  for (let i = 0; i < FIELD_COUNT; i++) {
    pattern[i] = ((byte >> i) & 1) === 1;
  }

  return pattern;
}

/**
 * Get the indices of all active fields for a number.
 *
 * @param n - The number to analyze
 * @returns Array of field indices that are active
 */
export function getActiveFields(n: bigint): FieldIndex[] {
  const pattern = getFieldPattern(n);
  const active: FieldIndex[] = [];

  for (let i = 0; i < FIELD_COUNT; i++) {
    if (pattern[i]) {
      active.push(i as FieldIndex);
    }
  }

  return active;
}

/**
 * Check if a specific field is active for a number.
 *
 * @param n - The number to analyze
 * @param fieldIndex - The field index to check
 * @returns true if the field is active
 */
export function isFieldActive(n: bigint, fieldIndex: FieldIndex): boolean {
  const pattern = getFieldPattern(n);
  return pattern[fieldIndex];
}

/**
 * Convert a field pattern to its byte representation.
 *
 * @param pattern - The field pattern
 * @returns The byte value (0-255)
 */
export function patternToByte(pattern: FieldPattern): number {
  if (pattern.length !== FIELD_COUNT) {
    throw new Error(`Invalid pattern length: ${pattern.length}, expected ${FIELD_COUNT}`);
  }

  let byte = 0;
  for (let i = 0; i < FIELD_COUNT; i++) {
    if (pattern[i]) {
      byte |= 1 << i;
    }
  }

  return byte;
}

/**
 * Create a field pattern from a byte value.
 *
 * @param byte - The byte value (0-255)
 * @returns The corresponding field pattern
 */
export function byteToPattern(byte: number): FieldPattern {
  if (byte < 0 || byte > 255) {
    throw new Error(`Invalid byte value: ${byte}, must be 0-255`);
  }

  const pattern: FieldPattern = new Array<boolean>(FIELD_COUNT);
  for (let i = 0; i < FIELD_COUNT; i++) {
    pattern[i] = ((byte >> i) & 1) === 1;
  }

  return pattern;
}
