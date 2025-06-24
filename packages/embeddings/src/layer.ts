import type { LayerEmbedding } from './types';
import { getConstitutionalEmbedding } from './constitutional';
import { getPageEmbedding } from './page';
import { getGateEmbedding, gateEntropy } from './gate';

/**
 * Get Layer Embedding (3D) - Meta-embedding showing relationships between embeddings
 * X-axis: field complexity (constitutional)
 * Y-axis: molecular position (page)
 * Z-axis: quantum state (gate)
 * Spec §3.4
 */
export function getLayerEmbedding(n: bigint): LayerEmbedding {
  const constitutional = getConstitutionalEmbedding(n);
  const page = getPageEmbedding(n);
  const gate = getGateEmbedding(n);

  // X-axis: Field complexity (0-8, normalized to 0-1)
  const fieldComplexity = constitutional.activeFieldCount / 8;

  // Y-axis: Molecular position (0-47, normalized to 0-1)
  const molecularPosition = page.offset / 47;

  // Z-axis: Quantum state entropy (normalized to 0-1)
  const quantumState = Math.min(gateEntropy(gate) / 8, 1); // Max entropy is 8 bits

  return {
    dimensions: 3,
    constitutional: fieldComplexity,
    page: molecularPosition,
    gate: quantumState,
    vector: [fieldComplexity, molecularPosition, quantumState],
  };
}

/**
 * Calculate Euclidean distance between two layer embeddings
 */
export function layerDistance(a: LayerEmbedding, b: LayerEmbedding): number {
  const dx = a.constitutional - b.constitutional;
  const dy = a.page - b.page;
  const dz = a.gate - b.gate;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Get the volume of a region in layer space
 * Useful for density calculations
 */
export function layerVolume(
  minCorner: [number, number, number],
  maxCorner: [number, number, number],
): number {
  const width = maxCorner[0] - minCorner[0];
  const height = maxCorner[1] - minCorner[1];
  const depth = maxCorner[2] - minCorner[2];

  return width * height * depth;
}

/**
 * Project layer embedding onto a 2D plane
 */
export function projectLayerTo2D(
  embedding: LayerEmbedding,
  plane: 'xy' | 'xz' | 'yz',
): [number, number] {
  switch (plane) {
    case 'xy':
      return [embedding.constitutional, embedding.page];
    case 'xz':
      return [embedding.constitutional, embedding.gate];
    case 'yz':
      return [embedding.page, embedding.gate];
  }
}
