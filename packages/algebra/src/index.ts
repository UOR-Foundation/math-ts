import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';

import { GroupDetector } from './groups';
import { RingDetector } from './rings';
import { ModuleAnalyzer } from './modules';

export * from './groups';
export * from './rings';
export * from './modules';

export interface AlgebraicStructures {
  detectGroups(numbers: bigint[]): GroupStructure[];
  findRingStructure(numbers: bigint[]): RingStructure | null;
  analyzeSymmetries(n: bigint): SymmetryGroup;
  createModule(elements: Set<bigint>, scalarRing: RingStructure): Module | null;
  detectAlgebraicLife(numbers: bigint[]): AlgebraicLifeReport;
}

export interface AlgebraicLifeReport {
  groups: GroupStructure[];
  rings: RingStructure[];
  modules: Module[];
  ecology: AlgebraicEcology;
  evolution: AlgebraicEvolution[];
  metabolism: AlgebraicMetabolism;
  conservation: ConservationStatus;
  emergence: EmergenceReport;
}

export interface AlgebraicEcology {
  cooperativeStructures: Array<{
    structure1: GroupStructure | RingStructure;
    structure2: GroupStructure | RingStructure;
    interaction: 'enhancing' | 'neutral' | 'interfering';
    resonanceExchange: number;
    fieldHarmony: number;
  }>;
  dominantStructures: Array<GroupStructure | RingStructure>;
  nichStructures: Array<GroupStructure | RingStructure>;
  lagrangeAnchored: Array<GroupStructure | RingStructure>;
  artifactBorn: Array<GroupStructure | RingStructure>;
  pageLocal: Array<GroupStructure | RingStructure>;
}

export interface AlgebraicEvolution {
  generation: number;
  structures: Array<GroupStructure | RingStructure>;
  mutations: string[];
  fitness: number;
  resonanceGradient: number;
  conservationCompliance: number;
  fieldCoherence: number;
}

export interface AlgebraicMetabolism {
  totalMetabolicRate: number;
  fieldConsumption: Map<string, number>;
  denormalizationActivity: number;
  resonanceFlux: number;
  informationThroughput: number;
}

export interface ConservationStatus {
  fieldParityConserved: boolean;
  resonanceFluxBalanced: boolean;
  informationConserved: boolean;
  violationLocations: Array<{
    location: bigint;
    type: 'field-parity' | 'resonance-flux' | 'information';
    severity: number;
  }>;
}

export interface EmergenceReport {
  spontaneousGroups: number;
  crystallizedRings: number;
  selfOrganizingModules: number;
  resonanceWells: Array<{
    center: bigint;
    depth: number;
    capturedStructures: number;
  }>;
  evolutionaryPressure: number;
}

import type { GroupStructure, SymmetryGroup } from './groups';
import type { RingStructure } from './rings';
import type { Module } from './modules';

export class AlgebraicStructureDetector implements AlgebraicStructures {
  private groupDetector: GroupDetector;
  private ringDetector: RingDetector;
  private moduleAnalyzer: ModuleAnalyzer;

  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
    private operators: ArithmeticOperators,
  ) {
    this.groupDetector = new GroupDetector(substrate, resonance, topology, operators);
    this.ringDetector = new RingDetector(substrate, resonance, topology, operators);
    this.moduleAnalyzer = new ModuleAnalyzer(substrate, resonance, topology, operators);
  }

  detectGroups(numbers: bigint[]): GroupStructure[] {
    const groups = this.groupDetector.detectGroups(numbers);

    // Find subgroups for each detected group
    for (const group of groups) {
      group.subgroups = this.groupDetector.detectSubgroups(group);
    }

    return groups;
  }

  findRingStructure(numbers: bigint[]): RingStructure | null {
    return this.ringDetector.detectRingStructure(numbers);
  }

  analyzeSymmetries(n: bigint): SymmetryGroup {
    return this.groupDetector.analyzeSymmetries(n);
  }

  createModule(elements: Set<bigint>, scalarRing: RingStructure): Module | null {
    return this.moduleAnalyzer.createModule(elements, scalarRing);
  }

  detectAlgebraicLife(numbers: bigint[]): AlgebraicLifeReport {
    // Discover emergent structures (not detect imposed ones)
    const groups = this.discoverEmergentGroups(numbers);
    const rings = this.crystallizeRings(numbers);
    const modules = this.cultivateModules(rings);

    // Analyze the living ecosystem
    const ecology = this.analyzeEcology(groups, rings);
    const metabolism = this.measureMetabolism(groups, rings, modules);
    const conservation = this.checkConservationLaws(numbers, groups, rings);
    const emergence = this.assessEmergence(groups, rings, modules, numbers);

    // Simulate evolution along resonance gradients
    const evolution = this.evolveAlongGradients(numbers, 5);

    return {
      groups,
      rings,
      modules,
      ecology,
      evolution,
      metabolism,
      conservation,
      emergence,
    };
  }

  private analyzeEcology(groups: GroupStructure[], rings: RingStructure[]): AlgebraicEcology {
    const cooperativeStructures: AlgebraicEcology['cooperativeStructures'] = [];
    const dominantStructures: Array<GroupStructure | RingStructure> = [];
    const nichStructures: Array<GroupStructure | RingStructure> = [];
    const lagrangeAnchored: Array<GroupStructure | RingStructure> = [];
    const artifactBorn: Array<GroupStructure | RingStructure> = [];
    const pageLocal: Array<GroupStructure | RingStructure> = [];

    // Analyze living interactions with field awareness
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const interaction = this.analyzeInteraction(groups[i], groups[j]);
        const resonanceExchange = this.calculateResonanceExchange(groups[i], groups[j]);
        const fieldHarmony = this.measureFieldHarmony(groups[i], groups[j]);

        cooperativeStructures.push({
          structure1: groups[i],
          structure2: groups[j],
          interaction,
          resonanceExchange,
          fieldHarmony,
        });
      }
    }

    // Analyze ring-group symbiosis
    for (const ring of rings) {
      for (const group of groups) {
        const interaction = this.analyzeRingGroupInteraction(ring, group);
        const resonanceExchange = this.calculateResonanceExchange(ring, group);
        const fieldHarmony = this.measureFieldHarmony(ring, group);

        cooperativeStructures.push({
          structure1: ring,
          structure2: group,
          interaction,
          resonanceExchange,
          fieldHarmony,
        });
      }
    }

    // Classify structures by their ecological niche
    const allStructures = [...groups, ...rings];
    for (const structure of allStructures) {
      // Check if anchored at Lagrange points
      if (this.isLagrangeAnchored(structure)) {
        lagrangeAnchored.push(structure);
      }

      // Check if born from denormalization artifacts
      if (this.isArtifactBorn(structure)) {
        artifactBorn.push(structure);
      }

      // Check if page-local
      if (this.isPageLocal(structure)) {
        pageLocal.push(structure);
      }

      // Classify by metabolic dominance
      const metabolicRate = structure.metabolicRate ?? 0;
      if (metabolicRate > 0.8) {
        dominantStructures.push(structure);
      } else if (metabolicRate < 0.2) {
        nichStructures.push(structure);
      }
    }

    return {
      cooperativeStructures,
      dominantStructures,
      nichStructures,
      lagrangeAnchored,
      artifactBorn,
      pageLocal,
    };
  }

  private analyzeInteraction(
    group1: GroupStructure,
    group2: GroupStructure,
  ): 'enhancing' | 'neutral' | 'interfering' {
    // Check if groups share elements
    const intersection = new Set([...group1.elements].filter((x) => group2.elements.has(x)));

    if (intersection.size === 0) {
      return 'neutral';
    }

    // Check if one is a subgroup of the other
    if (intersection.size === group1.elements.size || intersection.size === group2.elements.size) {
      return 'enhancing';
    }

    // Partial overlap can cause interference
    return 'interfering';
  }

  private analyzeRingGroupInteraction(
    ring: RingStructure | null,
    group: GroupStructure,
  ): 'enhancing' | 'neutral' | 'interfering' {
    // If no ring exists, groups are neutral
    if (!ring) {
      return 'neutral';
    }

    // Check if group operation is compatible with ring
    if (group.operation === ring.addition) {
      return 'enhancing'; // Additive group of the ring
    }

    // Check if group elements form an ideal
    if (ring.ideals !== undefined && ring.ideals !== null && ring.ideals.length > 0) {
      const isIdeal = ring.ideals.some((ideal) =>
        [...group.elements].every((g) => ideal.elements.has(g)),
      );

      if (isIdeal) {
        return 'enhancing';
      }
    }

    // Check for element overlap
    const intersection = new Set([...group.elements].filter((x) => ring.elements.has(x)));

    if (intersection.size === 0) {
      return 'neutral';
    }

    return 'interfering';
  }

  private evolveAlongGradients(numbers: bigint[], generations: number): AlgebraicEvolution[] {
    const evolution: AlgebraicEvolution[] = [];
    let currentNumbers = [...numbers];

    for (let gen = 0; gen < generations; gen++) {
      // Discover structures in current generation
      const groups = this.discoverEmergentGroups(currentNumbers);
      const rings = this.crystallizeRings(currentNumbers);
      const structures: Array<GroupStructure | RingStructure> = [...groups, ...rings];

      // Calculate fitness based on living properties
      const fitness = this.calculateLivingFitness(structures);
      const resonanceGradient = this.measureResonanceGradient(currentNumbers);
      const conservationCompliance = this.assessConservationCompliance(structures);
      const fieldCoherence = this.calculateFieldCoherence(structures);

      // Record generation with mutations along gradients
      const mutations: string[] = [];
      if (gen > 0) {
        mutations.push(`Gen ${gen}: ${currentNumbers.length} elements`);
        mutations.push(`Resonance gradient: ${resonanceGradient.toFixed(3)}`);
        mutations.push(`Field coherence: ${fieldCoherence.toFixed(3)}`);
      }

      evolution.push({
        generation: gen,
        structures,
        mutations,
        fitness,
        resonanceGradient,
        conservationCompliance,
        fieldCoherence,
      });

      // Evolve along resonance gradients
      currentNumbers = this.evolveAlongResonance(currentNumbers, structures);
    }

    return evolution;
  }

  private calculateLivingFitness(structures: Array<GroupStructure | RingStructure>): number {
    let fitness = 0;

    // Reward metabolic activity
    for (const structure of structures) {
      const metabolicRate = structure.metabolicRate ?? 0;
      fitness += metabolicRate * 20;
    }

    // Reward field coherence
    for (const structure of structures) {
      const coherence = structure.fieldCoherence ?? 0;
      fitness += coherence * 15;
    }

    // Reward resonance stability
    for (const structure of structures) {
      const stability = structure.resonanceStability ?? 0;
      fitness += stability * 10;
    }

    // Reward evolutionary potential
    for (const structure of structures) {
      const potential = structure.evolutionPotential ?? 0;
      fitness += potential * 25;
    }

    // Reward conservation law compliance
    for (const structure of structures) {
      if (structure.conservationMetrics) {
        if (structure.conservationMetrics.fieldParityConserved) fitness += 10;
        if (structure.conservationMetrics.resonanceFluxConserved) fitness += 10;
        if (structure.conservationMetrics.informationConserved) fitness += 10;
      }
    }

    // Reward natural boundaries respect
    for (const structure of structures) {
      if (this.respectsPageBoundaries(structure)) fitness += 5;
      if (this.isLagrangeAnchored(structure)) fitness += 15;
    }

    return fitness;
  }

  private evolveAlongResonance(
    numbers: bigint[],
    structures: Array<GroupStructure | RingStructure>,
  ): bigint[] {
    const evolved = new Set(numbers);

    // Follow resonance gradient flow
    for (const n of numbers) {
      const resonance = this.resonance.calculateResonance(n);
      if (Math.abs(resonance - 1.0) > 0.01) {
        // Flow toward nearest Lagrange point
        // Flow toward nearest Lagrange point using gradient descent
        const path = this.topology.gradientDescent(n);
        const flowTarget = path.length > 1 ? path[1] : n;
        if (flowTarget !== n) {
          evolved.add(flowTarget);
        }
      }
    }

    // Explore field harmonics
    for (const structure of structures) {
      if (
        structure.fieldCoherence !== undefined &&
        structure.fieldCoherence !== null &&
        structure.fieldCoherence > 0.7
      ) {
        // High coherence structures spawn harmonic variants
        const harmonics = this.generateFieldHarmonics(structure);
        harmonics.forEach((h) => evolved.add(h));
      }
    }

    // Crystallize around denormalization artifacts
    for (const structure of structures) {
      if (
        structure.denormalizationActivity !== undefined &&
        structure.denormalizationActivity !== null &&
        structure.denormalizationActivity > 0.5
      ) {
        // Active artifacts create new numbers
        const artifacts = this.harvestArtifacts(structure);
        artifacts.forEach((a) => evolved.add(a));
      }
    }

    // Respect natural boundaries
    const boundedEvolved = Array.from(evolved).filter((n) => {
      // Prefer numbers within correlation length (75)
      const minDist = Math.min(...numbers.map((m) => Number(n > m ? n - m : m - n)));
      return minDist <= 75;
    });

    // Maintain ecological diversity
    return this.selectForDiversity(boundedEvolved, 100);
  }

  private patternToNumber(pattern: boolean[]): bigint {
    // Convert 8-bit pattern back to a number
    let value = 0n;
    for (let i = 0; i < 8; i++) {
      if (pattern[i]) {
        value += 1n << BigInt(i);
      }
    }
    return value;
  }

  // New methods for living algebraic structures

  private discoverEmergentGroups(numbers: bigint[]): GroupStructure[] {
    return this.groupDetector.discoverEmergentGroups(numbers);
  }

  private crystallizeRings(numbers: bigint[]): RingStructure[] {
    const rings: RingStructure[] = [];
    if (numbers.length > 0) {
      const ring = this.ringDetector.crystallizeRing(numbers);
      if (ring) rings.push(ring);
    }
    return rings;
  }

  private cultivateModules(rings: RingStructure[]): Module[] {
    const modules: Module[] = [];
    for (const ring of rings) {
      const module = this.moduleAnalyzer.cultivateModule(ring.elements, ring);
      if (module) modules.push(module);
    }
    return modules;
  }

  private measureMetabolism(
    groups: GroupStructure[],
    rings: RingStructure[],
    modules: Module[],
  ): AlgebraicMetabolism {
    let totalMetabolicRate = 0;
    const fieldConsumption = new Map<string, number>();
    let denormalizationActivity = 0;
    let resonanceFlux = 0;
    let informationThroughput = 0;

    // Aggregate metabolic activity
    const allStructures = [...groups, ...rings];
    for (const structure of allStructures) {
      totalMetabolicRate += structure.metabolicRate ?? 0;
      denormalizationActivity += structure.denormalizationActivity ?? 0;

      // Track field consumption
      if (structure.fieldChemistry) {
        for (const [reaction, rate] of structure.fieldChemistry.reactionRates) {
          fieldConsumption.set(reaction, (fieldConsumption.get(reaction) ?? 0) + rate);
        }
      }
    }

    // Calculate resonance flux through structures
    for (const structure of allStructures) {
      const elements = Array.from(structure.elements);
      for (let i = 0; i < Math.min(elements.length - 1, 10); i++) {
        const flux =
          this.resonance.calculateResonance(elements[i + 1]) -
          this.resonance.calculateResonance(elements[i]);
        resonanceFlux += Math.abs(flux);
      }
    }

    // Estimate information throughput
    informationThroughput = modules.length * 0.3 + rings.length * 0.5 + groups.length * 0.2;

    return {
      totalMetabolicRate,
      fieldConsumption,
      denormalizationActivity,
      resonanceFlux,
      informationThroughput,
    };
  }

  private checkConservationLaws(
    numbers: bigint[],
    groups: GroupStructure[],
    rings: RingStructure[],
  ): ConservationStatus {
    const violations: ConservationStatus['violationLocations'] = [];

    // Check field-parity conservation within pages
    const pageViolations = this.checkFieldParityByPage(numbers);
    violations.push(...pageViolations);

    // Check resonance flux conservation
    const fluxViolations = this.checkResonanceFlux(numbers);
    violations.push(...fluxViolations);

    // Check information conservation in operations
    const infoViolations = this.checkInformationConservation(groups, rings);
    violations.push(...infoViolations);

    return {
      fieldParityConserved: pageViolations.length === 0,
      resonanceFluxBalanced: fluxViolations.length === 0,
      informationConserved: infoViolations.length === 0,
      violationLocations: violations,
    };
  }

  private assessEmergence(
    groups: GroupStructure[],
    rings: RingStructure[],
    modules: Module[],
    numbers: bigint[],
  ): EmergenceReport {
    // Count spontaneous structures
    const spontaneousGroups = groups.filter(
      (g) =>
        g.resonanceStability !== undefined &&
        g.resonanceStability !== null &&
        g.resonanceStability > 0.8,
    ).length;

    const crystallizedRings = rings.filter(
      (r) => r.fieldCoherence !== undefined && r.fieldCoherence !== null && r.fieldCoherence > 0.7,
    ).length;

    const selfOrganizingModules = modules.filter(
      (m) =>
        m.evolutionPotential !== undefined &&
        m.evolutionPotential !== null &&
        m.evolutionPotential > 0.6,
    ).length;

    // Find resonance wells
    const resonanceWells = this.findResonanceWells(numbers);

    // Calculate evolutionary pressure
    const evolutionaryPressure = this.calculateEvolutionaryPressure(groups, rings);

    return {
      spontaneousGroups,
      crystallizedRings,
      selfOrganizingModules,
      resonanceWells,
      evolutionaryPressure,
    };
  }

  // Advanced algebraic structure detection methods

  detectCategoryStructure(objects: Array<GroupStructure | RingStructure>): CategoryStructure {
    const morphisms: Morphism[] = [];

    // Find homomorphisms between structures
    for (let i = 0; i < objects.length; i++) {
      for (let j = 0; j < objects.length; j++) {
        if (i === j) {
          // Identity morphism
          morphisms.push({
            domain: objects[i],
            codomain: objects[i],
            type: 'identity',
            preserves: ['structure', 'operation'],
          });
        } else {
          // Look for homomorphisms
          const morphism = this.findMorphism(objects[i], objects[j]);
          if (morphism) {
            morphisms.push(morphism);
          }
        }
      }
    }

    return {
      objects,
      morphisms,
      composition: (f, g) => this.composeMorphisms(f, g),
      isAbelian: this.checkAbelianCategory(objects, morphisms),
    };
  }

  private findMorphism(
    source: GroupStructure | RingStructure,
    target: GroupStructure | RingStructure,
  ): Morphism | null {
    // Simplified morphism detection
    const intersection = new Set([...source.elements].filter((x) => target.elements.has(x)));

    if (intersection.size > 0) {
      return {
        domain: source,
        codomain: target,
        type: 'inclusion',
        preserves: ['elements'],
      };
    }

    return null;
  }

  private composeMorphisms(f: Morphism, g: Morphism): Morphism | null {
    if (f.codomain !== g.domain) return null;

    return {
      domain: f.domain,
      codomain: g.codomain,
      type: 'composition',
      preserves: f.preserves.filter((p) => g.preserves.includes(p)),
    };
  }

  private checkAbelianCategory(
    objects: Array<GroupStructure | RingStructure>,
    _morphisms: Morphism[],
  ): boolean {
    // Simplified check: all objects should be abelian groups
    return objects.every((obj) => {
      if ('isAbelian' in obj) {
        return obj.isAbelian;
      }
      if ('isCommutative' in obj) {
        return obj.isCommutative;
      }
      return false;
    });
  }

  // Helper methods for living mathematics

  private calculateResonanceExchange(
    structure1: GroupStructure | RingStructure,
    structure2: GroupStructure | RingStructure,
  ): number {
    // Calculate resonance flow between structures
    const elements1 = Array.from(structure1.elements);
    const elements2 = Array.from(structure2.elements);

    let totalExchange = 0;
    for (let i = 0; i < Math.min(3, elements1.length); i++) {
      for (let j = 0; j < Math.min(3, elements2.length); j++) {
        const res1 = this.resonance.calculateResonance(elements1[i]);
        const res2 = this.resonance.calculateResonance(elements2[j]);
        totalExchange += Math.abs(res1 - res2);
      }
    }

    return totalExchange / 9; // Normalize
  }

  private measureFieldHarmony(
    structure1: GroupStructure | RingStructure,
    structure2: GroupStructure | RingStructure,
  ): number {
    // Measure field pattern compatibility
    const elements1 = Array.from(structure1.elements).slice(0, 5);
    const elements2 = Array.from(structure2.elements).slice(0, 5);

    let harmony = 0;
    for (const e1 of elements1) {
      const pattern1 = this.substrate.getFieldPattern(e1);
      for (const e2 of elements2) {
        const pattern2 = this.substrate.getFieldPattern(e2);
        // Count matching field activations
        const matches = pattern1.filter((b, i) => b === pattern2[i]).length;
        harmony += matches / 8;
      }
    }

    return harmony / (elements1.length * elements2.length);
  }

  private isLagrangeAnchored(structure: GroupStructure | RingStructure): boolean {
    // Check if structure contains Lagrange points
    const lagrangeOffsets = [0n, 1n, 48n, 49n];
    return lagrangeOffsets.some((offset) => structure.elements.has(offset));
  }

  private isArtifactBorn(structure: GroupStructure | RingStructure): boolean {
    // Check if structure has high denormalization activity
    return (structure.denormalizationActivity ?? 0) > 0.5;
  }

  private isPageLocal(structure: GroupStructure | RingStructure): boolean {
    // Check if structure fits within a single page
    const elements = Array.from(structure.elements);
    if (elements.length === 0) return true;

    const min = elements.reduce((a, b) => (a < b ? a : b));
    const max = elements.reduce((a, b) => (a > b ? a : b));
    return max - min < 48n;
  }

  private respectsPageBoundaries(structure: GroupStructure | RingStructure): boolean {
    // Check if structure aligns with page boundaries
    const elements = Array.from(structure.elements);
    const pages = new Set(elements.map((e) => e / 48n));
    return pages.size <= 2; // Spans at most 2 pages
  }

  private measureResonanceGradient(numbers: bigint[]): number {
    // Measure average resonance gradient
    let totalGradient = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      const res1 = this.resonance.calculateResonance(numbers[i]);
      const res2 = this.resonance.calculateResonance(numbers[i + 1]);
      totalGradient += Math.abs(res2 - res1);
    }
    return totalGradient / (numbers.length - 1);
  }

  private assessConservationCompliance(structures: Array<GroupStructure | RingStructure>): number {
    // Assess how well structures comply with conservation laws
    let compliance = 0;
    for (const structure of structures) {
      if (structure.conservationMetrics) {
        if (structure.conservationMetrics.fieldParityConserved) compliance += 0.33;
        if (structure.conservationMetrics.resonanceFluxConserved) compliance += 0.33;
        if (structure.conservationMetrics.informationConserved) compliance += 0.34;
      }
    }
    return compliance / structures.length;
  }

  private calculateFieldCoherence(structures: Array<GroupStructure | RingStructure>): number {
    // Calculate average field coherence
    let totalCoherence = 0;
    let count = 0;
    for (const structure of structures) {
      if (structure.fieldCoherence !== undefined && structure.fieldCoherence !== null) {
        totalCoherence += structure.fieldCoherence;
        count++;
      }
    }
    return count > 0 ? totalCoherence / count : 0;
  }

  private generateFieldHarmonics(structure: GroupStructure | RingStructure): bigint[] {
    // Generate harmonic variants based on field patterns
    const harmonics: bigint[] = [];
    const elements = Array.from(structure.elements).slice(0, 3);

    for (const elem of elements) {
      const pattern = this.substrate.getFieldPattern(elem);
      // Create harmonics by rotating field pattern
      const rotated = [...pattern.slice(1), pattern[0]];
      harmonics.push(this.patternToNumber(rotated));
    }

    return harmonics;
  }

  private harvestArtifacts(structure: GroupStructure | RingStructure): bigint[] {
    // Extract denormalization artifacts
    const artifacts: bigint[] = [];

    if ('multiplication' in structure && 'addition' in structure) {
      const ring = structure;
      const elements = Array.from(ring.elements).slice(0, 5);

      for (const a of elements) {
        for (const b of elements) {
          const product = ring.multiplication(a, b);
          // Check if product creates artifacts
          const expectedPattern = this.substrate
            .getFieldPattern(a)
            .map((bit, i) => bit !== this.substrate.getFieldPattern(b)[i]);
          const actualPattern = this.substrate.getFieldPattern(product);

          if (expectedPattern.some((bit, i) => bit !== actualPattern[i])) {
            artifacts.push(product);
          }
        }
      }
    }

    return artifacts;
  }

  private selectForDiversity(numbers: bigint[], targetSize: number): bigint[] {
    // Select diverse subset maintaining ecological balance
    if (numbers.length <= targetSize) return numbers;

    const selected: bigint[] = [];
    const used = new Set<bigint>();

    // First, include Lagrange points if present
    const lagrangePoints = [0n, 1n, 48n, 49n].filter((p) => numbers.includes(p) && !used.has(p));
    lagrangePoints.forEach((p) => {
      selected.push(p);
      used.add(p);
    });

    // Then, maximize field pattern diversity
    while (selected.length < targetSize && selected.length < numbers.length) {
      let maxDiversity = -1;
      let bestCandidate: bigint | null = null;

      for (const candidate of numbers) {
        if (used.has(candidate)) continue;

        // Calculate diversity contribution
        let diversity = 0;
        const candidatePattern = this.substrate.getFieldPattern(candidate);

        for (const existing of selected) {
          const existingPattern = this.substrate.getFieldPattern(existing);
          const diff = candidatePattern.filter((b, i) => b !== existingPattern[i]).length;
          diversity += diff;
        }

        if (diversity > maxDiversity) {
          maxDiversity = diversity;
          bestCandidate = candidate;
        }
      }

      if (bestCandidate !== null) {
        selected.push(bestCandidate);
        used.add(bestCandidate);
      } else {
        break;
      }
    }

    return selected;
  }

  private checkFieldParityByPage(numbers: bigint[]): ConservationStatus['violationLocations'] {
    // Check field parity conservation within each page
    const violations: ConservationStatus['violationLocations'] = [];
    const pageGroups = new Map<bigint, bigint[]>();

    // Group by page
    for (const n of numbers) {
      const page = n / 48n;
      if (!pageGroups.has(page)) pageGroups.set(page, []);
      const pageArray = pageGroups.get(page);
      if (pageArray) {
        pageArray.push(n);
      }
    }

    // Check each page
    for (const [page, pageNumbers] of pageGroups) {
      if (pageNumbers.length !== 48) continue; // Only check complete pages

      // Calculate XOR of all patterns
      let xorPattern = [false, false, false, false, false, false, false, false];
      for (const n of pageNumbers) {
        const pattern = this.substrate.getFieldPattern(n);
        xorPattern = xorPattern.map((b, i) => b !== pattern[i]);
      }

      // Should be (1,1,1,1,0,0,0,0)
      const expected = [true, true, true, true, false, false, false, false];
      if (!xorPattern.every((b, i) => b === expected[i])) {
        violations.push({
          location: page * 48n,
          type: 'field-parity',
          severity: 0.8,
        });
      }
    }

    return violations;
  }

  private checkResonanceFlux(numbers: bigint[]): ConservationStatus['violationLocations'] {
    // Check resonance flux conservation
    const violations: ConservationStatus['violationLocations'] = [];

    // Calculate total flux
    let totalFlux = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      const flux =
        this.resonance.calculateResonance(numbers[i + 1]) -
        this.resonance.calculateResonance(numbers[i]);
      totalFlux += flux;
    }

    // Should sum to approximately zero
    if (Math.abs(totalFlux) > 0.1 * numbers.length) {
      violations.push({
        location: numbers[0],
        type: 'resonance-flux',
        severity: Math.abs(totalFlux) / numbers.length,
      });
    }

    return violations;
  }

  private checkInformationConservation(
    groups: GroupStructure[],
    _rings: RingStructure[],
  ): ConservationStatus['violationLocations'] {
    // Check information conservation in operations
    const violations: ConservationStatus['violationLocations'] = [];

    // Check groups
    for (const group of groups) {
      if (group.operation !== null && group.operation !== undefined) {
        // Sample operations to check conservation
        const elements = Array.from(group.elements).slice(0, 5);
        for (const a of elements) {
          for (const b of elements) {
            const result = group.operation(a, b);
            // Information should be conserved or transformed, not lost
            if (!group.elements.has(result)) {
              violations.push({
                location: a,
                type: 'information',
                severity: 0.5,
              });
            }
          }
        }
      }
    }

    return violations;
  }

  private findResonanceWells(numbers: bigint[]): EmergenceReport['resonanceWells'] {
    // Find local minima in resonance landscape
    const wells: EmergenceReport['resonanceWells'] = [];
    const resonances = numbers.map((n) => ({
      n,
      res: this.resonance.calculateResonance(n),
    }));

    for (let i = 1; i < resonances.length - 1; i++) {
      const curr = resonances[i];
      const prev = resonances[i - 1];
      const next = resonances[i + 1];

      // Local minimum
      if (curr.res < prev.res && curr.res < next.res) {
        wells.push({
          center: curr.n,
          depth: 1 - curr.res,
          capturedStructures: 0, // Will be counted separately
        });
      }
    }

    return wells;
  }

  private calculateEvolutionaryPressure(groups: GroupStructure[], rings: RingStructure[]): number {
    // Calculate pressure for evolution
    let pressure = 0;

    // Competition for resources (field patterns)
    const allElements = new Set<bigint>();
    [...groups, ...rings].forEach((s) => s.elements.forEach((e) => allElements.add(e)));

    // More overlap = more pressure
    pressure += allElements.size / (groups.length + rings.length);

    // Metabolic pressure
    const avgMetabolism =
      [...groups, ...rings].map((s) => s.metabolicRate ?? 0).reduce((a, b) => a + b, 0) /
      (groups.length + rings.length);

    pressure += avgMetabolism;

    return Math.min(pressure, 1);
  }
}

// Additional type definitions

export interface CategoryStructure {
  objects: Array<GroupStructure | RingStructure>;
  morphisms: Morphism[];
  composition: (f: Morphism, g: Morphism) => Morphism | null;
  isAbelian: boolean;
}

export interface Morphism {
  domain: GroupStructure | RingStructure;
  codomain: GroupStructure | RingStructure;
  type: 'identity' | 'inclusion' | 'homomorphism' | 'isomorphism' | 'composition';
  preserves: string[];
}

// Export main class
export default AlgebraicStructureDetector;
