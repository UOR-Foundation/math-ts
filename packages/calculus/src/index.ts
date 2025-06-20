/**
 * Layer 6: Calculus Engine
 * The universe understanding its own change
 */

// Type imports removed - they are used in engine.ts, not here

/**
 * Result of a limit calculation
 */
export interface LimitResult {
  exists: boolean;
  value?: number;
  convergenceRate?: number;
  error?: string;
}

/**
 * Result of a derivative calculation
 */
export interface DerivativeResult {
  value: number;
  order: number;
  position: bigint;
}

/**
 * Result of an integration
 */
export interface IntegrationResult {
  value: number;
  intervalStart: bigint;
  intervalEnd: bigint;
  method: string;
}

/**
 * Field derivative information
 */
export interface FieldDerivative {
  fieldIndex: number;
  derivative: number;
  isActive: boolean;
}

/**
 * Jacobian matrix for field-operation relationships
 */
export interface JacobianMatrix {
  rows: number; // number of fields (8)
  cols: number; // number of operations
  values: number[][];
}

/**
 * Differential equation state
 */
export interface DifferentialState {
  position: bigint;
  fieldPattern: boolean[];
  resonance: number;
  derivatives: number[];
}

/**
 * Chaos dynamics metrics
 */
export interface ChaosMetrics {
  lyapunovExponent: number;
  isChaoctic: boolean;
  bifurcationPoints: bigint[];
  attractorType: 'fixed' | 'limit-cycle' | 'strange' | 'none';
}

/**
 * Series expansion result
 */
export interface SeriesExpansion {
  center: bigint;
  coefficients: number[];
  radius: number;
  type: 'taylor' | 'fourier' | 'other';
}

/**
 * Calculus Engine Interface
 * Implements discrete calculus on the integer lattice
 */
export interface CalculusEngine {
  // Discrete derivatives
  derivative(f: (n: bigint) => number, n: bigint): number;
  higherDerivative(f: (n: bigint) => number, n: bigint, order: number): number;

  // Field derivatives
  fieldDerivative(n: bigint, fieldIndex: number): FieldDerivative;
  jacobianMatrix(n: bigint): JacobianMatrix;

  // Integration
  integrate(f: (n: bigint) => number, start: bigint, end: bigint): number;
  pathIntegral(path: bigint[], fieldFunction: (n: bigint) => number): number;

  // Limits and convergence
  findLimit(sequence: bigint[]): LimitResult;
  convergenceRate(sequence: bigint[], target?: number): number;

  // Differential equations
  evolveFieldPattern(initial: DifferentialState, steps: number): DifferentialState[];
  findEquilibrium(start: bigint): bigint;

  // Chaos and dynamics
  computeLyapunovExponent(n: bigint, iterations: number): number;
  detectChaos(n: bigint): ChaosMetrics;

  // Series expansions
  taylorExpansion(f: (n: bigint) => number, center: bigint, order: number): SeriesExpansion;
  fourierAnalysis(pattern: number[], period?: number): SeriesExpansion;

  // Stability analysis
  isStable(n: bigint): boolean;
  stabilityRadius(n: bigint): number;
  gradientFlow(start: bigint, steps: number): bigint[];
}

// Re-export all types and implementations
export * from './discrete';
export * from './derivatives';
export * from './integration';
export * from './limits';
export * from './dynamics';
export * from './series';
export * from './engine';
