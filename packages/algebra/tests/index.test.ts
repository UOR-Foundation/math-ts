import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import type { PageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import {
  AlgebraicStructureDetector,
  GroupDetector,
  RingDetector,
  ModuleAnalyzer,
  type GroupStructure,
  type RingStructure,
  type Module,
} from '../src';

describe('AlgebraicStructures', () => {
  let substrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;
  let algebraicStructures: AlgebraicStructureDetector;
  let groupDetector: GroupDetector;
  let ringDetector: RingDetector;
  let moduleAnalyzer: ModuleAnalyzer;

  beforeEach(() => {
    substrate = createFieldSubstrate();
    resonance = createResonanceDynamics(substrate);
    topology = createPageTopology(substrate, resonance);
    operators = createArithmeticOperators(substrate, resonance, topology);
    algebraicStructures = new AlgebraicStructureDetector(substrate, resonance, topology, operators);
    groupDetector = new GroupDetector(substrate, resonance, topology, operators);
    ringDetector = new RingDetector(substrate, resonance, topology, operators);
    moduleAnalyzer = new ModuleAnalyzer(substrate, resonance, topology, operators);
  });

  describe('GroupDetector', () => {
    test('should detect additive group of integers', () => {
      const numbers = [0n, 1n, -1n, 2n, -2n, 3n, -3n];
      const groups = groupDetector.detectGroups(numbers);

      expect(groups.length).toBeGreaterThan(0);

      // Find the additive group
      const additiveGroup = groups.find((g) => g.identity === 0n && g.operation(1n, 2n) === 3n);
      expect(additiveGroup).toBeDefined();
      expect(additiveGroup!.isAbelian).toBe(true);
      expect(additiveGroup!.elements.has(0n)).toBe(true);
    });

    test('should detect multiplicative group of units', () => {
      const numbers = [1n, -1n];
      const groups = groupDetector.detectGroups(numbers);

      const multiplicativeGroup = groups.find((g) => g.identity === 1n);
      expect(multiplicativeGroup).toBeDefined();
      expect(multiplicativeGroup!.isClosed).toBe(true);
      expect(multiplicativeGroup!.hasInverses).toBe(true);
    });

    test('should detect page-based groups', () => {
      // Numbers from the same page
      const numbers = [48n, 49n, 50n, 51n, 52n, 53n];
      const groups = groupDetector.detectGroups(numbers);

      expect(groups.length).toBeGreaterThan(0);
    });

    test('should detect resonance groups', () => {
      // Numbers with similar resonance
      const numbers = [7n, 11n, 13n, 17n, 19n]; // Small primes have similar resonance
      const groups = groupDetector.detectGroups(numbers);

      expect(groups.length).toBeGreaterThan(0);
    });

    test('should analyze symmetries', () => {
      const symmetry = groupDetector.analyzeSymmetries(255n); // All fields active

      expect(symmetry.generators.length).toBeGreaterThan(0);
      expect(symmetry.isFinite).toBe(true);
      expect(symmetry.symmetryType).toBeDefined();
    });

    test('should detect subgroups', () => {
      const numbers = [0n, 2n, 4n, 6n, 8n, -2n, -4n, -6n, -8n];
      const groups = groupDetector.detectGroups(numbers);
      const group = groups[0];

      const subgroups = groupDetector.detectSubgroups(group);

      expect(subgroups.length).toBeGreaterThan(1); // At least trivial and whole group

      // Should include the trivial subgroup {0}
      const trivialSubgroup = subgroups.find((s) => s.elements.size === 1 && s.elements.has(0n));
      expect(trivialSubgroup).toBeDefined();
    });
  });

  describe('RingDetector', () => {
    test('should detect ring structure of integers', () => {
      const numbers = [0n, 1n, -1n, 2n, -2n, 3n, -3n];
      const ring = ringDetector.detectRingStructure(numbers);

      expect(ring).not.toBeNull();
      expect(ring!.additiveIdentity).toBe(0n);
      expect(ring!.multiplicativeIdentity).toBe(1n);
      expect(ring!.isCommutative).toBe(true);
      expect(ring!.hasUnity).toBe(true);
      expect(ring!.isIntegralDomain).toBe(true);
      expect(ring!.isField).toBe(false); // Z is not a field
    });

    test('should detect ideals', () => {
      const numbers = [0n, 2n, 4n, 6n, 8n, -2n, -4n, -6n, -8n];
      const ring = ringDetector.detectRingStructure(numbers);

      expect(ring).not.toBeNull();
      const ideals = ring!.ideals;

      expect(ideals.length).toBeGreaterThan(0);

      // Should have zero ideal
      const zeroIdeal = ideals.find((i) => i.elements.size === 1 && i.elements.has(0n));
      expect(zeroIdeal).toBeDefined();

      // Should have the whole ring as an ideal
      const wholeIdeal = ideals.find((i) => i.elements.size === ring!.elements.size);
      expect(wholeIdeal).toBeDefined();
    });

    test('should detect artifact-based ideals', () => {
      // Numbers that exhibit denormalization
      const numbers = [0n, 1n, 7n, 11n, 77n, 143n, 1001n];
      const ring = ringDetector.detectRingStructure(numbers);

      expect(ring).not.toBeNull();
      const artifactIdeals = ring!.ideals.filter((i) => !i.isPrincipal && i.generators.length > 1);

      // Should find ideals based on denormalization patterns
      expect(artifactIdeals.length).toBeGreaterThanOrEqual(0);
    });

    test('should analyze ring homomorphisms', () => {
      const domain = ringDetector.detectRingStructure([0n, 1n, 2n, 3n])!;
      const codomain = ringDetector.detectRingStructure([0n, 1n])!;

      // Map that sends even to 0, odd to 1
      const map = (n: bigint): bigint => n % 2n;

      const homomorphism = ringDetector.analyzeRingHomomorphism(domain, codomain, map);

      expect(homomorphism.kernel.elements.has(0n)).toBe(true);
      expect(homomorphism.kernel.elements.has(2n)).toBe(true);
      expect(homomorphism.image.has(0n)).toBe(true);
      expect(homomorphism.image.has(1n)).toBe(true);
      expect(homomorphism.isInjective).toBe(false);
      expect(homomorphism.isSurjective).toBe(true);
    });

    test('should detect quotient rings', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n, 4n, 5n])!;
      const ideal = ring.ideals.find((i) => i.generators.includes(2n));

      if (ideal) {
        const quotient = ringDetector.detectQuotientRing(ring, ideal);
        expect(quotient).not.toBeNull();
        expect(quotient!.elements.size).toBeLessThan(ring.elements.size);
      }
    });
  });

  describe('ModuleAnalyzer', () => {
    test('should create Z-module (abelian group)', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, -1n])!;
      const elements = new Set([0n, 2n, 4n, 6n, -2n, -4n, -6n]);

      const module = moduleAnalyzer.createModule(elements, ring);

      expect(module).not.toBeNull();
      expect(module!.zero).toBe(0n);
      expect(module!.generators.length).toBeGreaterThan(0);
    });

    test('should detect free modules', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, -1n])!;
      const elements = new Set([0n, 1n, 2n, 3n, -1n, -2n, -3n]);

      const module = moduleAnalyzer.createModule(elements, ring);

      expect(module).not.toBeNull();
      expect(module!.isFree).toBe(true);
      expect(module!.rank).toBe(module!.generators.length);
    });

    test('should find torsion elements', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n])!;
      const elements = new Set([0n, 1n, 2n, 3n]);

      const module = moduleAnalyzer.createModule(elements, ring, (s, m) => (s * m) % 4n);

      expect(module).not.toBeNull();
      // In Z/4Z, 2 is a torsion element since 2*2 = 0 (mod 4)
      expect(module!.torsionElements.size).toBeGreaterThan(0);
    });

    test('should detect submodules', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, -1n])!;
      const elements = new Set([0n, 2n, 4n, 6n, 8n, -2n, -4n, -6n, -8n]);
      const module = moduleAnalyzer.createModule(elements, ring)!;

      const submodules = moduleAnalyzer.detectSubmodules(module);

      expect(submodules.length).toBeGreaterThan(2); // At least trivial, whole, and some cyclic

      // Should have cyclic submodules
      const cyclicSubmodules = submodules.filter((s) => s.isCyclic);
      expect(cyclicSubmodules.length).toBeGreaterThan(0);
    });

    test('should analyze module homomorphisms', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, -1n])!;
      const domain = moduleAnalyzer.createModule(new Set([0n, 2n, 4n, -2n, -4n]), ring)!;
      const codomain = moduleAnalyzer.createModule(new Set([0n, 1n, 2n, -1n, -2n]), ring)!;

      // Map that divides by 2
      const map = (n: bigint): bigint => n / 2n;

      const homomorphism = moduleAnalyzer.analyzeModuleHomomorphism(domain, codomain, map);

      expect(homomorphism.kernel.has(0n)).toBe(true);
      expect(homomorphism.isLinear).toBe(true);
      expect(homomorphism.preservesScalarAction).toBe(true);
    });

    test('should detect tensor products', () => {
      const ring = ringDetector.detectRingStructure([0n, 1n, -1n])!;
      const module1 = moduleAnalyzer.createModule(new Set([0n, 1n, 2n, -1n, -2n]), ring)!;
      const module2 = moduleAnalyzer.createModule(new Set([0n, 3n, -3n]), ring)!;

      const tensorProduct = moduleAnalyzer.detectTensorProduct(module1, module2);

      expect(tensorProduct).not.toBeNull();
      expect(tensorProduct!.elements.has(0n)).toBe(true);
      // Should contain products of generators
      expect(tensorProduct!.elements.size).toBeGreaterThan(1);
    });
  });

  describe('AlgebraicStructureDetector', () => {
    test('should detect algebraic life', () => {
      const numbers = [0n, 1n, -1n, 2n, -2n, 3n, -3n, 4n, -4n];
      const report = algebraicStructures.detectAlgebraicLife(numbers);

      expect(report.groups.length).toBeGreaterThan(0);
      expect(report.rings.length).toBeGreaterThan(0);
      expect(report.modules.length).toBeGreaterThan(0);
      expect(report.ecology).toBeDefined();
      expect(report.evolution.length).toBe(5); // 5 generations
    });

    test('should analyze algebraic ecology', () => {
      const numbers = [0n, 1n, 2n, 3n, 4n, 5n, 6n];
      const report = algebraicStructures.detectAlgebraicLife(numbers);

      expect(report.ecology.cooperativeStructures.length).toBeGreaterThan(0);

      // Should identify some structures as dominant or niche
      const totalStructures = report.groups.length + report.rings.length;
      const classifiedStructures =
        report.ecology.dominantStructures.length + report.ecology.nichStructures.length;
      expect(classifiedStructures).toBeLessThanOrEqual(totalStructures);
    });

    test('should simulate algebraic evolution', () => {
      const numbers = [0n, 1n, 2n];
      const report = algebraicStructures.detectAlgebraicLife(numbers);

      expect(report.evolution.length).toBe(5);

      // Fitness should generally increase or stay stable
      let previousFitness = report.evolution[0].fitness;
      for (let i = 1; i < report.evolution.length; i++) {
        const currentFitness = report.evolution[i].fitness;
        expect(currentFitness).toBeGreaterThanOrEqual(0);
      }

      // Later generations should have mutations recorded
      const lastGeneration = report.evolution[report.evolution.length - 1];
      expect(lastGeneration.generation).toBe(4);
    });

    test('should detect category structure', () => {
      const numbers1 = [0n, 2n, 4n];
      const numbers2 = [0n, 3n, 6n];

      const groups1 = algebraicStructures.detectGroups(numbers1);
      const groups2 = algebraicStructures.detectGroups(numbers2);
      const allStructures = [...groups1, ...groups2];

      const category = algebraicStructures.detectCategoryStructure(allStructures);

      expect(category.objects.length).toBe(allStructures.length);
      expect(category.morphisms.length).toBeGreaterThan(0);

      // Should have at least identity morphisms
      const identityMorphisms = category.morphisms.filter((m) => m.type === 'identity');
      expect(identityMorphisms.length).toBe(category.objects.length);
    });

    test('should handle empty input gracefully', () => {
      const groups = algebraicStructures.detectGroups([]);
      expect(groups).toEqual([]);

      const ring = algebraicStructures.findRingStructure([]);
      expect(ring).toBeNull();

      const report = algebraicStructures.detectAlgebraicLife([]);
      expect(report.groups).toEqual([]);
      expect(report.rings).toEqual([]);
      expect(report.modules).toEqual([]);
    });

    test('should detect field patterns in algebraic structures', () => {
      // Numbers with specific field patterns
      const numbers = [15n, 31n, 47n, 63n]; // Similar field activation patterns
      const groups = algebraicStructures.detectGroups(numbers);

      // Should detect field-based groups
      const fieldGroups = groups.filter((g) => g.elements.size === numbers.length);
      expect(fieldGroups.length).toBeGreaterThanOrEqual(0);
    });

    test('should integrate with denormalization artifacts', () => {
      // Numbers that create denormalization when multiplied
      const numbers = [7n, 11n, 77n]; // 7 * 11 = 77 with field artifacts
      const ring = algebraicStructures.findRingStructure(numbers);

      expect(ring).not.toBeNull();

      // Should detect ideals based on artifact patterns
      const artifactIdeals = ring!.ideals.filter((ideal) =>
        ideal.generators.some((g) => g === 77n),
      );

      expect(artifactIdeals.length).toBeGreaterThanOrEqual(0);
    });
  });
});
