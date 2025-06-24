import { getGateEmbedding, gateInterference, getGateBitString, gateEntropy } from '../src/gate';

describe('Gate Embedding', () => {
  describe('getGateEmbedding', () => {
    it('should calculate cycle position correctly', () => {
      const zero = getGateEmbedding(0n);
      expect(zero.cyclePosition).toBe(0);
      expect(zero.gateConfiguration).toBe(0n);
      expect(zero.dimensions).toBe(256);

      const pos255 = getGateEmbedding(255n);
      expect(pos255.cyclePosition).toBe(255);

      const nextCycle = getGateEmbedding(256n);
      expect(nextCycle.cyclePosition).toBe(0);
    });

    it('should calculate quantum phase correctly', () => {
      const zero = getGateEmbedding(0n);
      expect(zero.quantumPhase).toBe(0);

      const half = getGateEmbedding(128n);
      expect(half.quantumPhase).toBeCloseTo(Math.PI, 5);

      const full = getGateEmbedding(256n);
      expect(full.quantumPhase).toBe(0); // Back to 0
    });

    it('should create normalized 256D vector', () => {
      const embedding = getGateEmbedding(42n);
      expect(embedding.vector.length).toBe(256);

      // Check normalization
      const magnitude = Math.sqrt(embedding.vector.reduce((sum, val) => sum + val * val, 0));
      expect(magnitude).toBeCloseTo(1.0, 5);
    });

    it('should have primary activation at cycle position', () => {
      const embedding = getGateEmbedding(42n);
      // Find max value in vector
      const maxIndex = embedding.vector.indexOf(Math.max(...embedding.vector));
      expect(maxIndex).toBe(42);
    });
  });

  describe('gateInterference', () => {
    it('should calculate interference between embeddings', () => {
      const a = getGateEmbedding(0n);
      const b = getGateEmbedding(128n);

      // Opposite phase should give negative or zero interference
      const interference = gateInterference(a, b);
      expect(interference).toBeLessThanOrEqual(0);

      // Same embedding should give positive interference
      const selfInterference = gateInterference(a, a);
      expect(selfInterference).toBeGreaterThan(0);
    });
  });

  describe('getGateBitString', () => {
    it('should return 8-bit string representation', () => {
      const zero = getGateEmbedding(0n);
      expect(getGateBitString(zero)).toBe('00000000');

      const pattern = getGateEmbedding(170n); // 10101010
      expect(getGateBitString(pattern)).toBe('10101010');

      const max = getGateEmbedding(255n);
      expect(getGateBitString(max)).toBe('11111111');
    });
  });

  describe('gateEntropy', () => {
    it('should calculate entropy of embedding', () => {
      const embedding = getGateEmbedding(42n);
      const entropy = gateEntropy(embedding);

      // Entropy should be positive for non-trivial embeddings
      expect(entropy).toBeGreaterThan(0);

      // Create a more uniform distribution for higher entropy
      const uniform = getGateEmbedding(255n);
      const uniformEntropy = gateEntropy(uniform);
      expect(uniformEntropy).toBeGreaterThan(0);
    });
  });
});
