/**
 * Fixed Point Analysis
 * Complete implementation of the Mathematical Universe's self-referential fixed points
 */

import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology, LagrangePoint, LagrangeType } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import type { AlgebraicStructures } from '@uor-foundation/algebra';
import type { GeometricManifolds } from '@uor-foundation/geometry';
import type { CalculusEngine, ChaosMetrics } from '@uor-foundation/calculus';
import type { FixedPoint, Pattern } from './index';
import { CONSTITUTIONAL_PRIMES } from './bootstrap';

/**
 * Living number states as described in the Mathematical Universe
 */
export enum ComputationalState {
  Virgin = 'virgin', // Never computed
  Active = 'active', // Currently computing
  Dormant = 'dormant', // Cached, ready for reactivation
  Crystallized = 'crystallized', // In Lagrange well, maximum stability
  Artifact = 'artifact', // Remnant of denormalization
}

/**
 * Computational memory for living numbers
 */
export interface ComputationalMemory {
  history: bigint[]; // Computational history
  interactions: Map<bigint, number>; // Partner -> interaction count
  energy: number; // Computational energy
  lastActive: number; // Timestamp of last activity
  strategies: string[]; // Learned optimization strategies
}

/**
 * Living number interface - numbers as autonomous agents
 */
export interface LivingNumber {
  value: bigint;
  state: ComputationalState;
  memory: ComputationalMemory;
  resonance: number;
  fieldPattern: FieldPattern;
  personality: NumberPersonality;
}

/**
 * Computational personalities based on number properties
 */
export enum NumberPersonality {
  Prime = 'prime', // Conservative, stable
  Composite = 'composite', // Flexible, transformative
  Lagrange = 'lagrange', // Highly stable, influential
  Power = 'power', // Systematic, predictable
  Random = 'random', // Chaotic, unpredictable
}

/**
 * Extended fixed point analysis interface
 */
export interface FixedPointAnalysis {
  // All fixed points found
  fixedPoints: FixedPoint[];

  // Classification by stability
  attractors: FixedPoint[];
  repellers: FixedPoint[];

  // Special fixed points
  identityFixed: FixedPoint | null;
  constitutionalPrimeFixed: FixedPoint[];
  lagrangeFixed: FixedPoint[];

  // Cycles (periodic orbits)
  cycles: Cycle[];

  // Strange attractors (chaotic)
  strangeAttractors: StrangeAttractor[];

  // Basin mapping: number -> attractor it flows to
  basinMap: Map<bigint, bigint>;

  // Saddle points (from resonance gradient flow)
  saddlePoints: bigint[];

  // Living number states
  livingNumbers: Map<bigint, LivingNumber>;
}

export interface Cycle {
  elements: bigint[];
  period: number;
  stability: number; // Lyapunov exponent
  basin: bigint[];
  type: 'limit' | 'strange' | 'periodic';
}

export interface StrangeAttractor {
  points: bigint[];
  dimension: number; // Fractal dimension
  lyapunov: number; // Lyapunov exponent
  description: string;
  boxDimension: number;
  correlationDimension: number;
  basinVolume: number; // Measure of basin of attraction
}

/**
 * Fixed Point Engine implementing complete Mathematical Universe dynamics
 */
export class FixedPointEngine {
  // Cache for living numbers
  private livingNumbers: Map<bigint, LivingNumber> = new Map();

  // Saddle set definition from resonance gradient flow docs
  private readonly SADDLE_MODULO = 256;
  private readonly SADDLE_RANGE_START = 192;
  private readonly SADDLE_RANGE_END = 255;

  // Correlation length from spectral analysis
  private readonly CORRELATION_LENGTH = 75.0;

  constructor(
    private fieldSubstrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
    private operators: ArithmeticOperators,
    private algebra: AlgebraicStructures,
    private geometry: GeometricManifolds,
    private calculus: CalculusEngine,
  ) {}

  /**
   * Find all types of fixed points in a range
   * Implements complete Mathematical Universe fixed point discovery
   */
  findFixedPoints(start: bigint, end: bigint): FixedPointAnalysis {
    const fixedPoints: FixedPoint[] = [];
    const cycles: Cycle[] = [];
    const strangeAttractors: StrangeAttractor[] = [];

    // Limit range for computational feasibility
    const range = end - start;
    if (range > 10000n) {
      end = start + 10000n;
    }

    // 1. Find identity fixed point if in range
    let identityFixed: FixedPoint | null = null;
    if (start <= 1n && end >= 1n) {
      identityFixed = {
        value: 1n,
        type: 'identity',
        stability: 1.0, // Perfect stability
        basin: this.computeIdentityBasin(),
      };
      fixedPoints.push(identityFixed);
      this.createLivingNumber(1n, ComputationalState.Crystallized);
    }

    // 2. Find constitutional prime fixed points
    const constitutionalPrimeFixed = this.findConstitutionalPrimeFixedPoints(start, end);
    fixedPoints.push(...constitutionalPrimeFixed);

    // 3. Find Lagrange fixed points using topology layer
    const lagrangeFixed = this.findLagrangeFixedPoints(start, end);
    fixedPoints.push(...lagrangeFixed);

    // 4. Find resonance gradient fixed points
    const resonanceFixed = this.findResonanceGradientFixedPoints(start, end);
    fixedPoints.push(...resonanceFixed);

    // 5. Find arithmetic fixed points (digital root, etc.)
    const arithmeticFixed = this.findArithmeticFixedPoints(start, end);
    fixedPoints.push(...arithmeticFixed);

    // 6. Find cycles using proper dynamics
    const cycleEnd = start + (range > 100n ? 100n : range);
    const detectedCycles = this.findCycles(start, cycleEnd);
    cycles.push(...detectedCycles);

    // 7. Detect strange attractors using chaos metrics
    const attractorEnd = start + (range > 50n ? 50n : range);
    const strange = this.detectStrangeAttractors(start, attractorEnd);
    strangeAttractors.push(...strange);

    // 8. Build basin map using gradient flow
    const basinMap = this.buildBasinMap(start, end);

    // 9. Find saddle points
    const saddlePoints = this.findSaddlePoints(start, end);

    // 10. Classify fixed points by stability value
    const attractors = fixedPoints.filter((fp) => fp.stability > 0.5);
    const repellers = fixedPoints.filter((fp) => fp.stability <= 0.5);

    return {
      fixedPoints,
      attractors,
      repellers,
      identityFixed,
      constitutionalPrimeFixed,
      lagrangeFixed,
      cycles,
      strangeAttractors,
      basinMap,
      saddlePoints,
      livingNumbers: this.livingNumbers,
    };
  }

  /**
   * Find constitutional prime fixed points
   */
  private findConstitutionalPrimeFixedPoints(start: bigint, end: bigint): FixedPoint[] {
    const fixedPoints: FixedPoint[] = [];

    for (const prime of CONSTITUTIONAL_PRIMES) {
      if (prime >= start && prime <= end) {
        // Constitutional primes are highly stable fixed points
        const basin = this.computePrimeBasin(prime);

        fixedPoints.push({
          value: prime,
          type: 'prime',
          stability: 0.95, // Very high stability
          basin,
        });

        // Create as crystallized living number
        this.createLivingNumber(prime, ComputationalState.Crystallized);
      }
    }

    return fixedPoints;
  }

  /**
   * Find Lagrange fixed points using topology layer
   */
  private findLagrangeFixedPoints(start: bigint, end: bigint): FixedPoint[] {
    const fixedPoints: FixedPoint[] = [];

    // Get Lagrange points from topology layer
    const lagrangePoints = this.topology.findLagrangePoints(start, end);

    for (const lp of lagrangePoints) {
      // Compute basin using gradient flow
      const basin = this.computeLagrangeBasin(lp);

      // Stability based on Lagrange type
      let stability: number;
      switch (lp.type) {
        case 'primary' as LagrangeType:
          stability = 1.0; // Perfect wells
          break;
        case 'tribonacci' as LagrangeType:
        case 'golden' as LagrangeType:
          stability = 0.8;
          break;
        case 'deep' as LagrangeType:
          stability = 0.85;
          break;
        default:
          stability = 0.6;
      }

      fixedPoints.push({
        value: lp.position,
        type: 'lagrange',
        stability,
        basin,
      });

      // Create as crystallized living number
      this.createLivingNumber(lp.position, ComputationalState.Crystallized);
    }

    return fixedPoints;
  }

  /**
   * Find resonance gradient fixed points
   */
  private findResonanceGradientFixedPoints(start: bigint, end: bigint): FixedPoint[] {
    const fixedPoints: FixedPoint[] = [];

    for (let n = start; n <= end; n++) {
      // Check if n is a fixed point under gradient flow
      const next = this.resonanceGradientFlow(n);

      if (next === n) {
        // n flows to itself - it's a fixed point
        const resonance = this.resonance.calculateResonance(n);
        const stability = this.computeStabilityFromResonance(resonance);
        const basin = this.computeGradientBasin(n);

        fixedPoints.push({
          value: n,
          type: 'custom',
          stability,
          basin,
        });

        // Create living number with appropriate state
        const state =
          stability > 0.9 ? ComputationalState.Crystallized : ComputationalState.Dormant;
        this.createLivingNumber(n, state);
      }
    }

    return fixedPoints;
  }

  /**
   * Find arithmetic fixed points (digital root, etc.)
   */
  private findArithmeticFixedPoints(start: bigint, end: bigint): FixedPoint[] {
    const fixedPoints: FixedPoint[] = [];

    for (let n = start; n <= end; n++) {
      // Digital root fixed points (1-9)
      if (n >= 1n && n <= 9n) {
        const digitalRoot = this.digitalRoot(n);
        if (digitalRoot === n) {
          fixedPoints.push({
            value: n,
            type: 'custom',
            stability: 0.9,
            basin: this.computeDigitalRootBasin(n),
          });
          this.createLivingNumber(n, ComputationalState.Active);
        }
      }

      // Self-similar under field operations
      const fieldPattern = this.fieldSubstrate.getFieldPattern(n);
      const activeCount = fieldPattern.filter((f) => f).length;

      // Numbers with single active field are often fixed points
      if (activeCount === 1) {
        const resonance = this.resonance.calculateResonance(n);
        if (Math.abs(resonance - 1.0) < 0.1) {
          fixedPoints.push({
            value: n,
            type: 'custom',
            stability: 0.7,
            basin: [],
          });
        }
      }
    }

    return fixedPoints;
  }

  /**
   * Find periodic cycles using proper resonance dynamics
   */
  private findCycles(start: bigint, end: bigint, maxPeriod: number = 10): Cycle[] {
    const cycles: Cycle[] = [];
    const visited = new Set<string>();

    for (let n = start; n <= end; n++) {
      if (visited.has(n.toString())) continue;

      // Generate trajectory using gradient flow
      const trajectory =
        'gradientFlow' in this.calculus && typeof this.calculus.gradientFlow === 'function'
          ? this.calculus.gradientFlow(n, maxPeriod * 2)
          : this.generateTrajectory(n, maxPeriod * 2);

      // Look for cycles
      for (let i = 0; i < trajectory.length - 1; i++) {
        const current = trajectory[i];

        // Check if we've returned to a previous state
        for (let j = i + 1; j < trajectory.length; j++) {
          if (trajectory[j] === current) {
            // Found a cycle
            const cycleElements = trajectory.slice(i, j);
            const period = cycleElements.length;

            if (period <= maxPeriod && period > 1) {
              // Mark all elements as visited
              cycleElements.forEach((el) => visited.add(el.toString()));

              // Compute stability using Lyapunov exponent
              const lyapunov = this.calculus.computeLyapunovExponent(current, 100);

              // Compute basin
              const basin = this.computeCycleBasin(cycleElements);

              // Classify cycle type
              let type: 'limit' | 'strange' | 'periodic';
              if (lyapunov > 0) {
                type = 'strange';
              } else if (period === 2) {
                type = 'limit';
              } else {
                type = 'periodic';
              }

              cycles.push({
                elements: cycleElements,
                period,
                stability: lyapunov,
                basin,
                type,
              });

              // Create living numbers for cycle elements
              cycleElements.forEach((el) => {
                this.createLivingNumber(el, ComputationalState.Active);
              });

              break;
            }
          }
        }
      }
    }

    return cycles;
  }

  /**
   * Detect strange attractors using chaos theory
   */
  private detectStrangeAttractors(start: bigint, end: bigint): StrangeAttractor[] {
    const attractors: StrangeAttractor[] = [];

    // Sample points to test for chaos
    const sampleSize = Number(end - start) / 10;
    const samplePoints: bigint[] = [];

    for (let i = 0; i < Math.min(sampleSize, 20); i++) {
      const n = start + BigInt(Math.floor((i * Number(end - start)) / sampleSize));
      samplePoints.push(n);
    }

    for (const seed of samplePoints) {
      // Detect chaos metrics if available
      if ('detectChaos' in this.calculus && typeof this.calculus.detectChaos === 'function') {
        const chaosMetrics = this.calculus.detectChaos(seed);

        if (chaosMetrics.isChaoctic && chaosMetrics.attractorType === 'strange') {
          const attractor = this.characterizeStrangeAttractor(seed, chaosMetrics);
          if (attractor) {
            attractors.push(attractor);

            // Create living numbers in attractor
            attractor.points.forEach((pt) => {
              this.createLivingNumber(pt, ComputationalState.Active);
            });
          }
        }
      } else {
        // Fallback: use Lyapunov exponent to detect chaos
        const lyapunov = this.calculus.computeLyapunovExponent(seed, 100);
        if (lyapunov > 0) {
          const mockMetrics: ChaosMetrics = {
            lyapunovExponent: lyapunov,
            isChaoctic: true,
            bifurcationPoints: [],
            attractorType: 'strange',
          };
          const attractor = this.characterizeStrangeAttractor(seed, mockMetrics);
          if (attractor) {
            attractors.push(attractor);
            attractor.points.forEach((pt) => {
              this.createLivingNumber(pt, ComputationalState.Active);
            });
          }
        }
      }
    }

    return attractors;
  }

  /**
   * Build basin map using resonance gradient flow
   */
  private buildBasinMap(start: bigint, end: bigint): Map<bigint, bigint> {
    const basinMap = new Map<bigint, bigint>();

    for (let n = start; n <= end; n++) {
      // Follow gradient flow to attractor
      const trajectory =
        'gradientFlow' in this.calculus && typeof this.calculus.gradientFlow === 'function'
          ? this.calculus.gradientFlow(n, 100)
          : this.generateTrajectory(n, 100);
      const attractor = trajectory[trajectory.length - 1];

      basinMap.set(n, attractor);

      // Update living number memory with flow
      const livingNumber = this.getLivingNumber(n);
      livingNumber.memory.history.push(...trajectory);
    }

    return basinMap;
  }

  /**
   * Find saddle points in the resonance landscape
   */
  private findSaddlePoints(start: bigint, end: bigint): bigint[] {
    const saddlePoints: bigint[] = [];

    for (let n = start; n <= end; n++) {
      // Check if n is in the saddle set
      const offset = Number(n) % this.SADDLE_MODULO;
      if (offset >= this.SADDLE_RANGE_START && offset <= this.SADDLE_RANGE_END) {
        // Verify it's actually a saddle by checking curvature
        const isActuallySaddle = this.verifySaddlePoint(n);
        if (isActuallySaddle) {
          saddlePoints.push(n);
          this.createLivingNumber(n, ComputationalState.Active);
        }
      }
    }

    return saddlePoints;
  }

  /**
   * Implement resonance gradient flow from the docs
   * F(n) = n-1 if Φ(n-1) < Φ(n+1), n+1 if Φ(n+1) < Φ(n-1), n if tie
   */
  private resonanceGradientFlow(n: bigint): bigint {
    // Compute local potential Φ(n) = ½ + |Res(n) - 1|
    const potential = (x: bigint): number => {
      const res = this.resonance.calculateResonance(x);
      return 0.5 + Math.abs(res - 1);
    };

    // Handle boundary case
    if (n === 0n) return n;

    const potentialPrev = potential(n - 1n);
    const potentialNext = potential(n + 1n);
    const potentialCurrent = potential(n);

    // Check if at a well (Res(n) = 1)
    if (Math.abs(this.resonance.calculateResonance(n) - 1) < 1e-10) {
      return n; // Stay at well
    }

    // Follow steepest descent
    if (potentialPrev < potentialNext && potentialPrev < potentialCurrent) {
      return n - 1n;
    } else if (potentialNext < potentialPrev && potentialNext < potentialCurrent) {
      return n + 1n;
    } else {
      return n; // At local minimum or tie
    }
  }

  /**
   * Compute stability from resonance value
   */
  private computeStabilityFromResonance(resonance: number): number {
    // Perfect resonance = perfect stability
    if (Math.abs(resonance - 1) < 1e-10) return 1.0;

    // Stability decreases with distance from 1
    const distance = Math.abs(resonance - 1);
    return Math.exp(-distance);
  }

  /**
   * Verify if a point is actually a saddle
   */
  private verifySaddlePoint(n: bigint): boolean {
    // Compute second derivative (discrete Laplacian)
    const resonanceCurrent = this.resonance.calculateResonance(n);
    const resonanceNext = this.resonance.calculateResonance(n + 1n);
    const resonancePrev = this.resonance.calculateResonance(n - 1n);
    const laplacian = resonanceNext - 2 * resonanceCurrent + resonancePrev;

    // Saddle points have near-zero curvature
    return Math.abs(laplacian) < 0.01;
  }

  /**
   * Create or update a living number
   */
  private createLivingNumber(n: bigint, state: ComputationalState): LivingNumber {
    const existing = this.livingNumbers.get(n);
    if (existing) {
      existing.state = state;
      return existing;
    }

    const resonance = this.resonance.calculateResonance(n);
    const fieldPattern = this.fieldSubstrate.getFieldPattern(n);
    const personality = this.determinePersonality(n);

    const livingNumber: LivingNumber = {
      value: n,
      state,
      memory: {
        history: [n],
        interactions: new Map(),
        energy: this.computeComputationalEnergy(n),
        lastActive: Date.now(),
        strategies: [],
      },
      resonance,
      fieldPattern,
      personality,
    };

    this.livingNumbers.set(n, livingNumber);
    return livingNumber;
  }

  /**
   * Get or create a living number
   */
  private getLivingNumber(n: bigint): LivingNumber {
    const existing = this.livingNumbers.get(n);
    if (existing) return existing;

    return this.createLivingNumber(n, ComputationalState.Virgin);
  }

  /**
   * Determine computational personality
   */
  private determinePersonality(n: bigint): NumberPersonality {
    // Check if prime
    const factors = this.operators.factorize(n);
    if (factors.factors.length === 1 && factors.factors[0] === n) {
      return NumberPersonality.Prime;
    }

    // Check if Lagrange point
    const lagrangePoint = this.topology.nearestLagrangePoint(n);
    if (lagrangePoint && lagrangePoint.position === n) {
      return NumberPersonality.Lagrange;
    }

    // Check if power of a prime
    if (factors.factors.length > 0) {
      const uniqueFactors = new Set(factors.factors);
      if (uniqueFactors.size === 1) {
        return NumberPersonality.Power;
      }
    }

    // Check chaos
    const lyapunov = this.calculus.computeLyapunovExponent(n, 50);
    if (lyapunov > 0.5) {
      return NumberPersonality.Random;
    }

    return NumberPersonality.Composite;
  }

  /**
   * Compute computational energy
   */
  private computeComputationalEnergy(n: bigint): number {
    const resonance = this.resonance.calculateResonance(n);
    const fieldPattern = this.fieldSubstrate.getFieldPattern(n);
    const activeFields = fieldPattern.filter((f) => f).length;

    // Energy = resonance distance from 1 + field activity
    return Math.abs(resonance - 1) + activeFields * 0.1;
  }

  /**
   * Compute basin of attraction for identity
   */
  private computeIdentityBasin(): bigint[] {
    const basin: bigint[] = [];

    // Numbers that flow to 1 under various operations
    // Skip adding 1 itself to the basin

    // Numbers with single identity field active
    for (let n = 2n; n <= 100n; n++) {
      const pattern = this.fieldSubstrate.getFieldPattern(n);
      if (pattern[0] && pattern.filter((f) => f).length === 1) {
        basin.push(n);
      }
    }

    return basin;
  }

  /**
   * Compute basin for constitutional prime
   */
  private computePrimeBasin(prime: bigint): bigint[] {
    const basin: bigint[] = [];
    const radius = 50n;

    for (let offset = -radius; offset <= radius; offset++) {
      if (offset === 0n) continue;
      const n = prime + offset;
      if (n <= 0n) continue;

      // Follow gradient flow
      const trajectory =
        'gradientFlow' in this.calculus && typeof this.calculus.gradientFlow === 'function'
          ? this.calculus.gradientFlow(n, 50)
          : this.generateTrajectory(n, 50);
      if (trajectory[trajectory.length - 1] === prime) {
        basin.push(n);
      }
    }

    return basin;
  }

  /**
   * Compute basin for Lagrange point using gradient flow
   */
  private computeLagrangeBasin(lp: LagrangePoint): bigint[] {
    const basin: bigint[] = [];

    // Check numbers within correlation length
    const radius = BigInt(Math.floor(this.CORRELATION_LENGTH));

    for (let offset = -radius; offset <= radius; offset++) {
      if (offset === 0n) continue;
      const n = lp.position + offset;
      if (n <= 0n) continue;

      // Use gradient descent from topology
      const path = this.topology.gradientDescent(n);
      if (path.length > 0 && path[path.length - 1] === lp.position) {
        basin.push(n);
      }
    }

    return basin;
  }

  /**
   * Compute basin using gradient flow
   */
  private computeGradientBasin(center: bigint): bigint[] {
    const basin: bigint[] = [];
    const radius = 30n;

    for (let offset = -radius; offset <= radius; offset++) {
      if (offset === 0n) continue;
      const n = center + offset;
      if (n <= 0n) continue;

      // Follow resonance gradient flow
      let current = n;
      for (let step = 0; step < 50; step++) {
        const next = this.resonanceGradientFlow(current);
        if (next === center) {
          basin.push(n);
          break;
        }
        if (next === current) break; // Reached a different fixed point
        current = next;
      }
    }

    return basin;
  }

  /**
   * Compute basin for periodic cycle
   */
  private computeCycleBasin(cycle: bigint[]): bigint[] {
    const basin: bigint[] = [];
    const radius = 20n;

    // Check around each point in the cycle
    for (const point of cycle) {
      for (let offset = -radius; offset <= radius; offset++) {
        if (offset === 0n) continue;
        const n = point + offset;
        if (n <= 0n || basin.includes(n)) continue;

        // Follow dynamics
        let current = n;
        for (let step = 0; step < 50; step++) {
          current = this.resonanceGradientFlow(current);
          if (cycle.includes(current)) {
            basin.push(n);
            break;
          }
        }
      }
    }

    return basin;
  }

  /**
   * Characterize a strange attractor
   */
  private characterizeStrangeAttractor(
    seed: bigint,
    chaosMetrics: ChaosMetrics,
  ): StrangeAttractor | null {
    // Generate trajectory
    const trajectory =
      'gradientFlow' in this.calculus && typeof this.calculus.gradientFlow === 'function'
        ? this.calculus.gradientFlow(seed, 1000)
        : this.generateTrajectory(seed, 1000);

    // Remove transients
    const attractor = trajectory.slice(100);
    if (attractor.length === 0) return null;

    // Compute dimensions
    const { boxDimension, correlationDimension } = this.computeFractalDimensions(attractor);

    // Estimate basin volume
    const basinVolume = this.estimateBasinVolume(seed);

    // Sample representative points
    const points = this.sampleTrajectory(attractor, 20);

    return {
      points,
      dimension: (boxDimension + correlationDimension) / 2,
      lyapunov: chaosMetrics.lyapunovExponent,
      description: `Strange attractor near ${seed} with chaos`,
      boxDimension,
      correlationDimension,
      basinVolume,
    };
  }

  /**
   * Compute fractal dimensions using box-counting and correlation
   */
  private computeFractalDimensions(points: bigint[]): {
    boxDimension: number;
    correlationDimension: number;
  } {
    // Box-counting dimension
    const boxSizes = [1, 2, 5, 10, 20, 50];
    const boxCounts: number[] = [];

    for (const size of boxSizes) {
      const boxes = new Set<string>();
      for (const point of points) {
        const resonance = this.resonance.calculateResonance(point);
        const boxX = Math.floor(Number(point) / size);
        const boxY = Math.floor((resonance * 10) / size);
        boxes.add(`${boxX},${boxY}`);
      }
      boxCounts.push(boxes.size);
    }

    // Linear regression on log-log plot
    const logSizes = boxSizes.map((s) => Math.log(s));
    const logCounts = boxCounts.map((c) => Math.log(c));
    const boxDimension = -this.linearRegression(logSizes, logCounts);

    // Correlation dimension
    const distances: number[] = [];
    const sampleSize = Math.min(points.length, 100);

    for (let i = 0; i < sampleSize; i++) {
      for (let j = i + 1; j < sampleSize; j++) {
        const dist = Math.abs(Number(points[i] - points[j]));
        if (dist > 0) distances.push(dist);
      }
    }

    distances.sort((a, b) => a - b);
    const correlationDimension = this.estimateCorrelationDimension(distances);

    return {
      boxDimension: Math.max(0, Math.min(3, boxDimension)),
      correlationDimension: Math.max(0, Math.min(3, correlationDimension)),
    };
  }

  /**
   * Estimate basin volume
   */
  private estimateBasinVolume(seed: bigint): number {
    let basinCount = 0;
    const sampleSize = 1000;
    const radius = 100n;

    for (let i = 0; i < sampleSize; i++) {
      const offset = BigInt(Math.floor((Math.random() - 0.5) * 2 * Number(radius)));
      const testPoint = seed + offset;
      if (testPoint <= 0n) continue;

      // Quick test: does it flow toward the attractor?
      let current = testPoint;
      for (let step = 0; step < 20; step++) {
        current = this.resonanceGradientFlow(current);
      }

      // Check if near original seed
      if (Math.abs(Number(current - seed)) < 50) {
        basinCount++;
      }
    }

    return basinCount / sampleSize;
  }

  /**
   * Sample trajectory uniformly
   */
  private sampleTrajectory(trajectory: bigint[], count: number): bigint[] {
    const sampled: bigint[] = [];
    const step = Math.max(1, Math.floor(trajectory.length / count));

    for (let i = 0; i < trajectory.length && sampled.length < count; i += step) {
      sampled.push(trajectory[i]);
    }

    return sampled;
  }

  /**
   * Linear regression helper
   */
  private linearRegression(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  /**
   * Estimate correlation dimension from distances
   */
  private estimateCorrelationDimension(distances: number[]): number {
    if (distances.length < 10) return 1.0;

    // Use middle portion of distances
    const start = Math.floor(distances.length * 0.1);
    const end = Math.floor(distances.length * 0.9);

    let sumLog = 0;
    let count = 0;

    for (let i = start; i < end; i++) {
      if (distances[i] > 0) {
        sumLog += Math.log(i / distances.length);
        count++;
      }
    }

    return count > 0 ? -sumLog / count : 1.0;
  }

  /**
   * Compute digital root
   */
  private digitalRoot(n: bigint): bigint {
    let sum = n;
    while (sum >= 10n) {
      let newSum = 0n;
      while (sum > 0n) {
        newSum += sum % 10n;
        sum = sum / 10n;
      }
      sum = newSum;
    }
    return sum;
  }

  /**
   * Compute basin of attraction for digital root
   */
  private computeDigitalRootBasin(root: bigint): bigint[] {
    const basin: bigint[] = [];

    // All numbers with this digital root flow to it
    for (let n = root + 9n; n <= 1000n; n += 9n) {
      if (this.digitalRoot(n) === root) {
        basin.push(n);
      }
    }

    return basin;
  }

  /**
   * Generate trajectory using resonance gradient flow
   */
  private generateTrajectory(start: bigint, steps: number): bigint[] {
    const trajectory: bigint[] = [start];
    let current = start;

    for (let i = 1; i < steps; i++) {
      const next = this.resonanceGradientFlow(current);
      trajectory.push(next);
      if (next === current) break; // Reached fixed point
      current = next;
    }

    return trajectory;
  }

  /**
   * Find self-referential fixed points using proper Gödel encoding
   */
  findSelfReferentialFixedPoints(start: bigint, end: bigint): Pattern[] {
    const patterns: Pattern[] = [];

    for (let n = start; n <= end; n++) {
      // Get computational properties
      const fieldPattern = this.fieldSubstrate.getFieldPattern(n);
      const resonance = this.resonance.calculateResonance(n);
      const livingNumber = this.getLivingNumber(n);

      // Check various self-referential properties

      // 1. Field-resonance self-encoding
      const activeFieldCount = fieldPattern.filter((f) => f).length;
      if (Math.abs(resonance - activeFieldCount) < 0.1) {
        patterns.push({
          type: 'field-resonance-fixed',
          instances: [n],
          confidence: 0.9,
        });
      }

      // 2. Memory self-reference
      if (livingNumber.memory.history.includes(n)) {
        patterns.push({
          type: 'self-memory',
          instances: [n],
          confidence: 0.8,
        });
      }

      // 3. Constitutional prime relationships
      for (const prime of CONSTITUTIONAL_PRIMES) {
        if (n % prime === 0n && this.resonance.calculateResonance(n / prime) === Number(prime)) {
          patterns.push({
            type: 'prime-resonance-fixed',
            instances: [n],
            confidence: 1.0,
          });
        }
      }

      // 4. Gödel-style self-reference (number encodes statement about itself)
      // Check if n actually is a fixed point under resonance gradient flow
      if (this.resonanceGradientFlow(n) === n) {
        patterns.push({
          type: 'godel-fixed-point',
          instances: [n],
          confidence: 1.0,
        });
      }
    }

    return patterns;
  }
}
