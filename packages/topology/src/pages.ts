import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';

/**
 * The fundamental page size emerges from perfect resonance at 48.
 * Numbers 48 and 49 have resonance = 1.0 due to fields 4,5 interaction.
 */
export const PAGE_SIZE = 48;

/**
 * Location of a number within the page topology.
 */
export interface PageLocation {
  /** Page number (0-based) */
  page: number;
  /** Offset within the page (0-47) */
  offset: number;
  /** 256-number cycle (0-based) */
  cycle: number;
  /** Phase within the 256-number cycle */
  phase: number;
}

/**
 * Locate a number within the page topology.
 *
 * @param n - The number to locate
 * @returns Page location information
 */
export function locateNumber(n: bigint): PageLocation {
  const num = Number(n);
  return {
    page: Math.floor(num / PAGE_SIZE),
    offset: num % PAGE_SIZE,
    cycle: Math.floor(num / 256),
    phase: num % 256,
  };
}

/**
 * Get the numbers in a specific page.
 *
 * @param pageNumber - The page number (0-based)
 * @returns Array of numbers in the page
 */
export function getPageNumbers(pageNumber: number): bigint[] {
  const start = pageNumber * PAGE_SIZE;
  const numbers: bigint[] = [];

  for (let i = 0; i < PAGE_SIZE; i++) {
    numbers.push(BigInt(start + i));
  }

  return numbers;
}

/**
 * Statistics for a page's resonance distribution.
 */
export interface PageResonanceStats {
  mean: number;
  variance: number;
  skew: number;
  kurtosis: number;
  min: number;
  max: number;
}

/**
 * Calculate resonance statistics for a page.
 *
 * @param pageNumber - The page number
 * @param dynamics - Resonance dynamics interface
 * @returns Page resonance statistics
 */
export function calculatePageResonance(
  pageNumber: number,
  dynamics: ResonanceDynamics,
): PageResonanceStats {
  const numbers = getPageNumbers(pageNumber);
  const resonances = numbers.map((n) => dynamics.calculateResonance(n));

  // Calculate mean
  const mean = resonances.reduce((sum, r) => sum + r, 0) / resonances.length;

  // Calculate centered moments
  const centered = resonances.map((r) => r - mean);
  const variance = centered.reduce((sum, c) => sum + c * c, 0) / resonances.length;
  const stdDev = Math.sqrt(variance);

  // Calculate skew (third moment)
  const skew =
    stdDev > 0
      ? centered.reduce((sum, c) => sum + Math.pow(c / stdDev, 3), 0) / resonances.length
      : 0;

  // Calculate kurtosis (fourth moment)
  const kurtosis =
    stdDev > 0
      ? centered.reduce((sum, c) => sum + Math.pow(c / stdDev, 4), 0) / resonances.length - 3
      : 0;

  return {
    mean,
    variance,
    skew,
    kurtosis,
    min: Math.min(...resonances),
    max: Math.max(...resonances),
  };
}

/**
 * Page information including field activation density.
 */
export interface PageInfo {
  pageNumber: number;
  startNumber: bigint;
  endNumber: bigint;
  resonanceStats: PageResonanceStats;
  averageActiveFields: number;
  primeCount?: number; // Optional, would need prime detection
}

/**
 * Get comprehensive information about a page.
 *
 * @param pageNumber - The page number
 * @param substrate - Field substrate interface
 * @param dynamics - Resonance dynamics interface
 * @returns Complete page information
 */
export function getPageInfo(
  pageNumber: number,
  substrate: FieldSubstrate,
  dynamics: ResonanceDynamics,
): PageInfo {
  const numbers = getPageNumbers(pageNumber);
  const resonanceStats = calculatePageResonance(pageNumber, dynamics);

  // Calculate average active field count
  let totalActiveFields = 0;
  for (const n of numbers) {
    const pattern = substrate.getFieldPattern(n);
    totalActiveFields += pattern.filter((b) => b).length;
  }
  const averageActiveFields = totalActiveFields / numbers.length;

  return {
    pageNumber,
    startNumber: numbers[0],
    endNumber: numbers[numbers.length - 1],
    resonanceStats,
    averageActiveFields,
  };
}

/**
 * Check if a position is at a page boundary.
 *
 * @param n - The number to check
 * @returns True if at page boundary (positions 47, 48, 49, 0)
 */
export function isPageBoundary(n: bigint): boolean {
  const offset = Number(n) % PAGE_SIZE;
  return offset === 0 || offset === 47; // Only actual page boundaries
}

/**
 * Find the next page boundary from a given position.
 *
 * @param n - Current position
 * @returns Next page boundary position
 */
export function nextPageBoundary(n: bigint): bigint {
  const num = Number(n);
  const page = Math.floor(num / PAGE_SIZE);
  const offset = num % PAGE_SIZE;

  if (offset === 0) {
    return n; // Already at page start
  } else if (offset === 47) {
    // At page end, next boundary is next page start
    return BigInt((page + 1) * PAGE_SIZE);
  } else if (offset < 47) {
    // Go to end of current page
    return BigInt(page * PAGE_SIZE + 47);
  } else {
    // Past 47, go to next page end
    return BigInt((page + 1) * PAGE_SIZE + 47);
  }
}

/**
 * Navigate pages efficiently.
 *
 * @param currentPage - Current page number
 * @param targetPage - Target page number
 * @returns Path of page numbers to traverse
 */
export function navigatePages(currentPage: number, targetPage: number): number[] {
  if (currentPage === targetPage) return [currentPage];

  const path: number[] = [];
  const step = targetPage > currentPage ? 1 : -1;

  for (let page = currentPage; page !== targetPage; page += step) {
    path.push(page);
  }
  path.push(targetPage);

  return path;
}
