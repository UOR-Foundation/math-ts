import { ContinuousEmbedding } from '../src/embedding';
import { PageTopology } from '@uor-foundation/topology';

describe('ContinuousEmbedding', () => {
  let embedding: ContinuousEmbedding;
  let mockTopology: jest.Mocked<PageTopology>;

  beforeEach(() => {
    mockTopology = {
      getPageInfo: jest.fn(),
      getStabilityMetric: jest.fn(),
    } as any;

    embedding = new ContinuousEmbedding(mockTopology);
  });

  describe('computeCurvature', () => {
    it('should return correct curvature for Lagrange points', () => {
      // First two points of each page are treated as Lagrange points
      expect(embedding.computeCurvature(0n)).toBe(1.31);
      expect(embedding.computeCurvature(1n)).toBe(1.31);
      expect(embedding.computeCurvature(48n)).toBe(1.31);
      expect(embedding.computeCurvature(49n)).toBe(1.31);
    });

    it('should return correct curvature for page edges', () => {
      expect(embedding.computeCurvature(47n)).toBe(1.92);
    });

    it('should return negative curvature for golden ridge', () => {
      expect(embedding.computeCurvature(23n)).toBe(-0.42);
    });

    it('should return zero curvature for regular points', () => {
      expect(embedding.computeCurvature(10n)).toBe(0);
    });
  });

  describe('getEmbedding', () => {
    it('should return origin for n=0', () => {
      const point = embedding.getEmbedding(0n);

      expect(point.x).toBe(0);
      expect(point.y).toBe(0);
    });

    it('should compute correct position for small n', () => {
      const point = embedding.getEmbedding(5n);

      expect(point.x).toBeDefined();
      expect(point.y).toBeDefined();
    });
  });

  describe('intrinsicDistance', () => {
    it('should compute absolute difference', () => {
      expect(embedding.intrinsicDistance(10n, 20n)).toBe(10n);
      expect(embedding.intrinsicDistance(20n, 10n)).toBe(10n);
      expect(embedding.intrinsicDistance(5n, 5n)).toBe(0n);
    });
  });

  describe('biLipschitzBounds', () => {
    it('should provide correct bounds', () => {
      const bounds = embedding.biLipschitzBounds(0n, 100n);

      expect(bounds.lower).toBeLessThan(100);
      expect(bounds.upper).toBe(100);
      expect(bounds.lower).toBeGreaterThan(0);
    });
  });

  describe('computeGeodesic', () => {
    it('should return single point for same start and end', () => {
      const path = embedding.computeGeodesic(5n, 5n);

      expect(path.length).toBe(1);
      expect(path[0]).toEqual(embedding.getEmbedding(5n));
    });

    it('should create path from start to end', () => {
      const path = embedding.computeGeodesic(0n, 5n);

      expect(path.length).toBe(6);
      expect(path[0]).toEqual({ x: 0, y: 0 });
    });
  });

  describe('embeddingDistance', () => {
    it('should return 0 for same points', () => {
      expect(embedding.embeddingDistance(5n, 5n)).toBe(0);
    });

    it('should compute Euclidean distance', () => {
      const dist = embedding.embeddingDistance(0n, 10n);

      expect(dist).toBeGreaterThan(0);
      expect(dist).toBeLessThanOrEqual(10);
    });
  });

  describe('computeArcLength', () => {
    it('should return 0 for empty or single-point paths', () => {
      expect(embedding.computeArcLength([])).toBe(0);
      expect(embedding.computeArcLength([{ x: 1, y: 2 }])).toBe(0);
    });

    it('should compute total length of path', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ];

      expect(embedding.computeArcLength(path)).toBe(2);
    });
  });

  describe('findCriticalCurvaturePoints', () => {
    it('should find curvature extrema', () => {
      const criticalPoints = embedding.findCriticalCurvaturePoints(0n, 50n);

      // Check that we found some critical points
      expect(criticalPoints.length).toBeGreaterThan(0);
      // 47 is a page edge with high curvature
      expect(criticalPoints).toContain(47n);
    });
  });

  describe('getWindingNumber', () => {
    it('should compute winding number from total rotation', () => {
      const testEmbedding = {
        folio: 0n,
        curve: [],
        segments: [],
        totalRotation: 2 * Math.PI,
      };

      expect(embedding.getWindingNumber(testEmbedding)).toBe(1);
    });
  });

  describe('visualizeEmbedding', () => {
    it('should create ASCII visualization', () => {
      const embeddingData = embedding.embedFolio(0n);
      const visualization = embedding.visualizeEmbedding(embeddingData, 20, 10);

      expect(visualization.length).toBe(10);
      expect(visualization[0].length).toBe(20);
    });
  });

  describe('extendToComplexPlane', () => {
    it('should add imaginary component', () => {
      const complex = embedding.extendToComplexPlane(0n);

      expect(complex.real).toBeDefined();
      expect(complex.imag).toBeDefined();
    });
  });

  describe('detectBottlenecks', () => {
    it('should identify high-curvature segments', () => {
      const testEmbedding = {
        folio: 0n,
        curve: [],
        segments: [
          { start: 0n, end: 47n, curvature: 1.92, points: [] },
          { start: 48n, end: 95n, curvature: 0.5, points: [] },
        ],
        totalRotation: 0,
      };

      const bottlenecks = embedding.detectBottlenecks(testEmbedding);

      expect(bottlenecks).toContain(0n);
      expect(bottlenecks).not.toContain(48n);
    });
  });
});
