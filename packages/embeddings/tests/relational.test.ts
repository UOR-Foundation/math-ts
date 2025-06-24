import {
  getRelationalEmbedding,
  relationalSimilarity,
  isSelfReferential,
  getQueryComplexity,
} from '../src/relational';
import type { FieldPattern } from '../src/types';

describe('Relational Embedding', () => {
  describe('getRelationalEmbedding', () => {
    it('should create 2D embedding with schema and query', () => {
      const fieldPattern: FieldPattern = [true, false, true, false, false, false, false, false];
      const factors = [2n, 3n, 7n];

      const embedding = getRelationalEmbedding(42n, fieldPattern, factors);

      expect(embedding.dimensions).toBe(2);
      expect(embedding.schema).toEqual(fieldPattern);
      expect(embedding.query).toEqual(factors);
      expect(embedding.hashDigest).toHaveLength(16);
      expect(embedding.vector[0]).toBe(0.25); // 2 active fields / 8
      expect(embedding.vector[1]).toBe(0.3); // 3 factors / 10
    });

    it('should default to self-reference when no factors provided', () => {
      const fieldPattern: FieldPattern = [true, false, false, false, false, false, false, false];
      const embedding = getRelationalEmbedding(7n, fieldPattern);

      expect(embedding.query).toEqual([7n]);
    });

    it('should normalize vector components correctly', () => {
      const allActive: FieldPattern = [true, true, true, true, true, true, true, true];
      const manyFactors = Array.from({ length: 15 }, (_, i) => BigInt(i + 1));

      const embedding = getRelationalEmbedding(1000n, allActive, manyFactors);

      expect(embedding.vector[0]).toBe(1); // 8/8 = 1
      expect(embedding.vector[1]).toBe(1); // Capped at 1
    });
  });

  describe('relationalSimilarity', () => {
    it('should calculate similarity based on schema and query overlap', () => {
      const pattern1: FieldPattern = [true, true, false, false, false, false, false, false];
      const pattern2: FieldPattern = [true, false, true, false, false, false, false, false];
      const pattern3: FieldPattern = [false, false, false, false, true, true, true, true];

      const a = getRelationalEmbedding(6n, pattern1, [2n, 3n]);
      const b = getRelationalEmbedding(10n, pattern2, [2n, 5n]);
      const c = getRelationalEmbedding(15n, pattern3, [3n, 5n]);

      // Some overlap in both schema and query
      const simAB = relationalSimilarity(a, b);
      expect(simAB).toBeGreaterThan(0);
      expect(simAB).toBeLessThan(1);

      // No schema overlap, some query overlap
      const simAC = relationalSimilarity(a, c);
      expect(simAC).toBeGreaterThan(0);
      expect(simAC).toBeLessThan(simAB);

      // Self similarity should be 1
      expect(relationalSimilarity(a, a)).toBe(1);
    });
  });

  describe('isSelfReferential', () => {
    it('should identify self-referential numbers (primes)', () => {
      const fieldPattern: FieldPattern = [true, false, false, false, false, false, false, false];

      const prime = getRelationalEmbedding(7n, fieldPattern, [7n]);
      expect(isSelfReferential(prime, 7n)).toBe(true);

      const composite = getRelationalEmbedding(6n, fieldPattern, [2n, 3n]);
      expect(isSelfReferential(composite, 6n)).toBe(false);
    });
  });

  describe('getQueryComplexity', () => {
    it('should calculate complexity based on factors', () => {
      const pattern: FieldPattern = [true, false, false, false, false, false, false, false];

      const simple = getRelationalEmbedding(2n, pattern, [2n]);
      const simpleComplexity = getQueryComplexity(simple);

      const complex = getRelationalEmbedding(30n, pattern, [2n, 3n, 5n]);
      const complexComplexity = getQueryComplexity(complex);

      expect(complexComplexity).toBeGreaterThan(simpleComplexity);

      // Large factors add logarithmic complexity
      const large = getRelationalEmbedding(1000n, pattern, [1000n]);
      const largeComplexity = getQueryComplexity(large);
      expect(largeComplexity).toBeGreaterThan(simpleComplexity);
    });
  });
});
