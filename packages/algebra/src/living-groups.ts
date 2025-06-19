import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import type { GroupStructure } from './groups';

/**
 * Living groups that emerge from the Mathematical Universe's field dynamics.
 * These are not axiomatically defined but self-organize from resonance flows.
 */

export interface LivingGroup extends GroupStructure {
  // Field-based properties
  fieldCoherence: number; // How well the group preserves field patterns
  resonanceStability: number; // Stability within resonance gradient flow

  // Page topology
  pageSignature: {
    primaryPage: number; // Home page of the group
    pageSpan: number; // How many pages it spans
    lagrangeAnchors: bigint[]; // Elements at Lagrange points
  };

  // Metabolic properties
  operationEnergy: Map<[bigint, bigint], number>; // Energy cost of operations
  fieldMetabolism: {
    fieldConsumption: FieldPattern[]; // Fields consumed by operations
    fieldProduction: FieldPattern[]; // Fields produced by operations
    metabolicEfficiency: number;
  };

  // Self-organization
  attractorBasin: Set<bigint>; // Numbers that "fall into" this group
  repellerSet: Set<bigint>; // Numbers that are pushed away
  evolutionPotential: number; // Likelihood of spawning new groups
}

export class LivingGroupDetector {
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
   * Discovers living groups by following the natural organization of the Mathematical Universe
   */
  discoverLivingGroups(numbers: bigint[]): LivingGroup[] {
    // const groups: LivingGroup[] = [];

    // 1. Find resonance-coherent clusters
    const resonanceClusters = this.findResonanceClusters(numbers);

    // 2. Discover field-harmonic groups
    const fieldGroups = this.findFieldHarmonicGroups(numbers);

    // 3. Detect page-local groups
    const pageGroups = this.findPageLocalGroups(numbers);

    // 4. Find Lagrange-anchored groups
    const lagrangeGroups = this.findLagrangeGroups(numbers);

    // 5. Discover denormalization-born groups
    const artifactGroups = this.findArtifactGroups(numbers);

    // Merge and evolve discovered groups
    const allGroups = [
      ...resonanceClusters,
      ...fieldGroups,
      ...pageGroups,
      ...lagrangeGroups,
      ...artifactGroups,
    ];

    // Let groups compete and cooperate
    const evolvedGroups = this.evolveGroups(allGroups);

    return evolvedGroups;
  }

  private findResonanceClusters(numbers: bigint[]): LivingGroup[] {
    const groups: LivingGroup[] = [];
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
        const group = this.formResonanceGroup(elements, resonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  private formResonanceGroup(elements: bigint[], targetResonance: number): LivingGroup | null {
    // Find operation that preserves resonance
    const operation = this.findResonancePreservingOperation(elements, targetResonance);
    if (!operation) return null;

    // Verify group axioms emerge naturally
    const identity = this.findIdentity(elements, operation);
    if (identity === null) return null;

    // Check closure under resonance gradient
    const closure = this.computeResonanceClosure(elements, operation, targetResonance);

    // Compute field coherence
    const fieldCoherence = this.computeFieldCoherence(closure.elements);

    // Analyze page topology
    const pageSignature = this.analyzePageSignature(closure.elements);

    // Compute metabolic properties
    const metabolism = this.computeFieldMetabolism(closure.elements, operation);

    // Find attractor basin
    const { attractorBasin, repellerSet } = this.findAttractorDynamics(closure.elements, operation);

    return {
      // Basic group properties
      elements: closure.elements,
      identity,
      operation,
      isClosed: closure.isClosed,
      hasInverses: closure.hasInverses,
      isAbelian: true, // Resonance groups are typically abelian
      subgroups: [],

      // Living properties
      fieldCoherence,
      resonanceStability: 1.0 - Math.abs(targetResonance - 1.0), // Distance from perfect resonance
      pageSignature,
      operationEnergy: this.computeOperationEnergy(closure.elements, operation),
      fieldMetabolism: metabolism,
      attractorBasin,
      repellerSet,
      evolutionPotential: this.computeEvolutionPotential(closure.elements, fieldCoherence),
    };
  }

  private findResonancePreservingOperation(
    elements: bigint[],
    targetResonance: number,
  ): ((a: bigint, b: bigint) => bigint) | null {
    // Try different operations to find one that preserves resonance

    // 1. Modular addition with resonance-aware modulus
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

    // 2. Field-aware XOR operation
    const fieldXor = (a: bigint, b: bigint): bigint => {
      const result = this.operators.add(a, b);
      return typeof result === 'bigint' ? result : result.result;
    };

    if (this.preservesResonance(elements, fieldXor, targetResonance)) {
      return fieldXor;
    }

    // 3. Resonance-harmonic operation
    const harmonicOp = (a: bigint, b: bigint): bigint => {
      const resA = this.resonance.calculateResonance(a);
      const resB = this.resonance.calculateResonance(b);
      const harmonicMean = 2 / (1 / resA + 1 / resB);

      // Find number with closest resonance to harmonic mean
      let closest = a;
      let minDiff = Math.abs(resA - harmonicMean);

      for (const n of elements) {
        const resN = this.resonance.calculateResonance(n);
        const diff = Math.abs(resN - harmonicMean);
        if (diff < minDiff) {
          minDiff = diff;
          closest = n;
        }
      }

      return closest;
    };

    if (this.preservesResonance(elements, harmonicOp, targetResonance)) {
      return harmonicOp;
    }

    return null;
  }

  private preservesResonance(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
    targetResonance: number,
    tolerance: number = 0.1,
  ): boolean {
    // Sample operation results
    const sample = elements.slice(0, Math.min(5, elements.length));

    for (const a of sample) {
      for (const b of sample) {
        const result = operation(a, b);
        const resultRes = this.resonance.calculateResonance(result);

        if (Math.abs(resultRes - targetResonance) > tolerance) {
          return false;
        }
      }
    }

    return true;
  }

  private findIdentity(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
  ): bigint | null {
    // Look for identity element
    for (const candidate of elements) {
      let isIdentity = true;

      for (const a of elements) {
        if (operation(candidate, a) !== a || operation(a, candidate) !== a) {
          isIdentity = false;
          break;
        }
      }

      if (isIdentity) return candidate;
    }

    // Try common identities
    const commonIdentities = [0n, 1n, BigInt(this.PAGE_SIZE), BigInt(this.CYCLE_SIZE)];

    for (const candidate of commonIdentities) {
      let isIdentity = true;

      for (const a of elements) {
        const left = operation(candidate, a);
        const right = operation(a, candidate);

        if (left !== a || right !== a) {
          isIdentity = false;
          break;
        }
      }

      if (isIdentity) {
        elements.push(candidate);
        return candidate;
      }
    }

    return null;
  }

  private computeResonanceClosure(
    elements: bigint[],
    operation: (a: bigint, b: bigint) => bigint,
    targetResonance: number,
  ): { elements: Set<bigint>; isClosed: boolean; hasInverses: boolean } {
    const closed = new Set(elements);
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;
    const maxSize = this.CYCLE_SIZE; // Natural boundary

    // Compute closure while respecting resonance
    while (changed && iterations < maxIterations && closed.size < maxSize) {
      changed = false;
      iterations++;

      const current = Array.from(closed);
      for (const a of current) {
        for (const b of current) {
          const result = operation(a, b);
          const resultRes = this.resonance.calculateResonance(result);

          // Only add if it maintains resonance coherence
          if (!closed.has(result) && Math.abs(resultRes - targetResonance) < 0.2) {
            closed.add(result);
            changed = true;
          }
        }
      }
    }

    // Check for inverses
    let hasInverses = true;
    const identity = this.findIdentity(Array.from(closed), operation);

    if (identity !== null) {
      for (const a of closed) {
        let hasInverse = false;
        for (const b of closed) {
          if (operation(a, b) === identity && operation(b, a) === identity) {
            hasInverse = true;
            break;
          }
        }
        if (!hasInverse) {
          hasInverses = false;
          break;
        }
      }
    } else {
      hasInverses = false;
    }

    return {
      elements: closed,
      isClosed: iterations < maxIterations,
      hasInverses,
    };
  }

  private computeFieldCoherence(elements: Set<bigint>): number {
    // Measure how coherent the field patterns are
    const patterns: FieldPattern[] = [];

    for (const n of elements) {
      patterns.push(this.substrate.getFieldPattern(n));
    }

    // Compute pairwise field similarity
    let totalSimilarity = 0;
    let pairs = 0;

    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const similarity = this.fieldSimilarity(patterns[i], patterns[j]);
        totalSimilarity += similarity;
        pairs++;
      }
    }

    return pairs > 0 ? totalSimilarity / pairs : 0;
  }

  private fieldSimilarity(pattern1: FieldPattern, pattern2: FieldPattern): number {
    let matches = 0;
    for (let i = 0; i < 8; i++) {
      if (pattern1[i] === pattern2[i]) matches++;
    }
    return matches / 8;
  }

  private analyzePageSignature(elements: Set<bigint>): LivingGroup['pageSignature'] {
    const pageMap = new Map<number, bigint[]>();
    const lagrangeAnchors: bigint[] = [];

    for (const n of elements) {
      const pageInfo = this.topology.locateNumber(n);
      const page = pageInfo.page;

      if (!pageMap.has(page)) {
        pageMap.set(page, []);
      }
      const pageArray = pageMap.get(page);
      if (pageArray) {
        pageArray.push(n);
      }

      // Check if at Lagrange point
      const position = Number(n % BigInt(this.PAGE_SIZE));
      if (this.LAGRANGE_POINTS.includes(position)) {
        lagrangeAnchors.push(n);
      }
    }

    // Find primary page (most elements)
    let primaryPage = 0;
    let maxCount = 0;

    for (const [page, elems] of pageMap) {
      if (elems.length > maxCount) {
        maxCount = elems.length;
        primaryPage = page;
      }
    }

    return {
      primaryPage,
      pageSpan: pageMap.size,
      lagrangeAnchors,
    };
  }

  private computeFieldMetabolism(
    elements: Set<bigint>,
    operation: (a: bigint, b: bigint) => bigint,
  ): LivingGroup['fieldMetabolism'] {
    const consumed: FieldPattern[] = [];
    const produced: FieldPattern[] = [];

    // Sample operations to analyze metabolism
    const sample = Array.from(elements).slice(0, Math.min(10, elements.size));

    for (const a of sample) {
      for (const b of sample) {
        const patternA = this.substrate.getFieldPattern(a);
        const patternB = this.substrate.getFieldPattern(b);

        const result = operation(a, b);
        const patternResult = this.substrate.getFieldPattern(result);

        // Track field transformations
        consumed.push(patternA, patternB);
        produced.push(patternResult);
      }
    }

    // Compute metabolic efficiency
    const uniqueConsumed = this.uniquePatterns(consumed);
    const uniqueProduced = this.uniquePatterns(produced);

    const efficiency = uniqueProduced.length / Math.max(uniqueConsumed.length, 1);

    return {
      fieldConsumption: consumed,
      fieldProduction: produced,
      metabolicEfficiency: efficiency,
    };
  }

  private uniquePatterns(patterns: FieldPattern[]): FieldPattern[] {
    const unique: FieldPattern[] = [];
    const seen = new Set<string>();

    for (const pattern of patterns) {
      const key = pattern.map((b) => (b ? '1' : '0')).join('');
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(pattern);
      }
    }

    return unique;
  }

  private computeOperationEnergy(
    elements: Set<bigint>,
    _operation: (a: bigint, b: bigint) => bigint,
  ): Map<[bigint, bigint], number> {
    const energyMap = new Map<[bigint, bigint], number>();

    for (const a of elements) {
      for (const b of elements) {
        const pageA = this.topology.locateNumber(a).page;
        const pageB = this.topology.locateNumber(b).page;

        // Energy cost based on page distance
        const pageDist = Math.abs(pageA - pageB);
        const baseCost = 1.0;
        const crossPagePenalty = pageDist > 0 ? 1.3 : 1.0;

        // Additional cost for operations far from Lagrange points
        const posA = Number(a % BigInt(this.PAGE_SIZE));
        const posB = Number(b % BigInt(this.PAGE_SIZE));

        const lagrangeDist = Math.min(
          ...this.LAGRANGE_POINTS.map((lp) => Math.abs(posA - lp) + Math.abs(posB - lp)),
        );

        const lagrangePenalty = 1 + lagrangeDist / this.PAGE_SIZE;

        const totalEnergy = baseCost * crossPagePenalty * lagrangePenalty;
        energyMap.set([a, b], totalEnergy);
      }
    }

    return energyMap;
  }

  private findAttractorDynamics(
    elements: Set<bigint>,
    operation: (a: bigint, b: bigint) => bigint,
  ): { attractorBasin: Set<bigint>; repellerSet: Set<bigint> } {
    const attractorBasin = new Set<bigint>();
    const repellerSet = new Set<bigint>();

    // Test nearby numbers to see if they're attracted to the group
    const testRadius = BigInt(this.CORRELATION_LENGTH);

    for (const n of elements) {
      // Test numbers within correlation length
      for (let offset = -testRadius; offset <= testRadius; offset++) {
        const test = n + offset;
        if (test < 0n || elements.has(test)) continue;

        // Apply operation with group elements
        let attracted = false;
        let repelled = false;

        for (const g of elements) {
          const result = operation(test, g);

          if (elements.has(result)) {
            attracted = true;
          } else if (Math.abs(Number(result - test)) > Number(testRadius)) {
            repelled = true;
          }
        }

        if (attracted && !repelled) {
          attractorBasin.add(test);
        } else if (repelled && !attracted) {
          repellerSet.add(test);
        }
      }
    }

    return { attractorBasin, repellerSet };
  }

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

  private findFieldHarmonicGroups(numbers: bigint[]): LivingGroup[] {
    // Groups where field patterns form harmonic relationships
    const groups: LivingGroup[] = [];

    // Group by field pattern similarity
    const patternGroups = new Map<string, bigint[]>();

    for (const n of numbers) {
      const pattern = this.substrate.getFieldPattern(n);
      // Create harmonic signature (count of active fields)
      const activeCount = pattern.filter((b) => b).length;
      const key = `harmonic-${activeCount}`;

      if (!patternGroups.has(key)) {
        patternGroups.set(key, []);
      }
      const keyArray = patternGroups.get(key);
      if (keyArray) {
        keyArray.push(n);
      }
    }

    // Form groups from harmonic clusters
    for (const [key, elements] of patternGroups) {
      if (elements.length >= 3) {
        const harmonicNumber = Number(key.split('-')[1]);
        const resonance = harmonicNumber / 8; // Fraction of active fields

        const group = this.formResonanceGroup(elements, resonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  private findPageLocalGroups(numbers: bigint[]): LivingGroup[] {
    // Groups that emerge within single pages
    const groups: LivingGroup[] = [];
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
        // Page-local groups have perfect resonance at page center
        const pageCenter = page * this.PAGE_SIZE + this.PAGE_SIZE / 2;
        const centerResonance = this.resonance.calculateResonance(BigInt(pageCenter));

        const group = this.formResonanceGroup(elements, centerResonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  private findLagrangeGroups(numbers: bigint[]): LivingGroup[] {
    // Groups anchored at Lagrange points
    const groups: LivingGroup[] = [];
    const lagrangeMap = new Map<number, bigint[]>();

    for (const n of numbers) {
      const pos = Number(n % BigInt(this.PAGE_SIZE));

      // Find nearest Lagrange point
      let nearest = this.LAGRANGE_POINTS[0];
      let minDist = Math.abs(pos - nearest);

      for (const lp of this.LAGRANGE_POINTS) {
        const dist = Math.abs(pos - lp);
        if (dist < minDist) {
          minDist = dist;
          nearest = lp;
        }
      }

      if (minDist < this.PAGE_SIZE / 4) {
        // Within influence radius
        if (!lagrangeMap.has(nearest)) {
          lagrangeMap.set(nearest, []);
        }
        const nearestArray = lagrangeMap.get(nearest);
        if (nearestArray) {
          nearestArray.push(n);
        }
      }
    }

    for (const [lagrange, elements] of lagrangeMap) {
      if (elements.length >= 2) {
        // Lagrange groups have special stability
        const lagrangeResonance = this.resonance.calculateResonance(BigInt(lagrange));

        const group = this.formResonanceGroup(elements, lagrangeResonance);
        if (group) {
          // Enhance stability for Lagrange-anchored groups
          group.resonanceStability *= 1.5;
          groups.push(group);
        }
      }
    }

    return groups;
  }

  private findArtifactGroups(numbers: bigint[]): LivingGroup[] {
    // Groups born from denormalization artifacts
    const groups: LivingGroup[] = [];
    const artifactMap = new Map<string, bigint[]>();

    for (const n of numbers) {
      // Check if multiplication creates artifacts
      const factors = this.operators.factorize(n);

      if (factors.factors.length >= 2) {
        for (let i = 0; i < factors.factors.length - 1; i++) {
          const f1 = factors.factors[i];
          const f2 = factors.factors[i + 1];

          const result = this.operators.multiply(f1, f2);
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

    for (const [, elements] of artifactMap) {
      if (elements.length >= 3) {
        // Artifact groups have golden ratio resonance
        const goldenResonance = 1.618;

        const group = this.formResonanceGroup(elements, goldenResonance);
        if (group) groups.push(group);
      }
    }

    return groups;
  }

  private evolveGroups(groups: LivingGroup[]): LivingGroup[] {
    // Let groups interact and evolve
    const evolved: LivingGroup[] = [];

    // Sort by evolution potential
    groups.sort((a, b) => b.evolutionPotential - a.evolutionPotential);

    // Keep the fittest groups
    const survivors = groups.slice(0, Math.min(10, groups.length));
    evolved.push(...survivors);

    // Allow strong groups to spawn offspring
    for (const parent of survivors) {
      if (parent.evolutionPotential > 0.7) {
        const offspring = this.spawnOffspring(parent);
        if (offspring) evolved.push(offspring);
      }
    }

    return evolved;
  }

  private spawnOffspring(parent: LivingGroup): LivingGroup | null {
    // Create a mutated offspring group
    const mutatedElements = new Set<bigint>();

    // Keep core elements
    const core = Array.from(parent.elements).slice(0, parent.elements.size / 2);
    core.forEach((n) => mutatedElements.add(n));

    // Add mutations from attractor basin
    const attractors = Array.from(parent.attractorBasin).slice(0, 3);
    attractors.forEach((n) => mutatedElements.add(n));

    // Try to form a new group with slightly shifted resonance
    const shiftedResonance = parent.resonanceStability * 1.1;

    return this.formResonanceGroup(Array.from(mutatedElements), shiftedResonance);
  }
}
