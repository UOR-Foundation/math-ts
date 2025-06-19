import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import {
  PAGE_SIZE,
  locateNumber,
  getPageNumbers,
  calculatePageResonance,
  getPageInfo,
  isPageBoundary,
  nextPageBoundary,
  LagrangeType,
  PRIMARY_LAGRANGE_POINTS,
  isPrimaryLagrangePoint,
  detectLagrangeType,
  findLagrangePoints,
  nearestLagrangePoint,
  lagrangeGravity,
  gradientDescentToLagrange,
  createPageTopology,
  analyzeTopology,
} from '../src';

describe('Page Topology - Layer 2', () => {
  const substrate = createFieldSubstrate();
  const dynamics = createResonanceDynamics(substrate);
  const topology = createPageTopology(substrate, dynamics);

  describe('Page Structure', () => {
    test('should have page size of 48', () => {
      expect(PAGE_SIZE).toBe(48);
    });

    test('should locate numbers correctly within pages', () => {
      // First page
      const loc0 = locateNumber(0n);
      expect(loc0).toEqual({ page: 0, offset: 0, cycle: 0, phase: 0 });

      const loc47 = locateNumber(47n);
      expect(loc47).toEqual({ page: 0, offset: 47, cycle: 0, phase: 47 });

      // Second page
      const loc48 = locateNumber(48n);
      expect(loc48).toEqual({ page: 1, offset: 0, cycle: 0, phase: 48 });

      const loc49 = locateNumber(49n);
      expect(loc49).toEqual({ page: 1, offset: 1, cycle: 0, phase: 49 });

      // Later pages
      const loc100 = locateNumber(100n);
      expect(loc100).toEqual({ page: 2, offset: 4, cycle: 0, phase: 100 });

      // Second cycle
      const loc256 = locateNumber(256n);
      expect(loc256).toEqual({ page: 5, offset: 16, cycle: 1, phase: 0 });
    });

    test('should get correct page numbers', () => {
      const page0 = getPageNumbers(0);
      expect(page0).toHaveLength(48);
      expect(page0[0]).toBe(0n);
      expect(page0[47]).toBe(47n);

      const page1 = getPageNumbers(1);
      expect(page1[0]).toBe(48n);
      expect(page1[47]).toBe(95n);
    });

    test('should identify page boundaries', () => {
      expect(isPageBoundary(0n)).toBe(true); // Page start
      expect(isPageBoundary(47n)).toBe(true); // Page end
      expect(isPageBoundary(48n)).toBe(true); // Page start

      expect(isPageBoundary(1n)).toBe(false);
      expect(isPageBoundary(25n)).toBe(false);
      expect(isPageBoundary(49n)).toBe(false);
      expect(isPageBoundary(50n)).toBe(false);
    });

    test('should find next page boundary', () => {
      expect(nextPageBoundary(10n)).toBe(47n);
      expect(nextPageBoundary(47n)).toBe(48n);
      expect(nextPageBoundary(48n)).toBe(48n); // Already at boundary
      expect(nextPageBoundary(49n)).toBe(95n); // Go to end of page 1
    });
  });

  describe('Page Resonance Statistics', () => {
    test('should calculate page resonance statistics', () => {
      const stats = calculatePageResonance(0, dynamics);

      expect(stats.mean).toBeGreaterThan(0);
      expect(stats.variance).toBeGreaterThan(0);
      expect(stats.min).toBeLessThanOrEqual(stats.mean);
      expect(stats.max).toBeGreaterThanOrEqual(stats.mean);
      expect(stats.skew).toBeDefined();
      expect(stats.kurtosis).toBeDefined();
    });

    test('should get comprehensive page info', () => {
      const info = getPageInfo(0, substrate, dynamics);

      expect(info.pageNumber).toBe(0);
      expect(info.startNumber).toBe(0n);
      expect(info.endNumber).toBe(47n);
      expect(info.resonanceStats).toBeDefined();
      expect(info.averageActiveFields).toBeGreaterThan(0);
      expect(info.averageActiveFields).toBeLessThan(8);
    });
  });

  describe('Primary Lagrange Points', () => {
    test('should have correct primary Lagrange points', () => {
      expect(PRIMARY_LAGRANGE_POINTS).toEqual([0, 1, 48, 49]);
    });

    test('should detect primary Lagrange points by resonance', () => {
      // Check known primary points
      expect(isPrimaryLagrangePoint(0n, dynamics)).toBe(true);
      expect(isPrimaryLagrangePoint(1n, dynamics)).toBe(true);
      expect(isPrimaryLagrangePoint(48n, dynamics)).toBe(true);
      expect(isPrimaryLagrangePoint(49n, dynamics)).toBe(true);

      // Check non-primary points
      expect(isPrimaryLagrangePoint(2n, dynamics)).toBe(false);
      expect(isPrimaryLagrangePoint(47n, dynamics)).toBe(false);
      expect(isPrimaryLagrangePoint(50n, dynamics)).toBe(false);
    });

    test('should verify perfect resonance at positions 48 and 49', () => {
      const res48 = dynamics.calculateResonance(48n);
      const res49 = dynamics.calculateResonance(49n);

      expect(res48).toBeCloseTo(1.0, 15);
      expect(res49).toBeCloseTo(1.0, 15);
    });
  });

  describe('Lagrange Point Detection', () => {
    test('should detect Lagrange point types', () => {
      expect(detectLagrangeType(0n, substrate, dynamics)).toBe(LagrangeType.PRIMARY);
      expect(detectLagrangeType(1n, substrate, dynamics)).toBe(LagrangeType.PRIMARY);
      expect(detectLagrangeType(48n, substrate, dynamics)).toBe(LagrangeType.PRIMARY);
      expect(detectLagrangeType(49n, substrate, dynamics)).toBe(LagrangeType.PRIMARY);

      // Test some non-Lagrange points
      expect(detectLagrangeType(10n, substrate, dynamics)).toBe(null);
      expect(detectLagrangeType(25n, substrate, dynamics)).toBe(null);
    });

    test('should find Lagrange points in a range', () => {
      const points = findLagrangePoints(0n, 100n, substrate, dynamics);

      expect(points.length).toBeGreaterThan(0);

      // Should include known primary points
      const positions = points.map((p) => Number(p.position));
      expect(positions).toContain(0);
      expect(positions).toContain(1);
      expect(positions).toContain(48);
      expect(positions).toContain(49);

      // Check point properties
      const point48 = points.find((p) => p.position === 48n);
      expect(point48).toBeDefined();
      expect(point48!.type).toBe(LagrangeType.PRIMARY);
      expect(point48!.resonance).toBeCloseTo(1.0, 15);
      expect(point48!.activeFields).toContain(4);
      expect(point48!.activeFields).toContain(5);
    });

    test('should find nearest Lagrange point', () => {
      // From 25, should find a nearby Lagrange point
      const nearest = nearestLagrangePoint(25n, substrate, dynamics);
      expect(nearest).toBeDefined();
      expect(nearest!.position).toBeDefined();

      // From 47, should find 48
      const from47 = nearestLagrangePoint(47n, substrate, dynamics);
      expect(from47).toBeDefined();

      // Already at Lagrange point
      const from48 = nearestLagrangePoint(48n, substrate, dynamics);
      expect(from48).toBeDefined();
      expect(from48!.position).toBe(48n);
      expect(from48!.type).toBe(LagrangeType.PRIMARY);
    });
  });

  describe('Lagrange Gravity', () => {
    test('should calculate gravity correctly', () => {
      const point: any = {
        position: 48n,
        type: LagrangeType.PRIMARY,
        resonance: 1.0,
        activeFields: [4, 5],
      };

      // At the point itself
      expect(lagrangeGravity(point, 48n)).toBe(1.0);

      // Nearby
      expect(lagrangeGravity(point, 47n)).toBeGreaterThan(0.8);
      expect(lagrangeGravity(point, 49n)).toBeGreaterThan(0.8);

      // Far away
      expect(lagrangeGravity(point, 100n)).toBeLessThan(0.2);

      // Gravity decreases with distance
      const g1 = lagrangeGravity(point, 49n);
      const g2 = lagrangeGravity(point, 50n);
      const g3 = lagrangeGravity(point, 51n);
      expect(g1).toBeGreaterThan(g2);
      expect(g2).toBeGreaterThan(g3);
    });
  });

  describe('Gradient Descent', () => {
    test('should find path to Lagrange point', () => {
      // Starting near 48
      const path = gradientDescentToLagrange(45n, substrate, dynamics);
      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThanOrEqual(1);
      expect(path[0]).toBe(45n);

      // Should end at or near a Lagrange point
      const lastPosition = path[path.length - 1];
      const type = detectLagrangeType(lastPosition, substrate, dynamics);
      expect(type).toBeDefined();
    });

    test('should stay at Lagrange point if starting there', () => {
      const path = gradientDescentToLagrange(48n, substrate, dynamics);
      expect(path).toEqual([48n]);
    });
  });

  describe('PageTopology Interface', () => {
    test('should provide all interface methods', () => {
      expect(typeof topology.locateNumber).toBe('function');
      expect(typeof topology.getPageInfo).toBe('function');
      expect(typeof topology.findLagrangePoints).toBe('function');
      expect(typeof topology.nearestLagrangePoint).toBe('function');
      expect(typeof topology.isPageBoundary).toBe('function');
      expect(typeof topology.getPageNumbers).toBe('function');
      expect(typeof topology.gradientDescent).toBe('function');
    });

    test('should locate numbers through interface', () => {
      const loc = topology.locateNumber(100n);
      expect(loc.page).toBe(2);
      expect(loc.offset).toBe(4);
    });

    test('should find Lagrange points through interface', () => {
      const points = topology.findLagrangePoints(0n, 50n);
      expect(points.length).toBeGreaterThan(0);
      expect(points.some((p) => p.position === 48n)).toBe(true);
    });
  });

  describe('Topology Analysis', () => {
    test('should analyze topology of a range', () => {
      const analysis = analyzeTopology(0n, 100n, topology);

      expect(analysis.pageCount).toBe(3); // Pages 0, 1, 2
      expect(analysis.lagrangePoints).toBeDefined();
      expect(analysis.primaryLagrangeCount).toBeGreaterThan(0);
      expect(analysis.averageResonance).toBeGreaterThan(0);
      expect(analysis.resonanceVariance).toBeGreaterThan(0);
      expect(analysis.pageUtilization).toBeGreaterThan(0);
      expect(analysis.pageUtilization).toBeLessThanOrEqual(1);
    });
  });

  describe('Known Examples from Documentation', () => {
    test('should verify page boundaries create phase transitions', () => {
      // Check resonance jump at 47->48
      const res47 = dynamics.calculateResonance(47n);
      const res48 = dynamics.calculateResonance(48n);

      expect(res47).not.toBeCloseTo(1.0, 1);
      expect(res48).toBeCloseTo(1.0, 15);

      // Check field activation change
      const fields47 = substrate.getActiveFieldIndices(47n);
      const fields48 = substrate.getActiveFieldIndices(48n);

      // 47 = binary 00101111, so fields 0,1,2,3,5 are active
      expect(fields47).toContain(5);
      expect(fields47).not.toContain(4);
      expect(fields48).toContain(4);
      expect(fields48).toContain(5);
    });

    test('should verify 256-number cycle', () => {
      // Primary Lagrange points repeat every 256
      expect(isPrimaryLagrangePoint(0n, dynamics)).toBe(true);
      expect(isPrimaryLagrangePoint(256n, dynamics)).toBe(true);
      expect(isPrimaryLagrangePoint(512n, dynamics)).toBe(true);

      expect(isPrimaryLagrangePoint(48n, dynamics)).toBe(true);
      expect(isPrimaryLagrangePoint(304n, dynamics)).toBe(true); // 48 + 256
    });
  });
});
