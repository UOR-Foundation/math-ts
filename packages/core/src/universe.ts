import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import AlgebraicStructureDetector from '@uor-foundation/algebra';
import { MathematicalManifold } from '@uor-foundation/geometry';
import { MathematicalCalculusEngine } from '@uor-foundation/calculus';
import { SelfReference } from '@uor-foundation/self-reference';

import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators, DenormalizationArtifact } from '@uor-foundation/operators';
import type { AlgebraicStructures } from '@uor-foundation/algebra';
import type { GeometricManifolds } from '@uor-foundation/geometry';
import type { CalculusEngine } from '@uor-foundation/calculus';
import type { SelfReferenceCore } from '@uor-foundation/self-reference';

import { LivingNumber } from './living-number';
import type {
  UniverseAnalysis,
  ExtendedArithmeticResult,
  ExtendedFactorizationResult,
  AlgebraicStructureResult,
  DynamicsAnalysis,
  FieldParityConservation,
  ResonanceFluxResult,
  PageConsensus,
  SwarmOptimizationOptions,
  Hierarchy,
  EvolutionStep,
  UniverseMetrics,
  MetaInformation,
  BatchAnalysisResult,
  DecisionContext,
} from './types';

export class MathematicalUniverse {
  // Layer instances
  private fieldSubstrate: FieldSubstrate;
  private resonanceDynamics: ResonanceDynamics;
  private pageTopology: PageTopology;
  private arithmeticOperators: ArithmeticOperators;
  private algebraicStructures: AlgebraicStructures;
  private geometricManifolds: GeometricManifolds;
  private calculusEngine: CalculusEngine;
  private selfReferenceCore: SelfReferenceCore;

  // Cache for performance
  private analysisCache: Map<bigint, UniverseAnalysis>;
  private livingNumberCache: Map<bigint, LivingNumber>;

  // Universe state
  private generation: number = 0;
  private activeNumbers: Set<bigint> = new Set();

  constructor() {
    // Initialize all 8 layers in sequence
    this.fieldSubstrate = createFieldSubstrate();
    this.resonanceDynamics = createResonanceDynamics(this.fieldSubstrate);
    this.pageTopology = createPageTopology(this.fieldSubstrate, this.resonanceDynamics);
    this.arithmeticOperators = createArithmeticOperators(
      this.fieldSubstrate,
      this.resonanceDynamics,
      this.pageTopology,
    );
    this.algebraicStructures = new AlgebraicStructureDetector(
      this.fieldSubstrate,
      this.resonanceDynamics,
      this.pageTopology,
      this.arithmeticOperators,
    );
    this.geometricManifolds = new MathematicalManifold(
      this.fieldSubstrate,
      this.resonanceDynamics,
      this.pageTopology,
      this.arithmeticOperators,
      this.algebraicStructures,
    );
    this.calculusEngine = new MathematicalCalculusEngine(
      this.fieldSubstrate,
      this.resonanceDynamics,
      this.pageTopology,
      this.arithmeticOperators,
      this.algebraicStructures,
      this.geometricManifolds,
    );
    this.selfReferenceCore = new SelfReference(
      this.fieldSubstrate,
      this.resonanceDynamics,
      this.pageTopology,
      this.arithmeticOperators,
      this.algebraicStructures,
      this.geometricManifolds,
      this.calculusEngine,
    );

    // Initialize caches
    this.analysisCache = new Map();
    this.livingNumberCache = new Map();

    // Bootstrap the self-referential system
    this.bootstrap();
  }

  private bootstrap(): void {
    const bootstrapResult = this.selfReferenceCore.bootstrap();
    if (!bootstrapResult.stable) {
      throw new Error('Failed to bootstrap Mathematical Universe');
    }
  }

  // Core analysis method
  analyze(n: bigint): UniverseAnalysis {
    // Check cache first
    if (this.analysisCache.has(n)) {
      const cached = this.analysisCache.get(n);
      if (cached) return cached;
      throw new Error('Cache miss after has() returned true');
    }

    // Get field pattern
    const fields = this.fieldSubstrate.getFieldPattern(n);

    // Calculate resonance
    const resonance = this.resonanceDynamics.calculateResonance(n);

    // Get page info
    const pageLoc = this.pageTopology.locateNumber(n);
    const pageInfo = this.pageTopology.getPageInfo(pageLoc.page);

    // Check primality using factorization
    const factors = this.arithmeticOperators.factorize(n);
    const isPrime = factors.isPrime;

    // Get stability metric from page topology
    const lagrangePoints = this.pageTopology.findLagrangePoints(0n, 100n);
    const stabilityMetric = this.calculateStabilityMetric(n, lagrangePoints);

    // Find nearest Lagrange point
    const nearestLagrangePoint = this.pageTopology.nearestLagrangePoint(n);
    const nearestLagrangeValue = nearestLagrangePoint?.position ?? 0n;
    const distanceToLagrange = Number(
      n > nearestLagrangeValue ? n - nearestLagrangeValue : nearestLagrangeValue - n,
    );

    // Check if this is a Lagrange point
    const isLagrangePoint = lagrangePoints.some(
      (lp) => (lp as { position: bigint }).position === n,
    );

    // Get denormalization artifacts (if any from recent operations)
    const artifacts: DenormalizationArtifact[] = [];

    const analysis: UniverseAnalysis = {
      number: n,
      fields,
      resonance,
      isPrime,
      artifacts,
      pageInfo,
      stabilityMetric,
      nearestLagrangePoint: nearestLagrangeValue,
      distanceToLagrange,
      isLagrangePoint,
    };

    // Cache the result
    this.analysisCache.set(n, analysis);

    return analysis;
  }

  // Create living number
  number(n: bigint): LivingNumber {
    // Check cache
    if (this.livingNumberCache.has(n)) {
      const cached = this.livingNumberCache.get(n);
      if (cached) return cached;
      throw new Error('Cache miss after has() returned true');
    }

    const livingNumber = new LivingNumber(n, this);

    // Cache and track
    this.livingNumberCache.set(n, livingNumber);
    this.activeNumbers.add(n);

    return livingNumber;
  }

  // Evolve the universe
  evolve(): EvolutionStep {
    this.generation++;

    // Get current active numbers
    const numbers = Array.from(this.activeNumbers);

    // Detect algebraic structures
    const structures = this.algebraicStructures.detectAlgebraicLife(numbers);

    // Calculate fitness
    const fitness = this.calculateUniverseFitness(structures);

    // Measure gradients
    const resonanceGradient = this.measureResonanceGradient(numbers);

    // Check conservation
    const conservationCompliance = this.checkConservationCompliance(numbers);

    // Calculate field coherence
    const fieldCoherence = this.calculateFieldCoherence(numbers);

    // Generate mutations
    const mutations = this.generateMutations(numbers);

    return {
      generation: this.generation,
      fitness,
      mutations,
      structures: [...structures.groups, ...structures.rings],
      resonanceGradient,
      conservationCompliance,
      fieldCoherence,
    };
  }

  // Get field constants
  getFieldConstants(): number[] {
    return [...this.fieldSubstrate.getFieldConstants()];
  }

  // Arithmetic operations
  add(a: bigint, b: bigint): ExtendedArithmeticResult {
    // const result = this.arithmeticOperators.add(a, b);
    const resultValue = a + b;
    const artifacts: DenormalizationArtifact[] = [];

    // Calculate field transitions
    const aFields = this.fieldSubstrate.getFieldPattern(a);
    const bFields = this.fieldSubstrate.getFieldPattern(b);
    const resultFields = this.fieldSubstrate.getFieldPattern(resultValue);

    const fieldTransitions = [aFields, bFields, resultFields];

    // Calculate energy flow
    const aResonance = this.resonanceDynamics.calculateResonance(a);
    const bResonance = this.resonanceDynamics.calculateResonance(b);
    const resultResonance = this.resonanceDynamics.calculateResonance(resultValue);
    const energyFlow = Math.abs(resultResonance - (aResonance + bResonance));

    // Information balance
    const informationBalance = {
      created: [],
      destroyed: [],
      conserved: true, // Simplified
      netInformation: 0,
    };

    return {
      result: resultValue,
      artifacts,
      fieldTransitions,
      energyFlow,
      entanglementComplexity: 0, // Not applicable for addition
      informationBalance,
    };
  }

  multiply(a: bigint, b: bigint): ExtendedArithmeticResult {
    const result = this.arithmeticOperators.multiply(a, b);
    const resultValue = a * b;

    // Calculate field transitions
    const aFields = this.fieldSubstrate.getFieldPattern(a);
    const bFields = this.fieldSubstrate.getFieldPattern(b);
    const resultFields = this.fieldSubstrate.getFieldPattern(resultValue);

    const fieldTransitions = [aFields, bFields, resultFields];

    // Calculate energy flow
    const aResonance = this.resonanceDynamics.calculateResonance(a);
    const bResonance = this.resonanceDynamics.calculateResonance(b);
    const resultResonance = this.resonanceDynamics.calculateResonance(resultValue);
    const energyFlow = Math.abs(resultResonance - aResonance * bResonance);

    // Calculate entanglement complexity
    const interference = this.resonanceDynamics.fieldInterference(a, b);
    const entanglementComplexity = interference.coherence || 0;

    // Information balance - use artifacts directly from the operators package
    const informationBalance = {
      created: result.artifacts.filter((a) => a.type === 'emergent'),
      destroyed: result.artifacts.filter((a) => a.type === 'vanishing'),
      conserved: result.artifacts.length === 0,
      netInformation: result.artifacts.length,
    };

    return {
      result: resultValue,
      artifacts: result.artifacts,
      fieldTransitions,
      energyFlow,
      entanglementComplexity,
      informationBalance,
    };
  }

  divide(a: bigint, b: bigint): ExtendedArithmeticResult {
    if (b === 0n) {
      throw new Error('Division by zero');
    }

    const result = this.arithmeticOperators.divide(a, b);

    // Similar field analysis as multiply
    const aFields = this.fieldSubstrate.getFieldPattern(a);
    const bFields = this.fieldSubstrate.getFieldPattern(b);
    const quotientFields = this.fieldSubstrate.getFieldPattern(result.quotient);

    const fieldTransitions = [aFields, bFields, quotientFields];

    // Energy flow in division
    const aResonance = this.resonanceDynamics.calculateResonance(a);
    const bResonance = this.resonanceDynamics.calculateResonance(b);
    const quotientResonance = this.resonanceDynamics.calculateResonance(result.quotient);
    const energyFlow = Math.abs(quotientResonance - aResonance / bResonance);

    // Information balance
    const divArtifacts = result.decompilationArtifacts ?? [];
    const informationBalance = {
      created: divArtifacts
        .filter((a) => (a as { type?: string }).type === 'reconstruction')
        .map((a) => ({ ...a, type: 'emergent' as const }) as DenormalizationArtifact),
      destroyed: divArtifacts
        .filter((a) => (a as { type?: string }).type === 'loss')
        .map((a) => ({ ...a, type: 'vanishing' as const }) as DenormalizationArtifact),
      conserved: result.remainder === 0n,
      netInformation: divArtifacts.length,
    };

    return {
      result: result.quotient,
      artifacts: divArtifacts,
      fieldTransitions,
      energyFlow,
      entanglementComplexity: 0,
      informationBalance,
    };
  }

  factorize(n: bigint): ExtendedFactorizationResult {
    const result = this.arithmeticOperators.factorize(n);

    // Reconstruct fields from factors
    const fieldReconstruction: FieldPattern[] = [];
    for (const factor of result.factors) {
      fieldReconstruction.push(this.fieldSubstrate.getFieldPattern(factor));
    }

    // Find artifact sources
    const artifactSources: DenormalizationArtifact[] = [];
    if (result.factors.length > 1) {
      // Check for denormalization in the product
      let product = 1n;
      for (const factor of result.factors) {
        if (product > 1n) {
          const multiplyResult = this.arithmeticOperators.multiply(product, factor);
          artifactSources.push(...(multiplyResult.artifacts ?? []));
        }
        product *= factor;
      }
    }

    return {
      factors: result.factors,
      isPrime: result.isPrime,
      fieldReconstruction,
      artifactSources,
    };
  }

  // Algebraic structure detection
  detectAlgebraicStructures(numbers: bigint[]): AlgebraicStructureResult {
    const life = this.algebraicStructures.detectAlgebraicLife(numbers);

    return {
      groups: life.groups,
      rings: life.rings,
      modules: life.modules,
      categoryStructure: life.ecology,
    };
  }

  analyzeSymmetries(n: bigint): { generators: unknown; order: unknown; symmetryType: unknown } {
    return this.algebraicStructures.analyzeSymmetries(n);
  }

  // Geometric operations
  geometricDistance(a: bigint, b: bigint): number {
    return this.geometricManifolds.getMetric(a, b);
  }

  findGeodesic(start: bigint, end: bigint): bigint[] {
    return this.geometricManifolds.findGeodesic(start, end);
  }

  getCurvature(n: bigint): { scalar: unknown; ricci: unknown } {
    return this.geometricManifolds.getCurvature(n);
  }

  // Calculus operations
  computeDerivative(f: (n: bigint) => number, n: bigint): number {
    return this.calculusEngine.derivative(f, n);
  }

  integrate(f: (n: bigint) => number, start: bigint, end: bigint): number {
    return this.calculusEngine.integrate(f, start, end);
  }

  analyzeDynamics(n: bigint): DynamicsAnalysis {
    // Use discrete dynamics analysis
    // Simple iteration for dynamics analysis
    const trajectory: bigint[] = [n];
    let current = n;
    for (let i = 0; i < 10; i++) {
      const res = this.resonanceDynamics.calculateResonance(current);
      current = current + BigInt(Math.floor((1.0 - res) * 10));
      trajectory.push(current);
    }

    // Analyze trajectory for stability
    const isStable =
      trajectory.length > 5 &&
      trajectory[trajectory.length - 1] === trajectory[trajectory.length - 2];

    // Simple Lyapunov exponent estimation
    let lyapunovSum = 0;
    for (let i = 1; i < trajectory.length; i++) {
      const diff = Number(trajectory[i] - trajectory[i - 1]);
      if (diff !== 0) {
        lyapunovSum += Math.log(Math.abs(diff));
      }
    }
    const lyapunovExponent = lyapunovSum / trajectory.length;

    // Determine attractor type
    let attractorType: 'fixed' | 'periodic' | 'strange' | 'none' = 'none';
    if (isStable) {
      attractorType = 'fixed';
    } else if (trajectory.length > 2) {
      // Check for periodicity
      for (let period = 2; period < trajectory.length / 2; period++) {
        let isPeriodic = true;
        for (let i = 0; i < period; i++) {
          if (
            trajectory[trajectory.length - 1 - i] !== trajectory[trajectory.length - 1 - i - period]
          ) {
            isPeriodic = false;
            break;
          }
        }
        if (isPeriodic) {
          attractorType = 'periodic';
          break;
        }
      }
      if (attractorType === 'none' && lyapunovExponent > 0) {
        attractorType = 'strange';
      }
    }

    return {
      isStable,
      lyapunovExponent,
      attractorType,
      basinOfAttraction: trajectory,
    };
  }

  // Self-reference operations
  findFixedPoints(start: bigint, end: bigint): Array<{ point: bigint; type: string }> {
    // Self-reference core doesn't expose fixed point engine directly
    // Use a simple implementation
    const fixedPoints: Array<{ point: bigint; type: string }> = [];
    for (let n = start; n <= end && n <= start + 1000n; n++) {
      // Check if f(n) = n for some simple functions
      if (n === 0n || n === 1n) {
        fixedPoints.push({ point: n, type: 'arithmetic' });
      }
    }
    return fixedPoints as Array<{ point: bigint; type: string }>;
  }

  async validateConsistency(): Promise<{
    consistent: boolean;
    godelLimitations: unknown;
    conservationChecks: unknown;
  }> {
    const result = await this.selfReferenceCore.validateConsistency();
    return {
      consistent: result.consistent,
      godelLimitations: result.godelLimitations,
      conservationChecks: result.conservationChecks,
    };
  }

  getMeta(): MetaInformation {
    // const consistency = this.selfReferenceCore.validateConsistency();

    return {
      godelNumber: BigInt(this.generation * 1000000 + this.activeNumbers.size),
      selfDescription: `Mathematical Universe v${this.generation}`,
      evolutionCapability: true,
      computationalLimits: {
        maxNumber: Number.MAX_SAFE_INTEGER,
        precision: 53,
        cacheSize: this.analysisCache.size,
      },
    };
  }

  // Conservation law checks
  checkFieldParityConservation(numbers: bigint[]): FieldParityConservation {
    // Group by page
    const pageGroups = new Map<bigint, bigint[]>();
    for (const n of numbers) {
      const pageLoc = this.pageTopology.locateNumber(n);
      const page = BigInt(pageLoc.page);
      if (!pageGroups.has(page)) {
        pageGroups.set(page, []);
      }
      const pageList = pageGroups.get(page);
      if (pageList) pageList.push(n);
    }

    // Check each complete page
    let isConserved = true;
    const violations: bigint[] = [];
    let xorPattern: boolean[] = [];

    for (const [page, pageNumbers] of pageGroups) {
      if (pageNumbers.length === 48) {
        // Calculate XOR of all patterns
        xorPattern = [false, false, false, false, false, false, false, false];
        for (const n of pageNumbers) {
          const pattern = this.fieldSubstrate.getFieldPattern(n);
          xorPattern = xorPattern.map((bit, i) => bit !== pattern[i]);
        }

        // Should be (1,1,1,1,0,0,0,0)
        const expected = [true, true, true, true, false, false, false, false];
        if (!xorPattern.every((bit, i) => bit === expected[i])) {
          isConserved = false;
          violations.push(page * 48n);
        }
      }
    }

    return {
      isConserved,
      xorPattern,
      violations,
    };
  }

  checkResonanceFlux(numbers: bigint[]): ResonanceFluxResult {
    let totalFlux = 0;
    let maxDeviation = 0;

    for (let i = 0; i < numbers.length - 1; i++) {
      const flux =
        this.resonanceDynamics.calculateResonance(numbers[i + 1]) -
        this.resonanceDynamics.calculateResonance(numbers[i]);
      totalFlux += flux;
      maxDeviation = Math.max(maxDeviation, Math.abs(flux));
    }

    const isBalanced = Math.abs(totalFlux) < 0.1 * numbers.length;

    return {
      totalFlux,
      isBalanced,
      maxDeviation,
    };
  }

  // Collective intelligence
  formPageConsensus(numbers: LivingNumber[]): PageConsensus {
    // Simple voting mechanism
    const votes = new Map<string, number>();
    const startTime = Date.now();

    // Each number votes based on its decision-making
    const context: DecisionContext = {
      options: ['evolve', 'stabilize', 'explore'],
      context: { energy: 0.5, neighbors: numbers.map((n) => n.value) },
    };

    for (const num of numbers) {
      const decision = num.makeDecision(context);
      votes.set(decision.choice, (votes.get(decision.choice) ?? 0) + 1);
    }

    // Find majority decision
    let maxVotes = 0;
    let consensus = '';
    for (const [choice, count] of votes) {
      if (count > maxVotes) {
        maxVotes = count;
        consensus = choice;
      }
    }

    // Calculate coherence
    const coherence = numbers.length > 0 ? maxVotes / numbers.length : 0;

    // Find dissenters
    const dissenters = numbers.filter((num) => num.makeDecision(context).choice !== consensus);

    return {
      decision: consensus,
      coherence,
      dissenters,
      convergenceTime: Date.now() - startTime,
    };
  }

  swarmOptimize(numbers: LivingNumber[], options: SwarmOptimizationOptions): LivingNumber[] {
    let swarm = [...numbers];

    for (let iter = 0; iter < options.iterations; iter++) {
      // Each member optimizes based on target
      swarm = swarm.map((num) => {
        switch (options.target) {
          case 'minimum-energy':
            return num.evolve();
          case 'maximum-stability': {
            const optimized = num.optimize();
            // Create a new LivingNumber with evolved value
            const newValue = num.value + BigInt(Math.floor(optimized.improvement * 10));
            return new LivingNumber(newValue, this);
          }
          case 'information-discovery': {
            // Explore new territories
            const exploredValue = num.value + BigInt(iter + 1);
            return new LivingNumber(exploredValue, this);
          }
          default:
            return num;
        }
      });
    }

    return swarm;
  }

  organizeHierarchy(numbers: LivingNumber[]): Hierarchy {
    // Group into pages
    const pages: LivingNumber[][] = [];
    const pageMap = new Map<bigint, LivingNumber[]>();

    for (const num of numbers) {
      const pageNum = num.pagePosition.page;
      if (!pageMap.has(pageNum)) {
        pageMap.set(pageNum, []);
      }
      const pageList = pageMap.get(pageNum);
      if (pageList) pageList.push(num);
    }

    for (const [, pageNumbers] of pageMap) {
      pages.push(pageNumbers);
    }

    // Identify leaders (Lagrange points and high-influence numbers)
    const leaders = numbers.filter((num) => num.isLagrangePoint || num.personality.influence > 0.8);

    return {
      individuals: numbers,
      pages,
      leaders,
      structure: leaders.length > numbers.length * 0.1 ? 'hierarchical' : 'flat',
    };
  }

  // Universe metrics
  getMetrics(): UniverseMetrics {
    const numbers = Array.from(this.activeNumbers);

    // Count by state
    let activeCount = 0;
    let dormantCount = 0;

    for (const n of numbers) {
      if (this.livingNumberCache.has(n)) {
        const livingNum = this.livingNumberCache.get(n);
        if (!livingNum) continue;
        if (livingNum.computationalState.status === 'active') {
          activeCount++;
        } else if (livingNum.computationalState.status === 'dormant') {
          dormantCount++;
        }
      }
    }

    // Calculate total resonance
    const totalResonance = numbers.reduce(
      (sum, n) => sum + this.resonanceDynamics.calculateResonance(n),
      0,
    );

    // Information content (entropy-based)
    const patterns = numbers.map((n) => this.fieldSubstrate.getFieldPattern(n));
    const informationContent = this.calculateInformationContent(patterns);

    // Computational complexity
    const computationalComplexity = Math.log2(numbers.length + 1) * Math.sqrt(this.generation + 1);

    // Evolutionary pressure
    const evolutionaryPressure = activeCount / (numbers.length + 1);

    return {
      totalNumbers: numbers.length,
      activeNumbers: activeCount,
      dormantNumbers: dormantCount,
      totalResonance,
      informationContent,
      computationalComplexity,
      evolutionaryPressure,
    };
  }

  // Batch operations
  batchAnalyze(numbers: bigint[]): BatchAnalysisResult[] {
    const results: BatchAnalysisResult[] = [];

    for (const n of numbers) {
      const cached = this.analysisCache.has(n);
      const analysis = this.analyze(n);

      results.push({
        ...analysis,
        optimized: true,
        cacheHit: cached,
      });
    }

    return results;
  }

  // Helper methods for other components

  analyzeNumber(n: bigint): UniverseAnalysis {
    return this.analyze(n);
  }

  getArithmeticResult(
    a: bigint,
    b: bigint,
    operation: string,
  ): { result: bigint; artifacts: DenormalizationArtifact[] } {
    switch (operation) {
      case 'add': {
        const addResult = this.arithmeticOperators.add(a, b);
        return {
          result: addResult.result,
          artifacts: [], // Add operations don't produce artifacts
        };
      }
      case 'multiply': {
        const multResult = this.arithmeticOperators.multiply(a, b) as {
          result: bigint;
          artifacts?: DenormalizationArtifact[];
        };
        return {
          result: multResult.result,
          artifacts: multResult.artifacts ?? [],
        };
      }
      case 'divide': {
        const divResult = this.arithmeticOperators.divide(a, b) as {
          quotient: bigint;
          decompilationArtifacts?: DenormalizationArtifact[];
        };
        return {
          result: divResult.quotient,
          artifacts: divResult.decompilationArtifacts ?? [],
        };
      }
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  gradientDescent(n: bigint): bigint[] {
    return this.pageTopology.gradientDescent(n);
  }

  findNearestLagrangePoint(n: bigint): bigint {
    const lp = this.pageTopology.nearestLagrangePoint(n);
    return lp?.position ?? 0n;
  }

  getFactorCount(n: bigint): number {
    const factors = this.arithmeticOperators.factorize(n);
    return factors.factors.length;
  }

  getNeighbors(n: bigint, radius: number): bigint[] {
    const neighbors: bigint[] = [];
    for (let i = 1; i <= radius; i++) {
      neighbors.push(n - BigInt(i));
      neighbors.push(n + BigInt(i));
    }
    return neighbors.filter((m) => m >= 0n);
  }

  // Private helper methods

  private calculateStabilityMetric(n: bigint, lagrangePoints: Array<{ position: bigint }>): number {
    // Find distance to nearest Lagrange point
    let minDistance = Number.MAX_SAFE_INTEGER;
    for (const lp of lagrangePoints) {
      const lpPosition = lp.position;
      const dist = Number(n > lpPosition ? n - lpPosition : lpPosition - n);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }

    // Stability decreases with distance from Lagrange points
    return Math.exp(-minDistance / 48);
  }

  private calculateUniverseFitness(structures: {
    groups: unknown[];
    rings: unknown[];
    modules: unknown[];
    conservation?: { fieldParityConserved?: boolean; resonanceFluxBalanced?: boolean };
    emergence?: { spontaneousGroups?: number; crystallizedRings?: number };
  }): number {
    let fitness = 0;

    // Reward diverse structures
    fitness += structures.groups.length * 10;
    fitness += structures.rings.length * 15;
    fitness += structures.modules.length * 20;

    // Reward conservation compliance
    if (structures.conservation?.fieldParityConserved === true) fitness += 25;
    if (structures.conservation?.resonanceFluxBalanced === true) fitness += 25;

    // Reward emergence
    fitness += (structures.emergence?.spontaneousGroups ?? 0) * 5;
    fitness += (structures.emergence?.crystallizedRings ?? 0) * 8;

    return fitness;
  }

  private measureResonanceGradient(numbers: bigint[]): number {
    if (numbers.length < 2) return 0;

    let totalGradient = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      const res1 = this.resonanceDynamics.calculateResonance(numbers[i]);
      const res2 = this.resonanceDynamics.calculateResonance(numbers[i + 1]);
      totalGradient += Math.abs(res2 - res1);
    }

    return totalGradient / (numbers.length - 1);
  }

  private checkConservationCompliance(numbers: bigint[]): number {
    let compliance = 0;

    // Check field parity
    const fieldParity = this.checkFieldParityConservation(numbers);
    if (fieldParity.isConserved) compliance += 0.33;

    // Check resonance flux
    const resonanceFlux = this.checkResonanceFlux(numbers);
    if (resonanceFlux.isBalanced) compliance += 0.33;

    // Check information conservation (simplified)
    if (numbers.length > 0) compliance += 0.34;

    return compliance;
  }

  private calculateFieldCoherence(numbers: bigint[]): number {
    if (numbers.length === 0) return 0;

    // Calculate average pairwise field similarity
    let totalSimilarity = 0;
    let pairs = 0;

    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const pattern1 = this.fieldSubstrate.getFieldPattern(numbers[i]);
        const pattern2 = this.fieldSubstrate.getFieldPattern(numbers[j]);

        const similarity = pattern1.filter((bit, idx) => bit === pattern2[idx]).length / 8;
        totalSimilarity += similarity;
        pairs++;
      }
    }

    return pairs > 0 ? totalSimilarity / pairs : 0;
  }

  private generateMutations(numbers: bigint[]): string[] {
    const mutations: string[] = [];

    // Record generation info
    mutations.push(`Generation ${this.generation}: ${numbers.length} active numbers`);

    // Record average resonance
    if (numbers.length > 0) {
      const avgResonance =
        numbers.reduce((sum, n) => sum + this.resonanceDynamics.calculateResonance(n), 0) /
        numbers.length;
      mutations.push(`Average resonance: ${avgResonance.toFixed(3)}`);
    }

    // Record Lagrange point count
    const lagrangePoints = this.pageTopology.findLagrangePoints(0n, 100n);
    const lagrangeCount = numbers.filter((n) =>
      lagrangePoints.some((lp) => lp.position === n),
    ).length;
    mutations.push(`Lagrange points: ${lagrangeCount}`);

    return mutations;
  }

  private calculateInformationContent(patterns: FieldPattern[]): number {
    // Calculate Shannon entropy of field patterns
    const counts = new Array(256).fill(0);

    for (const pattern of patterns) {
      const value = pattern.reduce((acc, bit, i) => acc + (bit ? 1 << i : 0), 0);
      counts[value]++;
    }

    let entropy = 0;
    const total = patterns.length;

    for (const count of counts) {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    }

    return entropy;
  }
}

// Re-export types
export { LivingNumber } from './living-number';
