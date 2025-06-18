export * from './fields';
export * from './activation';

import type { FieldIndex } from './fields';
import {
  FIELD_CONSTANTS,
  FIELD_NAMES,
  FIELD_DESCRIPTIONS,
  FIELD_COUNT,
  verifyFieldConstants,
} from './fields';
import type { FieldPattern } from './activation';
import {
  getFieldPattern as getPattern,
  getActiveFields,
  isFieldActive as checkFieldActive,
} from './activation';

/**
 * Field Substrate Interface - Layer 0 of the Mathematical Universe
 *
 * This interface provides the quantum foundation where numbers exist as
 * programs with 8-dimensional field activation patterns.
 */
export interface FieldSubstrate {
  /**
   * Get the 8-bit field activation pattern for a number
   */
  getFieldPattern(n: bigint): FieldPattern;

  /**
   * Get the array of 8 field constants
   */
  getFieldConstants(): readonly number[];

  /**
   * Check if a specific field is active for a number
   */
  isFieldActive(n: bigint, fieldIndex: FieldIndex): boolean;

  /**
   * Get field name by index
   */
  getFieldName(fieldIndex: FieldIndex): string;

  /**
   * Get field description by index
   */
  getFieldDescription(fieldIndex: FieldIndex): string;

  /**
   * Get indices of all active fields
   */
  getActiveFieldIndices(n: bigint): FieldIndex[];

  /**
   * Verify field constant relationships
   */
  verifyConsistency(): boolean;
}

/**
 * Default implementation of the Field Substrate
 */
export class DefaultFieldSubstrate implements FieldSubstrate {
  constructor() {
    // Verify field constants on initialization
    verifyFieldConstants();
  }

  getFieldPattern(n: bigint): FieldPattern {
    return getPattern(n);
  }

  getFieldConstants(): readonly number[] {
    return FIELD_CONSTANTS;
  }

  isFieldActive(n: bigint, fieldIndex: FieldIndex): boolean {
    return checkFieldActive(n, fieldIndex);
  }

  getFieldName(fieldIndex: FieldIndex): string {
    if (fieldIndex < 0 || fieldIndex >= FIELD_COUNT) {
      throw new Error(`Invalid field index: ${fieldIndex}`);
    }
    return FIELD_NAMES[fieldIndex];
  }

  getFieldDescription(fieldIndex: FieldIndex): string {
    if (fieldIndex < 0 || fieldIndex >= FIELD_COUNT) {
      throw new Error(`Invalid field index: ${fieldIndex}`);
    }
    return FIELD_DESCRIPTIONS[fieldIndex];
  }

  getActiveFieldIndices(n: bigint): FieldIndex[] {
    return getActiveFields(n);
  }

  verifyConsistency(): boolean {
    return verifyFieldConstants();
  }
}

/**
 * Create a field substrate instance
 */
export function createFieldSubstrate(): FieldSubstrate {
  return new DefaultFieldSubstrate();
}
