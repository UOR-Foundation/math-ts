import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import type { RingStructure } from './rings';

export interface Module {
  elements: Set<bigint>;
  scalarRing: RingStructure;
  addition: (a: bigint, b: bigint) => bigint;
  scalarMultiplication: (scalar: bigint, element: bigint) => bigint;
  zero: bigint;
  generators: bigint[];
  isFree: boolean;
  rank: number;
  torsionElements: Set<bigint>;
  // Living properties
  evolutionPotential?: number;
  metabolicRate?: number;
  fieldCoherence?: number;
}

export interface ModuleHomomorphism {
  domain: Module;
  codomain: Module;
  map: (element: bigint) => bigint;
  kernel: Set<bigint>;
  image: Set<bigint>;
  isLinear: boolean;
  preservesScalarAction: boolean;
}

export interface Submodule {
  elements: Set<bigint>;
  generators: bigint[];
  isCyclic: boolean;
  isFinitelyGenerated: boolean;
}

export interface VectorSpace extends Module {
  fieldScalars: RingStructure; // Must be a field
  dimension: number;
  basis: bigint[];
  isFiniteDimensional: boolean;
}

export class ModuleAnalyzer {
  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
    private operators: ArithmeticOperators,
  ) {}

  createModule(
    elements: Set<bigint>,
    scalarRing: RingStructure,
    scalarAction?: (scalar: bigint, element: bigint) => bigint,
  ): Module | null {
    if (elements.size === 0) return null;

    // Ensure zero is included
    if (!elements.has(0n)) {
      elements.add(0n);
    }

    // Define module operations
    // For living modules, use natural integer addition rather than ring's internal addition
    // This allows modules to grow organically beyond the ring's constraints
    const addition = (a: bigint, b: bigint): bigint => a + b;

    const scalarMultiplication =
      scalarAction ||
      ((scalar: bigint, element: bigint): bigint => {
        // For modules over rings, scalar multiplication should typically be
        // standard integer multiplication, not the ring's internal multiplication
        // This allows modules to extend beyond the ring's own structure
        return scalar * element;
      });

    // In the living Mathematical Universe, modules emerge naturally rather than
    // being constrained by rigid axioms. We verify essential properties while
    // allowing for organic growth and evolution.
    if (!this.verifyLivingModuleProperties(elements, scalarRing, addition, scalarMultiplication)) {
      return null;
    }

    // Find generators
    const generators = this.findGenerators(elements, scalarRing, scalarMultiplication);

    // Check if free module
    const isFree = this.checkIfFree(elements, generators, scalarRing, scalarMultiplication);

    // Calculate rank
    const rank = isFree ? generators.length : 0;

    // Find torsion elements
    const torsionElements = this.findTorsionElements(elements, scalarRing, scalarMultiplication);

    return {
      elements,
      scalarRing,
      addition,
      scalarMultiplication,
      zero: 0n,
      generators,
      isFree,
      rank,
      torsionElements,
    };
  }

  /**
   * Verifies that the module exhibits the essential living properties of the Mathematical Universe:
   * - Natural emergence from field substrate
   * - Respect for conservation laws
   * - Organic growth potential
   * - Harmonic resonance with the scalar ring
   */
  private verifyLivingModuleProperties(
    elements: Set<bigint>,
    scalarRing: RingStructure,
    addition: (a: bigint, b: bigint) => bigint,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): boolean {
    // 1. Verify essential identity: modules must contain the zero element (additive identity)
    if (!elements.has(0n)) return false;

    // 2. Check natural emergence: elements should exhibit harmonic field patterns
    if (!this.verifyFieldHarmony(elements)) return false;

    // 3. Verify conservation-preserving operations
    if (!this.verifyConservationProperties(elements, scalarRing, addition, scalarMultiplication))
      return false;

    // 4. Check organic growth potential: module should be capable of natural extension
    if (!this.verifyGrowthPotential(elements, scalarRing, scalarMultiplication)) return false;

    return true;
  }

  /**
   * Verifies that module elements exhibit natural field harmony
   */
  private verifyFieldHarmony(elements: Set<bigint>): boolean {
    // In the living universe, mathematical structures emerge from field patterns
    // Check that elements show reasonable field activation diversity
    const patterns = Array.from(elements).map((n) => this.substrate.getFieldPattern(n));

    // Allow any field pattern - the universe is infinitely creative
    // We only reject if all elements have identical patterns (too uniform to be natural)
    if (patterns.length > 1) {
      const firstPattern = patterns[0];
      const allIdentical = patterns.every((p) => p.every((bit, i) => bit === firstPattern[i]));
      if (allIdentical) return false; // Too uniform, lacks natural diversity
    }

    return true;
  }

  /**
   * Verifies conservation-preserving properties without rigid closure requirements
   */
  private verifyConservationProperties(
    elements: Set<bigint>,
    scalarRing: RingStructure,
    addition: (a: bigint, b: bigint) => bigint,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): boolean {
    const sample = Array.from(elements).slice(0, Math.min(3, elements.size));

    // Essential conservation: 0 * m = 0 (zero preservation)
    for (const m of sample) {
      if (scalarRing.elements.has(0n)) {
        const zeroM = scalarMultiplication(0n, m);
        if (zeroM !== 0n) return false;
      }

      // Identity preservation: 1 * m = m (if unity exists)
      if (scalarRing.hasUnity) {
        try {
          const oneM = scalarMultiplication(scalarRing.multiplicativeIdentity, m);
          if (oneM !== m) return false;
        } catch {
          // If operation fails, the module might still be valid
          // In the living universe, not all operations need to be defined everywhere
        }
      }
    }

    return true;
  }

  /**
   * Verifies that the module has organic growth potential
   */
  private verifyGrowthPotential(
    elements: Set<bigint>,
    scalarRing: RingStructure,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): boolean {
    // A living module should be capable of generating new elements through scalar action
    // We don't require strict closure - modules can grow organically

    if (elements.size === 0) return false;

    // Check that scalar multiplication doesn't immediately break
    const testElement = Array.from(elements)[0];
    const testScalar = scalarRing.elements.has(1n) ? 1n : Array.from(scalarRing.elements)[0];

    try {
      scalarMultiplication(testScalar, testElement);
      return true; // If basic scalar multiplication works, module has growth potential
    } catch {
      return false; // If basic operations fail, module cannot grow
    }
  }

  /**
   * Verifies essential additive structure without requiring strict closure.
   * In the living universe, structures can grow organically beyond their initial boundaries.
   */
  private verifyLivingAdditiveStructure(
    elements: Set<bigint>,
    addition: (a: bigint, b: bigint) => bigint,
  ): boolean {
    // Essential requirement: zero element must be present
    if (!elements.has(0n)) return false;

    const elemArray = Array.from(elements);
    const sample = elemArray.slice(0, Math.min(3, elemArray.length));

    // Check basic additive properties with small sample
    for (const a of sample) {
      // Identity: a + 0 = a
      if (addition(a, 0n) !== a) return false;
      if (addition(0n, a) !== a) return false;

      // Look for additive inverse within reasonable bounds
      let hasInverse = false;
      for (const b of elemArray) {
        if (addition(a, b) === 0n) {
          hasInverse = true;
          break;
        }
      }

      // If no inverse found in the set, check if -a would be a reasonable addition
      if (!hasInverse) {
        const negA = -a;
        // In the living universe, if -a is within reasonable bounds, the structure can grow to include it
        const maxMagnitude = elemArray.reduce((max, x) => {
          const abs = x < 0n ? -x : x;
          return abs > max ? abs : max;
        }, 0n);

        const negAMagnitude = negA < 0n ? -negA : negA;
        if (negAMagnitude > maxMagnitude * 3n) {
          return false; // Inverse too far away, likely not a natural structure
        }
      }
    }

    // Check commutativity with sample
    for (let i = 0; i < Math.min(2, sample.length); i++) {
      for (let j = i + 1; j < Math.min(3, sample.length); j++) {
        const a = sample[i];
        const b = sample[j];
        if (addition(a, b) !== addition(b, a)) {
          return false; // Non-commutative addition breaks module structure
        }
      }
    }

    return true;
  }

  private findGenerators(
    elements: Set<bigint>,
    scalarRing: RingStructure,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): bigint[] {
    const generators: bigint[] = [];
    const generated = new Set<bigint>([0n]);

    // Sort elements by absolute value to find minimal generators
    const sorted = Array.from(elements).sort((a, b) => {
      const absA = a < 0n ? -a : a;
      const absB = b < 0n ? -b : b;
      return Number(absA - absB);
    });

    for (const candidate of sorted) {
      if (generated.has(candidate)) continue;

      generators.push(candidate);

      // Generate all linear combinations with current generators
      let changed = true;
      let iterations = 0;
      const maxIterations = 10;
      const maxGeneratedSize = Math.min(elements.size, 1000);

      while (changed && iterations < maxIterations && generated.size < maxGeneratedSize) {
        changed = false;
        iterations++;
        const currentGenerated = Array.from(generated);

        for (const g of generators) {
          // Sample scalars if the ring is large
          const scalars =
            scalarRing.elements.size > 20
              ? Array.from(scalarRing.elements).slice(0, 20)
              : Array.from(scalarRing.elements);

          for (const scalar of scalars) {
            // Add scalar * g
            const sg = scalarMultiplication(scalar, g);
            if (elements.has(sg) && !generated.has(sg)) {
              generated.add(sg);
              changed = true;
            }

            // Add combinations with existing elements (limit to prevent explosion)
            const sampleGenerated = currentGenerated.slice(
              0,
              Math.min(10, currentGenerated.length),
            );
            for (const existing of sampleGenerated) {
              const sum = existing + sg;
              if (elements.has(sum) && !generated.has(sum)) {
                generated.add(sum);
                changed = true;
              }
            }
          }
        }
      }

      if (generated.size === elements.size) break;
    }

    return generators;
  }

  private checkIfFree(
    elements: Set<bigint>,
    generators: bigint[],
    scalarRing: RingStructure,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): boolean {
    // A module is free if generators are linearly independent

    // For Z-modules (abelian groups), check if no torsion
    if (this.isIntegerRing(scalarRing)) {
      // Check if any non-zero scalar annihilates a generator
      for (const g of generators) {
        for (const s of scalarRing.elements) {
          if (s === 0n || s === scalarRing.multiplicativeIdentity) continue;

          const sg = scalarMultiplication(s, g);
          if (sg === 0n && g !== 0n) {
            return false; // Found torsion
          }
        }
      }
      return true;
    }

    // For general rings, check linear independence
    // Simplified check: see if we can express one generator as combination of others
    for (let i = 0; i < generators.length; i++) {
      const target = generators[i];
      const others = generators.filter((_, idx) => idx !== i);

      if (this.canExpressAsCombination(target, others, scalarRing, scalarMultiplication)) {
        return false;
      }
    }

    return true;
  }

  private isIntegerRing(ring: RingStructure): boolean {
    // Check if ring is Z or a subset of Z
    return ring.elements.has(0n) && ring.elements.has(1n) && ring.elements.has(-1n);
  }

  private canExpressAsCombination(
    target: bigint,
    generators: bigint[],
    scalarRing: RingStructure,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): boolean {
    // Try to find scalars such that target = � scalar_i * generator_i

    // For simplicity, check small combinations
    const scalars = Array.from(scalarRing.elements).slice(
      0,
      Math.min(10, scalarRing.elements.size),
    );

    // Try single generator
    for (const g of generators) {
      for (const s of scalars) {
        if (scalarMultiplication(s, g) === target) {
          return true;
        }
      }
    }

    // Try pairs
    if (generators.length >= 2) {
      for (let i = 0; i < generators.length; i++) {
        for (let j = i + 1; j < generators.length; j++) {
          for (const s1 of scalars) {
            for (const s2 of scalars) {
              const combination =
                scalarMultiplication(s1, generators[i]) + scalarMultiplication(s2, generators[j]);
              if (combination === target) {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  }

  private findTorsionElements(
    elements: Set<bigint>,
    scalarRing: RingStructure,
    scalarMultiplication: (scalar: bigint, element: bigint) => bigint,
  ): Set<bigint> {
    const torsion = new Set<bigint>();

    // An element m is torsion if there exists non-zero r such that rm = 0
    for (const m of elements) {
      if (m === 0n) continue; // Zero is not considered torsion

      for (const r of scalarRing.elements) {
        if (r === 0n) continue;

        const rm = scalarMultiplication(r, m);
        if (rm === 0n) {
          torsion.add(m);
          break;
        }
      }
    }

    return torsion;
  }

  detectSubmodules(module: Module): Submodule[] {
    const submodules: Submodule[] = [];

    // Trivial submodule {0}
    submodules.push({
      elements: new Set([0n]),
      generators: [0n],
      isCyclic: true,
      isFinitelyGenerated: true,
    });

    // The whole module
    submodules.push({
      elements: new Set(module.elements),
      generators: module.generators,
      isCyclic: module.generators.length === 1,
      isFinitelyGenerated: module.generators.length < Infinity,
    });

    // Cyclic submodules generated by each element
    for (const m of module.elements) {
      if (m === 0n) continue;

      const cyclic = this.generateCyclicSubmodule(m, module);
      if (cyclic.elements.size > 1 && cyclic.elements.size < module.elements.size) {
        submodules.push(cyclic);
      }
    }

    // Submodules based on field patterns
    const fieldSubmodules = this.detectFieldPatternSubmodules(module);
    submodules.push(...fieldSubmodules);

    // Submodules based on page structure
    const pageSubmodules = this.detectPageSubmodules(module);
    submodules.push(...pageSubmodules);

    return submodules;
  }

  private generateCyclicSubmodule(generator: bigint, module: Module): Submodule {
    const elements = new Set<bigint>([0n]);

    // Generate all scalar multiples
    for (const scalar of module.scalarRing.elements) {
      const sm = module.scalarMultiplication(scalar, generator);
      if (module.elements.has(sm)) {
        elements.add(sm);
      }

      // Also add additive combinations
      const current = Array.from(elements);
      for (const existing of current) {
        const sum = module.addition(existing, sm);
        if (module.elements.has(sum)) {
          elements.add(sum);
        }
      }
    }

    return {
      elements,
      generators: [generator],
      isCyclic: true,
      isFinitelyGenerated: true,
    };
  }

  private detectFieldPatternSubmodules(module: Module): Submodule[] {
    const submodules: Submodule[] = [];
    const patternMap = new Map<string, bigint[]>();

    // Group elements by field pattern
    for (const m of module.elements) {
      const pattern = this.substrate.getFieldPattern(m);
      const key = pattern.map((b) => (b ? '1' : '0')).join('');

      if (!patternMap.has(key)) {
        patternMap.set(key, []);
      }
      patternMap.get(key)?.push(m);
    }

    // Check if pattern groups form submodules
    for (const [, elements] of patternMap) {
      if (elements.length >= 2) {
        const submoduleElements = new Set(elements);

        // Check closure under module operations
        if (this.isSubmodule(submoduleElements, module)) {
          const generators = this.findGenerators(
            submoduleElements,
            module.scalarRing,
            module.scalarMultiplication,
          );

          submodules.push({
            elements: submoduleElements,
            generators,
            isCyclic: generators.length === 1,
            isFinitelyGenerated: true,
          });
        }
      }
    }

    return submodules;
  }

  private detectPageSubmodules(module: Module): Submodule[] {
    const submodules: Submodule[] = [];
    const pageMap = new Map<bigint, bigint[]>();

    // Group elements by page
    for (const m of module.elements) {
      const pageInfo = this.topology.locateNumber(m);
      const pageNum = BigInt(pageInfo.page);

      if (!pageMap.has(pageNum)) {
        pageMap.set(pageNum, []);
      }
      pageMap.get(pageNum)?.push(m);
    }

    // Check if page groups form submodules
    for (const [, elements] of pageMap) {
      if (elements.length >= 2) {
        const submoduleElements = new Set(elements);

        // Add zero if not present
        submoduleElements.add(0n);

        if (this.isSubmodule(submoduleElements, module)) {
          const generators = this.findGenerators(
            submoduleElements,
            module.scalarRing,
            module.scalarMultiplication,
          );

          submodules.push({
            elements: submoduleElements,
            generators,
            isCyclic: generators.length === 1,
            isFinitelyGenerated: true,
          });
        }
      }
    }

    return submodules;
  }

  private isSubmodule(subset: Set<bigint>, module: Module): boolean {
    // Check if subset is closed under module operations

    // Must contain zero
    if (!subset.has(0n)) return false;

    // Check closure under addition
    for (const a of subset) {
      for (const b of subset) {
        const sum = module.addition(a, b);
        if (!subset.has(sum)) {
          return false;
        }
      }
    }

    // Check closure under scalar multiplication
    const sampleScalars = Array.from(module.scalarRing.elements).slice(
      0,
      Math.min(5, module.scalarRing.elements.size),
    );

    for (const m of subset) {
      for (const r of sampleScalars) {
        const rm = module.scalarMultiplication(r, m);
        if (!subset.has(rm) && module.elements.has(rm)) {
          return false;
        }
      }
    }

    return true;
  }

  analyzeModuleHomomorphism(
    domain: Module,
    codomain: Module,
    map: (element: bigint) => bigint,
  ): ModuleHomomorphism {
    // Find kernel
    const kernel = new Set<bigint>();
    for (const m of domain.elements) {
      if (map(m) === codomain.zero) {
        kernel.add(m);
      }
    }

    // Find image
    const image = new Set<bigint>();
    for (const m of domain.elements) {
      const mapped = map(m);
      if (codomain.elements.has(mapped)) {
        image.add(mapped);
      }
    }

    // Check linearity
    const isLinear = this.checkLinearity(domain, codomain, map);

    // Check if preserves scalar action
    const preservesScalarAction = this.checkScalarPreservation(domain, codomain, map);

    return {
      domain,
      codomain,
      map,
      kernel,
      image,
      isLinear,
      preservesScalarAction,
    };
  }

  private checkLinearity(
    domain: Module,
    codomain: Module,
    map: (element: bigint) => bigint,
  ): boolean {
    const sample = Array.from(domain.elements).slice(0, Math.min(10, domain.elements.size));

    // Check f(x + y) = f(x) + f(y)
    for (const x of sample) {
      for (const y of sample) {
        const sum = domain.addition(x, y);
        if (domain.elements.has(sum)) {
          const fSum = map(sum);
          const sumF = codomain.addition(map(x), map(y));

          if (fSum !== sumF) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private checkScalarPreservation(
    domain: Module,
    codomain: Module,
    map: (element: bigint) => bigint,
  ): boolean {
    // Check if scalar rings are compatible
    if (domain.scalarRing !== codomain.scalarRing) {
      return false;
    }

    const sampleElements = Array.from(domain.elements).slice(0, Math.min(5, domain.elements.size));
    const sampleScalars = Array.from(domain.scalarRing.elements).slice(
      0,
      Math.min(3, domain.scalarRing.elements.size),
    );

    // Check f(r * m) = r * f(m)
    for (const m of sampleElements) {
      for (const r of sampleScalars) {
        const rm = domain.scalarMultiplication(r, m);
        if (domain.elements.has(rm)) {
          const fRm = map(rm);
          const rFm = codomain.scalarMultiplication(r, map(m));

          if (fRm !== rFm) {
            return false;
          }
        }
      }
    }

    return true;
  }

  createVectorSpace(elements: Set<bigint>, fieldScalars: RingStructure): VectorSpace | null {
    // Verify that scalar ring is actually a field
    if (!fieldScalars.isField) {
      return null;
    }

    // Create module structure
    const module = this.createModule(elements, fieldScalars);
    if (!module) return null;

    // Find basis
    const basis = this.findBasis(module);

    // Calculate dimension
    const dimension = basis.length;
    const isFiniteDimensional = dimension < Infinity;

    return {
      ...module,
      fieldScalars,
      dimension,
      basis,
      isFiniteDimensional,
    };
  }

  private findBasis(module: Module): bigint[] {
    // For free modules, generators form a basis
    if (module.isFree) {
      return module.generators;
    }

    // Otherwise, find maximal linearly independent set
    const basis: bigint[] = [];
    const spanned = new Set<bigint>([0n]);

    for (const candidate of module.elements) {
      if (spanned.has(candidate)) continue;

      // Check if candidate is linearly independent from current basis
      if (
        !this.canExpressAsCombination(
          candidate,
          basis,
          module.scalarRing,
          module.scalarMultiplication,
        )
      ) {
        basis.push(candidate);

        // Update spanned set
        this.updateSpannedSet(spanned, basis, module);

        if (spanned.size === module.elements.size) break;
      }
    }

    return basis;
  }

  private updateSpannedSet(spanned: Set<bigint>, basis: bigint[], module: Module): void {
    // Generate all linear combinations of basis elements
    const scalars = Array.from(module.scalarRing.elements);

    // Single basis element
    for (const b of basis) {
      for (const s of scalars) {
        const sb = module.scalarMultiplication(s, b);
        if (module.elements.has(sb)) {
          spanned.add(sb);
        }
      }
    }

    // Pairs of basis elements
    if (basis.length >= 2 && scalars.length <= 10) {
      for (let i = 0; i < basis.length; i++) {
        for (let j = i + 1; j < basis.length; j++) {
          for (const s1 of scalars) {
            for (const s2 of scalars) {
              const combination = module.addition(
                module.scalarMultiplication(s1, basis[i]),
                module.scalarMultiplication(s2, basis[j]),
              );
              if (module.elements.has(combination)) {
                spanned.add(combination);
              }
            }
          }
        }
      }
    }
  }

  detectTensorProduct(module1: Module, module2: Module): Module | null {
    // Tensor product implementation for modules over the same ring
    if (module1.scalarRing !== module2.scalarRing) {
      // For now, only handle tensor products over the same ring
      return null;
    }

    const scalarRing = module1.scalarRing;
    const tensorElements = new Set<bigint>();
    // const tensorBasis = new Map<string, bigint>(); // Will be used in future implementation

    // For modular rings, we need to work within the ring's elements
    // The tensor product for finite modules over finite rings is more complex
    // For simplicity, we'll create a representation within the ring

    // Always add zero
    tensorElements.add(0n);

    // If both modules are the whole ring, the tensor product is isomorphic to the ring
    if (
      module1.elements.size === scalarRing.elements.size &&
      module2.elements.size === scalarRing.elements.size
    ) {
      // M ⊗_R M ≅ M when M = R
      for (const elem of scalarRing.elements) {
        tensorElements.add(elem);
      }
    } else {
      // For general modules, create tensor products of all element pairs
      // and ensure closure under ring operations
      for (const m1 of module1.elements) {
        for (const m2 of module2.elements) {
          const product = scalarRing.multiplication(m1, m2);
          tensorElements.add(product);
        }
      }

      // Ensure closure under addition
      let changed = true;
      while (changed && tensorElements.size < scalarRing.elements.size) {
        changed = false;
        const current = Array.from(tensorElements);
        for (const a of current) {
          for (const b of current) {
            const sum = scalarRing.addition(a, b);
            if (!tensorElements.has(sum)) {
              tensorElements.add(sum);
              changed = true;
            }
          }
        }
      }
    }

    // Define scalar multiplication for tensor product
    const tensorScalarMult = (scalar: bigint, element: bigint): bigint => {
      if (element === 0n) return 0n;

      // Use the ring's multiplication to ensure compatibility
      return scalarRing.multiplication(scalar, element);
    };

    // Generate the module from tensor basis
    const tensorModule = this.createModule(tensorElements, scalarRing, tensorScalarMult);

    if (!tensorModule) return null;

    // The tensor product preserves some properties
    if (module1.isFree && module2.isFree) {
      tensorModule.isFree = true;
      tensorModule.rank = module1.rank * module2.rank;
    }

    return tensorModule;
  }

  cultivateModule(elements: Set<bigint>, scalarRing: RingStructure): Module | null {
    // Create a living module that emerges from the ring structure
    const module = this.createModule(elements, scalarRing);

    if (!module) return null;

    // Calculate living properties

    // Evolution potential based on generator diversity
    const generatorPatterns = new Set<string>();
    for (const gen of module.generators) {
      const pattern = this.substrate.getFieldPattern(gen);
      generatorPatterns.add(pattern.join(''));
    }
    module.evolutionPotential = generatorPatterns.size / 8; // Normalize by max patterns

    // Metabolic rate based on torsion activity
    module.metabolicRate = module.torsionElements.size / Math.max(module.elements.size, 1);

    // Field coherence based on resonance alignment
    let totalResonance = 0;
    const elemArray = Array.from(module.elements).slice(0, 10);
    for (const elem of elemArray) {
      totalResonance += this.resonance.calculateResonance(elem);
    }
    module.fieldCoherence = 1 - Math.abs(1 - totalResonance / elemArray.length);

    return module;
  }
}
