import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';

export interface GroupElement {
  value: bigint;
  operation: (a: bigint, b: bigint) => bigint;
}

/**
 * Extended GroupStructure that captures the living nature of groups
 * in the Mathematical Universe
 */
export interface GroupStructure {
  elements: Set<bigint>;
  identity: bigint;
  operation: (a: bigint, b: bigint) => bigint;
  isClosed: boolean;
  hasInverses: boolean;
  isAbelian: boolean;
  subgroups: GroupStructure[];

  // Living properties
  fieldCoherence?: number; // How well the group preserves field patterns
  resonanceStability?: number; // Stability within resonance gradient flow
  metabolicRate?: number; // Rate of field pattern transformation
  evolutionPotential?: number; // Likelihood of spawning new groups
  denormalizationActivity?: number; // Rate of artifact production
  conservationMetrics?: {
    fieldParityConserved: boolean;
    resonanceFluxConserved: boolean;
    informationConserved: boolean;
  };
  fieldChemistry?: {
    reactionRates: Map<string, number>;
    catalysts: bigint[];
    inhibitors: bigint[];
  };
}

export interface GroupAction {
  element: bigint;
  operation: (a: bigint, b: bigint) => bigint;
  fieldTransform: (pattern: FieldPattern) => FieldPattern;
  preserves: 'resonance' | 'structure' | 'phase';
}

export interface SymmetryGroup {
  generators: bigint[];
  order: bigint;
  isFinite: boolean;
  symmetryType: string;
  // Field-aware symmetry properties
  fieldSymmetries?: FieldPattern[]; // Field patterns that exhibit symmetry
  resonanceOrbits?: number[]; // Resonance values preserved by symmetry
}

/**
 * GroupDetector discovers groups that emerge naturally from the
 * Mathematical Universe's field dynamics and resonance flows
 */
export class GroupDetector {
  // Constants from the Mathematical Universe
  private readonly PAGE_SIZE = 48;
  private readonly CYCLE_SIZE = 256;
  private readonly LAGRANGE_POINTS = [0, 1, 48, 49];
  private readonly CORRELATION_LENGTH = 75;

  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
    private operators: ArithmeticOperators,
  ) {}

  /**
   * Discovers groups by following natural organization rather than imposing axioms
   */
  detectGroups(numbers: bigint[]): GroupStructure[] {
    return this.discoverEmergentGroups(numbers);
  }

  /**
   * Public method to discover emergent groups from numbers
   */
  discoverEmergentGroups(numbers: bigint[]): GroupStructure[] {
    return this.discoverEmergentGroupsPrivate(numbers);
  }

  /**
   * Discovers groups that emerge from field dynamics and resonance flows
   */
  private discoverEmergentGroupsPrivate(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];

    // 1. Discover basic algebraic groups (handles small groups)
    const basicGroups = this.discoverBasicGroups(numbers);
    groups.push(...basicGroups);

    // 2. Discover resonance-coherent groups
    const resonanceGroups = this.discoverResonanceGroups(numbers);
    groups.push(...resonanceGroups);

    // 3. Find field-harmonic groups
    const fieldGroups = this.discoverFieldHarmonicGroups(numbers);
    groups.push(...fieldGroups);

    // 4. Detect page-local groups
    const pageGroups = this.discoverPageLocalGroups(numbers);
    groups.push(...pageGroups);

    // 5. Find Lagrange-anchored groups
    const lagrangeGroups = this.discoverLagrangeGroups(numbers);
    groups.push(...lagrangeGroups);

    // 6. Discover artifact-born groups
    const artifactGroups = this.discoverArtifactGroups(numbers);
    groups.push(...artifactGroups);

    // Let groups evolve and find subgroups
    for (const group of groups) {
      group.subgroups = this.discoverSubgroups(group);
    }

    return groups;
  }

  /**
   * Discovers basic algebraic groups (handles small groups like {1, -1})
   */
  private discoverBasicGroups(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];

    if (numbers.length < 2) return groups;

    // Try to find additive groups
    if (numbers.includes(0n) && numbers.length >= 2) {
      const additiveGroup = this.tryFormAdditiveGroup(numbers);
      if (additiveGroup) groups.push(additiveGroup);
    }

    // Try to find multiplicative groups
    if (numbers.includes(1n) && numbers.length >= 2) {
      const multiplicativeGroup = this.tryFormMultiplicativeGroup(numbers);
      if (multiplicativeGroup) groups.push(multiplicativeGroup);
    }

    return groups;
  }

  /**
   * Discovers groups that form around resonance wells
   */
  private discoverResonanceGroups(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];
    const resonanceMap = new Map<number, bigint[]>();

    // Cluster by resonance similarity
    for (const n of numbers) {
      const res = this.resonance.calculateResonance(n);
      const bucket = Math.round(res * 100) / 100; // Quantize to 0.01

      if (!resonanceMap.has(bucket)) {
        resonanceMap.set(bucket, []);
      }
      const bucketArray = resonanceMap.get(bucket);
      if (bucketArray) {
        bucketArray.push(n);
      }
    }

    // Form groups from resonance clusters
    for (const [resonance, elements] of resonanceMap) {
      if (elements.length >= 3) {
        // Need at least 3 for interesting structure
        const group = this.crystallizeResonanceGroup(elements, resonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  /**
   * Crystallizes a group from elements sharing similar resonance
   */
  private crystallizeResonanceGroup(
    elements: bigint[],
    targetResonance: number,
  ): GroupStructure | null {
    // Find operation that preserves resonance
    const operation = this.findResonancePreservingOperation(elements, targetResonance);
    if (!operation) return null;

    // Find identity element (may emerge naturally)
    const identity = this.findEmergentIdentity(elements, operation);
    if (identity === null) return null;

    // Compute natural closure respecting resonance
    const closure = this.computeResonanceClosure(elements, operation, targetResonance);

    // Compute living properties
    const fieldCoherence = this.computeFieldCoherence(closure.elements);
    const resonanceStability = 1.0 - Math.abs(targetResonance - 1.0);
    const metabolicRate = this.computeMetabolicRate(closure.elements, operation);
    const evolutionPotential = this.computeEvolutionPotential(closure.elements, fieldCoherence);

    return {
      elements: closure.elements,
      identity,
      operation,
      isClosed: closure.isClosed,
      hasInverses: closure.hasInverses,
      isAbelian: true, // Resonance groups are typically abelian
      subgroups: [],
      // Living properties
      fieldCoherence,
      resonanceStability,
      metabolicRate,
      evolutionPotential,
    };
  }

  /**
   * Finds an operation that preserves resonance patterns
   */
  private findResonancePreservingOperation(
    elements: bigint[],
    targetResonance: number,
  ): ((a: bigint, b: bigint) => bigint) | null {
    // Try modular addition with resonance-aware modulus
    const resonanceModulus = BigInt(Math.round(targetResonance * this.PAGE_SIZE));
    if (resonanceModulus > 0n) {
      const modAdd = (a: bigint, b: bigint): bigint => {
        const sum = (a + b) % resonanceModulus;
        return sum < 0n ? sum + resonanceModulus : sum;
      };

      if (this.preservesResonance(elements, modAdd, targetResonance)) {
        return modAdd;
      }
    }

    // Try field-aware operation using arithmetic operators
    const fieldOp = (a: bigint, b: bigint): bigint => {
      const result = this.operators.add(a, b);
      return typeof result === 'bigint' ? result : result.result;
    };

    if (this.preservesResonance(elements, fieldOp, targetResonance)) {
      return fieldOp;
    }

    // Try standard addition for certain resonance values
    if (Math.abs(targetResonance - 1.0) < 0.1) {
      const standardAdd = (a: bigint, b: bigint): bigint => a + b;
      if (this.preservesResonance(elements, standardAdd, targetResonance, 0.2)) {
        return standardAdd;
      }
    }

    return null;
  }

  /**
   * Checks if an operation preserves resonance within tolerance
   */
  private preservesResonance(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
    targetResonance: number,
    tolerance: number = 0.1,
  ): boolean {
    const sample = elements.slice(0, Math.min(5, elements.length));

    for (const a of sample) {
      for (const b of sample) {
        try {
          const result = operation(a, b);
          const resultRes = this.resonance.calculateResonance(result);

          if (Math.abs(resultRes - targetResonance) > tolerance) {
            return false;
          }
        } catch {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Finds identity element that emerges naturally from the operation
   */
  private findEmergentIdentity(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
  ): bigint | null {
    // Check if any element acts as identity
    for (const candidate of elements) {
      let isIdentity = true;

      for (const a of elements) {
        try {
          if (operation(candidate, a) !== a || operation(a, candidate) !== a) {
            isIdentity = false;
            break;
          }
        } catch {
          isIdentity = false;
          break;
        }
      }

      if (isIdentity) return candidate;
    }

    // Try common identities from Mathematical Universe
    const commonIdentities = [0n, 1n, BigInt(this.PAGE_SIZE), BigInt(this.CYCLE_SIZE)];

    for (const candidate of commonIdentities) {
      let isIdentity = true;

      for (const a of elements.slice(0, Math.min(5, elements.length))) {
        try {
          const left = operation(candidate, a);
          const right = operation(a, candidate);

          if (left !== a || right !== a) {
            isIdentity = false;
            break;
          }
        } catch {
          isIdentity = false;
          break;
        }
      }

      if (isIdentity) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * Computes closure while respecting resonance and natural boundaries
   */
  private computeResonanceClosure(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
    targetResonance: number,
  ): { elements: Set<bigint>; isClosed: boolean; hasInverses: boolean } {
    const closed = new Set(elements);
    const identity = this.findEmergentIdentity(elements, operation);

    if (identity !== null && !closed.has(identity)) {
      closed.add(identity);
    }

    let changed = true;
    let iterations = 0;
    const maxIterations = 10;
    const maxSize = this.CYCLE_SIZE; // Natural boundary

    // Compute closure while respecting resonance
    while (changed && iterations < maxIterations && closed.size < maxSize) {
      changed = false;
      iterations++;

      const current = Array.from(closed);
      for (let i = 0; i < Math.min(current.length, 20); i++) {
        for (let j = 0; j < Math.min(current.length, 20); j++) {
          try {
            const result = operation(current[i], current[j]);
            const resultRes = this.resonance.calculateResonance(result);

            // Only add if it maintains resonance coherence
            if (!closed.has(result) && Math.abs(resultRes - targetResonance) < 0.2) {
              closed.add(result);
              changed = true;
            }
          } catch {
            // Operation failed, skip
          }
        }
      }
    }

    // Check for inverses
    let hasInverses = identity !== null;
    if (hasInverses) {
      for (const a of Array.from(closed).slice(0, Math.min(10, closed.size))) {
        let hasInverse = false;
        for (const b of closed) {
          try {
            if (operation(a, b) === identity && operation(b, a) === identity) {
              hasInverse = true;
              break;
            }
          } catch {
            // Operation failed
          }
        }
        if (!hasInverse) {
          hasInverses = false;
          break;
        }
      }
    }

    return {
      elements: closed,
      isClosed: iterations < maxIterations,
      hasInverses,
    };
  }

  /**
   * Measures how coherent the field patterns are within the group
   */
  private computeFieldCoherence(elements: Set<bigint>): number {
    const patterns: FieldPattern[] = [];

    for (const n of elements) {
      patterns.push(this.substrate.getFieldPattern(n));
    }

    if (patterns.length < 2) return 1.0;

    // Compute average pairwise field similarity
    let totalSimilarity = 0;
    let pairs = 0;

    const sample = patterns.slice(0, Math.min(20, patterns.length));
    for (let i = 0; i < sample.length; i++) {
      for (let j = i + 1; j < sample.length; j++) {
        let matches = 0;
        for (let k = 0; k < 8; k++) {
          if (sample[i][k] === sample[j][k]) matches++;
        }
        totalSimilarity += matches / 8;
        pairs++;
      }
    }

    return pairs > 0 ? totalSimilarity / pairs : 0;
  }

  /**
   * Computes the metabolic rate of field transformations
   */
  private computeMetabolicRate(
    elements: Set<bigint>,
    operation: (a: bigint, b: bigint) => bigint,
  ): number {
    let transformations = 0;
    let energyConsumed = 0;

    const sample = Array.from(elements).slice(0, Math.min(10, elements.size));

    for (let i = 0; i < sample.length; i++) {
      for (let j = i + 1; j < sample.length; j++) {
        try {
          const a = sample[i];
          const b = sample[j];

          // Check if operation creates field changes
          const patternA = this.substrate.getFieldPattern(a);
          const patternB = this.substrate.getFieldPattern(b);
          const result = operation(a, b);
          const patternResult = this.substrate.getFieldPattern(result);

          // Count field changes
          let changes = 0;
          for (let k = 0; k < 8; k++) {
            if (patternResult[k] !== patternA[k] && patternResult[k] !== patternB[k]) {
              changes++;
            }
          }

          if (changes > 0) {
            transformations++;
            energyConsumed += changes;
          }
        } catch {
          // Operation failed
        }
      }
    }

    return transformations > 0 ? energyConsumed / transformations : 0;
  }

  /**
   * Computes the group's potential to spawn new structures
   */
  private computeEvolutionPotential(elements: Set<bigint>, fieldCoherence: number): number {
    // High coherence and moderate size indicate evolutionary potential
    const sizeFactor = Math.min(elements.size / this.PAGE_SIZE, 1.0);
    const coherenceFactor = fieldCoherence;

    // Groups at Lagrange points have higher potential
    const lagrangeCount = Array.from(elements).filter((n) => {
      const pos = Number(n % BigInt(this.PAGE_SIZE));
      return this.LAGRANGE_POINTS.includes(pos);
    }).length;

    const lagrangeFactor = lagrangeCount / Math.max(elements.size, 1);

    return sizeFactor * coherenceFactor * (1 + lagrangeFactor);
  }

  /**
   * Discovers groups with harmonic field relationships
   */
  private discoverFieldHarmonicGroups(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];
    const patternGroups = new Map<number, bigint[]>();

    // Group by active field count (harmonic signature)
    for (const n of numbers) {
      const pattern = this.substrate.getFieldPattern(n);
      const activeCount = pattern.filter((b) => b).length;

      if (!patternGroups.has(activeCount)) {
        patternGroups.set(activeCount, []);
      }
      const activeCountArray = patternGroups.get(activeCount);
      if (activeCountArray) {
        activeCountArray.push(n);
      }
    }

    // Form groups from harmonic clusters
    for (const [activeCount, elements] of patternGroups) {
      if (elements.length >= 3) {
        const resonance = activeCount / 8; // Fraction of active fields
        const group = this.crystallizeResonanceGroup(elements, resonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  /**
   * Discovers groups that emerge within single pages
   */
  private discoverPageLocalGroups(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];
    const pageMap = new Map<number, bigint[]>();

    for (const n of numbers) {
      const page = this.topology.locateNumber(n).page;
      if (!pageMap.has(page)) {
        pageMap.set(page, []);
      }
      const pageArray = pageMap.get(page);
      if (pageArray) {
        pageArray.push(n);
      }
    }

    for (const [page, elements] of pageMap) {
      if (elements.length >= 3) {
        // Page-local groups use modular arithmetic within page
        const pageOp = (a: bigint, b: bigint): bigint => {
          const pageStart = BigInt(page * this.PAGE_SIZE);
          const relA = a - pageStart;
          const relB = b - pageStart;
          const sum = (relA + relB) % BigInt(this.PAGE_SIZE);
          return pageStart + sum;
        };

        // Check if this forms a valid group
        const identity = this.findEmergentIdentity(elements, pageOp);
        if (identity !== null) {
          const closure = this.computePageClosure(elements, pageOp, page);

          const group: GroupStructure = {
            elements: closure.elements,
            identity,
            operation: pageOp,
            isClosed: closure.isClosed,
            hasInverses: closure.hasInverses,
            isAbelian: true,
            subgroups: [],
            fieldCoherence: this.computeFieldCoherence(closure.elements),
            resonanceStability: 0.9, // Page-local groups are stable
            metabolicRate: this.computeMetabolicRate(closure.elements, pageOp),
          };

          groups.push(group);
        }
      }
    }

    return groups;
  }

  /**
   * Computes closure for page-local groups
   */
  private computePageClosure(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
    page: number,
  ): { elements: Set<bigint>; isClosed: boolean; hasInverses: boolean } {
    const closed = new Set(elements);
    const pageStart = BigInt(page * this.PAGE_SIZE);
    const pageEnd = pageStart + BigInt(this.PAGE_SIZE);

    let changed = true;
    let iterations = 0;

    while (changed && iterations < 5) {
      changed = false;
      iterations++;

      const current = Array.from(closed);
      for (const a of current) {
        for (const b of current) {
          try {
            const result = operation(a, b);
            if (result >= pageStart && result < pageEnd && !closed.has(result)) {
              closed.add(result);
              changed = true;
            }
          } catch {
            // Operation failed
          }
        }
      }
    }

    // Page-local groups always have inverses within the page
    return {
      elements: closed,
      isClosed: true,
      hasInverses: true,
    };
  }

  /**
   * Discovers groups anchored at Lagrange points
   */
  private discoverLagrangeGroups(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];
    const lagrangeMap = new Map<number, bigint[]>();

    // Group numbers near Lagrange points
    for (const n of numbers) {
      const pos = Number(n % BigInt(this.PAGE_SIZE));

      for (const lp of this.LAGRANGE_POINTS) {
        if (Math.abs(pos - lp) < this.PAGE_SIZE / 4) {
          if (!lagrangeMap.has(lp)) {
            lagrangeMap.set(lp, []);
          }
          const lpArray = lagrangeMap.get(lp);
          if (lpArray) {
            lpArray.push(n);
          }
        }
      }
    }

    for (const [lagrange, elements] of lagrangeMap) {
      if (elements.length >= 2) {
        const lagrangeRes = this.resonance.calculateResonance(BigInt(lagrange));
        const group = this.crystallizeResonanceGroup(elements, lagrangeRes);

        if (group) {
          // Enhance stability for Lagrange-anchored groups
          group.resonanceStability = Math.min((group.resonanceStability ?? 1) * 1.5, 1.0);
          groups.push(group);
        }
      }
    }

    return groups;
  }

  /**
   * Discovers groups born from denormalization artifacts
   */
  private discoverArtifactGroups(numbers: bigint[]): GroupStructure[] {
    const groups: GroupStructure[] = [];
    const artifactMap = new Map<string, bigint[]>();

    // Group numbers by artifact signatures
    for (const n of numbers) {
      const factors = this.operators.factorize(n);

      if (factors.factors.length >= 2) {
        for (let i = 0; i < factors.factors.length - 1; i++) {
          const result = this.operators.multiply(factors.factors[i], factors.factors[i + 1]);

          if (
            typeof result === 'object' &&
            'artifacts' in result &&
            result.artifacts !== null &&
            result.artifacts !== undefined
          ) {
            const artifacts = Array.isArray(result.artifacts) ? result.artifacts : [];
            const vanishing = artifacts.filter((a: unknown) => {
              return typeof a === 'object' && a !== null && 'type' in a && a.type === 'vanishing';
            }).length;
            const emergent = artifacts.filter((a: unknown) => {
              return typeof a === 'object' && a !== null && 'type' in a && a.type === 'emergent';
            }).length;
            const artifactSig = `v${vanishing}e${emergent}`;

            if (!artifactMap.has(artifactSig)) {
              artifactMap.set(artifactSig, []);
            }
            const sigArray = artifactMap.get(artifactSig);
            if (sigArray) {
              sigArray.push(n);
            }
          }
        }
      }
    }

    // Form groups from artifact clusters
    for (const [, elements] of artifactMap) {
      if (elements.length >= 3) {
        // Artifact groups have golden ratio resonance
        const goldenResonance = 1.618;
        const group = this.crystallizeResonanceGroup(elements, goldenResonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  /**
   * Discovers subgroups by finding natural subdivisions
   */
  detectSubgroups(group: GroupStructure): GroupStructure[] {
    return this.discoverSubgroups(group);
  }

  private discoverSubgroups(parent: GroupStructure): GroupStructure[] {
    const subgroups: GroupStructure[] = [];

    // Trivial subgroup
    subgroups.push({
      elements: new Set([parent.identity]),
      identity: parent.identity,
      operation: parent.operation,
      isClosed: true,
      hasInverses: true,
      isAbelian: true,
      subgroups: [],
      fieldCoherence: 1.0,
      resonanceStability: 1.0,
    });

    // The whole group is always a subgroup of itself
    subgroups.push({
      elements: new Set(parent.elements),
      identity: parent.identity,
      operation: parent.operation,
      isClosed: parent.isClosed,
      hasInverses: parent.hasInverses,
      isAbelian: parent.isAbelian,
      subgroups: [],
      fieldCoherence: parent.fieldCoherence,
      resonanceStability: parent.resonanceStability,
      metabolicRate: parent.metabolicRate,
      evolutionPotential: parent.evolutionPotential,
    });

    // Find cyclic subgroups
    const elements = Array.from(parent.elements);
    for (const generator of elements) {
      if (generator === parent.identity) continue;

      const cyclic = this.generateCyclicSubgroup(generator, parent);
      if (cyclic.elements.size > 1 && cyclic.elements.size < parent.elements.size) {
        subgroups.push(cyclic);
      }
    }

    // Find resonance-coherent subgroups
    const resonanceSubgroups = this.findResonanceSubgroups(parent);
    subgroups.push(...resonanceSubgroups);

    // Find page-coherent subgroups
    const pageSubgroups = this.findPageSubgroups(parent);
    subgroups.push(...pageSubgroups);

    return subgroups;
  }

  /**
   * Generates cyclic subgroup from a generator
   */
  private generateCyclicSubgroup(generator: bigint, parent: GroupStructure): GroupStructure {
    const elements = new Set<bigint>();
    elements.add(parent.identity);

    let current = generator;
    let iterations = 0;
    const maxIterations = 1000;

    while (!elements.has(current) && iterations < maxIterations) {
      elements.add(current);
      try {
        current = parent.operation(current, generator);
        iterations++;
      } catch {
        break;
      }
    }

    return {
      elements,
      identity: parent.identity,
      operation: parent.operation,
      isClosed: true,
      hasInverses: true,
      isAbelian: true,
      subgroups: [],
      fieldCoherence: this.computeFieldCoherence(elements),
      metabolicRate:
        parent.metabolicRate !== undefined && parent.metabolicRate !== null
          ? parent.metabolicRate * 0.8
          : undefined,
    };
  }

  /**
   * Finds subgroups based on resonance clustering
   */
  private findResonanceSubgroups(parent: GroupStructure): GroupStructure[] {
    const subgroups: GroupStructure[] = [];
    const resonanceMap = new Map<number, bigint[]>();

    // Cluster parent elements by resonance
    for (const n of parent.elements) {
      const res = this.resonance.calculateResonance(n);
      const bucket = Math.round(res * 10) / 10;

      if (!resonanceMap.has(bucket)) {
        resonanceMap.set(bucket, []);
      }
      const bucketArray = resonanceMap.get(bucket);
      if (bucketArray) {
        bucketArray.push(n);
      }
    }

    // Form subgroups from clusters
    for (const [, elements] of resonanceMap) {
      if (elements.length >= 3 && elements.length < parent.elements.size) {
        const subgroupElements = new Set(elements);

        // Verify it's closed under parent operation
        let isClosed = true;
        for (const a of elements) {
          for (const b of elements) {
            try {
              const result = parent.operation(a, b);
              if (!subgroupElements.has(result)) {
                isClosed = false;
                break;
              }
            } catch {
              isClosed = false;
              break;
            }
          }
          if (!isClosed) break;
        }

        if (isClosed && subgroupElements.has(parent.identity)) {
          subgroups.push({
            elements: subgroupElements,
            identity: parent.identity,
            operation: parent.operation,
            isClosed: true,
            hasInverses: true,
            isAbelian: parent.isAbelian,
            subgroups: [],
            fieldCoherence: this.computeFieldCoherence(subgroupElements),
          });
        }
      }
    }

    return subgroups;
  }

  /**
   * Finds subgroups based on page locality
   */
  private findPageSubgroups(parent: GroupStructure): GroupStructure[] {
    const subgroups: GroupStructure[] = [];
    const pageMap = new Map<number, bigint[]>();

    // Group parent elements by page
    for (const n of parent.elements) {
      const page = this.topology.locateNumber(n).page;
      if (!pageMap.has(page)) {
        pageMap.set(page, []);
      }
      const pageArray = pageMap.get(page);
      if (pageArray) {
        pageArray.push(n);
      }
    }

    // Check if page-local elements form subgroups
    for (const [, elements] of pageMap) {
      if (elements.length >= 3 && elements.length < parent.elements.size) {
        const subgroupElements = new Set(elements);

        // Add identity if not present
        if (!subgroupElements.has(parent.identity)) {
          subgroupElements.add(parent.identity);
        }

        // Verify closure
        let isClosed = true;
        const elemArray = Array.from(subgroupElements);

        for (let i = 0; i < Math.min(elemArray.length, 10); i++) {
          for (let j = 0; j < Math.min(elemArray.length, 10); j++) {
            try {
              const result = parent.operation(elemArray[i], elemArray[j]);
              if (!subgroupElements.has(result)) {
                // Try to add it if it's small enough
                if (subgroupElements.size < parent.elements.size / 2) {
                  subgroupElements.add(result);
                } else {
                  isClosed = false;
                  break;
                }
              }
            } catch {
              isClosed = false;
              break;
            }
          }
          if (!isClosed) break;
        }

        if (isClosed) {
          subgroups.push({
            elements: subgroupElements,
            identity: parent.identity,
            operation: parent.operation,
            isClosed: true,
            hasInverses: true,
            isAbelian: parent.isAbelian,
            subgroups: [],
          });
        }
      }
    }

    return subgroups;
  }

  /**
   * Analyzes symmetries through field and resonance patterns
   */
  analyzeSymmetries(n: bigint): SymmetryGroup {
    const generators: bigint[] = [];
    const pattern = this.substrate.getFieldPattern(n);
    const fieldSymmetries: FieldPattern[] = [];
    const resonanceOrbits: number[] = [];

    // Find field rotation symmetries
    const rotationGenerators = this.findFieldRotationSymmetries(n, pattern);
    generators.push(...rotationGenerators);

    // Find field reflection symmetries
    const reflectionGenerators = this.findFieldReflectionSymmetries(n, pattern);
    generators.push(...reflectionGenerators);

    // Find page-based symmetries
    const pageGenerators = this.findPageSymmetries(n);
    generators.push(...pageGenerators);

    // Find resonance orbit symmetries
    const resonanceSymmetries = this.findResonanceSymmetries(n);
    generators.push(...resonanceSymmetries.generators);
    resonanceOrbits.push(...resonanceSymmetries.orbits);

    // Record field patterns with symmetry
    for (let shift = 0; shift < 8; shift++) {
      const rotated = this.rotatePattern(pattern, shift);
      if (this.patternsEqual(rotated, pattern)) {
        fieldSymmetries.push(rotated);
      }
    }

    // Calculate group order
    const order = this.calculateSymmetryOrder(generators);

    return {
      generators,
      order,
      isFinite: order < 1000000n,
      symmetryType: this.classifySymmetryType(generators, order),
      fieldSymmetries,
      resonanceOrbits,
    };
  }

  /**
   * Finds symmetries from field rotations
   */
  private findFieldRotationSymmetries(n: bigint, pattern: FieldPattern): bigint[] {
    const generators: bigint[] = [];

    // Check cyclic rotations
    for (let shift = 1; shift < 8; shift++) {
      const rotated = this.rotatePattern(pattern, shift);
      if (this.patternsEqual(rotated, pattern)) {
        generators.push(BigInt(shift));
      }
    }

    return generators;
  }

  /**
   * Finds symmetries from field reflections
   */
  private findFieldReflectionSymmetries(n: bigint, pattern: FieldPattern): bigint[] {
    const generators: bigint[] = [];

    // Check reflection
    const reflected = [...pattern].reverse();
    if (this.patternsEqual(reflected, pattern)) {
      generators.push(2n); // Reflection has order 2
    }

    // Check other reflection axes
    for (let axis = 0; axis < 4; axis++) {
      const reflected = this.reflectPattern(pattern, axis);
      if (this.patternsEqual(reflected, pattern)) {
        generators.push(BigInt(2 + axis));
      }
    }

    return generators;
  }

  /**
   * Finds page-based symmetries
   */
  private findPageSymmetries(n: bigint): bigint[] {
    const generators: bigint[] = [];
    // const pageInfo = this.topology.locateNumber(n); // Currently unused
    const pos = Number(n % BigInt(this.PAGE_SIZE));

    // Check if at Lagrange point
    if (this.LAGRANGE_POINTS.includes(pos)) {
      generators.push(BigInt(this.PAGE_SIZE)); // Page period symmetry
    }

    // Check page boundary symmetry
    if (pos === 0 || pos === this.PAGE_SIZE - 1) {
      generators.push(2n); // Boundary reflection
    }

    return generators;
  }

  /**
   * Finds resonance-based symmetries
   */
  private findResonanceSymmetries(n: bigint): { generators: bigint[]; orbits: number[] } {
    const generators: bigint[] = [];
    const orbits: number[] = [];

    const baseRes = this.resonance.calculateResonance(n);
    orbits.push(baseRes);

    // Check for resonance-preserving transformations
    for (let k = 1; k <= 8; k++) {
      const transformed = n + BigInt(k * this.PAGE_SIZE);
      const transformedRes = this.resonance.calculateResonance(transformed);

      if (Math.abs(transformedRes - baseRes) < 0.01) {
        generators.push(BigInt(k));
        orbits.push(transformedRes);
      }
    }

    return { generators, orbits };
  }

  /**
   * Helper methods
   */

  private rotatePattern(pattern: FieldPattern, shift: number): FieldPattern {
    const result = new Array<boolean>(8);
    for (let i = 0; i < 8; i++) {
      result[i] = pattern[(i + shift) % 8];
    }
    return result;
  }

  private reflectPattern(pattern: FieldPattern, axis: number): FieldPattern {
    const result = [...pattern];

    switch (axis) {
      case 0: // Horizontal reflection
        return [
          result[0],
          result[7],
          result[6],
          result[5],
          result[4],
          result[3],
          result[2],
          result[1],
        ];
      case 1: // Vertical reflection
        return [
          result[4],
          result[3],
          result[2],
          result[1],
          result[0],
          result[7],
          result[6],
          result[5],
        ];
      case 2: // Diagonal reflection
        return [
          result[0],
          result[3],
          result[6],
          result[1],
          result[4],
          result[7],
          result[2],
          result[5],
        ];
      case 3: // Anti-diagonal reflection
        return [
          result[0],
          result[5],
          result[2],
          result[7],
          result[4],
          result[1],
          result[6],
          result[3],
        ];
      default:
        return result;
    }
  }

  private patternsEqual(p1: FieldPattern, p2: FieldPattern): boolean {
    for (let i = 0; i < 8; i++) {
      if (p1[i] !== p2[i]) return false;
    }
    return true;
  }

  private calculateSymmetryOrder(generators: bigint[]): bigint {
    if (generators.length === 0) return 1n;

    // For single generator, return its value
    if (generators.length === 1) {
      return generators[0];
    }

    // For multiple generators, compute LCM
    let order = generators[0];
    for (let i = 1; i < generators.length; i++) {
      order = this.lcm(order, generators[i]);
    }

    return order;
  }

  private lcm(a: bigint, b: bigint): bigint {
    return (a * b) / this.gcd(a, b);
  }

  private gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  private classifySymmetryType(generators: bigint[], order: bigint): string {
    if (generators.length === 0) return 'Trivial';
    if (generators.length === 1) return `Cyclic-${order}`;

    // Check for dihedral group
    const hasRotation = generators.some((g) => g > 2n);
    const hasReflection = generators.some((g) => g === 2n);

    if (hasRotation && hasReflection) {
      return `Dihedral-${order}`;
    }

    // Check for Klein four-group
    if (generators.every((g) => g === 2n) && generators.length === 2) {
      return 'Klein-4';
    }

    return `General-${order}`;
  }

  /**
   * Try to form an additive group from the given numbers
   */
  private tryFormAdditiveGroup(numbers: bigint[]): GroupStructure | null {
    const elements = new Set(numbers);

    // Additive operation
    const addition = (a: bigint, b: bigint): bigint => a + b;

    // Check if closed under addition (for finite sets, this is tricky)
    // For now, just accept the elements as given for simple cases

    // Find identity (should be 0)
    if (!elements.has(0n)) return null;

    // Check for inverses
    let hasInverses = true;
    for (const a of elements) {
      if (a === 0n) continue; // 0 is its own inverse

      const inverse = -a;
      if (!elements.has(inverse)) {
        hasInverses = false;
        break;
      }
    }

    // For now, accept it if we have identity and inverses
    return {
      elements,
      identity: 0n,
      operation: addition,
      isClosed: true, // Assume closure for simple cases
      hasInverses,
      isAbelian: true, // Addition is always commutative
      subgroups: [],

      // Living properties
      fieldCoherence: this.computeFieldCoherence(elements),
      resonanceStability: 0.8, // Stable for basic groups
      metabolicRate: 0.2,
      evolutionPotential: 0.5,
      denormalizationActivity: 0.1,
      conservationMetrics: {
        fieldParityConserved: true,
        resonanceFluxConserved: true,
        informationConserved: true,
      },
      fieldChemistry: {
        reactionRates: new Map(),
        catalysts: [],
        inhibitors: [],
      },
    };
  }

  /**
   * Try to form a multiplicative group from the given numbers
   */
  private tryFormMultiplicativeGroup(numbers: bigint[]): GroupStructure | null {
    const elements = new Set(numbers);

    // Multiplicative operation
    const multiplication = (a: bigint, b: bigint): bigint => a * b;

    // Find identity (should be 1)
    if (!elements.has(1n)) return null;

    // Check for inverses
    let hasInverses = true;
    for (const a of elements) {
      if (a === 1n) continue; // 1 is its own inverse

      // For simple cases, check if we have the obvious inverses
      if (a === -1n && elements.has(-1n)) continue; // -1 is its own inverse

      // For other elements, we'd need to check if a * b = 1 for some b in the set
      // For now, let's be more permissive and check basic cases
      if (elements.size === 2 && elements.has(1n) && elements.has(-1n)) {
        // Special case: {1, -1} under multiplication
        hasInverses = true;
        break;
      }

      // General case: look for multiplicative inverse
      let foundInverse = false;
      for (const b of elements) {
        if (a * b === 1n) {
          foundInverse = true;
          break;
        }
      }
      if (!foundInverse) {
        hasInverses = false;
        break;
      }
    }

    // Check closure (simplified for common cases)
    let isClosed = true;
    if (elements.size === 2 && elements.has(1n) && elements.has(-1n)) {
      // {1, -1} is closed under multiplication
      isClosed = true;
    } else {
      // For general case, check if all products are in the set
      for (const a of Array.from(elements).slice(0, 5)) {
        // Limit to avoid infinite loops
        for (const b of Array.from(elements).slice(0, 5)) {
          const product = multiplication(a, b);
          if (!elements.has(product)) {
            isClosed = false;
            break;
          }
        }
        if (!isClosed) break;
      }
    }

    if (!isClosed || !hasInverses) return null;

    return {
      elements,
      identity: 1n,
      operation: multiplication,
      isClosed,
      hasInverses,
      isAbelian: true, // For small groups like {1, -1}
      subgroups: [],

      // Living properties
      fieldCoherence: this.computeFieldCoherence(elements),
      resonanceStability: 0.9, // High stability for multiplicative units
      metabolicRate: 0.1,
      evolutionPotential: 0.3,
      denormalizationActivity: 0.05,
      conservationMetrics: {
        fieldParityConserved: true,
        resonanceFluxConserved: true,
        informationConserved: true,
      },
      fieldChemistry: {
        reactionRates: new Map(),
        catalysts: [],
        inhibitors: [],
      },
    };
  }
}
