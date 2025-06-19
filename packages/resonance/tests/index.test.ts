import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import {
  calculateResonance,
  calculateResonanceFromPattern,
  getResonanceEvidence,
  classifyResonance,
  isAtResonanceWell,
  getResonanceSignature,
  fieldInterference,
  willDestructivelyInterfere,
  calculatePhaseRelationship,
  predictResonanceChange,
  createResonanceDynamics,
} from '../src';

describe('Resonance Dynamics - Layer 1', () => {
  const substrate = createFieldSubstrate();
  const constants = substrate.getFieldConstants();

  describe('Resonance Calculation', () => {
    test('should calculate resonance for numbers with no active fields', () => {
      // Number 0 has no active fields
      const resonance = calculateResonance(substrate, 0n);
      expect(resonance).toBe(1.0); // Product of empty set is 1
    });

    test('should calculate resonance for single active field', () => {
      // Number 1 has only field 0 (Identity) active
      const resonance = calculateResonance(substrate, 1n);
      expect(resonance).toBe(constants[0]); // Should be 1.0
      expect(resonance).toBe(1.0);
    });

    test('should calculate resonance for multiple active fields', () => {
      // Number 7 = 0b00000111 has fields 0, 1, 2 active (I, T, φ)
      const resonance = calculateResonance(substrate, 7n);
      const expected = constants[0] * constants[1] * constants[2];
      expect(resonance).toBeCloseTo(expected, 10);
      // Expected: 1.0 * 1.8392867552141612 * 1.618033988749895 ≈ 2.976028485
      expect(resonance).toBeCloseTo(2.976028485, 6);
    });

    test('should calculate perfect resonance for number 48', () => {
      // Number 48 = 0b00110000 has fields 4, 5 active
      // α₄ × α₅ = (1/2π) × (2π) = 1.0
      const resonance = calculateResonance(substrate, 48n);
      expect(resonance).toBeCloseTo(1.0, 15);
    });

    test('should handle large numbers using mod 256', () => {
      // 263 ≡ 7 (mod 256), so should have same resonance
      const resonance263 = calculateResonance(substrate, 263n);
      const resonance7 = calculateResonance(substrate, 7n);
      expect(resonance263).toBeCloseTo(resonance7, 15);
    });
  });

  describe('Resonance Classification', () => {
    test('should classify resonance values correctly', () => {
      expect(classifyResonance(0)).toBe('void');
      expect(classifyResonance(0.05)).toBe('ultra-low');
      expect(classifyResonance(0.3)).toBe('very-low');
      expect(classifyResonance(0.7)).toBe('low');
      expect(classifyResonance(1.0)).toBe('unity');
      expect(classifyResonance(1.5)).toBe('moderate');
      expect(classifyResonance(3.0)).toBe('high');
      expect(classifyResonance(7.0)).toBe('very-high');
      expect(classifyResonance(15.0)).toBe('ultra-high');
    });

    test('should detect resonance wells', () => {
      expect(isAtResonanceWell(0.5)).toBe(true);
      expect(isAtResonanceWell(1.0)).toBe(true);
      expect(isAtResonanceWell(1.618033989)).toBe(true); // φ
      expect(isAtResonanceWell(Math.PI)).toBe(true);
      expect(isAtResonanceWell(2 * Math.PI)).toBe(true);

      expect(isAtResonanceWell(0.7)).toBe(false);
      expect(isAtResonanceWell(2.5)).toBe(false);
    });
  });

  describe('Resonance Evidence', () => {
    test('should provide evidence for resonance calculation', () => {
      const evidence = getResonanceEvidence(substrate, 7n);

      expect(evidence).toContain('Field I active: α0 = 1');
      expect(evidence).toContain('Field T active: α1 = 1.8392867552141612');
      expect(evidence).toContain('Field φ active: α2 = 1.618033988749895');
      expect(evidence[evidence.length - 1]).toMatch(/Total resonance: 2.976/);
    });
  });

  describe('Resonance Signatures', () => {
    test('should create complete resonance signature', () => {
      const sig = getResonanceSignature(substrate, 7n);

      expect(sig.primary).toBeCloseTo(2.976028485, 6);
      expect(sig.classification).toBe('high');
      expect(sig.isWell).toBe(false);
      expect(sig.activeFieldCount).toBe(3);
    });

    test('should detect unity resonance signature', () => {
      const sig = getResonanceSignature(substrate, 48n);

      expect(sig.primary).toBeCloseTo(1.0, 15);
      expect(sig.classification).toBe('unity');
      expect(sig.isWell).toBe(true);
      expect(sig.activeFieldCount).toBe(2);
    });
  });

  describe('Field Interference', () => {
    test('should calculate constructive interference', () => {
      // Patterns that don't conflict
      const pattern1 = [true, false, false, false, false, false, false, false];
      const pattern2 = [false, true, false, false, false, false, false, false];

      const result = fieldInterference(pattern1, pattern2);

      expect(result.interferenceType).toBe('constructive');
      expect(result.resultPattern).toEqual([true, true, false, false, false, false, false, false]);
      expect(result.coherence).toBe(1.0);
      expect(result.artifacts).toHaveLength(0);
    });

    test('should handle destructive interference for fields 4 and 5', () => {
      // When both patterns have fields 4 and 5 active, they cancel
      const pattern1 = [false, false, false, false, true, true, false, false];
      const pattern2 = [false, false, false, false, true, true, false, false];

      const result = fieldInterference(pattern1, pattern2);

      expect(result.interferenceType).toBe('destructive');
      expect(result.resultPattern[4]).toBe(false);
      expect(result.resultPattern[5]).toBe(false);
      expect(result.artifacts).toHaveLength(2);
      expect(result.artifacts[0].type).toBe('vanished');
    });

    test('should handle mixed interference', () => {
      const pattern1 = [true, true, false, false, true, true, false, false];
      const pattern2 = [true, false, true, false, true, true, false, false];

      const result = fieldInterference(pattern1, pattern2);

      expect(result.interferenceType).toBe('mixed');
      expect(result.resultPattern[0]).toBe(true); // Constructive
      expect(result.resultPattern[4]).toBe(false); // Destructive
      expect(result.resultPattern[5]).toBe(false); // Destructive
    });

    test('should calculate phase relationships', () => {
      const pattern1 = [true, true, false, false, false, false, false, false];
      const pattern2 = [true, true, false, false, false, false, false, false];

      // Same pattern = in phase (0 radians)
      expect(calculatePhaseRelationship(pattern1, pattern2)).toBeCloseTo(0, 6);

      // Orthogonal patterns
      const pattern3 = [true, false, false, false, false, false, false, false];
      const pattern4 = [false, true, false, false, false, false, false, false];
      expect(calculatePhaseRelationship(pattern3, pattern4)).toBeCloseTo(Math.PI / 2, 6);
    });
  });

  describe('Resonance Prediction', () => {
    test('should predict resonance changes from interference', () => {
      const resonanceA = 2.0;
      const resonanceB = 3.0;

      // Constructive interference
      const constructive = {
        resultPattern: [true, true, false, false, false, false, false, false],
        artifacts: [],
        interferenceType: 'constructive' as const,
        coherence: 1.0,
      };

      const predicted = predictResonanceChange(resonanceA, resonanceB, constructive);
      expect(predicted).toBeCloseTo(6.0, 6); // Simple multiplication

      // Destructive interference
      const destructive = {
        resultPattern: [false, false, false, false, false, false, false, false],
        artifacts: [{ fieldIndex: 0, type: 'vanished' as const, description: 'test' }],
        interferenceType: 'destructive' as const,
        coherence: 0.5,
      };

      const predictedDestructive = predictResonanceChange(resonanceA, resonanceB, destructive);
      expect(predictedDestructive).toBeLessThan(6.0); // Reduced by interference
    });
  });

  describe('ResonanceDynamics Interface', () => {
    const dynamics = createResonanceDynamics(substrate);

    test('should provide all interface methods', () => {
      expect(typeof dynamics.calculateResonance).toBe('function');
      expect(typeof dynamics.fieldInterference).toBe('function');
      expect(typeof dynamics.getResonanceEvidence).toBe('function');
      expect(typeof dynamics.getResonanceSignature).toBe('function');
    });

    test('should calculate resonance through interface', () => {
      const resonance = dynamics.calculateResonance(7n);
      expect(resonance).toBeCloseTo(2.976028485, 6);
    });

    test('should calculate interference through interface', () => {
      const result = dynamics.fieldInterference(7n, 11n);
      expect(result.interferenceType).toBeDefined();
      expect(result.resultPattern).toBeDefined();
      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(1);
    });
  });

  describe('Known Resonance Examples', () => {
    test('should match documented prime resonances', () => {
      // Primes often have low resonance
      const prime7 = calculateResonance(substrate, 7n);
      const prime11 = calculateResonance(substrate, 11n);
      const prime13 = calculateResonance(substrate, 13n);

      // 7 has high resonance due to multiple active fields
      expect(prime7).toBeGreaterThan(2.0);

      // 11 = 1011 binary, fields 0,1,3 active
      const expected11 = constants[0] * constants[1] * constants[3];
      expect(prime11).toBeCloseTo(expected11, 10);

      // Verify classifications
      expect(classifyResonance(prime7)).toBe('high');
      expect(classifyResonance(prime11)).toBe('low');
    });

    test('should verify multiplication interference example from docs', () => {
      // From documentation:
      // 7 × 11 = 77, but resonances don't simply multiply
      const res7 = calculateResonance(substrate, 7n);
      const res11 = calculateResonance(substrate, 11n);
      const res77 = calculateResonance(substrate, 77n);

      const naiveExpectation = res7 * res11;
      expect(res77).not.toBeCloseTo(naiveExpectation, 1);

      // 77 has its own field pattern and resonance
      const pattern77 = substrate.getFieldPattern(77n);
      expect(pattern77).toEqual([true, false, true, true, false, false, true, false]);
    });
  });
});
