import { UniverseGraph } from '../src/graph';
import type { DenormalizationArtifacts } from '@uor-foundation/operators';

describe('UniverseGraph', () => {
  let graph: UniverseGraph;

  beforeEach(() => {
    graph = new UniverseGraph();
  });

  describe('addMultiplicationEdge', () => {
    it('should add edge and create nodes', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: [],
        emergentFields: [],
      };

      graph.addMultiplicationEdge(2n, 3n, 6n, artifacts);

      expect(graph.nodes.size).toBe(3);
      expect(graph.edges.size).toBe(1);
      expect(graph.nodes.has(2n)).toBe(true);
      expect(graph.nodes.has(3n)).toBe(true);
      expect(graph.nodes.has(6n)).toBe(true);
    });

    it('should handle self-multiplication', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: ['T'],
        emergentFields: [],
      };

      graph.addMultiplicationEdge(3n, 3n, 9n, artifacts);

      const node3 = graph.nodes.get(3n);
      const node9 = graph.nodes.get(9n);

      expect(node3?.outgoingEdges.length).toBe(1);
      expect(node9?.incomingEdges.length).toBe(1);
    });

    it('should track artifacts correctly', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: ['φ', 'T'],
        emergentFields: ['ζ'],
      };

      graph.addMultiplicationEdge(5n, 7n, 35n, artifacts);

      const edge = Array.from(graph.edges.values())[0];
      expect(edge.artifacts.vanishingFields).toEqual(['φ', 'T']);
      expect(edge.artifacts.emergentFields).toEqual(['ζ']);
    });
  });

  describe('getFactorizations', () => {
    it('should return all factorizations of a number', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: [],
        emergentFields: [],
      };

      graph.addMultiplicationEdge(2n, 6n, 12n, artifacts);
      graph.addMultiplicationEdge(3n, 4n, 12n, artifacts);
      graph.addMultiplicationEdge(1n, 12n, 12n, artifacts);

      const factorizations = graph.getFactorizations(12n);
      expect(factorizations.length).toBe(3);
    });

    it('should return empty array for unknown number', () => {
      const factorizations = graph.getFactorizations(100n);
      expect(factorizations).toEqual([]);
    });
  });

  describe('traverse', () => {
    beforeEach(() => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: [],
        emergentFields: [],
      };

      // Build a small graph: 2×3=6, 2×5=10, 6×5=30
      graph.addMultiplicationEdge(2n, 3n, 6n, artifacts);
      graph.addMultiplicationEdge(2n, 5n, 10n, artifacts);
      graph.addMultiplicationEdge(6n, 5n, 30n, artifacts);
    });

    it('should traverse forward from a number', () => {
      const lineages = Array.from(graph.traverse(2n, { direction: 'forward', maxDepth: 2 }));

      const numbers = lineages.map((l) => l.number);
      expect(numbers).toContain(2n); // Starting point
      expect(numbers).toContain(6n); // 2×3
      expect(numbers).toContain(10n); // 2×5
      expect(numbers).toContain(30n); // 6×5 (depth 2)
    });

    it('should traverse backward from a number', () => {
      const lineages = Array.from(graph.traverse(30n, { direction: 'backward', maxDepth: 2 }));

      const numbers = lineages.map((l) => l.number);
      expect(numbers).toContain(30n); // Starting point
      expect(numbers).toContain(6n); // Factor of 30
      expect(numbers).toContain(5n); // Factor of 30
      expect(numbers).toContain(2n); // Factor of 6 (depth 2)
      expect(numbers).toContain(3n); // Factor of 6 (depth 2)
    });

    it('should respect maxDepth', () => {
      const lineages = Array.from(graph.traverse(2n, { direction: 'forward', maxDepth: 1 }));

      const numbers = lineages.map((l) => l.number);
      expect(numbers).toContain(2n);
      expect(numbers).toContain(6n);
      expect(numbers).toContain(10n);
      expect(numbers).not.toContain(30n); // Depth 2, should be excluded
    });
  });

  describe('traceLineage', () => {
    it('should trace complete lineage of a number', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: [],
        emergentFields: [],
      };

      // Build lineage: 2×3=6, 6×5=30
      graph.addMultiplicationEdge(2n, 3n, 6n, artifacts);
      graph.addMultiplicationEdge(6n, 5n, 30n, artifacts);

      const lineages = graph.traceLineage(30n);
      const numbers = lineages.map((l) => l.number);

      expect(numbers).toContain(30n);
      expect(numbers).toContain(6n);
      expect(numbers).toContain(5n);
      expect(numbers).toContain(2n);
      expect(numbers).toContain(3n);
    });
  });

  describe('findPaths', () => {
    it('should find paths between two numbers', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: [],
        emergentFields: [],
      };

      // Build path: 2×3=6, 6×5=30
      graph.addMultiplicationEdge(2n, 3n, 6n, artifacts);
      graph.addMultiplicationEdge(6n, 5n, 30n, artifacts);

      const paths = graph.findPaths(2n, 30n);
      expect(paths.length).toBeGreaterThan(0);

      const path = paths[0];
      expect(path.length).toBe(2);
      expect(path[0].to).toBe(6n);
      expect(path[1].to).toBe(30n);
    });
  });

  describe('getStats', () => {
    it('should calculate graph statistics', () => {
      const artifacts: DenormalizationArtifacts = {
        vanishingFields: [],
        emergentFields: [],
      };

      graph.addMultiplicationEdge(2n, 3n, 6n, artifacts);
      graph.addMultiplicationEdge(2n, 5n, 10n, artifacts);

      const stats = graph.getStats();
      expect(stats.nodeCount).toBe(5); // 2, 3, 5, 6, 10
      expect(stats.edgeCount).toBe(2);
      expect(stats.maxOutDegree).toBe(2); // Node 2 has 2 outgoing edges
      expect(stats.connectedComponents).toBe(1); // All connected
    });
  });
});
