import {
  getConstitutionalEmbedding,
  constitutionalDistance,
  getActiveFieldIndices,
} from '../src/constitutional';

describe('Constitutional Embedding', () => {
  describe('getConstitutionalEmbedding', () => {
    it('should extract 8-bit pattern correctly', () => {
      // Test with 0 (no fields active)
      const zero = getConstitutionalEmbedding(0n);
      expect(zero.dimensions).toBe(8);
      expect(zero.vector).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(zero.activeFieldCount).toBe(0);

      // Test with 255 (all fields active)
      const allActive = getConstitutionalEmbedding(255n);
      expect(allActive.vector).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
      expect(allActive.activeFieldCount).toBe(8);

      // Test with specific pattern (170 = 10101010)
      const pattern = getConstitutionalEmbedding(170n);
      expect(pattern.vector).toEqual([0, 1, 0, 1, 0, 1, 0, 1]);
      expect(pattern.activeFieldCount).toBe(4);
    });

    it('should handle large numbers by taking first 8 bits', () => {
      // 256 = 100000000 in binary, so first 8 bits are 00000000
      const large = getConstitutionalEmbedding(256n);
      expect(large.vector).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);

      // 511 = 111111111 in binary, so first 8 bits are 11111111
      const largePattern = getConstitutionalEmbedding(511n);
      expect(largePattern.vector).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    });
  });

  describe('constitutionalDistance', () => {
    it('should calculate Hamming distance correctly', () => {
      const a = getConstitutionalEmbedding(0n); // 00000000
      const b = getConstitutionalEmbedding(255n); // 11111111
      expect(constitutionalDistance(a, b)).toBe(8);

      const c = getConstitutionalEmbedding(170n); // 10101010
      const d = getConstitutionalEmbedding(85n); // 01010101
      expect(constitutionalDistance(c, d)).toBe(8);

      // Same patterns should have distance 0
      expect(constitutionalDistance(a, a)).toBe(0);
      expect(constitutionalDistance(c, c)).toBe(0);
    });
  });

  describe('getActiveFieldIndices', () => {
    it('should return correct indices of active fields', () => {
      const zero = getConstitutionalEmbedding(0n);
      expect(getActiveFieldIndices(zero)).toEqual([]);

      const one = getConstitutionalEmbedding(1n); // 00000001
      expect(getActiveFieldIndices(one)).toEqual([0]);

      const pattern = getConstitutionalEmbedding(170n); // 10101010
      expect(getActiveFieldIndices(pattern)).toEqual([1, 3, 5, 7]);

      const allActive = getConstitutionalEmbedding(255n);
      expect(getActiveFieldIndices(allActive)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
  });
});
