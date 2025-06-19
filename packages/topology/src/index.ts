export * from './pages';
export * from './lagrange';

import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import {
  PAGE_SIZE,
  type PageLocation,
  type PageInfo,
  locateNumber,
  getPageNumbers,
  getPageInfo,
  isPageBoundary,
} from './pages';
import {
  type LagrangePoint,
  findLagrangePoints,
  nearestLagrangePoint,
  gradientDescentToLagrange,
} from './lagrange';

/**
 * Page Topology Interface - Layer 2 of the Mathematical Universe
 *
 * This interface reveals the 48-number page structure and Lagrange points,
 * showing how numbers naturally organize into molecular-like structures.
 */
export interface PageTopology {
  /**
   * Locate a number within the page structure
   */
  locateNumber(n: bigint): PageLocation;

  /**
   * Get information about a specific page
   */
  getPageInfo(pageNumber: number): PageInfo;

  /**
   * Find Lagrange points in a range
   */
  findLagrangePoints(start: bigint, end: bigint): LagrangePoint[];

  /**
   * Find the nearest Lagrange point
   */
  nearestLagrangePoint(n: bigint): LagrangePoint | null;

  /**
   * Check if at a page boundary
   */
  isPageBoundary(n: bigint): boolean;

  /**
   * Get numbers in a specific page
   */
  getPageNumbers(pageNumber: number): bigint[];

  /**
   * Follow gradient descent to nearest Lagrange point
   */
  gradientDescent(start: bigint): bigint[];
}

/**
 * Default implementation of Page Topology.
 * Uses Layer 0 (Field Substrate) and Layer 1 (Resonance Dynamics).
 */
export class DefaultPageTopology implements PageTopology {
  constructor(
    private substrate: FieldSubstrate,
    private dynamics: ResonanceDynamics,
  ) {}

  locateNumber(n: bigint): PageLocation {
    return locateNumber(n);
  }

  getPageInfo(pageNumber: number): PageInfo {
    return getPageInfo(pageNumber, this.substrate, this.dynamics);
  }

  findLagrangePoints(start: bigint, end: bigint): LagrangePoint[] {
    return findLagrangePoints(start, end, this.substrate, this.dynamics);
  }

  nearestLagrangePoint(n: bigint): LagrangePoint | null {
    return nearestLagrangePoint(n, this.substrate, this.dynamics);
  }

  isPageBoundary(n: bigint): boolean {
    return isPageBoundary(n);
  }

  getPageNumbers(pageNumber: number): bigint[] {
    return getPageNumbers(pageNumber);
  }

  gradientDescent(start: bigint): bigint[] {
    return gradientDescentToLagrange(start, this.substrate, this.dynamics);
  }
}

/**
 * Create a page topology instance.
 *
 * @param substrate - Field substrate interface
 * @param dynamics - Resonance dynamics interface
 * @returns Page topology implementation
 */
export function createPageTopology(
  substrate: FieldSubstrate,
  dynamics: ResonanceDynamics,
): PageTopology {
  return new DefaultPageTopology(substrate, dynamics);
}

/**
 * Analyze the topology of a number range.
 */
export interface TopologyAnalysis {
  pageCount: number;
  lagrangePoints: LagrangePoint[];
  averageResonance: number;
  resonanceVariance: number;
  primaryLagrangeCount: number;
  pageUtilization: number; // How "full" pages are on average
}

/**
 * Analyze the topological structure of a number range.
 *
 * @param start - Start of range
 * @param end - End of range
 * @param topology - Page topology interface
 * @returns Topology analysis
 */
export function analyzeTopology(
  start: bigint,
  end: bigint,
  topology: PageTopology,
): TopologyAnalysis {
  const startPage = Math.floor(Number(start) / PAGE_SIZE);
  const endPage = Math.floor(Number(end) / PAGE_SIZE);
  const pageCount = endPage - startPage + 1;

  // Find all Lagrange points
  const lagrangePoints = topology.findLagrangePoints(start, end);
  const primaryLagrangeCount = lagrangePoints.filter((p) => String(p.type) === 'primary').length;

  // Calculate average page utilization
  let totalNumbers = 0;
  let totalResonance = 0;
  let resonanceSquares = 0;

  for (let page = startPage; page <= endPage; page++) {
    const info = topology.getPageInfo(page);
    const pageNumbers = topology.getPageNumbers(page);

    // Count numbers in range
    const numbersInRange = pageNumbers.filter((n) => n >= start && n <= end).length;
    totalNumbers += numbersInRange;

    // Accumulate resonance stats
    totalResonance += info.resonanceStats.mean * numbersInRange;
    resonanceSquares +=
      (info.resonanceStats.variance + Math.pow(info.resonanceStats.mean, 2)) * numbersInRange;
  }

  const averageResonance = totalNumbers > 0 ? totalResonance / totalNumbers : 0;
  const resonanceVariance =
    totalNumbers > 0 ? resonanceSquares / totalNumbers - Math.pow(averageResonance, 2) : 0;

  const maxPossibleNumbers = pageCount * PAGE_SIZE;
  const pageUtilization = totalNumbers / maxPossibleNumbers;

  return {
    pageCount,
    lagrangePoints,
    averageResonance,
    resonanceVariance,
    primaryLagrangeCount,
    pageUtilization,
  };
}
