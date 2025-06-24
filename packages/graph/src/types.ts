/**
 * Graph types for the Mathematical Universe
 * Based on spec §6.1
 */

/**
 * Denormalization artifacts for graph edges
 */
export interface DenormalizationArtifacts {
  vanishingFields: string[];
  emergentFields: string[];
}

/**
 * Multiplication edge in the directed graph
 * Spec §6.1
 */
export interface MultiplicationEdge {
  from: [bigint, bigint]; // Factor pair
  to: bigint; // Product
  artifacts: DenormalizationArtifacts; // Edge weight
  timestamp?: number; // When the edge was created
}

/**
 * Node in the Mathematical Universe graph
 * Each node represents a living number
 */
export interface GraphNode {
  id: bigint; // The number itself
  incomingEdges: MultiplicationEdge[]; // All ways to create this number
  outgoingEdges: MultiplicationEdge[]; // All multiplications involving this number
}

/**
 * Complete directed graph structure
 * Spec §6.1
 */
export interface MathematicalUniverseGraph {
  nodes: Map<bigint, GraphNode>; // All numbers as nodes
  edges: Map<string, MultiplicationEdge>; // Multiplication relationships
}

/**
 * Graph traversal options
 */
export interface TraversalOptions {
  maxDepth?: number; // Maximum depth to traverse
  direction?: 'forward' | 'backward' | 'both'; // Direction of traversal
  filter?: (edge: MultiplicationEdge) => boolean; // Edge filter
}

/**
 * Lineage information for a number
 * Spec §6.2
 */
export interface NumberLineage {
  number: bigint;
  depth: number; // Distance from starting number
  path: MultiplicationEdge[]; // Edges taken to reach this number
  ancestors: Set<bigint>; // All unique ancestors
}

/**
 * Graph statistics
 */
export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  maxInDegree: number;
  maxOutDegree: number;
  averageDegree: number;
  connectedComponents: number;
}
