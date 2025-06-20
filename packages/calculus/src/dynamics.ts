/**
 * Dynamics, Differential Equations, and Chaos
 *
 * Implements the laws of motion for field evolution,
 * stability analysis, and chaos detection.
 */

import type { DifferentialState, ChaosMetrics } from './index';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { GeometricManifolds } from '@uor-foundation/geometry';

/**
 * The Master Equation for field evolution
 * d(fields)/dn = F(fields, n)
 *
 * F encodes how fields change with position
 */
export function fieldEvolutionEquation(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  state: DifferentialState,
): boolean[] {
  const currentPattern = state.fieldPattern;
  const n = state.position;

  // Compute field forces based on resonance gradient
  const gradient = computeResonanceGradient(fieldSubstrate, resonanceDynamics, n);

  // New pattern based on gradient descent
  const newPattern = [...currentPattern];

  for (let i = 0; i < 8; i++) {
    // Flip field if gradient suggests it would decrease resonance distance from 1
    const shouldFlip = gradient[i] * (state.resonance - 1) > 0;
    if (shouldFlip) {
      newPattern[i] = !newPattern[i];
    }
  }

  return newPattern;
}

/**
 * Evolve field pattern through time steps
 */
export function evolveFieldPattern(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  initial: DifferentialState,
  steps: number,
): DifferentialState[] {
  const trajectory: DifferentialState[] = [initial];
  const current = { ...initial };

  for (let step = 0; step < steps; step++) {
    // Update position
    current.position = current.position + 1n;

    // Get natural field pattern at new position
    const naturalPattern = fieldSubstrate.getFieldPattern(current.position);

    // Compute evolved pattern based on dynamics
    const evolvedPattern = fieldEvolutionEquation(fieldSubstrate, resonanceDynamics, current);

    // Mix natural and evolved patterns (coupling strength)
    const couplingStrength = 0.3; // How much the evolution affects the natural pattern
    const mixedPattern = naturalPattern.map((natural: boolean, i: number) => {
      const evolved = evolvedPattern[i];
      return Math.random() < couplingStrength ? evolved : natural;
    });

    // Update state
    current.fieldPattern = mixedPattern;
    current.resonance = resonanceDynamics.calculateResonance(current.position);

    // Compute derivatives
    current.derivatives = computeFieldDerivatives(
      fieldSubstrate,
      resonanceDynamics,
      current.position,
    );

    trajectory.push({ ...current });
  }

  return trajectory;
}

/**
 * Resonance flow equation with gradient descent and noise
 * dResonance/dt = -∇V(Resonance) + noise
 */
export function resonanceFlowEquation(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  n: bigint,
  _noiseLevel: number = 0.01,
): bigint {
  // Compute potential gradient
  const resonanceCurrent = resonanceDynamics.calculateResonance(n);
  const resonanceNext = resonanceDynamics.calculateResonance(n + 1n);
  const resonancePrev = resonanceDynamics.calculateResonance(n - 1n);

  // Choose direction of steepest descent toward resonance = 1
  const targetResonance = 1.0;
  const distNext = Math.abs(resonanceNext - targetResonance);
  const distPrev = Math.abs(resonancePrev - targetResonance);
  const distCurrent = Math.abs(resonanceCurrent - targetResonance);

  // Add noise term
  // const noise = (Math.random() - 0.5) * noiseLevel; // Unused in current implementation

  if (distCurrent <= Math.min(distNext, distPrev)) {
    // Already at local minimum
    return n;
  } else if (distNext < distPrev) {
    // Move forward
    return n + 1n;
  } else {
    // Move backward
    return n - 1n;
  }
}

/**
 * Find equilibrium point starting from given position
 * Follows gradient flow until reaching stable point
 */
export function findEquilibrium(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  start: bigint,
  maxSteps: number = 1000,
): bigint {
  let current = start;
  let previousResonance = resonanceDynamics.calculateResonance(current);

  for (let step = 0; step < maxSteps; step++) {
    const next = resonanceFlowEquation(resonanceDynamics, topology, current, 0); // No noise

    if (next === current) {
      // Reached equilibrium
      return current;
    }

    const nextResonance = resonanceDynamics.calculateResonance(next);

    // Check if we're at a Lagrange point (resonance ≈ 1)
    if (Math.abs(nextResonance - 1.0) < 1e-10) {
      return next;
    }

    // Check for oscillation
    if (step > 0 && Math.abs(nextResonance - previousResonance) < 1e-10) {
      return current; // Reached stable oscillation
    }

    previousResonance = nextResonance;
    current = next;
  }

  // Did not converge
  return current;
}

/**
 * Compute Lyapunov exponent to measure chaos
 * λ = lim[t→∞] (1/t) * ln(|δx(t)|/|δx(0)|)
 *
 * Positive λ indicates chaos, negative indicates stability
 */
export function computeLyapunovExponent(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  n: bigint,
  iterations: number = 1000,
  epsilon: number = 1e-8,
): number {
  // Initial conditions
  let x1 = n;
  let x2 = n;

  // Initial separation
  let separation = epsilon;
  let sumLogSeparation = 0;

  for (let i = 0; i < iterations; i++) {
    // Evolve both trajectories
    x1 = resonanceFlowEquation(resonanceDynamics, topology, x1);

    // For x2, add small perturbation
    const resonance2 = resonanceDynamics.calculateResonance(x2);
    const perturbedN = x2 + (resonance2 > 1 ? 1n : -1n);
    x2 = resonanceFlowEquation(resonanceDynamics, topology, perturbedN);

    // Measure new separation
    const newSeparation = Math.abs(Number(x1 - x2));

    if (newSeparation > 0) {
      sumLogSeparation += Math.log(newSeparation / separation);
      separation = newSeparation;

      // Renormalize if separation gets too large
      if (separation > 1) {
        // const scale = epsilon / separation; // Unused
        separation = epsilon;
        // Adjust x2 to maintain small separation
        x2 = x1 + (x2 > x1 ? 1n : -1n);
      }
    }
  }

  return sumLogSeparation / iterations;
}

/**
 * Detect chaos in field dynamics
 */
export function detectChaos(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  geometry: GeometricManifolds,
  n: bigint,
  windowSize: number = 100,
): ChaosMetrics {
  // Compute Lyapunov exponent
  const lyapunovExponent = computeLyapunovExponent(resonanceDynamics, topology, n, windowSize);

  // Detect bifurcation points in nearby region
  const bifurcationPoints = findBifurcationPoints(
    resonanceDynamics,
    topology,
    n - BigInt(windowSize),
    n + BigInt(windowSize),
  );

  // Classify attractor type
  const attractorType = classifyAttractor(resonanceDynamics, topology, n, windowSize);

  return {
    lyapunovExponent,
    isChaoctic: lyapunovExponent > 0,
    bifurcationPoints,
    attractorType,
  };
}

/**
 * Find bifurcation points where system behavior changes
 */
function findBifurcationPoints(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  start: bigint,
  end: bigint,
): bigint[] {
  const bifurcations: bigint[] = [];
  const stepSize = 1n;

  let previousBehavior = classifyLocalBehavior(resonanceDynamics, topology, start);

  for (let n = start + stepSize; n <= end; n += stepSize) {
    const currentBehavior = classifyLocalBehavior(resonanceDynamics, topology, n);

    if (currentBehavior !== previousBehavior) {
      bifurcations.push(n);
      previousBehavior = currentBehavior;
    }
  }

  return bifurcations;
}

/**
 * Classify local behavior at a point
 */
function classifyLocalBehavior(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  n: bigint,
): 'stable' | 'periodic' | 'chaotic' {
  const trajectory: bigint[] = [n];
  let current = n;

  // Generate short trajectory
  for (let i = 0; i < 20; i++) {
    current = resonanceFlowEquation(resonanceDynamics, topology, current, 0);
    trajectory.push(current);
  }

  // Check for fixed point
  if (trajectory[trajectory.length - 1] === trajectory[trajectory.length - 2]) {
    return 'stable';
  }

  // Check for periodic orbit
  for (let period = 2; period <= 10; period++) {
    let isPeriodic = true;
    for (let i = 0; i < period; i++) {
      if (
        trajectory[trajectory.length - 1 - i] !== trajectory[trajectory.length - 1 - i - period]
      ) {
        isPeriodic = false;
        break;
      }
    }
    if (isPeriodic) {
      return 'periodic';
    }
  }

  return 'chaotic';
}

/**
 * Classify the type of attractor
 */
function classifyAttractor(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  n: bigint,
  iterations: number,
): 'fixed' | 'limit-cycle' | 'strange' | 'none' {
  const trajectory: bigint[] = [];
  let current = n;

  // Generate trajectory
  for (let i = 0; i < iterations; i++) {
    current = resonanceFlowEquation(resonanceDynamics, topology, current);
    trajectory.push(current);
  }

  // Check for fixed point
  const lastFew = trajectory.slice(-10);
  if (lastFew.every((x) => x === lastFew[0])) {
    return 'fixed';
  }

  // Check for limit cycle
  for (let period = 2; period <= 20; period++) {
    let isLimitCycle = true;
    for (let i = 0; i < period && i < 10; i++) {
      if (
        trajectory[trajectory.length - 1 - i] !== trajectory[trajectory.length - 1 - i - period]
      ) {
        isLimitCycle = false;
        break;
      }
    }
    if (isLimitCycle) {
      return 'limit-cycle';
    }
  }

  // Check if trajectory is bounded
  const values = trajectory.map((x) => Number(x));
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max - min > iterations / 2) {
    return 'none'; // Unbounded
  }

  return 'strange'; // Bounded but not periodic
}

/**
 * Helper function to compute resonance gradient
 */
function computeResonanceGradient(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
): number[] {
  const gradient: number[] = [];
  const currentResonance = resonanceDynamics.calculateResonance(n);
  const fieldConstants = fieldSubstrate.getFieldConstants();
  const pattern = fieldSubstrate.getFieldPattern(n);

  for (let i = 0; i < 8; i++) {
    const alpha_i = fieldConstants[i];
    const isActive = pattern[i];

    if (isActive) {
      gradient.push(-currentResonance * (1 - 1 / alpha_i));
    } else {
      gradient.push(currentResonance * (alpha_i - 1));
    }
  }

  return gradient;
}

/**
 * Helper function to compute field derivatives
 */
function computeFieldDerivatives(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
): number[] {
  return computeResonanceGradient(fieldSubstrate, resonanceDynamics, n);
}

/**
 * Check if a position is stable under small perturbations
 */
export function isStable(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  n: bigint,
  perturbationSize: number = 5,
): boolean {
  // Test stability by perturbing in both directions
  const trajectoryLength = 20;

  for (let delta = -perturbationSize; delta <= perturbationSize; delta++) {
    if (delta === 0) continue;

    let current = n + BigInt(delta);
    const startDistance = Math.abs(delta);

    // Evolve and check if it returns close to n
    for (let i = 0; i < trajectoryLength; i++) {
      current = resonanceFlowEquation(resonanceDynamics, topology, current, 0);
    }

    const finalDistance = Math.abs(Number(current - n));

    // If perturbation grew, system is unstable
    if (finalDistance > startDistance * 1.5) {
      return false;
    }
  }

  return true;
}

/**
 * Compute stability radius - how far perturbations can be before instability
 */
export function stabilityRadius(
  resonanceDynamics: ResonanceDynamics,
  topology: PageTopology,
  n: bigint,
  maxRadius: number = 50,
): number {
  for (let radius = 1; radius <= maxRadius; radius++) {
    if (!isStable(resonanceDynamics, topology, n, radius)) {
      return radius - 1;
    }
  }

  return maxRadius;
}
