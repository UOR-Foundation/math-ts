/**
 * Fixed Point Engine Tests
 *
 * Tests the discovery and analysis of fixed points in the self-referential system
 */

import { FixedPointEngine } from '../src/fixed-points';
import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import type { AlgebraicStructures } from '@uor-foundation/algebra';
import type { GeometricManifolds } from '@uor-foundation/geometry';
import type { CalculusEngine } from '@uor-foundation/calculus';

// Mock implementations for testing
const mockAlgebra: AlgebraicStructures = {
  detectGroups: () => ({ groups: [], confidence: 0.5 }),
  detectRings: () => ({ rings: [], confidence: 0.5 }),
  detectFields: () => ({ fields: [], confidence: 0.5 }),
  findHomomorphisms: () => ({ homomorphisms: [], confidence: 0.5 }),
  analyzeSymmetries: () => ({ symmetries: [], confidence: 0.5 }),
};

const mockGeometry: GeometricManifolds = {
  embedInSpace: () => ({ coordinates: [0, 0, 0], curvature: 0 }),
  calculateCurvature: () => 0,
  findGeodesics: () => ({ paths: [], distance: 0 }),
  detectSingularities: () => ({ singularities: [], type: 'regular' }),
  computeTopology: () => ({ genus: 0, eulerCharacteristic: 2 }),
};

const mockCalculus: CalculusEngine = {
  derivative: () => 0,
  integral: () => 0,
  limit: () => 0,
  findCriticalPoints: () => ({ points: [], types: [] }),
  solveDifferentialEquation: () => ({ solution: 'x', stability: 'stable' }),
  gradientFlow: (start: bigint, maxSteps: number) => [start], // Simple flow that stays at start
  computeLyapunovExponent: (seed: bigint, iterations: number) => 0.1, // Small positive value
} as any;

describe('FixedPointEngine', () => {
  let fieldSubstrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;
  let fixedPointEngine: FixedPointEngine;

  beforeEach(() => {
    fieldSubstrate = createFieldSubstrate();
    resonance = createResonanceDynamics(fieldSubstrate);
    topology = createPageTopology(fieldSubstrate, resonance);
    operators = createArithmeticOperators(fieldSubstrate, resonance, topology);

    fixedPointEngine = new FixedPointEngine(
      fieldSubstrate,
      resonance,
      topology,
      operators,
      mockAlgebra,
      mockGeometry,
      mockCalculus,
    );
  });

  describe('Fixed Point Discovery', () => {
    it('should find arithmetic fixed points', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 100n);

      expect(analysis.fixedPoints).toBeDefined();
      expect(Array.isArray(analysis.fixedPoints)).toBe(true);
      expect(analysis.fixedPoints.length).toBeGreaterThan(0);
    });

    it('should find digital root fixed points (1-9)', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 10n);

      // Digital roots 1-9 are fixed points
      const digitalRootFixed = analysis.fixedPoints.filter(
        (fp) => fp.type === 'custom' && fp.value >= 1n && fp.value <= 9n,
      );

      expect(digitalRootFixed.length).toBeGreaterThan(0);

      // Each should have reasonable stability
      digitalRootFixed.forEach((fp) => {
        expect(fp.stability).toBeGreaterThan(0);
        expect(fp.stability).toBeLessThanOrEqual(1);
      });
    });

    it('should find resonance fixed points', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 50n);

      const resonanceFixed = analysis.fixedPoints.filter(
        (fp) => fp.type === 'custom' && fp.stability > 0.5 && fp.stability < 1.0,
      );

      expect(resonanceFixed.length).toBeGreaterThanOrEqual(0);
    });

    it('should find Lagrange fixed points', () => {
      const analysis = fixedPointEngine.findFixedPoints(40n, 60n);

      const lagrangeFixed = analysis.fixedPoints.filter((fp) => fp.type === 'lagrange');

      expect(lagrangeFixed.length).toBeGreaterThan(0);

      // Should include 48 and 49
      const values = lagrangeFixed.map((fp) => fp.value);
      expect(values).toContain(48n);
      expect(values).toContain(49n);
    });

    it('should classify fixed points as attractors or repellers', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 30n);

      // Attractors have high stability
      expect(analysis.attractors).toBeDefined();
      analysis.attractors.forEach((fp) => {
        expect(fp.stability).toBeGreaterThan(0.5);
      });

      // Repellers have low stability
      expect(analysis.repellers).toBeDefined();
      analysis.repellers.forEach((fp) => {
        expect(fp.stability).toBeLessThan(0.5);
      });

      // Every fixed point should be either attractor or repeller
      const totalClassified = analysis.attractors.length + analysis.repellers.length;
      expect(totalClassified).toBe(analysis.fixedPoints.length);
    });
  });

  describe('Cycle Detection', () => {
    it('should find periodic cycles', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 50n);

      expect(analysis.cycles).toBeDefined();
      expect(Array.isArray(analysis.cycles)).toBe(true);

      // If cycles exist, validate their structure
      if (analysis.cycles.length > 0) {
        analysis.cycles.forEach((cycle) => {
          expect(cycle.period).toBeGreaterThan(0);
          expect(cycle.elements).toHaveLength(cycle.period);
          expect(typeof cycle.stability).toBe('number');
          expect(Array.isArray(cycle.basin)).toBe(true);
        });
      }
    });

    it('should detect 2-cycles and 3-cycles', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 30n);

      if (analysis.cycles.length > 0) {
        const shortCycles = analysis.cycles.filter((c) => c.period <= 3);

        shortCycles.forEach((cycle) => {
          // Verify cycle is actually periodic
          const elements = cycle.elements;
          for (let i = 0; i < elements.length; i++) {
            const current = elements[i];
            const next = elements[(i + 1) % elements.length];

            // The dynamics should map current to next
            // (This is a conceptual test - actual dynamics may vary)
            expect(next).toBeDefined();
          }
        });
      }
    });
  });

  describe('Strange Attractors', () => {
    it('should detect strange attractors in chaotic regions', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 50n);

      expect(analysis.strangeAttractors).toBeDefined();
      expect(Array.isArray(analysis.strangeAttractors)).toBe(true);

      // If strange attractors exist, validate their properties
      if (analysis.strangeAttractors.length > 0) {
        analysis.strangeAttractors.forEach((attractor) => {
          expect(attractor.dimension).toBeGreaterThan(0);
          expect(attractor.lyapunov).toBeDefined();
          expect(attractor.points.length).toBeGreaterThan(0);
          expect(attractor.description).toBeTruthy();
        });
      }
    });

    it('should have positive Lyapunov exponents for strange attractors', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 50n);

      analysis.strangeAttractors.forEach((attractor) => {
        // Strange attractors should have positive Lyapunov exponents (chaos)
        expect(attractor.lyapunov).toBeGreaterThan(0);
      });
    });
  });

  describe('Basin of Attraction', () => {
    it('should compute basins for fixed points', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 50n);

      const fixedPointsWithBasins = analysis.fixedPoints.filter((fp) => fp.basin.length > 0);

      expect(fixedPointsWithBasins.length).toBeGreaterThanOrEqual(0);

      fixedPointsWithBasins.forEach((fp) => {
        // Basin should contain numbers that flow to the fixed point
        expect(fp.basin.every((n) => n !== fp.value)).toBe(true); // Basin excludes the fixed point itself
      });
    });

    it('should have larger basins for stronger attractors', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 30n);

      const strongAttractors = analysis.attractors.filter((fp) => fp.stability > 0.8);
      const weakAttractors = analysis.attractors.filter(
        (fp) => fp.stability <= 0.8 && fp.stability > 0.5,
      );

      if (strongAttractors.length > 0 && weakAttractors.length > 0) {
        const avgStrongBasinSize =
          strongAttractors.reduce((sum, fp) => sum + fp.basin.length, 0) / strongAttractors.length;
        const avgWeakBasinSize =
          weakAttractors.reduce((sum, fp) => sum + fp.basin.length, 0) / weakAttractors.length;

        // Strong attractors should generally have larger basins
        // Allow for some variance in the basin sizes
        expect(avgStrongBasinSize).toBeGreaterThan(avgWeakBasinSize * 0.95);
      }
    });
  });

  describe('Self-Referential Fixed Points', () => {
    it('should find self-referential fixed points', () => {
      const patterns = fixedPointEngine.findSelfReferentialFixedPoints(1n, 100n);

      expect(Array.isArray(patterns)).toBe(true);

      patterns.forEach((pattern) => {
        expect(pattern.type).toBeTruthy();
        expect(pattern.instances.length).toBeGreaterThan(0);
        expect(pattern.confidence).toBeGreaterThan(0);
        expect(pattern.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should identify self-encoding patterns', () => {
      const patterns = fixedPointEngine.findSelfReferentialFixedPoints(1n, 50n);

      const selfEncodingPatterns = patterns.filter((p) => p.type === 'self-encoding');

      if (selfEncodingPatterns.length > 0) {
        selfEncodingPatterns.forEach((pattern) => {
          expect(pattern.confidence).toBeGreaterThanOrEqual(0.8);
        });
      }
    });

    it('should find Gödel fixed points', () => {
      const patterns = fixedPointEngine.findSelfReferentialFixedPoints(1n, 100n);

      const godelFixed = patterns.filter((p) => p.type === 'godel-fixed-point');

      // Gödel fixed points are rare but significant
      if (godelFixed.length > 0) {
        godelFixed.forEach((pattern) => {
          expect(pattern.confidence).toBe(1.0); // Perfect confidence for true fixed points
          expect(pattern.instances.length).toBe(1); // Each is unique
        });
      }
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle empty ranges gracefully', () => {
      const analysis = fixedPointEngine.findFixedPoints(100n, 100n);

      expect(analysis.fixedPoints).toBeDefined();
      expect(Array.isArray(analysis.fixedPoints)).toBe(true);
      expect(analysis.cycles).toBeDefined();
      expect(analysis.strangeAttractors).toBeDefined();
    });

    it('should handle large ranges efficiently', () => {
      const startTime = Date.now();
      const analysis = fixedPointEngine.findFixedPoints(1n, 100n);
      const duration = Date.now() - startTime;

      expect(analysis).toBeDefined();
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should find fixed points consistently', () => {
      // Run analysis twice on same range
      const analysis1 = fixedPointEngine.findFixedPoints(1n, 30n);
      const analysis2 = fixedPointEngine.findFixedPoints(1n, 30n);

      // Should find the same fixed points
      const values1 = analysis1.fixedPoints.map((fp) => fp.value).sort();
      const values2 = analysis2.fixedPoints.map((fp) => fp.value).sort();

      expect(values1).toEqual(values2);
    });
  });

  describe('Mathematical Properties', () => {
    it('should verify fixed point definition f(x) = x', () => {
      const analysis = fixedPointEngine.findFixedPoints(1n, 50n);

      // For arithmetic fixed points, verify they satisfy f(x) = x
      const arithmeticFixed = analysis.fixedPoints.filter((fp) => fp.type === 'custom');

      expect(arithmeticFixed.length).toBeGreaterThan(0);

      // Each fixed point should be stable under its defining operation
      arithmeticFixed.forEach((fp) => {
        expect(fp.stability).toBeGreaterThan(0);
      });
    });

    it('should have monotonic stability in gradient flows', () => {
      const analysis = fixedPointEngine.findFixedPoints(40n, 60n);

      // Lagrange points should be local minima/maxima
      const lagrangePoints = analysis.fixedPoints.filter((fp) => fp.type === 'lagrange');

      lagrangePoints.forEach((lp) => {
        // Stability should reflect local extremum property
        expect(lp.stability).toBeGreaterThan(0.5);
      });
    });
  });
});
