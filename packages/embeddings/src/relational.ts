import type { RelationalEmbedding } from './types';
import { createHash } from 'crypto';

/**
 * Get Relational Embedding (2D) - Database resolver function
 * Represents what the number contains (schema) and what it seeks (query)
 * Spec §3.5
 */
export function getRelationalEmbedding(
  n: bigint,
  fieldPattern: boolean[],
  factors?: bigint[],
): RelationalEmbedding {
  // Query defaults to seeking prime factorization if not provided
  const query = factors || [n]; // Self-reference if prime

  // Create hash digest for unique identification in graph
  const hashInput = `${n}:${fieldPattern.map((f: boolean) => (f ? '1' : '0')).join('')}:${query.join(',')}`;
  const hashDigest = createHash('sha256').update(hashInput).digest('hex').substring(0, 16);

  // Calculate 2D projection for visualization
  // X-axis: Field complexity (number of active fields)
  const activeFields = fieldPattern.filter((f: boolean) => f).length;
  const x = activeFields / 8; // Normalized to [0, 1]

  // Y-axis: Factorization complexity (number of prime factors)
  const y = Math.min(query.length / 10, 1); // Normalized, capped at 10 factors

  return {
    dimensions: 2,
    schema: fieldPattern,
    query,
    hashDigest,
    vector: [x, y],
  };
}

/**
 * Calculate relational similarity between two embeddings
 * Based on schema overlap and query similarity
 */
export function relationalSimilarity(a: RelationalEmbedding, b: RelationalEmbedding): number {
  // Schema similarity (Jaccard index of field patterns)
  let schemaIntersection = 0;
  let schemaUnion = 0;

  for (let i = 0; i < a.schema.length; i++) {
    if (a.schema[i] || b.schema[i]) {
      schemaUnion++;
      if (a.schema[i] && b.schema[i]) {
        schemaIntersection++;
      }
    }
  }

  const schemaSimilarity = schemaUnion > 0 ? schemaIntersection / schemaUnion : 0;

  // Query similarity (overlap of factors)
  const aFactors = new Set(a.query.map((f) => f.toString()));
  const bFactors = new Set(b.query.map((f) => f.toString()));

  let queryIntersection = 0;
  for (const factor of aFactors) {
    if (bFactors.has(factor)) {
      queryIntersection++;
    }
  }

  const queryUnion = aFactors.size + bFactors.size - queryIntersection;
  const querySimilarity = queryUnion > 0 ? queryIntersection / queryUnion : 0;

  // Combined similarity (weighted average)
  return 0.5 * schemaSimilarity + 0.5 * querySimilarity;
}

/**
 * Check if an embedding represents a self-referential number
 * (A number that queries itself, typically a prime)
 */
export function isSelfReferential(embedding: RelationalEmbedding, n: bigint): boolean {
  return embedding.query.length === 1 && embedding.query[0] === n;
}

/**
 * Get the query complexity of an embedding
 */
export function getQueryComplexity(embedding: RelationalEmbedding): number {
  // Complexity based on number and size of factors
  let complexity = embedding.query.length;

  // Add logarithmic complexity for large factors
  for (const factor of embedding.query) {
    complexity += Math.log2(Number(factor)) / 100;
  }

  return complexity;
}
