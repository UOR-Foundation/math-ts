import type { PageEmbedding } from './types';

/**
 * Get Page Embedding (48D) - Position within 48-number molecular structure
 * Page structure emerges from α₄ × α₅ = 1 creating first perfect resonance at n=48
 * Spec §3.2
 */
export function getPageEmbedding(n: bigint): PageEmbedding {
  const pageNumber = n / 48n;
  const offset = Number(n % 48n);

  // Check if this is a Lagrange point
  // Lagrange points occur at positions 48, 49 in each 256-number cycle
  const cyclePosition = n % 256n;
  const isLagrange = cyclePosition === 48n || cyclePosition === 49n;

  // Create 48-dimensional one-hot vector
  const vector: number[] = new Array(48).fill(0) as number[];
  vector[offset] = 1;

  return {
    dimensions: 48,
    pageNumber,
    offset,
    isLagrange,
    vector,
  };
}

/**
 * Calculate distance between two page embeddings
 * Returns infinity if on different pages, otherwise Manhattan distance
 */
export function pageDistance(a: PageEmbedding, b: PageEmbedding): number {
  if (a.pageNumber !== b.pageNumber) {
    return Infinity;
  }
  return Math.abs(a.offset - b.offset);
}

/**
 * Get all numbers in the same page
 */
export function getPageMembers(pageNumber: bigint): bigint[] {
  const members: bigint[] = [];
  const start = pageNumber * 48n;

  for (let i = 0n; i < 48n; i++) {
    members.push(start + i);
  }

  return members;
}

/**
 * Check if a number is at a page boundary
 */
export function isPageBoundary(n: bigint): boolean {
  return n % 48n === 0n;
}

/**
 * Get the nearest Lagrange point to a given number
 */
export function getNearestLagrangePoint(n: bigint): bigint {
  const cycleNumber = n / 256n;

  // Lagrange points are at 48 and 49 in each cycle
  const lagrange1 = cycleNumber * 256n + 48n;
  const lagrange2 = cycleNumber * 256n + 49n;

  // Also check previous and next cycle
  const prevLagrange2 = (cycleNumber - 1n) * 256n + 49n;
  const nextLagrange1 = (cycleNumber + 1n) * 256n + 48n;

  // Find closest
  const candidates = [lagrange1, lagrange2];
  if (cycleNumber > 0n) candidates.push(prevLagrange2);
  candidates.push(nextLagrange1);

  let nearest = lagrange1;
  let minDistance = n > lagrange1 ? n - lagrange1 : lagrange1 - n;

  for (const candidate of candidates) {
    const distance = n > candidate ? n - candidate : candidate - n;
    if (distance < minDistance) {
      minDistance = distance;
      nearest = candidate;
    }
  }

  return nearest;
}
