// Field pattern is represented as boolean[] in this package

/**
 * Constitutional Embedding (8D) - Direct field activation pattern
 * Spec §3.1
 */
export interface ConstitutionalEmbedding {
  dimensions: 8;
  vector: number[]; // 8-element array of 0 or 1
  activeFieldCount: number;
}

/**
 * Page Embedding (48D) - Position within 48-number molecular structure
 * Spec §3.2
 */
export interface PageEmbedding {
  dimensions: 48;
  pageNumber: bigint;
  offset: number; // 0-47
  isLagrange: boolean;
  vector: number[]; // 48-element one-hot encoding of position
}

/**
 * Gate Embedding (256D) - Complete quantum state space (2^8 = 256)
 * Spec §3.3
 */
export interface GateEmbedding {
  dimensions: 256;
  cyclePosition: number; // 0-255
  gateConfiguration: bigint; // n % 256n
  quantumPhase: number;
  vector: number[]; // 256-element vector
}

/**
 * Layer Embedding (3D) - Meta-embedding showing relationships
 * Spec §3.4
 */
export interface LayerEmbedding {
  dimensions: 3;
  constitutional: number; // X-axis: field complexity
  page: number; // Y-axis: molecular position
  gate: number; // Z-axis: quantum state
  vector: [number, number, number];
}

/**
 * Relational Embedding (2D) - Database resolver function
 * Spec §3.5
 */
export interface RelationalEmbedding {
  dimensions: 2;
  schema: boolean[]; // What the number contains
  query: bigint[]; // What the number seeks (factors)
  hashDigest: string; // Unique identifier for graph traversal
  vector: [number, number]; // 2D projection for visualization
}

/**
 * Complete embedding coordinates for a number
 */
export interface EmbeddingCoordinates {
  constitutional: number[];
  page: number[];
  gate: number[];
  layer?: [number, number, number];
  relational?: [number, number];
}
