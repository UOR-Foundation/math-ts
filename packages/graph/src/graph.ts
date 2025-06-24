/**
 * Mathematical Universe Graph implementation
 * Tracks multiplication relationships and denormalization artifacts
 */

import type {
  MathematicalUniverseGraph,
  MultiplicationEdge,
  GraphNode,
  TraversalOptions,
  NumberLineage,
  GraphStats,
  DenormalizationArtifacts,
} from './types';

export class UniverseGraph implements MathematicalUniverseGraph {
  nodes: Map<bigint, GraphNode>;
  edges: Map<string, MultiplicationEdge>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  /**
   * Get or create a node for a number
   */
  private getOrCreateNode(n: bigint): GraphNode {
    let node = this.nodes.get(n);
    if (!node) {
      node = {
        id: n,
        incomingEdges: [],
        outgoingEdges: [],
      };
      this.nodes.set(n, node);
    }
    return node;
  }

  /**
   * Create edge key from factor pair and product
   */
  private getEdgeKey(a: bigint, b: bigint, product: bigint): string {
    // Normalize order for consistent keys
    const [first, second] = a <= b ? [a, b] : [b, a];
    return `${first}×${second}→${product}`;
  }

  /**
   * Add multiplication edge to the graph
   */
  addMultiplicationEdge(
    a: bigint,
    b: bigint,
    product: bigint,
    artifacts: DenormalizationArtifacts,
  ): void {
    // Check if edge already exists
    const key = this.getEdgeKey(a, b, product);
    if (this.edges.has(key)) {
      // Edge already exists, don't add it again
      return;
    }

    const edge: MultiplicationEdge = {
      from: [a, b],
      to: product,
      artifacts,
      timestamp: Date.now(),
    };

    // Add to edges map
    this.edges.set(key, edge);

    // Update nodes
    const nodeA = this.getOrCreateNode(a);
    const nodeB = this.getOrCreateNode(b);
    const nodeProduct = this.getOrCreateNode(product);

    // Add outgoing edges from factors
    nodeA.outgoingEdges.push(edge);
    if (b !== a) {
      nodeB.outgoingEdges.push(edge);
    }

    // Add incoming edge to product
    nodeProduct.incomingEdges.push(edge);
  }

  /**
   * Get all factorizations of a number
   */
  getFactorizations(n: bigint): MultiplicationEdge[] {
    const node = this.nodes.get(n);
    return node ? node.incomingEdges : [];
  }

  /**
   * Get all products involving a number as a factor
   */
  getProducts(n: bigint): MultiplicationEdge[] {
    const node = this.nodes.get(n);
    return node ? node.outgoingEdges : [];
  }

  /**
   * Traverse graph from a starting number
   */
  *traverse(start: bigint, options: TraversalOptions = {}): Generator<NumberLineage> {
    const { maxDepth = 10, direction = 'forward', filter = (): boolean => true } = options;

    const visited = new Set<bigint>();
    const queue: NumberLineage[] = [
      {
        number: start,
        depth: 0,
        path: [],
        ancestors: new Set(),
      },
    ];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      if (visited.has(current.number) || current.depth > maxDepth) {
        continue;
      }

      visited.add(current.number);
      yield current;

      const node = this.nodes.get(current.number);
      if (!node) continue;

      // Get edges based on direction
      const edges =
        direction === 'forward'
          ? node.outgoingEdges
          : direction === 'backward'
            ? node.incomingEdges
            : [...node.outgoingEdges, ...node.incomingEdges];

      for (const edge of edges) {
        if (!filter(edge)) continue;

        if (direction === 'forward') {
          const nextLineage: NumberLineage = {
            number: edge.to,
            depth: current.depth + 1,
            path: [...current.path, edge],
            ancestors: new Set([...current.ancestors, current.number]),
          };
          queue.push(nextLineage);
        } else if (direction === 'backward') {
          // For backward traversal, add both factors
          for (const factor of edge.from) {
            const nextLineage: NumberLineage = {
              number: factor,
              depth: current.depth + 1,
              path: [...current.path, edge],
              ancestors: new Set([...current.ancestors, current.number]),
            };
            queue.push(nextLineage);
          }
        } else {
          // Both directions
          if (edge.to === current.number) {
            // Add factors
            for (const factor of edge.from) {
              const nextLineage: NumberLineage = {
                number: factor,
                depth: current.depth + 1,
                path: [...current.path, edge],
                ancestors: new Set([...current.ancestors, current.number]),
              };
              queue.push(nextLineage);
            }
          } else {
            // Add product
            const nextLineage: NumberLineage = {
              number: edge.to,
              depth: current.depth + 1,
              path: [...current.path, edge],
              ancestors: new Set([...current.ancestors, current.number]),
            };
            queue.push(nextLineage);
          }
        }
      }
    }
  }

  /**
   * Trace complete lineage of a number
   */
  traceLineage(n: bigint, maxDepth = 10): NumberLineage[] {
    const lineages: NumberLineage[] = [];

    for (const lineage of this.traverse(n, {
      direction: 'backward',
      maxDepth,
    })) {
      lineages.push(lineage);
    }

    return lineages;
  }

  /**
   * Find all paths between two numbers
   */
  findPaths(from: bigint, to: bigint, maxDepth = 10): MultiplicationEdge[][] {
    const paths: MultiplicationEdge[][] = [];

    for (const lineage of this.traverse(from, {
      direction: 'forward',
      maxDepth,
    })) {
      if (lineage.number === to) {
        paths.push(lineage.path);
      }
    }

    return paths;
  }

  /**
   * Get graph statistics
   */
  getStats(): GraphStats {
    let totalDegree = 0;
    let maxInDegree = 0;
    let maxOutDegree = 0;

    for (const node of this.nodes.values()) {
      const inDegree = node.incomingEdges.length;
      const outDegree = node.outgoingEdges.length;

      totalDegree += inDegree + outDegree;
      maxInDegree = Math.max(maxInDegree, inDegree);
      maxOutDegree = Math.max(maxOutDegree, outDegree);
    }

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      maxInDegree,
      maxOutDegree,
      averageDegree: this.nodes.size > 0 ? totalDegree / this.nodes.size : 0,
      connectedComponents: this.countConnectedComponents(),
    };
  }

  /**
   * Count connected components in the graph
   */
  private countConnectedComponents(): number {
    const visited = new Set<bigint>();
    let components = 0;

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        components++;
        this.dfsVisit(node, visited);
      }
    }

    return components;
  }

  /**
   * DFS visit for connected components
   */
  private dfsVisit(start: bigint, visited: Set<bigint>): void {
    const stack = [start];

    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) continue;
      if (visited.has(current)) continue;

      visited.add(current);
      const node = this.nodes.get(current);
      if (!node) continue;

      // Add all connected nodes
      for (const edge of node.outgoingEdges) {
        if (!visited.has(edge.to)) {
          stack.push(edge.to);
        }
      }

      for (const edge of node.incomingEdges) {
        if (!visited.has(edge.from[0])) {
          stack.push(edge.from[0]);
        }
        if (!visited.has(edge.from[1])) {
          stack.push(edge.from[1]);
        }
      }
    }
  }

  /**
   * Clear the graph
   */
  clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }
}
