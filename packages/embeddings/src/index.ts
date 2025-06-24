/**
 * Mathematical Universe Embeddings
 *
 * This package provides five different embedding models for numbers:
 * 1. Constitutional (8D) - Direct field activation patterns
 * 2. Page (48D) - Position within 48-number molecular structure
 * 3. Gate (256D) - Complete quantum state space
 * 4. Layer (3D) - Meta-relationships between embeddings
 * 5. Relational (2D) - Database schema and query representation
 */

export * from './types';
export * from './constitutional';
export * from './page';
export * from './gate';
export * from './layer';
export * from './relational';

import type { EmbeddingCoordinates } from './types';
import { getConstitutionalEmbedding } from './constitutional';
import { getPageEmbedding } from './page';
import { getGateEmbedding } from './gate';
import { getLayerEmbedding } from './layer';
import { getRelationalEmbedding } from './relational';

/**
 * Get all embedding coordinates for a number
 * This is the main function used to populate LivingNumber.embeddingCoordinates
 */
export function getAllEmbeddings(
  n: bigint,
  fieldPattern?: boolean[],
  factors?: bigint[],
): EmbeddingCoordinates {
  const constitutional = getConstitutionalEmbedding(n);
  const page = getPageEmbedding(n);
  const gate = getGateEmbedding(n);
  const layer = getLayerEmbedding(n);

  const coordinates: EmbeddingCoordinates = {
    constitutional: constitutional.vector,
    page: page.vector,
    gate: gate.vector,
    layer: layer.vector,
  };

  // Add relational embedding if field pattern is provided
  if (fieldPattern !== undefined) {
    const relational = getRelationalEmbedding(n, fieldPattern, factors);
    coordinates.relational = relational.vector;
  }

  return coordinates;
}
