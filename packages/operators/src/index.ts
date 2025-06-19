import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';

// Import operators
import { AdditionOperator } from './addition';
import { MultiplicationOperator, type FactorizationResult } from './multiplication';
import { DenormalizationEngine } from './denormalization';

// Export all types
export * from './carry';
export * from './denormalization';
export * from './addition';
export * from './multiplication';

/**
 * Main arithmetic operators interface - operations as chemical reactions
 * This implements Layer 3 of the Mathematical Universe
 */
export class ArithmeticOperators {
  private addition: AdditionOperator;
  private multiplication: MultiplicationOperator;
  private denormalization: DenormalizationEngine;

  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {
    this.addition = new AdditionOperator(substrate, resonance, topology);
    this.multiplication = new MultiplicationOperator(substrate, resonance, topology);
    this.denormalization = new DenormalizationEngine(substrate, resonance);
  }

  /**
   * Addition as field merger
   */
  add(a: bigint, b: bigint): ReturnType<AdditionOperator['add']> {
    return this.addition.add(a, b);
  }

  /**
   * Addition with modular reduction
   */
  addModulo(a: bigint, b: bigint, modulus: bigint): ReturnType<AdditionOperator['addModulo']> {
    return this.addition.addModulo(a, b, modulus);
  }

  /**
   * Chain addition operations
   */
  addChain(numbers: bigint[]): ReturnType<AdditionOperator['addChain']> {
    return this.addition.addChain(numbers);
  }

  /**
   * Multiplication as field entanglement
   */
  multiply(a: bigint, b: bigint): ReturnType<MultiplicationOperator['multiply']> {
    return this.multiplication.multiply(a, b);
  }

  /**
   * Multiplication with modular reduction
   */
  multiplyModulo(
    a: bigint,
    b: bigint,
    modulus: bigint,
  ): ReturnType<MultiplicationOperator['multiplyModulo']> {
    return this.multiplication.multiplyModulo(a, b, modulus);
  }

  /**
   * Chain multiplication operations
   */
  multiplyChain(numbers: bigint[]): ReturnType<MultiplicationOperator['multiplyChain']> {
    return this.multiplication.multiplyChain(numbers);
  }

  /**
   * Exponentiation through recursive compilation
   */
  power(base: bigint, exponent: bigint): ReturnType<MultiplicationOperator['power']> {
    return this.multiplication.power(base, exponent);
  }

  /**
   * Factorization as molecular decomposition
   */
  factorize(n: bigint): FactorizationResult {
    return this.multiplication.factorize(n);
  }

  /**
   * Subtraction (addition with negation)
   */
  subtract(a: bigint, b: bigint): ReturnType<AdditionOperator['add']> {
    return this.addition.add(a, -b);
  }

  /**
   * Division as inverse compilation
   */
  divide(a: bigint, b: bigint): DivisionResult {
    if (b === 0n) {
      throw new Error('Division by zero');
    }

    const quotient = a / b;
    const remainder = a % b;

    // Analyze the decompilation process
    const multiplicationCheck = this.multiplication.multiply(quotient, b);
    const reconstructionWithRemainder = this.addition.add(multiplicationCheck.result, remainder);

    return {
      operation: 'division',
      dividend: a,
      divisor: b,
      quotient,
      remainder,
      exact: remainder === 0n,
      decompilationArtifacts: multiplicationCheck.artifacts,
      fieldReconstruction: {
        quotientPattern: this.substrate.getFieldPattern(quotient),
        remainderPattern: this.substrate.getFieldPattern(remainder),
        reconstructsOriginal: reconstructionWithRemainder.result === a,
      },
    };
  }

  /**
   * Modulo operation
   */
  modulo(a: bigint, b: bigint): bigint {
    if (b === 0n) {
      throw new Error('Modulo by zero');
    }
    return ((a % b) + b) % b; // Ensure positive result
  }

  /**
   * Greatest Common Divisor - finding common field sources
   */
  gcd(a: bigint, b: bigint): GCDResult {
    const absA = a < 0n ? -a : a;
    const absB = b < 0n ? -b : b;

    let x = absA;
    let y = absB;
    const steps: GCDStep[] = [];

    while (y !== 0n) {
      const remainder = x % y;
      steps.push({
        x,
        y,
        quotient: x / y,
        remainder,
        xPattern: this.substrate.getFieldPattern(x),
        yPattern: this.substrate.getFieldPattern(y),
      });
      x = y;
      y = remainder;
    }

    return {
      a: absA,
      b: absB,
      gcd: x,
      steps,
      commonFieldSources: this.findCommonFieldSources(absA, absB, x),
    };
  }

  /**
   * Least Common Multiple - finding first resonance harmony
   */
  lcm(a: bigint, b: bigint): LCMResult {
    const absA = a < 0n ? -a : a;
    const absB = b < 0n ? -b : b;

    if (absA === 0n || absB === 0n) {
      return {
        a: absA,
        b: absB,
        lcm: 0n,
        gcdUsed: 0n,
        resonanceHarmony: 0,
      };
    }

    const gcdResult = this.gcd(absA, absB);
    const lcm = (absA * absB) / gcdResult.gcd;

    return {
      a: absA,
      b: absB,
      lcm,
      gcdUsed: gcdResult.gcd,
      resonanceHarmony: this.resonance.calculateResonance(lcm),
    };
  }

  /**
   * Track denormalization artifacts
   */
  trackArtifacts(a: bigint, b: bigint): ReturnType<DenormalizationEngine['trackMultiplication']> {
    return this.denormalization.trackMultiplication(a, b);
  }

  /**
   * Predict artifacts without computing
   */
  predictArtifacts(a: bigint, b: bigint): ReturnType<DenormalizationEngine['predictArtifacts']> {
    return this.denormalization.predictArtifacts(a, b);
  }

  /**
   * Find common field sources for GCD
   */
  private findCommonFieldSources(a: bigint, b: bigint, gcd: bigint): number[] {
    const patternA = this.substrate.getFieldPattern(a);
    const patternB = this.substrate.getFieldPattern(b);
    const patternGCD = this.substrate.getFieldPattern(gcd);

    const commonSources: number[] = [];
    for (let i = 0; i < patternGCD.length; i++) {
      if (patternGCD[i] && patternA[i] && patternB[i]) {
        commonSources.push(i);
      }
    }

    return commonSources;
  }
}

/**
 * Result of division operation
 */
export interface DivisionResult {
  operation: string;
  dividend: bigint;
  divisor: bigint;
  quotient: bigint;
  remainder: bigint;
  exact: boolean;
  decompilationArtifacts: DenormalizationArtifact[];
  fieldReconstruction: {
    quotientPattern: FieldPattern;
    remainderPattern: FieldPattern;
    reconstructsOriginal: boolean;
  };
}

/**
 * GCD computation result
 */
export interface GCDResult {
  a: bigint;
  b: bigint;
  gcd: bigint;
  steps: GCDStep[];
  commonFieldSources: number[];
}

/**
 * Step in GCD algorithm
 */
export interface GCDStep {
  x: bigint;
  y: bigint;
  quotient: bigint;
  remainder: bigint;
  xPattern: FieldPattern;
  yPattern: FieldPattern;
}

/**
 * LCM computation result
 */
export interface LCMResult {
  a: bigint;
  b: bigint;
  lcm: bigint;
  gcdUsed: bigint;
  resonanceHarmony: number;
}

// For convenience, export and re-import types
export type { FieldPattern } from '@uor-foundation/field-substrate';
export type { DenormalizationArtifact } from './carry';
import type { FieldPattern } from '@uor-foundation/field-substrate';
import type { DenormalizationArtifact } from './carry';

/**
 * Create arithmetic operators instance
 * @param substrate - Field substrate interface
 * @param resonance - Resonance dynamics interface
 * @param topology - Page topology interface
 * @returns Arithmetic operators implementation
 */
export function createArithmeticOperators(
  substrate: FieldSubstrate,
  resonance: ResonanceDynamics,
  topology: PageTopology,
): ArithmeticOperators {
  return new ArithmeticOperators(substrate, resonance, topology);
}
