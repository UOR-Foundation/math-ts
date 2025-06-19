import type { FieldSubstrate, FieldIndex } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';

/**
 * Types of Lagrange points based on their properties.
 */
export enum LagrangeType {
  /** Perfect resonance = 1.0 */
  PRIMARY = 'primary',
  /** Tribonacci-dominant */
  TRIBONACCI = 'tribonacci',
  /** Golden ratio-dominant */
  GOLDEN = 'golden',
  /** Zeta-active (deep structure) */
  DEEP = 'deep',
  /** Other significant points */
  SECONDARY = 'secondary',
}

/**
 * A Lagrange point in the number topology.
 */
export interface LagrangePoint {
  position: bigint;
  resonance: number;
  type: LagrangeType;
  activeFields: number[];
  description: string;
}

/**
 * Known primary Lagrange points (perfect resonance = 1.0).
 * These repeat every 256 numbers due to field cycling.
 */
export const PRIMARY_LAGRANGE_POINTS: readonly number[] = Object.freeze([
  0, // L0: The void
  1, // L1: Unity
  48, // L48: Fields 4,5 active
  49, // L49: Fields 0,4,5 active
]);

/**
 * Check if a number is a primary Lagrange point.
 *
 * @param n - The number to check
 * @param dynamics - Resonance dynamics interface
 * @returns True if resonance is exactly 1.0
 */
export function isPrimaryLagrangePoint(n: bigint, dynamics: ResonanceDynamics): boolean {
  const resonance = dynamics.calculateResonance(n);
  return Math.abs(resonance - 1.0) < 1e-15;
}

/**
 * Detect the type of Lagrange point.
 *
 * @param n - The number to analyze
 * @param substrate - Field substrate interface
 * @param dynamics - Resonance dynamics interface
 * @returns Lagrange type or null if not a significant point
 */
export function detectLagrangeType(
  n: bigint,
  substrate: FieldSubstrate,
  dynamics: ResonanceDynamics,
): LagrangeType | null {
  const resonance = dynamics.calculateResonance(n);
  const pattern = substrate.getFieldPattern(n);

  // Check for primary (perfect resonance)
  if (Math.abs(resonance - 1.0) < 1e-15) {
    return LagrangeType.PRIMARY;
  }

  // Check for Tribonacci dominance (field 1 active)
  if (pattern[1] && !pattern[2] && resonance > 1.5) {
    return LagrangeType.TRIBONACCI;
  }

  // Check for Golden dominance (field 2 active)
  if (pattern[2] && !pattern[1] && resonance > 1.4) {
    return LagrangeType.GOLDEN;
  }

  // Check for Deep wells (field 7 active - Zeta)
  if (pattern[7]) {
    return LagrangeType.DEEP;
  }

  // Check for other significant resonance wells
  const resonanceWells = [0.5, 1.618033989, Math.PI, 2 * Math.PI];
  for (const well of resonanceWells) {
    if (Math.abs(resonance - well) < 0.01) {
      return LagrangeType.SECONDARY;
    }
  }

  return null;
}

/**
 * Find all Lagrange points in a range.
 *
 * @param start - Start of range (inclusive)
 * @param end - End of range (inclusive)
 * @param substrate - Field substrate interface
 * @param dynamics - Resonance dynamics interface
 * @returns Array of Lagrange points found
 */
export function findLagrangePoints(
  start: bigint,
  end: bigint,
  substrate: FieldSubstrate,
  dynamics: ResonanceDynamics,
): LagrangePoint[] {
  const points: LagrangePoint[] = [];

  for (let n = start; n <= end; n++) {
    const type = detectLagrangeType(n, substrate, dynamics);
    if (type !== null) {
      const resonance = dynamics.calculateResonance(n);
      const activeFields = substrate.getActiveFieldIndices(n);

      points.push({
        position: n,
        resonance,
        type,
        activeFields,
        description: describeLagrangePoint(n, type, activeFields, substrate),
      });
    }
  }

  return points;
}

/**
 * Create a description for a Lagrange point.
 */
function describeLagrangePoint(
  position: bigint,
  type: LagrangeType,
  activeFields: number[],
  substrate: FieldSubstrate,
): string {
  const fieldNames = activeFields.map((i) => substrate.getFieldName(i as FieldIndex)).join(',');

  switch (type) {
    case LagrangeType.PRIMARY:
      if (position === 0n) return 'L0: The void - empty field state';
      if (position === 1n) return 'L1: Unity - pure identity field';
      if (Number(position) % 256 === 48) return `L48: Perfect resonance - fields ${fieldNames}`;
      if (Number(position) % 256 === 49) return `L49: Perfect resonance - fields ${fieldNames}`;
      return `Primary Lagrange point - fields ${fieldNames}`;

    case LagrangeType.TRIBONACCI:
      return `Tribonacci well - recursive patterns, fields ${fieldNames}`;

    case LagrangeType.GOLDEN:
      return `Golden well - harmonic proportions, fields ${fieldNames}`;

    case LagrangeType.DEEP:
      return `Deep well - Zeta structure, fields ${fieldNames}`;

    case LagrangeType.SECONDARY:
      return `Secondary resonance well - fields ${fieldNames}`;
  }
}

/**
 * Find the nearest Lagrange point to a given position.
 *
 * @param n - Current position
 * @param substrate - Field substrate interface
 * @param dynamics - Resonance dynamics interface
 * @param searchRadius - How far to search (default 100)
 * @returns Nearest Lagrange point or null
 */
export function nearestLagrangePoint(
  n: bigint,
  substrate: FieldSubstrate,
  dynamics: ResonanceDynamics,
  searchRadius: number = 100,
): LagrangePoint | null {
  // Check if we're already at a Lagrange point
  const currentType = detectLagrangeType(n, substrate, dynamics);
  if (currentType !== null) {
    return {
      position: n,
      resonance: dynamics.calculateResonance(n),
      type: currentType,
      activeFields: substrate.getActiveFieldIndices(n),
      description: describeLagrangePoint(
        n,
        currentType,
        substrate.getActiveFieldIndices(n),
        substrate,
      ),
    };
  }

  // Search outward
  for (let distance = 1; distance <= searchRadius; distance++) {
    // Check forward
    const forward = n + BigInt(distance);
    const forwardType = detectLagrangeType(forward, substrate, dynamics);
    if (forwardType !== null) {
      return {
        position: forward,
        resonance: dynamics.calculateResonance(forward),
        type: forwardType,
        activeFields: substrate.getActiveFieldIndices(forward),
        description: describeLagrangePoint(
          forward,
          forwardType,
          substrate.getActiveFieldIndices(forward),
          substrate,
        ),
      };
    }

    // Check backward (if not negative)
    if (n >= BigInt(distance)) {
      const backward = n - BigInt(distance);
      const backwardType = detectLagrangeType(backward, substrate, dynamics);
      if (backwardType !== null) {
        return {
          position: backward,
          resonance: dynamics.calculateResonance(backward),
          type: backwardType,
          activeFields: substrate.getActiveFieldIndices(backward),
          description: describeLagrangePoint(
            backward,
            backwardType,
            substrate.getActiveFieldIndices(backward),
            substrate,
          ),
        };
      }
    }
  }

  return null;
}

/**
 * Calculate the "gravity" or attraction strength of a Lagrange point.
 * Stronger points have deeper wells and affect computation more.
 *
 * @param point - The Lagrange point
 * @param fromPosition - Position to calculate gravity from
 * @returns Gravity strength (0-1, higher = stronger attraction)
 */
export function lagrangeGravity(point: LagrangePoint, fromPosition: bigint): number {
  const distance = Math.abs(Number(fromPosition - point.position));
  if (distance === 0) return 1.0;

  // Base gravity depends on type
  let baseGravity: number;
  switch (point.type) {
    case LagrangeType.PRIMARY:
      baseGravity = 1.0;
      break;
    case LagrangeType.TRIBONACCI:
    case LagrangeType.GOLDEN:
      baseGravity = 0.7;
      break;
    case LagrangeType.DEEP:
      baseGravity = 0.8;
      break;
    case LagrangeType.SECONDARY:
      baseGravity = 0.5;
      break;
  }

  // Gravity falls off with distance
  return baseGravity / (1 + distance * 0.1);
}

/**
 * Find the path of steepest descent toward the nearest Lagrange point.
 * This follows the resonance gradient.
 *
 * @param start - Starting position
 * @param substrate - Field substrate interface
 * @param dynamics - Resonance dynamics interface
 * @param maxSteps - Maximum steps to take
 * @returns Path to Lagrange point
 */
export function gradientDescentToLagrange(
  start: bigint,
  substrate: FieldSubstrate,
  dynamics: ResonanceDynamics,
  maxSteps: number = 50,
): bigint[] {
  const path: bigint[] = [start];
  let current = start;

  // Check if we're already at a Lagrange point
  if (detectLagrangeType(current, substrate, dynamics) !== null) {
    return path;
  }

  // Find nearest known primary Lagrange point as target
  const num = Number(current);
  const knownPoints = [0, 1, 48, 49, 96, 97];
  let nearestPoint = knownPoints[0];
  let minDistance = Math.abs(num - nearestPoint);

  for (const point of knownPoints) {
    const distance = Math.abs(num - point);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = point;
    }
  }

  // Move toward the nearest known Lagrange point
  const target = BigInt(nearestPoint);
  const step = current < target ? 1n : -1n;

  for (let i = 0; i < maxSteps && current !== target; i++) {
    current = current + step;
    path.push(current);

    // Check if we found a Lagrange point along the way
    if (detectLagrangeType(current, substrate, dynamics) !== null) {
      break;
    }
  }

  return path;
}
