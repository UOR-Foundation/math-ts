import {
  type FieldSubstrate,
  type FieldPattern,
  FIELD_COUNT,
} from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import { CarryOperator, type DenormalizationArtifact } from './carry';
import { DenormalizationEngine } from './denormalization';
import { FieldFactorization } from './field-factorization';
import type {
  ArithmeticResult,
  ModularArithmeticResult,
  ChainedOperationResult,
  FieldTransition,
} from './addition';

/**
 * Multiplication as field entanglement - creates complex field interference
 * Fields can vanish or emerge during multiplication
 */
export class MultiplicationOperator {
  private carryOperator: CarryOperator;
  private denormalization: DenormalizationEngine;
  private fieldFactorization: FieldFactorization;

  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {
    this.carryOperator = new CarryOperator(substrate);
    this.denormalization = new DenormalizationEngine(substrate, resonance);
    this.fieldFactorization = new FieldFactorization(substrate, resonance, topology);
  }

  /**
   * Multiply two numbers - field entanglement with interference
   */
  multiply(a: bigint, b: bigint): MultiplicationResult {
    const product = a * b;

    // Get field patterns
    const patternA = this.substrate.getFieldPattern(a);
    const patternB = this.substrate.getFieldPattern(b);
    const patternProduct = this.substrate.getFieldPattern(product);

    // Calculate carry operator
    const carryPattern = this.carryOperator.compute(a, b);

    // Analyze denormalization artifacts
    const artifacts = this.carryOperator.analyzeArtifacts(a, b);

    // Calculate resonances
    const resonanceA = this.resonance.calculateResonance(a);
    const resonanceB = this.resonance.calculateResonance(b);
    const resonanceProduct = this.resonance.calculateResonance(product);

    // Get page information
    const locationA = this.topology.locateNumber(a);
    const locationB = this.topology.locateNumber(b);
    const locationProduct = this.topology.locateNumber(product);

    // Analyze field entanglement
    const entanglement = this.analyzeFieldEntanglement(
      patternA,
      patternB,
      patternProduct,
      carryPattern,
    );

    return {
      operation: 'multiplication',
      operands: [a, b],
      result: product,
      fieldAnalysis: {
        operandPatterns: [patternA, patternB],
        resultPattern: patternProduct,
        fieldTransitions: entanglement.transitions as unknown as FieldTransition[],
      },
      resonanceAnalysis: {
        operandResonances: [resonanceA, resonanceB],
        resultResonance: resonanceProduct,
        energyRedistribution: resonanceProduct - resonanceA * resonanceB,
      },
      topologicalAnalysis: {
        operandPages: [locationA.page, locationB.page],
        resultPage: locationProduct.page,
        crossedBoundary:
          locationA.page !== locationProduct.page || locationB.page !== locationProduct.page,
      },
      carryOperator: carryPattern,
      artifacts,
      entanglementComplexity: entanglement.complexity,
    };
  }

  /**
   * Analyze field entanglement during multiplication
   */
  private analyzeFieldEntanglement(
    patternA: FieldPattern,
    patternB: FieldPattern,
    patternProduct: FieldPattern,
    carryPattern: FieldPattern,
  ): EntanglementAnalysis {
    const transitions: FieldEntanglementTransition[] = [];
    let complexity = 0;

    for (let i = 0; i < FIELD_COUNT; i++) {
      const activeInA = patternA[i];
      const activeInB = patternB[i];
      const activeInProduct = patternProduct[i];
      const hasCarry = carryPattern[i];

      // Determine entanglement type
      let entanglementType: 'simple' | 'vanishing' | 'emergent' | 'interference';

      if (!hasCarry) {
        entanglementType = 'simple';
      } else if ((activeInA || activeInB) && !activeInProduct) {
        entanglementType = 'vanishing';
        complexity += 2;
      } else if (!activeInA && !activeInB && activeInProduct) {
        entanglementType = 'emergent';
        complexity += 3;
      } else {
        entanglementType = 'interference';
        complexity += 1;
      }

      transitions.push({
        field: i,
        beforeA: activeInA,
        beforeB: activeInB,
        after: activeInProduct,
        type: entanglementType,
        carry: hasCarry,
      });
    }

    return { transitions, complexity };
  }

  /**
   * Perform modular multiplication
   */
  multiplyModulo(a: bigint, b: bigint, modulus: bigint): ModularMultiplicationResult {
    const standardResult = this.multiply(a, b);
    const modularProduct = (a * b) % modulus;

    // Analyze the modular reduction
    const patternModular = this.substrate.getFieldPattern(modularProduct);
    const resonanceModular = this.resonance.calculateResonance(modularProduct);

    return {
      ...standardResult,
      modulus,
      modularResult: modularProduct,
      modularFieldPattern: patternModular,
      modularResonance: resonanceModular,
      reductionOccurred: standardResult.result !== modularProduct,
    };
  }

  /**
   * Compute power using repeated multiplication
   */
  power(base: bigint, exponent: bigint): PowerResult {
    if (exponent < 0n) {
      throw new Error('Negative exponents not supported');
    }

    if (exponent === 0n) {
      return {
        operation: 'power',
        base,
        exponent,
        result: 1n,
        steps: [],
        fieldCascade: [],
      };
    }

    const steps: MultiplicationResult[] = [];
    const fieldCascade: FieldPattern[] = [this.substrate.getFieldPattern(base)];

    let result = base;
    let exp = exponent - 1n;

    while (exp > 0n) {
      const multiplicationResult = this.multiply(result, base);
      steps.push(multiplicationResult);
      result = multiplicationResult.result;
      fieldCascade.push(multiplicationResult.fieldAnalysis.resultPattern);
      exp--;
    }

    return {
      operation: 'power',
      base,
      exponent,
      result,
      steps,
      fieldCascade,
    };
  }

  /**
   * Factorize a number using field-based analysis - NO TRIAL DIVISION
   * This uses resonance minima, field interference, and Lagrange navigation
   */
  factorize(n: bigint): FactorizationResult {
    // Delegate to field-based factorization
    return this.fieldFactorization.factorize(n);
  }

  /**
   * Analyze how fields are reconstructed during factorization
   */
  private analyzeFieldReconstruction(
    original: bigint,
    divisor: bigint,
    quotient: bigint,
  ): FieldReconstruction {
    // Verify the multiplication would recreate the original
    const reconstructed = this.multiply(divisor, quotient);
    const artifacts = reconstructed.artifacts;

    return {
      originalFields: this.substrate.getFieldPattern(original),
      divisorFields: this.substrate.getFieldPattern(divisor),
      quotientFields: this.substrate.getFieldPattern(quotient),
      reconstructedArtifacts: artifacts,
      fieldsRestored: artifacts.filter((a) => a.type === 'vanishing').map((a) => a.field),
      fieldsRemoved: artifacts.filter((a) => a.type === 'emergent').map((a) => a.field),
    };
  }

  /**
   * Chain multiple multiplications and track field evolution
   */
  multiplyChain(numbers: bigint[]): ChainedMultiplicationResult {
    if (numbers.length === 0) {
      throw new Error('Cannot perform chain multiplication on empty array');
    }

    const steps: MultiplicationResult[] = [];
    let accumulator = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
      const result = this.multiply(accumulator, numbers[i]);
      steps.push(result);
      accumulator = result.result;
    }

    // Analyze overall field evolution and artifact accumulation
    const initialPattern = this.substrate.getFieldPattern(numbers[0]);
    const finalPattern = this.substrate.getFieldPattern(accumulator);
    const totalArtifacts = steps.reduce((sum, step) => sum + step.artifacts.length, 0);

    return {
      operation: 'multiplication-chain',
      operands: numbers,
      finalResult: accumulator,
      steps,
      fieldEvolution: {
        initial: initialPattern,
        final: finalPattern,
        totalTransitions: this.countComplexTransitions(steps),
      },
      totalArtifacts,
      totalComplexity: steps.reduce((sum, step) => sum + step.entanglementComplexity, 0),
    };
  }

  /**
   * Count complex field transitions in a multiplication chain
   */
  private countComplexTransitions(steps: MultiplicationResult[]): number {
    return steps.reduce((total, step) => {
      return (
        total +
        step.fieldAnalysis.fieldTransitions.filter(
          (t) => 'carry' in t && (t as unknown as FieldEntanglementTransition).type !== 'simple',
        ).length
      );
    }, 0);
  }
}

/**
 * Extended arithmetic result for multiplication
 */
export interface MultiplicationResult extends ArithmeticResult {
  carryOperator: FieldPattern;
  artifacts: DenormalizationArtifact[];
  entanglementComplexity: number;
}

/**
 * Field entanglement transition
 */
export interface FieldEntanglementTransition {
  field: number;
  beforeA: boolean;
  beforeB: boolean;
  after: boolean;
  type: 'simple' | 'vanishing' | 'emergent' | 'interference';
  carry: boolean;
}

/**
 * Entanglement analysis result
 */
export interface EntanglementAnalysis {
  transitions: FieldEntanglementTransition[];
  complexity: number;
}

/**
 * Modular multiplication result
 */
export interface ModularMultiplicationResult
  extends MultiplicationResult,
    ModularArithmeticResult {}

/**
 * Power operation result
 */
export interface PowerResult {
  operation: string;
  base: bigint;
  exponent: bigint;
  result: bigint;
  steps: MultiplicationResult[];
  fieldCascade: FieldPattern[];
}

/**
 * Factorization result
 */
export interface FactorizationResult {
  operation: string;
  number: bigint;
  factors: bigint[];
  isPrime: boolean;
  decompositionSteps: DecompositionStep[];
  fieldEvolution?: {
    initial: FieldPattern;
    initialResonance: number;
    finalFactorPatterns: FieldPattern[];
  };
}

/**
 * Decomposition step during factorization
 */
export interface DecompositionStep {
  divisor: bigint;
  quotient: bigint;
  remainderBefore: bigint;
  fieldReconstruction: FieldReconstruction;
}

/**
 * Field reconstruction analysis
 */
export interface FieldReconstruction {
  originalFields: FieldPattern;
  divisorFields: FieldPattern;
  quotientFields: FieldPattern;
  reconstructedArtifacts: DenormalizationArtifact[];
  fieldsRestored: number[];
  fieldsRemoved: number[];
}

/**
 * Chained multiplication result
 */
export interface ChainedMultiplicationResult extends ChainedOperationResult {
  totalArtifacts: number;
  totalComplexity: number;
}
