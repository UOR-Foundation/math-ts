import { GraphBuilder } from '../src/builder';
import { UniverseGraph } from '../src/graph';

describe('GraphBuilder', () => {
  let builder: GraphBuilder;
  let graph: UniverseGraph;

  beforeEach(() => {
    graph = new UniverseGraph();
    builder = new GraphBuilder(graph);
  });

  describe('multiply', () => {
    it('should multiply numbers and add edge to graph', () => {
      const result = builder.multiply(3n, 4n);

      expect(result).toBe(12n);
      expect(graph.nodes.size).toBe(3); // 3, 4, 12
      expect(graph.edges.size).toBe(1);
    });

    it('should calculate artifacts correctly', () => {
      builder.multiply(5n, 7n); // 35

      const edge = Array.from(graph.edges.values())[0];
      expect(edge.from).toEqual([5n, 7n]);
      expect(edge.to).toBe(35n);

      // Artifacts depend on field patterns
      expect(edge.artifacts).toBeDefined();
      expect(Array.isArray(edge.artifacts.vanishingFields)).toBe(true);
      expect(Array.isArray(edge.artifacts.emergentFields)).toBe(true);
    });
  });

  describe('buildMultiplicationTable', () => {
    it('should build complete multiplication table', () => {
      builder.buildMultiplicationTable(3n);

      // Should have: 1×1=1, 1×2=2, 1×3=3, 2×2=4, 2×3=6, 3×3=9
      expect(graph.edges.size).toBe(6);

      // Check some specific products exist
      expect(graph.getFactorizations(4n).length).toBeGreaterThan(0);
      expect(graph.getFactorizations(6n).length).toBeGreaterThan(0);
      expect(graph.getFactorizations(9n).length).toBeGreaterThan(0);
    });

    it('should use consistent edge keys', () => {
      builder.buildMultiplicationTable(2n);
      const edgeCount1 = graph.edges.size;

      // Building the same table again should not add duplicate edges
      // because edge keys are normalized (a×b→c)
      builder.buildMultiplicationTable(2n);
      const edgeCount2 = graph.edges.size;

      // Edge keys are unique, so no duplicates
      expect(edgeCount2).toBe(edgeCount1);
    });
  });

  describe('buildFromFactorizations', () => {
    it('should build graph from prime factorizations', () => {
      builder.buildFromFactorizations(10n);

      // Check that composite numbers have factorizations
      expect(graph.getFactorizations(4n).length).toBeGreaterThan(0); // 1×4, 2×2
      expect(graph.getFactorizations(6n).length).toBeGreaterThan(0); // 1×6, 2×3
      expect(graph.getFactorizations(8n).length).toBeGreaterThan(0); // 1×8, 2×4
      expect(graph.getFactorizations(9n).length).toBeGreaterThan(0); // 1×9, 3×3
      expect(graph.getFactorizations(10n).length).toBeGreaterThan(0); // 1×10, 2×5
    });

    it('should include 1×n factorization', () => {
      builder.buildFromFactorizations(5n);

      // Every number > 1 should have 1×n factorization
      for (let n = 2n; n <= 5n; n++) {
        const factorizations = graph.getFactorizations(n);
        const has1Factor = factorizations.some(
          (edge) => edge.from[0] === 1n || edge.from[1] === 1n,
        );
        expect(has1Factor).toBe(true);
      }
    });
  });

  describe('integration with multiplication', () => {
    it('should track lineage through multiple operations', () => {
      // Build a chain: 2×3=6, 6×5=30
      const six = builder.multiply(2n, 3n);
      const thirty = builder.multiply(six, 5n);

      expect(thirty).toBe(30n);

      // Trace lineage
      const lineage = graph.traceLineage(30n);
      const numbers = lineage.map((l) => l.number);

      expect(numbers).toContain(30n);
      expect(numbers).toContain(6n);
      expect(numbers).toContain(5n);
      expect(numbers).toContain(2n);
      expect(numbers).toContain(3n);
    });
  });
});
