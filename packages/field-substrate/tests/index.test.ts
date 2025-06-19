import {
  FIELD_COUNT,
  FIELD_CONSTANTS,
  FIELD_NAMES,
  CONSTITUTIONAL_PRIMES,
  getFieldPattern,
  getActiveFields,
  isFieldActive,
  patternToByte,
  byteToPattern,
  verifyFieldConstants,
  createFieldSubstrate,
  FieldIndex,
} from '../src';

describe('Field Substrate - Layer 0', () => {
  describe('Field Constants', () => {
    test('should have exactly 8 fields', () => {
      expect(FIELD_COUNT).toBe(8);
      expect(FIELD_CONSTANTS.length).toBe(8);
      expect(FIELD_NAMES.length).toBe(8);
    });

    test('should have correct field constant values', () => {
      // Identity field
      expect(FIELD_CONSTANTS[0]).toBe(1.0);

      // Tribonacci field: documented as 1.8392867552141612
      // Note: Has more precision than simple (23 × 211 × 379) / 10^6 = 1.839287
      expect(FIELD_CONSTANTS[1]).toBe(1.8392867552141612);

      // Golden ratio: (1 + √5) / 2
      const expectedPhi = (1 + Math.sqrt(5)) / 2;
      expect(FIELD_CONSTANTS[2]).toBeCloseTo(expectedPhi, 15);

      // Half field
      expect(FIELD_CONSTANTS[3]).toBe(0.5);

      // Frequency fields
      expect(FIELD_CONSTANTS[4]).toBeCloseTo(1 / (2 * Math.PI), 15);
      expect(FIELD_CONSTANTS[5]).toBeCloseTo(2 * Math.PI, 15);

      // Phase field: (4 × 7 × 7129) / 10^6
      const expectedPhase = (4 * 7 * 7129) / 1_000_000;
      expect(FIELD_CONSTANTS[6]).toBe(expectedPhase);

      // Zeta field: documented as 0.014134725
      // Note: Has more precision than simple (107 × 1321) / 10^7 = 0.0141347
      expect(FIELD_CONSTANTS[7]).toBe(0.014134725);
    });

    test('should satisfy perfect resonance condition: α₄ × α₅ = 1.0', () => {
      const product = FIELD_CONSTANTS[4] * FIELD_CONSTANTS[5];
      expect(product).toBeCloseTo(1.0, 15);
    });

    test('should have correct constitutional primes', () => {
      expect(CONSTITUTIONAL_PRIMES).toEqual([2n, 5n, 7n, 23n, 107n, 211n, 379n, 1321n, 7129n]);
    });

    test('should verify field constants successfully', () => {
      expect(verifyFieldConstants()).toBe(true);
    });
  });

  describe('Field Activation Patterns', () => {
    test('should calculate correct field patterns for small numbers', () => {
      // 0: 00000000 - no fields active
      expect(getFieldPattern(0n)).toEqual([false, false, false, false, false, false, false, false]);

      // 1: 00000001 - only field 0 (Identity) active
      expect(getFieldPattern(1n)).toEqual([true, false, false, false, false, false, false, false]);

      // 7: 00000111 - fields 0, 1, 2 active (I, T, φ)
      expect(getFieldPattern(7n)).toEqual([true, true, true, false, false, false, false, false]);

      // 48: 00110000 - fields 4, 5 active (perfect resonance pair)
      expect(getFieldPattern(48n)).toEqual([false, false, false, false, true, true, false, false]);

      // 255: 11111111 - all fields active
      expect(getFieldPattern(255n)).toEqual([true, true, true, true, true, true, true, true]);
    });

    test('should handle large numbers using mod 256', () => {
      // 256 ≡ 0 (mod 256)
      expect(getFieldPattern(256n)).toEqual(getFieldPattern(0n));

      // 257 ≡ 1 (mod 256)
      expect(getFieldPattern(257n)).toEqual(getFieldPattern(1n));

      // 1000 ≡ 232 (mod 256)
      expect(getFieldPattern(1000n)).toEqual(getFieldPattern(232n));
    });

    test('should handle negative numbers using absolute value', () => {
      expect(getFieldPattern(-7n)).toEqual(getFieldPattern(7n));
      expect(getFieldPattern(-48n)).toEqual(getFieldPattern(48n));
    });

    test('should correctly identify active fields', () => {
      expect(getActiveFields(0n)).toEqual([]);
      expect(getActiveFields(1n)).toEqual([0]);
      expect(getActiveFields(7n)).toEqual([0, 1, 2]);
      expect(getActiveFields(48n)).toEqual([4, 5]);
      expect(getActiveFields(255n)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    test('should check individual field activation', () => {
      // Number 7 has fields 0, 1, 2 active
      expect(isFieldActive(7n, 0)).toBe(true);
      expect(isFieldActive(7n, 1)).toBe(true);
      expect(isFieldActive(7n, 2)).toBe(true);
      expect(isFieldActive(7n, 3)).toBe(false);

      // Number 48 has fields 4, 5 active
      expect(isFieldActive(48n, 4)).toBe(true);
      expect(isFieldActive(48n, 5)).toBe(true);
      expect(isFieldActive(48n, 0)).toBe(false);
    });
  });

  describe('Pattern/Byte Conversions', () => {
    test('should convert patterns to bytes correctly', () => {
      expect(patternToByte([false, false, false, false, false, false, false, false])).toBe(0);
      expect(patternToByte([true, false, false, false, false, false, false, false])).toBe(1);
      expect(patternToByte([true, true, true, false, false, false, false, false])).toBe(7);
      expect(patternToByte([false, false, false, false, true, true, false, false])).toBe(48);
      expect(patternToByte([true, true, true, true, true, true, true, true])).toBe(255);
    });

    test('should convert bytes to patterns correctly', () => {
      expect(byteToPattern(0)).toEqual([false, false, false, false, false, false, false, false]);
      expect(byteToPattern(1)).toEqual([true, false, false, false, false, false, false, false]);
      expect(byteToPattern(7)).toEqual([true, true, true, false, false, false, false, false]);
      expect(byteToPattern(48)).toEqual([false, false, false, false, true, true, false, false]);
      expect(byteToPattern(255)).toEqual([true, true, true, true, true, true, true, true]);
    });

    test('should validate pattern length', () => {
      expect(() => patternToByte([true, false])).toThrow('Invalid pattern length');
      expect(() => patternToByte([...new Array(10).fill(false)])).toThrow('Invalid pattern length');
    });

    test('should validate byte range', () => {
      expect(() => byteToPattern(-1)).toThrow('Invalid byte value');
      expect(() => byteToPattern(256)).toThrow('Invalid byte value');
    });
  });

  describe('FieldSubstrate Interface', () => {
    const substrate = createFieldSubstrate();

    test('should provide all interface methods', () => {
      expect(typeof substrate.getFieldPattern).toBe('function');
      expect(typeof substrate.getFieldConstants).toBe('function');
      expect(typeof substrate.isFieldActive).toBe('function');
      expect(typeof substrate.getFieldName).toBe('function');
      expect(typeof substrate.getFieldDescription).toBe('function');
      expect(typeof substrate.getActiveFieldIndices).toBe('function');
      expect(typeof substrate.verifyConsistency).toBe('function');
    });

    test('should return field constants', () => {
      const constants = substrate.getFieldConstants();
      expect(constants).toBe(FIELD_CONSTANTS);
      expect(constants.length).toBe(8);
    });

    test('should get field names', () => {
      expect(substrate.getFieldName(0)).toBe('I');
      expect(substrate.getFieldName(1)).toBe('T');
      expect(substrate.getFieldName(2)).toBe('φ');
      expect(substrate.getFieldName(3)).toBe('½');
      expect(substrate.getFieldName(4)).toBe('1/2π');
      expect(substrate.getFieldName(5)).toBe('2π');
      expect(substrate.getFieldName(6)).toBe('θ');
      expect(substrate.getFieldName(7)).toBe('ζ');
    });

    test('should validate field index', () => {
      expect(() => substrate.getFieldName(-1 as FieldIndex)).toThrow('Invalid field index');
      expect(() => substrate.getFieldName(8 as FieldIndex)).toThrow('Invalid field index');
    });

    test('should verify consistency', () => {
      expect(substrate.verifyConsistency()).toBe(true);
    });
  });

  describe('Field Pattern Cycles', () => {
    test('should cycle every 256 numbers', () => {
      for (let i = 0; i < 256; i++) {
        const pattern1 = getFieldPattern(BigInt(i));
        const pattern2 = getFieldPattern(BigInt(i + 256));
        const pattern3 = getFieldPattern(BigInt(i + 512));

        expect(pattern2).toEqual(pattern1);
        expect(pattern3).toEqual(pattern1);
      }
    });

    test('should handle BigInt arithmetic correctly', () => {
      const hugeNumber = 123456789012345678901234567890n;
      const modulo = hugeNumber % 256n;

      expect(getFieldPattern(hugeNumber)).toEqual(getFieldPattern(modulo));
    });
  });

  describe('Known Pattern Examples', () => {
    test('should match documented prime patterns', () => {
      // From documentation: 7 has fields I, T, φ active
      const seven = getActiveFields(7n);
      expect(seven).toContain(0); // I
      expect(seven).toContain(1); // T
      expect(seven).toContain(2); // φ
      expect(seven.length).toBe(3);

      // 11 = 1011 binary → fields 0, 1, 3 active
      const eleven = getActiveFields(11n);
      expect(eleven).toEqual([0, 1, 3]);

      // 48 has perfect resonance (fields 4, 5 only)
      const fortyEight = getActiveFields(48n);
      expect(fortyEight).toEqual([4, 5]);
    });
  });
});
