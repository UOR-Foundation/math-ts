/**
 * Graph builder that integrates with multiplication operations
 */

import { UniverseGraph } from './graph';
import { getFieldPattern, FIELD_NAMES } from '@uor-foundation/field-substrate';
import type { DenormalizationArtifacts } from './types';

export class GraphBuilder {
  private graph: UniverseGraph;

  constructor(graph?: UniverseGraph) {
    this.graph = graph || new UniverseGraph();
  }

  /**
   * Multiply two numbers and add the edge to the graph
   */
  multiply(a: bigint, b: bigint): bigint {
    // Perform multiplication
    const product = a * b;

    // Calculate artifacts
    const artifacts = this.calculateArtifacts(a, b, product);

    // Add edge to graph
    this.graph.addMultiplicationEdge(a, b, product, artifacts);

    return product;
  }

  /**
   * Calculate denormalization artifacts from multiplication
   */
  private calculateArtifacts(a: bigint, b: bigint, product: bigint): DenormalizationArtifacts {
    const patternA = getFieldPattern(a);
    const patternB = getFieldPattern(b);
    const patternProduct = getFieldPattern(product);

    const vanishingFields: string[] = [];
    const emergentFields: string[] = [];

    for (let i = 0; i < 8; i++) {
      const inFactors = patternA[i] || patternB[i];
      const inProduct = patternProduct[i];

      if (inFactors && !inProduct) {
        vanishingFields.push(FIELD_NAMES[i]);
      } else if (!patternA[i] && !patternB[i] && inProduct) {
        emergentFields.push(FIELD_NAMES[i]);
      }
    }

    return { vanishingFields, emergentFields };
  }

  /**
   * Build complete multiplication table up to n
   */
  buildMultiplicationTable(n: bigint): void {
    for (let a = 1n; a <= n; a++) {
      for (let b = a; b <= n; b++) {
        const product = a * b;
        if (product <= n * n) {
          this.multiply(a, b);
        }
      }
    }
  }

  /**
   * Build graph from prime factorizations
   */
  buildFromFactorizations(upTo: bigint): void {
    // Start with 2 as the first prime
    for (let n = 2n; n <= upTo; n++) {
      const factors = this.factorize(n);

      // Add edges for each factorization
      for (const [a, b] of factors) {
        const artifacts = this.calculateArtifacts(a, b, n);
        this.graph.addMultiplicationEdge(a, b, n, artifacts);
      }
    }
  }

  /**
   * Find all factor pairs of a number
   */
  private factorize(n: bigint): [bigint, bigint][] {
    const factors: [bigint, bigint][] = [];

    // Always include 1 × n
    if (n > 1n) {
      factors.push([1n, n]);
    }

    // Find other factor pairs
    for (let i = 2n; i * i <= n; i++) {
      if (n % i === 0n) {
        const j = n / i;
        factors.push([i, j]);
      }
    }

    return factors;
  }

  /**
   * Get the underlying graph
   */
  getGraph(): UniverseGraph {
    return this.graph;
  }

  /**
   * Clear the graph
   */
  clear(): void {
    this.graph.clear();
  }
}
