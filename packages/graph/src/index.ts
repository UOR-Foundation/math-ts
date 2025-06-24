/**
 * Mathematical Universe Graph
 *
 * This package implements the directed graph architecture for tracking
 * multiplication relationships and denormalization artifacts in the
 * Mathematical Universe.
 *
 * Key components:
 * - UniverseGraph: Core graph data structure
 * - GraphBuilder: Integration with multiplication operations
 * - Traversal algorithms for lineage tracing
 * - Artifact tracking for denormalization
 */

export * from './types';
export { UniverseGraph } from './graph';
export { GraphBuilder } from './builder';
