import {
  getPageEmbedding,
  pageDistance,
  getPageMembers,
  isPageBoundary,
  getNearestLagrangePoint,
} from '../src/page';

describe('Page Embedding', () => {
  describe('getPageEmbedding', () => {
    it('should calculate page and offset correctly', () => {
      // First page
      const zero = getPageEmbedding(0n);
      expect(zero.pageNumber).toBe(0n);
      expect(zero.offset).toBe(0);
      expect(zero.dimensions).toBe(48);

      // Number 47 is last in first page
      const lastInFirst = getPageEmbedding(47n);
      expect(lastInFirst.pageNumber).toBe(0n);
      expect(lastInFirst.offset).toBe(47);

      // Number 48 starts second page
      const firstInSecond = getPageEmbedding(48n);
      expect(firstInSecond.pageNumber).toBe(1n);
      expect(firstInSecond.offset).toBe(0);
    });

    it('should create correct one-hot vector', () => {
      const embedding = getPageEmbedding(5n);
      const expectedVector = new Array(48).fill(0);
      expectedVector[5] = 1;
      expect(embedding.vector).toEqual(expectedVector);
    });

    it('should identify Lagrange points correctly', () => {
      // Lagrange points at 48, 49 in each 256-cycle
      expect(getPageEmbedding(48n).isLagrange).toBe(true);
      expect(getPageEmbedding(49n).isLagrange).toBe(true);
      expect(getPageEmbedding(50n).isLagrange).toBe(false);

      // Next cycle
      expect(getPageEmbedding(304n).isLagrange).toBe(true); // 256 + 48
      expect(getPageEmbedding(305n).isLagrange).toBe(true); // 256 + 49
    });
  });

  describe('pageDistance', () => {
    it('should return infinity for different pages', () => {
      const page0 = getPageEmbedding(0n);
      const page1 = getPageEmbedding(48n);
      expect(pageDistance(page0, page1)).toBe(Infinity);
    });

    it('should calculate Manhattan distance within same page', () => {
      const a = getPageEmbedding(5n);
      const b = getPageEmbedding(10n);
      expect(pageDistance(a, b)).toBe(5);

      const c = getPageEmbedding(47n);
      const d = getPageEmbedding(0n);
      expect(pageDistance(c, d)).toBe(47);
    });
  });

  describe('getPageMembers', () => {
    it('should return all 48 members of a page', () => {
      const page0Members = getPageMembers(0n);
      expect(page0Members.length).toBe(48);
      expect(page0Members[0]).toBe(0n);
      expect(page0Members[47]).toBe(47n);

      const page1Members = getPageMembers(1n);
      expect(page1Members[0]).toBe(48n);
      expect(page1Members[47]).toBe(95n);
    });
  });

  describe('isPageBoundary', () => {
    it('should identify page boundaries', () => {
      expect(isPageBoundary(0n)).toBe(true);
      expect(isPageBoundary(48n)).toBe(true);
      expect(isPageBoundary(96n)).toBe(true);
      expect(isPageBoundary(47n)).toBe(false);
      expect(isPageBoundary(49n)).toBe(false);
    });
  });

  describe('getNearestLagrangePoint', () => {
    it('should find nearest Lagrange point', () => {
      // Near first Lagrange points
      expect(getNearestLagrangePoint(0n)).toBe(48n);
      expect(getNearestLagrangePoint(40n)).toBe(48n);
      expect(getNearestLagrangePoint(50n)).toBe(49n);

      // In second cycle
      expect(getNearestLagrangePoint(300n)).toBe(304n); // 256 + 48

      // Exactly at Lagrange point
      expect(getNearestLagrangePoint(48n)).toBe(48n);
    });
  });
});
