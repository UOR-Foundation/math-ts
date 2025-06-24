import type { ConstitutionalEmbedding } from './types';

/**
 * Get Constitutional Embedding (8D) - Direct field activation pattern
 * Each bit position represents activation of corresponding field
 * Spec §3.1
 */
export function getConstitutionalEmbedding(n: bigint): ConstitutionalEmbedding {
  const vector: number[] = [];
  let activeCount = 0;

  // Extract bit pattern for first 8 bits
  for (let i = 0; i < 8; i++) {
    const bitActive = (n >> BigInt(i)) & 1n;
    vector.push(Number(bitActive));
    if (bitActive) activeCount++;
  }

  return {
    dimensions: 8,
    vector,
    activeFieldCount: activeCount,
  };
}

/**
 * Calculate distance between two constitutional embeddings
 * Uses Hamming distance (number of differing bits)
 */
export function constitutionalDistance(
  a: ConstitutionalEmbedding,
  b: ConstitutionalEmbedding,
): number {
  let distance = 0;
  for (let i = 0; i < 8; i++) {
    if (a.vector[i] !== b.vector[i]) {
      distance++;
    }
  }
  return distance;
}

/**
 * Get active field indices from constitutional embedding
 */
export function getActiveFieldIndices(embedding: ConstitutionalEmbedding): number[] {
  const indices: number[] = [];
  for (let i = 0; i < 8; i++) {
    if (embedding.vector[i] === 1) {
      indices.push(i);
    }
  }
  return indices;
}
