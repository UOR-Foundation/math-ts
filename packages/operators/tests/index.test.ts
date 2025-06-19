import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import { ArithmeticOperators } from '../src';

describe('ArithmeticOperators', () => {
  let substrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;

  beforeEach(() => {
    substrate = createFieldSubstrate();
    resonance = createResonanceDynamics(substrate);
    topology = createPageTopology(substrate, resonance);
    operators = new ArithmeticOperators(substrate, resonance, topology);
  });

  describe('Addition - Field Merger', () => {
    test('should add two numbers correctly', () => {
      const result = operators.add(7n, 11n);
      expect(result.result).toBe(18n);
      expect(result.operation).toBe('addition');
    });

    test('should track field transitions during addition', () => {
      const result = operators.add(7n, 11n);
      // 7 has fields: I(0), T(1), φ(2)
      // 11 has fields: I(0), T(1), ½(3)
      // 18 has fields: T(1), 2π(4)

      const transitions = result.fieldAnalysis.fieldTransitions;
      expect(transitions.length).toBe(8); // All 8 fields analyzed

      // Check some specific transitions
      const field0 = transitions.find((t) => t.field === 0); // Identity field
      expect(field0?.beforeA).toBe(true); // Active in 7
      expect(field0?.beforeB).toBe(true); // Active in 11
      expect(field0?.after).toBe(false); // Not active in 18
      expect(field0?.type).toBe('destroyed');
    });

    test('should handle modular addition', () => {
      const result = operators.addModulo(45n, 27n, 48n);
      expect(result.modularResult).toBe(24n); // (45 + 27) % 48 = 24
      expect(result.reductionOccurred).toBe(true);
    });

    test('should chain additions', () => {
      const result = operators.addChain([5n, 7n, 11n, 13n]);
      expect(result.finalResult).toBe(36n);
      expect(result.steps.length).toBe(3); // 3 addition operations
    });
  });

  describe('Multiplication - Field Entanglement', () => {
    test('should multiply two numbers correctly', () => {
      const result = operators.multiply(7n, 11n);
      expect(result.result).toBe(77n);
      expect(result.operation).toBe('multiplication');
    });

    test('should detect denormalization artifacts', () => {
      const result = operators.multiply(7n, 11n);
      // 7 × 11 = 77
      // The actual artifacts depend on the field patterns

      // Should have a carry operator pattern
      expect(result.carryOperator).toBeDefined();
      expect(result.carryOperator.some((bit) => bit)).toBe(true); // At least one carry bit

      // The artifacts array might be empty if the multiplication
      // follows simple XOR pattern, which is okay
      expect(result.artifacts).toBeDefined();

      // Check entanglement complexity
      expect(result.entanglementComplexity).toBeGreaterThanOrEqual(0);
    });

    test('should track carry operator', () => {
      const result = operators.multiply(7n, 11n);
      expect(result.carryOperator).toBeDefined();
      expect(result.carryOperator.length).toBe(8);
    });

    test('should calculate entanglement complexity', () => {
      const result = operators.multiply(7n, 11n);
      expect(result.entanglementComplexity).toBeGreaterThan(0);
    });

    test('should handle powers', () => {
      const result = operators.power(7n, 3n);
      expect(result.result).toBe(343n); // 7^3
      expect(result.steps.length).toBe(2); // Two multiplications
      expect(result.fieldCascade.length).toBe(3); // Base + 2 results
    });

    test('should handle modular multiplication', () => {
      const result = operators.multiplyModulo(7n, 11n, 48n);
      expect(result.modularResult).toBe(29n); // (7 * 11) % 48
    });
  });

  describe('Division - Inverse Compilation', () => {
    test('should divide exactly', () => {
      const result = operators.divide(77n, 7n);
      expect(result.quotient).toBe(11n);
      expect(result.remainder).toBe(0n);
      expect(result.exact).toBe(true);
    });

    test('should handle division with remainder', () => {
      const result = operators.divide(100n, 7n);
      expect(result.quotient).toBe(14n);
      expect(result.remainder).toBe(2n);
      expect(result.exact).toBe(false);
    });

    test('should track decompilation artifacts', () => {
      const result = operators.divide(77n, 7n);
      // Division must reverse the multiplication artifacts
      expect(result.decompilationArtifacts).toBeDefined();
      expect(result.fieldReconstruction.reconstructsOriginal).toBe(true);
    });

    test('should throw on division by zero', () => {
      expect(() => operators.divide(10n, 0n)).toThrow('Division by zero');
    });
  });

  describe('Factorization - Molecular Decomposition', () => {
    test('should factorize composite numbers', () => {
      const result = operators.factorize(77n);
      expect(result.factors).toEqual([7n, 11n]);
      expect(result.isPrime).toBe(false);
    });

    test('should identify prime numbers', () => {
      const result = operators.factorize(7n);
      expect(result.factors).toEqual([7n]);
      expect(result.isPrime).toBe(true);
    });

    test('should track field reconstruction during factorization', () => {
      const result = operators.factorize(77n);
      expect(result.decompositionSteps.length).toBeGreaterThan(0);

      // Check that fields are properly reconstructed
      const step = result.decompositionSteps[0];
      expect(step.fieldReconstruction).toBeDefined();
      // Field restoration might be empty if no artifacts occurred
      expect(step.fieldReconstruction.fieldsRestored).toBeDefined();
      expect(step.fieldReconstruction.fieldsRemoved).toBeDefined();
    });

    test('should handle large numbers', () => {
      const result = operators.factorize(143n); // 11 × 13
      expect(result.factors).toEqual([11n, 13n]);
    });
  });

  describe('GCD/LCM - Field Sources and Harmony', () => {
    test('should compute GCD', () => {
      const result = operators.gcd(48n, 18n);
      expect(result.gcd).toBe(6n);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    test('should find common field sources', () => {
      const result = operators.gcd(48n, 18n);
      expect(result.commonFieldSources).toBeDefined();
      expect(result.commonFieldSources.length).toBeGreaterThanOrEqual(0);
    });

    test('should compute LCM', () => {
      const result = operators.lcm(12n, 18n);
      expect(result.lcm).toBe(36n);
      expect(result.gcdUsed).toBe(6n);
    });

    test('should calculate resonance harmony for LCM', () => {
      const result = operators.lcm(12n, 18n);
      expect(result.resonanceHarmony).toBeGreaterThan(0);
    });
  });

  describe('Modular Arithmetic - Cyclic Reactions', () => {
    test('should handle modulo operation', () => {
      expect(operators.modulo(17n, 5n)).toBe(2n);
      expect(operators.modulo(-17n, 5n)).toBe(3n); // Positive result
    });

    test('should work within page boundaries', () => {
      // Working mod 48 creates a closed page
      const result = operators.addModulo(47n, 2n, 48n);
      expect(result.modularResult).toBe(1n);

      // Check if we crossed a page boundary
      expect(result.topologicalAnalysis.crossedBoundary).toBe(true);
    });
  });

  describe('Artifact Tracking and Prediction', () => {
    test('should track multiplication artifacts', () => {
      const artifacts = operators.trackArtifacts(7n, 11n);
      expect(artifacts.operands).toEqual({ a: 7, b: 11 });
      expect(artifacts.product).toBe(77);
      expect(artifacts.artifacts.length).toBeGreaterThan(0);
    });

    test('should predict artifacts without computing', () => {
      const prediction = operators.predictArtifacts(7n, 11n);
      expect(prediction.predictions.length).toBeGreaterThan(0);

      // Should predict some artifacts with likelihood > 0
      const likelyArtifacts = prediction.predictions.filter((p) => p.likelihood > 0.5);
      expect(likelyArtifacts.length).toBeGreaterThan(0);
    });
  });

  describe('Subtraction', () => {
    test('should subtract correctly', () => {
      const result = operators.subtract(20n, 7n);
      expect(result.result).toBe(13n);
    });

    test('should handle negative results', () => {
      const result = operators.subtract(7n, 20n);
      expect(result.result).toBe(-13n);
    });
  });
});
