import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import type { PageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import { RingDetector, ModuleAnalyzer } from '../src';

describe('ModuleAnalyzer', () => {
  let substrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;
  let ringDetector: RingDetector;
  let moduleAnalyzer: ModuleAnalyzer;

  beforeEach(() => {
    substrate = createFieldSubstrate();
    resonance = createResonanceDynamics(substrate);
    topology = createPageTopology(substrate, resonance);
    operators = createArithmeticOperators(substrate, resonance, topology);
    ringDetector = new RingDetector(substrate, resonance, topology, operators);
    moduleAnalyzer = new ModuleAnalyzer(substrate, resonance, topology, operators);
  });

  test('should create Z-module (abelian group)', () => {
    // Use Z/4Z as the ring
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const elements = new Set([0n, 2n]);
      const module = moduleAnalyzer.createModule(elements, ring);

      expect(module).not.toBeNull();
      if (module) {
        expect(module.zero).toBe(0n);
        expect(module.generators.length).toBeGreaterThan(0);
      }
    }
  });

  test('should detect free modules', () => {
    // Use Z/3Z as the ring (field)
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const elements = new Set([0n, 1n, 2n]);
      const module = moduleAnalyzer.createModule(elements, ring);

      expect(module).not.toBeNull();
      if (module) {
        expect(module.isFree).toBe(true);
        expect(module.rank).toBe(module.generators.length);
      }
    }
  });

  test('should find torsion elements', () => {
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const elements = new Set([0n, 1n, 2n, 3n]);
      // Custom scalar multiplication that creates torsion
      const module = moduleAnalyzer.createModule(elements, ring, (s, m) => (s * m) % 4n);

      expect(module).not.toBeNull();
      if (module) {
        // In Z/4Z, 2 is a torsion element since 2*2 = 0 (mod 4)
        expect(module.torsionElements.size).toBeGreaterThan(0);
      }
    }
  });

  test('should detect submodules', () => {
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n, 4n, 5n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const elements = new Set([0n, 2n, 4n]);
      const module = moduleAnalyzer.createModule(elements, ring);

      expect(module).not.toBeNull();

      if (module) {
        const submodules = moduleAnalyzer.detectSubmodules(module);

        expect(submodules.length).toBeGreaterThan(2); // At least trivial, whole, and some cyclic

        // Should have cyclic submodules
        const cyclicSubmodules = submodules.filter((s) => s.isCyclic);
        expect(cyclicSubmodules.length).toBeGreaterThan(0);
      }
    }
  });

  test('should analyze module homomorphisms', () => {
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const domain = moduleAnalyzer.createModule(new Set([0n, 2n]), ring);
      // Use a proper submodule - the whole ring as codomain
      const codomain = moduleAnalyzer.createModule(new Set([0n, 1n, 2n, 3n]), ring);

      expect(domain).not.toBeNull();
      expect(codomain).not.toBeNull();

      if (domain && codomain) {
        // Map that embeds the submodule into the full module
        const map = (n: bigint): bigint => n;

        const homomorphism = moduleAnalyzer.analyzeModuleHomomorphism(domain, codomain, map);

        expect(homomorphism.kernel.has(0n)).toBe(true);
        expect(homomorphism.isLinear).toBe(true);
        expect(homomorphism.preservesScalarAction).toBe(true);
      }
    }
  });

  test('should detect tensor products', () => {
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n]);

    expect(ring).not.toBeNull();

    if (ring) {
      // Use the whole ring as modules
      const module1 = moduleAnalyzer.createModule(new Set([0n, 1n, 2n]), ring);
      const module2 = moduleAnalyzer.createModule(new Set([0n, 1n, 2n]), ring);

      expect(module1).not.toBeNull();
      expect(module2).not.toBeNull();

      if (module1 && module2) {
        const tensorProduct = moduleAnalyzer.detectTensorProduct(module1, module2);

        expect(tensorProduct).not.toBeNull();
        if (tensorProduct) {
          expect(tensorProduct.elements.has(0n)).toBe(true);
          // Should contain products of generators
          expect(tensorProduct.elements.size).toBeGreaterThan(1);
        }
      }
    }
  });

  test('should create vector space over field', () => {
    // Create a field ring Z/2Z
    const fieldRing = ringDetector.detectRingStructure([0n, 1n]);

    expect(fieldRing).not.toBeNull();

    if (fieldRing) {
      expect(fieldRing.isField).toBe(true);

      const elements = new Set([0n, 1n]);
      const vectorSpace = moduleAnalyzer.createVectorSpace(elements, fieldRing);

      expect(vectorSpace).not.toBeNull();
      if (vectorSpace) {
        expect(vectorSpace.dimension).toBe(vectorSpace.basis.length);
        expect(vectorSpace.isFiniteDimensional).toBe(true);
      }
    }
  });

  test('should handle empty module', () => {
    const ring = ringDetector.detectRingStructure([0n, 1n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const module = moduleAnalyzer.createModule(new Set(), ring);
      expect(module).toBeNull();
    }
  });
});
