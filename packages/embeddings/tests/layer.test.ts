import { getLayerEmbedding, layerDistance, layerVolume, projectLayerTo2D } from '../src/layer';

describe('Layer Embedding', () => {
  describe('getLayerEmbedding', () => {
    it('should create 3D embedding with correct dimensions', () => {
      const embedding = getLayerEmbedding(42n);
      expect(embedding.dimensions).toBe(3);
      expect(embedding.vector.length).toBe(3);
      expect(embedding.constitutional).toBeGreaterThanOrEqual(0);
      expect(embedding.constitutional).toBeLessThanOrEqual(1);
      expect(embedding.page).toBeGreaterThanOrEqual(0);
      expect(embedding.page).toBeLessThanOrEqual(1);
      expect(embedding.gate).toBeGreaterThanOrEqual(0);
      expect(embedding.gate).toBeLessThanOrEqual(1);
    });

    it('should normalize field complexity correctly', () => {
      // 0 has no active fields
      const zero = getLayerEmbedding(0n);
      expect(zero.constitutional).toBe(0);

      // 255 has all 8 fields active
      const allActive = getLayerEmbedding(255n);
      expect(allActive.constitutional).toBe(1);

      // 15 has 4 fields active (00001111)
      const halfActive = getLayerEmbedding(15n);
      expect(halfActive.constitutional).toBe(0.5);
    });

    it('should normalize page position correctly', () => {
      // First position in page
      const first = getLayerEmbedding(0n);
      expect(first.page).toBe(0);

      // Last position in page
      const last = getLayerEmbedding(47n);
      expect(last.page).toBe(1);

      // Middle position
      const middle = getLayerEmbedding(23n);
      expect(middle.page).toBeCloseTo(23 / 47, 5);
    });
  });

  describe('layerDistance', () => {
    it('should calculate Euclidean distance correctly', () => {
      const a = getLayerEmbedding(0n);
      const b = getLayerEmbedding(255n);

      const distance = layerDistance(a, b);
      expect(distance).toBeGreaterThan(0);

      // Distance to self should be 0
      expect(layerDistance(a, a)).toBe(0);
    });

    it('should handle 3D space correctly', () => {
      // Create mock embeddings with known positions
      const a = {
        dimensions: 3,
        constitutional: 0,
        page: 0,
        gate: 0,
        vector: [0, 0, 0] as [number, number, number],
      };
      const b = {
        dimensions: 3,
        constitutional: 1,
        page: 1,
        gate: 1,
        vector: [1, 1, 1] as [number, number, number],
      };

      const distance = layerDistance(a, b);
      expect(distance).toBeCloseTo(Math.sqrt(3), 5); // √(1² + 1² + 1²)
    });
  });

  describe('layerVolume', () => {
    it('should calculate volume correctly', () => {
      const volume = layerVolume([0, 0, 0], [1, 1, 1]);
      expect(volume).toBe(1);

      const largerVolume = layerVolume([0, 0, 0], [2, 3, 4]);
      expect(largerVolume).toBe(24); // 2 * 3 * 4

      const zeroVolume = layerVolume([0, 0, 0], [0, 0, 0]);
      expect(zeroVolume).toBe(0);
    });
  });

  describe('projectLayerTo2D', () => {
    it('should project onto different planes correctly', () => {
      const embedding = getLayerEmbedding(42n);

      const xy = projectLayerTo2D(embedding, 'xy');
      expect(xy).toEqual([embedding.constitutional, embedding.page]);

      const xz = projectLayerTo2D(embedding, 'xz');
      expect(xz).toEqual([embedding.constitutional, embedding.gate]);

      const yz = projectLayerTo2D(embedding, 'yz');
      expect(yz).toEqual([embedding.page, embedding.gate]);
    });
  });
});
