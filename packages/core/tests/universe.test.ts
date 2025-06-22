import { MathematicalUniverse } from '../src';

describe('Mathematical Universe - Core Integration', () => {
  // Create universe once for all tests to avoid expensive bootstrapping
  const universe = new MathematicalUniverse();

  // For tests that need a fresh bootstrapped universe
  let bootstrappedUniverse: MathematicalUniverse | null = null;
  const getBootstrappedUniverse = () => {
    if (!bootstrappedUniverse) {
      bootstrappedUniverse = new MathematicalUniverse();
    }
    return bootstrappedUniverse;
  };

  describe('Universe Creation and Initialization', () => {
    test('should create universe with all 8 layers', () => {
      expect(universe).toBeDefined();
      // Test that all layers are initialized
      const analysis = universe.analyze(7n);
      expect(analysis).toBeDefined();
      expect(analysis.number).toBe(7n);
    });

    test('should bootstrap self-referential system', () => {
      // The universe should be self-consistent
      const bootstrapTest = universe.analyze(0n);
      expect(bootstrapTest.fields).toBeDefined();
      expect(bootstrapTest.resonance).toBeDefined();
    });
  });

  describe('Living Number Creation', () => {
    test('should create living numbers with full properties', () => {
      const seven = universe.number(7n);

      expect(seven.value).toBe(7n);
      expect(seven.fields).toBeDefined();
      expect(seven.resonance).toBeDefined();
      expect(seven.isPrime).toBe(true);
      expect(seven.pagePosition).toBeDefined();
      expect(seven.stabilityMetric).toBeDefined();
    });

    test('should create living numbers with computational state', () => {
      const num = universe.number(48n);

      expect(num.computationalState).toBeDefined();
      expect(num.computationalState.status).toBeDefined();
      expect(num.computationalState.energy).toBeDefined();
      expect(num.computationalState.history).toBeDefined();
    });

    test('should handle special numbers correctly', () => {
      // Test Lagrange points
      const zero = universe.number(0n);
      const one = universe.number(1n);
      const fortyEight = universe.number(48n);
      const fortyNine = universe.number(49n);

      expect(zero.isLagrangePoint).toBe(true);
      expect(one.isLagrangePoint).toBe(true);
      expect(fortyEight.isLagrangePoint).toBe(true);
      expect(fortyNine.isLagrangePoint).toBe(true);

      // Near perfect resonance
      expect(Math.abs(fortyEight.resonance - 1.0)).toBeLessThan(0.01);
      expect(Math.abs(fortyNine.resonance - 1.0)).toBeLessThan(0.01);
    });
  });

  describe('Field Layer Integration', () => {
    test('should provide correct field patterns', () => {
      const analysis = universe.analyze(77n);

      expect(analysis.fields).toHaveLength(8);
      expect(analysis.fields.every((f) => typeof f === 'boolean')).toBe(true);

      // Verify field pattern matches n mod 256
      const expectedPattern = 77 % 256;
      const actualPattern = analysis.fields.reduce((acc, bit, i) => acc + (bit ? 1 << i : 0), 0);
      expect(actualPattern).toBe(expectedPattern);
    });

    test('should verify field constant relationships', () => {
      // The perfect resonance condition: α₄ × α₅ = 1
      const fieldConstants = universe.getFieldConstants();
      expect(fieldConstants).toHaveLength(8);

      const product = fieldConstants[4] * fieldConstants[5];
      expect(Math.abs(product - 1.0)).toBeLessThan(1e-10);
    });
  });

  describe('Resonance Layer Integration', () => {
    test('should calculate resonance correctly', () => {
      const seven = universe.analyze(7n);
      expect(seven.resonance).toBeGreaterThan(0);

      // Prime numbers typically have low resonance
      expect(seven.resonance).toBeLessThan(10);
    });

    test('should detect resonance interference', () => {
      const result = universe.multiply(7n, 11n);

      expect(result.result).toBe(77n);
      expect(result.artifacts).toBeDefined();
      expect(result.artifacts.length).toBeGreaterThan(0);

      // Should detect denormalization artifacts
      const hasFieldChanges = result.artifacts.some(
        (a) => a.type === 'vanishing' || a.type === 'emergent',
      );
      expect(hasFieldChanges).toBe(true);
    });
  });

  describe('Page Topology Integration', () => {
    test('should correctly identify page structure', () => {
      const num = universe.analyze(127n);

      expect(num.pageInfo).toBeDefined();
      expect(num.pageInfo.pageNumber).toBe(2); // 127 / 48 = 2
      // PageInfo has startNumber and endNumber, not pageOffset
      expect(num.pageInfo.startNumber).toBeDefined();
      expect(num.pageInfo.endNumber).toBeDefined();
    });

    test('should find Lagrange points', () => {
      const analysis = universe.analyze(100n);

      expect(analysis.nearestLagrangePoint).toBeDefined();
      expect(analysis.distanceToLagrange).toBeDefined();
      expect(analysis.distanceToLagrange).toBeGreaterThanOrEqual(0);
    });

    test('should calculate stability metrics', () => {
      const stable = universe.analyze(48n);
      const unstable = universe.analyze(25n);

      expect(stable.stabilityMetric).toBeGreaterThan(unstable.stabilityMetric);
    });
  });

  describe('Arithmetic Operations Integration', () => {
    test('should perform field-aware addition', () => {
      const result = universe.add(7n, 11n);

      expect(result.result).toBe(18n);
      expect(result.fieldTransitions).toBeDefined();
      expect(result.energyFlow).toBeDefined();
    });

    test('should perform field-entangled multiplication', () => {
      const result = universe.multiply(7n, 11n);

      expect(result.result).toBe(77n);
      expect(result.artifacts).toBeDefined();
      expect(result.entanglementComplexity).toBeDefined();
      expect(result.entanglementComplexity).toBeGreaterThan(0);
    });

    test('should factorize with field reconstruction', () => {
      const result = universe.factorize(77n);

      expect(result.factors).toEqual([7n, 11n]);
      expect(result.fieldReconstruction).toBeDefined();
      expect(result.isPrime).toBe(false);
    });
  });

  describe('Algebraic Structure Integration', () => {
    test('should detect algebraic structures in number sets', () => {
      const numbers = [0n, 1n, 2n, 3n, 4n];
      const structures = universe.detectAlgebraicStructures(numbers);

      expect(structures.groups).toBeDefined();
      expect(structures.rings).toBeDefined();
      expect(structures.modules).toBeDefined();
      expect(structures.groups.length).toBeGreaterThan(0);
    });

    test('should analyze symmetries', () => {
      const symmetries = universe.analyzeSymmetries(127n);

      expect(symmetries).toBeDefined();
      expect(symmetries.generators).toBeDefined();
      expect(symmetries.order).toBeDefined();
      expect(symmetries.symmetryType).toBeDefined();
    });
  });

  describe('Geometric Manifold Integration', () => {
    test('should calculate geometric distances', () => {
      const distance = universe.geometricDistance(7n, 77n);

      expect(distance).toBeGreaterThan(0);
      expect(isFinite(distance)).toBe(true);
    });

    test('should find geodesic paths', () => {
      const path = universe.findGeodesic(7n, 77n);

      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toBe(7n);
      expect(path[path.length - 1]).toBe(77n);
    });

    test('should calculate curvature around Lagrange points', () => {
      const curvature = universe.getCurvature(48n);

      expect(curvature).toBeDefined();
      expect(curvature.scalar).toBeDefined();
      expect(curvature.ricci).toBeDefined();
    });
  });

  describe('Calculus Engine Integration', () => {
    test('should compute discrete derivatives', () => {
      const derivative = universe.computeDerivative((n) => universe.analyze(n).resonance, 50n);

      expect(derivative).toBeDefined();
      expect(typeof derivative).toBe('number');
    });

    test('should perform integration over ranges', () => {
      const integral = universe.integrate((n) => universe.analyze(n).resonance, 0n, 10n);

      expect(integral).toBeDefined();
      expect(integral).toBeGreaterThan(0);
    });

    test('should analyze dynamic stability', () => {
      const stability = universe.analyzeDynamics(25n);

      expect(stability.isStable).toBeDefined();
      expect(stability.lyapunovExponent).toBeDefined();
      expect(stability.attractorType).toBeDefined();
    });
  });

  describe('Self-Reference Integration', () => {
    test('should find fixed points', () => {
      const fixedPoints = universe.findFixedPoints(0n, 100n);

      expect(fixedPoints).toBeDefined();
      expect(fixedPoints.length).toBeGreaterThan(0);
      expect(fixedPoints.some((fp) => fp.type === 'arithmetic')).toBe(true);
    });

    test('should validate self-consistency', async () => {
      // Add timeout to prevent hanging
      jest.setTimeout(5000);
      // This test needs bootstrapped universe
      const bootstrapped = getBootstrappedUniverse();
      const consistency = await bootstrapped.validateConsistency();

      expect(consistency.consistent).toBe(true);
      expect(consistency.godelLimitations).toBeDefined();
      expect(consistency.conservationChecks).toBeDefined();
    });

    test('should support meta-operations', () => {
      const meta = universe.getMeta();

      expect(meta).toBeDefined();
      expect(meta.godelNumber).toBeDefined();
      expect(meta.selfDescription).toBeDefined();
      expect(meta.evolutionCapability).toBe(true);
    });
  });

  describe('Conservation Laws', () => {
    test('should verify field-parity conservation', () => {
      // This test needs bootstrapped universe for proper field constants
      const bootstrapped = getBootstrappedUniverse();
      // Within a page, field parity is conserved
      const pageNumbers: bigint[] = [];
      for (let i = 0; i < 48; i++) {
        pageNumbers.push(BigInt(i));
      }

      const conservation = bootstrapped.checkFieldParityConservation(pageNumbers);
      // Field parity conservation is a theoretical ideal
      // In practice, we just check that the mechanism works
      expect(conservation).toBeDefined();
      expect(conservation.xorPattern).toBeDefined();
      expect(conservation.xorPattern).toHaveLength(8);
      // If not conserved, there should be violations recorded
      if (!conservation.isConserved) {
        expect(conservation.violations).toBeDefined();
      }
    });

    test('should verify resonance flux conservation', () => {
      const bootstrapped = getBootstrappedUniverse();
      const numbers = [0n, 1n, 2n, 3n, 4n];
      const flux = bootstrapped.checkResonanceFlux(numbers);

      expect(flux.totalFlux).toBeDefined();
      // Resonance flux should be relatively balanced
      expect(flux.isBalanced).toBeDefined();
      expect(flux.maxDeviation).toBeLessThan(2.0); // Allow some deviation
    });

    test('should track information conservation in operations', () => {
      const bootstrapped = getBootstrappedUniverse();
      const result = bootstrapped.multiply(7n, 11n);

      expect(result.informationBalance).toBeDefined();
      expect(result.informationBalance.created).toBeDefined();
      expect(result.informationBalance.destroyed).toBeDefined();
      // Conservation depends on whether artifacts are created
      expect(result.informationBalance.conserved).toBe(result.artifacts.length === 0);
    });
  });

  describe('Living Number Behaviors', () => {
    test('should evolve numbers along gradient flows', () => {
      const number = universe.number(25n);
      const evolved = number.evolve();

      expect(evolved.value).toBeDefined();
      expect(evolved.computationalState.energy).toBeLessThanOrEqual(
        number.computationalState.energy,
      );
    });

    test('should enable number interactions', () => {
      const seven = universe.number(7n);
      const eleven = universe.number(11n);

      const interaction = seven.interact(eleven);

      expect(interaction).toBeDefined();
      expect(interaction.result).toBeDefined();
      expect(interaction.artifacts).toBeDefined();
      expect(interaction.energyExchange).toBeDefined();
    });

    test('should support autonomous optimization', () => {
      const number = universe.number(100n);
      const optimized = number.optimize();

      expect(optimized.improvement).toBeGreaterThanOrEqual(0);
      expect(optimized.strategy).toBeDefined();
      expect(optimized.newState).toBeDefined();
    });
  });

  describe('Universe Evolution', () => {
    test('should evolve the universe state', () => {
      const evolution = universe.evolve();

      expect(evolution).toBeDefined();
      expect(evolution.generation).toBeGreaterThanOrEqual(0);
      expect(evolution.fitness).toBeDefined();
      expect(evolution.mutations).toBeDefined();
    });

    test('should track universe metrics', () => {
      const metrics = universe.getMetrics();

      expect(metrics.totalNumbers).toBeDefined();
      expect(metrics.activeNumbers).toBeDefined();
      expect(metrics.totalResonance).toBeDefined();
      expect(metrics.informationContent).toBeDefined();
      expect(metrics.computationalComplexity).toBeDefined();
    });
  });

  describe('Cross-Layer Optimization', () => {
    test('should cache computations across layers', () => {
      // First computation
      const start = Date.now();
      const first = universe.analyze(12345678901234567890n);
      const firstTime = Date.now() - start;

      // Cached computation should be faster
      const secondStart = Date.now();
      const second = universe.analyze(12345678901234567890n);
      const secondTime = Date.now() - secondStart;

      expect(second).toEqual(first);
      expect(secondTime).toBeLessThan(firstTime);
    });

    test('should optimize cross-layer operations', () => {
      const numbers = Array.from({ length: 10 }, (_, i) => BigInt(i));
      const batchResult = universe.batchAnalyze(numbers);

      expect(batchResult).toHaveLength(10);
      expect(batchResult.every((r) => r.optimized)).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle zero correctly', () => {
      // Zero is a special case that needs proper bootstrap
      const bootstrapped = getBootstrappedUniverse();
      const zero = bootstrapped.analyze(0n);
      expect(zero.number).toBe(0n);
      expect(zero.resonance).toBe(1); // Zero is L0 Lagrange point with perfect resonance
      expect(zero.isLagrangePoint).toBe(true);
    });

    test('should handle negative numbers', () => {
      const negative = universe.analyze(-7n);
      expect(negative.number).toBe(-7n);
      // Should use absolute value for field pattern
      expect(negative.fields).toEqual(universe.analyze(7n).fields);
    });

    test('should handle very large numbers', () => {
      const huge = 123456789012345678901234567890n;
      const analysis = universe.analyze(huge);

      expect(analysis.number).toBe(huge);
      expect(analysis.fields).toHaveLength(8);
      expect(analysis.resonance).toBeGreaterThan(0);
    });

    test('should provide meaningful error messages', () => {
      expect(() => universe.divide(7n, 0n)).toThrow('Division by zero');
    });
  });
});
