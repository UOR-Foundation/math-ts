import {
  type FieldSubstrate,
  type FieldPattern,
  FIELD_COUNT,
} from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';

/**
 * Addition as field merger - creates field superposition
 * The fields don't simply combine - they interfere and transform
 */
export class AdditionOperator {
  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {}

  /**
   * Add two numbers - field merger with interference
   */
  add(a: bigint, b: bigint): ArithmeticResult {
    const sum = a + b;

    // Get field patterns
    const patternA = this.substrate.getFieldPattern(a);
    const patternB = this.substrate.getFieldPattern(b);
    const patternSum = this.substrate.getFieldPattern(sum);

    // Calculate resonances
    const resonanceA = this.resonance.calculateResonance(a);
    const resonanceB = this.resonance.calculateResonance(b);
    const resonanceSum = this.resonance.calculateResonance(sum);

    // Get page information
    const locationA = this.topology.locateNumber(a);
    const locationB = this.topology.locateNumber(b);
    const locationSum = this.topology.locateNumber(sum);

    // Analyze field merger
    const fieldMerger = this.analyzeFieldMerger(patternA, patternB, patternSum);

    return {
      operation: 'addition',
      operands: [a, b],
      result: sum,
      fieldAnalysis: {
        operandPatterns: [patternA, patternB],
        resultPattern: patternSum,
        fieldTransitions: fieldMerger,
      },
      resonanceAnalysis: {
        operandResonances: [resonanceA, resonanceB],
        resultResonance: resonanceSum,
        energyRedistribution: resonanceSum - (resonanceA + resonanceB),
      },
      topologicalAnalysis: {
        operandPages: [locationA.page, locationB.page],
        resultPage: locationSum.page,
        crossedBoundary: locationA.page !== locationSum.page || locationB.page !== locationSum.page,
      },
    };
  }

  /**
   * Analyze how fields merge during addition
   */
  private analyzeFieldMerger(
    patternA: FieldPattern,
    patternB: FieldPattern,
    patternSum: FieldPattern,
  ): FieldTransition[] {
    const transitions: FieldTransition[] = [];

    for (let i = 0; i < FIELD_COUNT; i++) {
      const activeInA = patternA[i];
      const activeInB = patternB[i];
      const activeInSum = patternSum[i];

      // Determine transition type
      let transitionType: 'preserved' | 'created' | 'destroyed' | 'transformed';

      if (activeInA && activeInB && activeInSum) {
        transitionType = 'preserved';
      } else if (!activeInA && !activeInB && activeInSum) {
        transitionType = 'created';
      } else if ((activeInA || activeInB) && !activeInSum) {
        transitionType = 'destroyed';
      } else {
        transitionType = 'transformed';
      }

      transitions.push({
        field: i,
        beforeA: activeInA,
        beforeB: activeInB,
        after: activeInSum,
        type: transitionType,
      });
    }

    return transitions;
  }

  /**
   * Perform modular addition
   */
  addModulo(a: bigint, b: bigint, modulus: bigint): ModularArithmeticResult {
    const standardResult = this.add(a, b);
    const modularSum = (a + b) % modulus;

    // Analyze the modular reduction
    const patternModular = this.substrate.getFieldPattern(modularSum);
    const resonanceModular = this.resonance.calculateResonance(modularSum);

    return {
      ...standardResult,
      modulus,
      modularResult: modularSum,
      modularFieldPattern: patternModular,
      modularResonance: resonanceModular,
      reductionOccurred: standardResult.result !== modularSum,
    };
  }

  /**
   * Chain multiple additions and track field evolution
   */
  addChain(numbers: bigint[]): ChainedOperationResult {
    if (numbers.length === 0) {
      throw new Error('Cannot perform chain addition on empty array');
    }

    const steps: ArithmeticResult[] = [];
    let accumulator = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
      const result = this.add(accumulator, numbers[i]);
      steps.push(result);
      accumulator = result.result;
    }

    // Analyze overall field evolution
    const initialPattern = this.substrate.getFieldPattern(numbers[0]);
    const finalPattern = this.substrate.getFieldPattern(accumulator);

    return {
      operation: 'addition-chain',
      operands: numbers,
      finalResult: accumulator,
      steps,
      fieldEvolution: {
        initial: initialPattern,
        final: finalPattern,
        totalTransitions: this.countTransitions(steps),
      },
    };
  }

  /**
   * Count total field transitions in a chain
   */
  private countTransitions(steps: ArithmeticResult[]): number {
    return steps.reduce((total, step) => {
      return (
        total + step.fieldAnalysis.fieldTransitions.filter((t) => t.type !== 'preserved').length
      );
    }, 0);
  }
}

/**
 * Result of an arithmetic operation
 */
export interface ArithmeticResult {
  operation: string;
  operands: bigint[];
  result: bigint;
  fieldAnalysis: {
    operandPatterns: FieldPattern[];
    resultPattern: FieldPattern;
    fieldTransitions: FieldTransition[];
  };
  resonanceAnalysis: {
    operandResonances: number[];
    resultResonance: number;
    energyRedistribution: number;
  };
  topologicalAnalysis: {
    operandPages: number[];
    resultPage: number;
    crossedBoundary: boolean;
  };
}

/**
 * Field transition during operation
 */
export interface FieldTransition {
  field: number;
  beforeA: boolean;
  beforeB: boolean;
  after: boolean;
  type: 'preserved' | 'created' | 'destroyed' | 'transformed';
}

/**
 * Result of modular arithmetic
 */
export interface ModularArithmeticResult extends ArithmeticResult {
  modulus: bigint;
  modularResult: bigint;
  modularFieldPattern: FieldPattern;
  modularResonance: number;
  reductionOccurred: boolean;
}

/**
 * Result of chained operations
 */
export interface ChainedOperationResult {
  operation: string;
  operands: bigint[];
  finalResult: bigint;
  steps: ArithmeticResult[];
  fieldEvolution: {
    initial: FieldPattern;
    final: FieldPattern;
    totalTransitions: number;
  };
}
