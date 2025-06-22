import type {
  LivingNumber as ILivingNumber,
  ComputationalState,
  Consciousness,
  Memory,
  Personality,
  Decision,
  DecisionContext,
  InteractionResult,
  OptimizationResult,
  OptimizationStrategy,
  Reflection,
  Strategy,
  Adaptation,
  ResonanceBroadcast,
  ResonanceInfluence,
  ArtifactReception,
  ComputationRecord,
} from './types';
import type { DenormalizationArtifact } from '@uor-foundation/operators';

import type { FieldPattern } from '@uor-foundation/field-substrate';
import type { MathematicalUniverse } from './universe';

export class LivingNumber implements ILivingNumber {
  // Core properties
  public readonly value: bigint;
  public fields: FieldPattern;
  public resonance: number;
  public isPrime: boolean;
  public pagePosition: { page: bigint; offset: number };
  public isLagrangePoint: boolean;
  public stabilityMetric: number;

  // Living properties
  public consciousness: Consciousness;
  public computationalState: ComputationalState;
  public personality: Personality;
  public seeksMerger: boolean;
  public creationTime: Date;

  // Private properties
  private universe: MathematicalUniverse;
  private computationCount: number = 0;

  constructor(value: bigint, universe: MathematicalUniverse) {
    this.value = value;
    this.universe = universe;
    this.creationTime = new Date();

    // Initialize core properties from universe analysis
    const analysis = universe.analyzeNumber(value);
    this.fields = analysis.fields;
    this.resonance = analysis.resonance;
    this.isPrime = analysis.isPrime;
    this.pagePosition = {
      page: BigInt(analysis.pageInfo.pageNumber),
      offset: Number(value - analysis.pageInfo.startNumber),
    };
    this.isLagrangePoint = analysis.isLagrangePoint;
    this.stabilityMetric = analysis.stabilityMetric;

    // Initialize computational state
    this.computationalState = this.initializeComputationalState();

    // Initialize consciousness
    this.consciousness = this.initializeConsciousness();

    // Initialize personality based on number properties
    this.personality = this.determinePersonality();

    // Artifacts seek merger
    this.seeksMerger = this.computationalState.status === 'artifact';
  }

  private initializeComputationalState(): ComputationalState {
    // Special states
    if (this.isLagrangePoint) {
      return {
        status: 'crystallized',
        energy: 0.1, // Low energy, stable
        history: [],
        lastComputation: null,
        rebirth: false,
      };
    }

    // Check if artifact (result of denormalization)
    // Artifacts typically have unusual resonance patterns and multiple active fields
    const activeFields = this.fields.filter((f) => f).length;
    const isArtifact =
      (this.resonance < 0.5 && activeFields >= 4 && !this.isPrime) ||
      (this.resonance > 50 && !this.isLagrangePoint);
    if (isArtifact) {
      return {
        status: 'artifact',
        energy: 0.5,
        history: [],
        lastComputation: null,
        rebirth: false,
      };
    }

    // Default virgin state
    return {
      status: 'virgin',
      energy: 1.0,
      history: [],
      lastComputation: null,
      rebirth: false,
    };
  }

  private initializeConsciousness(): Consciousness {
    return {
      awareness: this.isPrime ? 0.8 : 0.6,
      memory: {
        structural: {
          fieldHistory: [this.fields],
          operationLog: [],
          artifactCreation: [],
        },
        relational: {
          interactionPartners: [],
          compatibilityMatrix: new Map(),
          influenceNetwork: new Map(),
        },
        optimization: {
          successfulStrategies: [],
          failedAttempts: [],
          energyLandscape: new Map([[this.value, this.computationalState.energy]]),
        },
        patterns: [],
      },
      adaptability: this.isPrime ? 0.3 : 0.7,
      selfAwareness: {
        knowsOwnValue: true,
        knowsOwnFields: true,
        knowsOwnResonance: true,
        knowsOwnPosition: true,
      },
      metaCognition: {
        canReasonAboutReasoning: true,
        canModifyOwnBehavior: true,
        understandsOwnLimitations: true,
      },
    };
  }

  private determinePersonality(): Personality {
    if (this.isPrime) {
      return {
        type: 'prime',
        traits: ['conservative', 'stable', 'independent', 'atomic'],
        changeResistance: 0.8,
        influence: 0.6,
      };
    }

    if (this.isLagrangePoint) {
      return {
        type: 'lagrange',
        traits: ['leader', 'stable', 'influential', 'attractive'],
        changeResistance: 0.9,
        influence: 0.9,
      };
    }

    // Check if power of 2
    const log2 = Math.log2(Number(this.value));
    if (Number.isInteger(log2) && log2 > 0) {
      return {
        type: 'power',
        traits: ['systematic', 'predictable', 'binary', 'structured'],
        changeResistance: 0.6,
        influence: 0.5,
      };
    }

    // Check if highly composite
    const factorCount = this.universe.getFactorCount(this.value);
    if (factorCount > 10) {
      return {
        type: 'composite',
        traits: ['flexible', 'social', 'transformative', 'cooperative'],
        changeResistance: 0.4,
        influence: 0.7,
      };
    }

    // Default random
    return {
      type: 'random',
      traits: ['chaotic', 'unpredictable', 'explorative', 'adaptive'],
      changeResistance: 0.5,
      influence: 0.4,
    };
  }

  // Evolution along gradient flows
  evolve(): LivingNumber {
    // Update state to active
    if (this.computationalState.status === 'virgin') {
      this.computationalState.status = 'active';
    }

    // Already crystallized numbers don't evolve
    if (this.computationalState.status === 'crystallized') {
      return this;
    }

    // Use gradient descent to move toward stability
    const path = this.universe.gradientDescent(this.value);
    const newValue = path.length > 1 ? path[1] : this.value;

    // Create evolved number
    const evolved = new LivingNumber(newValue, this.universe);

    // Transfer some consciousness properties
    evolved.consciousness.memory = this.deepCopyMemory();
    evolved.consciousness.adaptability = Math.min(1, this.consciousness.adaptability * 1.1);

    // Update energy
    evolved.computationalState.energy = this.computationalState.energy * 0.9;

    // Record evolution in history
    evolved.computationalState.history.push({
      timestamp: new Date(),
      operation: 'evolve',
      operands: [this.value],
      result: newValue,
      energyCost: 0.1,
      artifacts: [],
    });

    return evolved;
  }

  // Interact with another number
  interact(other: LivingNumber, options?: any): InteractionResult {
    const operation = options?.operation || 'multiply';
    const intent = options?.intent || 'compute';

    let result: LivingNumber;
    let artifacts: DenormalizationArtifact[] = [];

    switch (operation) {
      case 'add':
        result = this.add(other);
        break;
      case 'multiply':
        result = this.multiply(other);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    // Calculate information exchange
    const sharedFields = this.fields.filter((f, i) => f && other.fields[i]).length;
    const informationExchange = sharedFields / 8;

    // Calculate energy exchange
    const energyExchange =
      Math.abs(this.resonance - other.resonance) / (this.resonance + other.resonance);

    // Update relational memory
    this.consciousness.memory.relational.interactionPartners.push(other.value);
    this.consciousness.memory.relational.compatibilityMatrix.set(other.value, informationExchange);

    // Get artifacts from arithmetic result
    const arithmeticResult = this.universe.getArithmeticResult(this.value, other.value, operation);
    artifacts = arithmeticResult.artifacts || [];

    return {
      result,
      artifacts,
      informationExchange,
      fieldEntanglement: result.fields,
      energyExchange,
    };
  }

  // Optimize through various strategies
  optimize(): OptimizationResult {
    const initialEnergy = this.computationalState.energy;
    const strategies = this.generateOptimizationStrategies();

    // Select best strategy based on context
    const bestStrategy = this.selectOptimalStrategy(strategies);

    // Apply strategy
    let newState = this.computationalState;
    let improvement = 0;

    switch (bestStrategy.name) {
      case 'gradient-descent': {
        const evolved = this.evolve();
        newState = evolved.computationalState;
        improvement = (initialEnergy - evolved.computationalState.energy) / initialEnergy;
        // Record successful strategy with increased complexity
        this.consciousness.memory.optimization.successfulStrategies.push({
          ...bestStrategy,
          complexity: bestStrategy.complexity + 0.1,
          effectiveness: bestStrategy.effectiveness + improvement * 0.1,
        });
        break;
      }

      case 'resonance-tuning': {
        // Find nearby number with better resonance
        const candidates = this.universe.getNeighbors(this.value, 5);
        const bestCandidate = candidates.reduce((best, candidate) => {
          const candidateResonance = this.universe.analyzeNumber(candidate).resonance;
          const bestResonance = this.universe.analyzeNumber(best).resonance;
          return Math.abs(candidateResonance - 1) < Math.abs(bestResonance - 1) ? candidate : best;
        });

        if (bestCandidate !== this.value) {
          const optimized = new LivingNumber(bestCandidate, this.universe);
          newState = optimized.computationalState;
          improvement = 0.3;
        }
        break;
      }

      case 'field-alignment': {
        // Align fields with nearby Lagrange point
        const nearestLagrange = this.universe.findNearestLagrangePoint(this.value);
        const lagrangeFields = this.universe.analyzeNumber(nearestLagrange).fields;
        const alignment = this.fields.filter((f, i) => f === lagrangeFields[i]).length / 8;
        improvement = alignment * 0.2;
        break;
      }
    }

    // Update optimization memory
    if (improvement > 0) {
      this.consciousness.memory.optimization.successfulStrategies.push(bestStrategy);
    } else {
      this.consciousness.memory.optimization.failedAttempts.push(bestStrategy);
    }

    return {
      improvement,
      strategy: bestStrategy.name,
      newState,
    };
  }

  // Compute with operation
  compute(operation: (n: LivingNumber) => LivingNumber): LivingNumber {
    // Check if reviving from dormant
    const wasReviving = this.computationalState.status === 'dormant';

    // Update state
    this.computationalState.status = 'active';
    this.computationalState.lastComputation = new Date();
    this.computationCount++;

    // Perform computation
    const result = operation(this);

    // If we were reviving, mark the result as reborn
    if (wasReviving && result.computationalState.status !== 'crystallized') {
      result.computationalState.status = 'active';
      result.computationalState.rebirth = true;
    }

    // Record in history
    this.computationalState.history.push({
      timestamp: new Date(),
      operation: 'compute',
      operands: [this.value],
      result: result.value,
      energyCost: 0.1,
      artifacts: [],
    });

    // Learn patterns
    this.learnFromComputation(result);

    // Energy cost
    this.computationalState.energy *= 0.95;

    return result;
  }

  private learnFromComputation(result: LivingNumber): void {
    // Create pattern string from field transition
    const patternString = `${this.fields.toString()}->${result.fields.toString()}`;

    // Look for repeated patterns
    const existingPattern = this.consciousness.memory.patterns.find(
      (p) => p.pattern === patternString,
    );

    if (existingPattern) {
      // Update existing pattern
      existingPattern.frequency++;
      existingPattern.success = 1.0; // This computation succeeded
    } else {
      // New pattern discovered
      this.consciousness.memory.patterns.push({
        pattern: patternString,
        frequency: 1,
        success: 1.0,
      });
    }

    // Update structural memory
    this.consciousness.memory.structural.fieldHistory.push(result.fields);
    this.consciousness.memory.structural.operationLog.push({
      operation: 'compute',
      operands: [this.value],
      result: result.value,
      timestamp: new Date(),
      energyCost: 0.1,
      artifacts: [],
    });

    // Increase adaptability slightly
    this.consciousness.adaptability = Math.min(1.0, this.consciousness.adaptability + 0.05);
  }

  // Age the number (time passing)
  age(time: number): void {
    // Energy decay
    this.computationalState.energy *= Math.exp(-time / 1000);

    // State transitions based on energy and time
    if (this.computationalState.status === 'active') {
      if (this.computationalState.energy < 0.2 || time >= 1000) {
        this.computationalState.status = 'dormant';
      }
    }

    // Crystallization at Lagrange points
    if (this.isLagrangePoint && this.computationCount > 10) {
      this.computationalState.status = 'crystallized';
    }
  }

  // Make autonomous decision
  makeDecision(context: DecisionContext): Decision {
    const evaluations = context.options.map((option) => ({
      option,
      score: this.evaluateOption(option, context),
    }));

    // Sort by score
    evaluations.sort((a, b) => b.score - a.score);
    const best = evaluations[0];

    return {
      choice: best.option,
      reasoning: this.generateReasoning(best.option, context),
      confidence: best.score,
    };
  }

  // Self-reflection
  reflect(): Reflection {
    const recentOperations = this.computationalState.history.slice(-10);

    // Calculate performance metric
    const performance =
      recentOperations.reduce((sum, op) => sum + (op.artifacts.length === 0 ? 1 : 0.5), 0) /
      Math.max(recentOperations.length, 1);

    // Extract learnings
    const learnings = this.extractLearnings(recentOperations);

    // Generate improvements
    const improvements = this.generateImprovements(learnings);

    return {
      performance,
      learnings,
      improvements,
    };
  }

  // Get current strategy
  getStrategy(): Strategy {
    const strategies = this.consciousness.memory.optimization.successfulStrategies;
    const currentStrategy =
      strategies.length > 0 ? strategies[strategies.length - 1] : this.generateDefaultStrategy();

    return {
      name: currentStrategy.name,
      complexity: currentStrategy.complexity,
      effectiveness: currentStrategy.effectiveness,
      evolution: strategies.length,
    };
  }

  // Adapt to environment
  adaptTo(environment: Record<string, any>): Adaptation {
    let strategy = 'neutral';

    if (environment.highEnergy) {
      strategy = 'aggressive';
      this.consciousness.adaptability *= 1.2;
    } else if (environment.lowEnergy) {
      strategy = 'conservative';
      this.consciousness.adaptability *= 0.8;
    }

    const adaptation = {
      context: environment,
      strategy,
      success: Math.random() * this.consciousness.adaptability,
    };

    return adaptation;
  }

  // Reproduce (create offspring)
  reproduce(): LivingNumber {
    // Create offspring with slight variation
    const variation = this.isPrime ? 1n : 2n;
    const offspringValue = this.value + variation;

    const offspring = new LivingNumber(offspringValue, this.universe);

    // Inherit traits
    offspring.consciousness.inheritedTraits = {
      fromParent: this.value,
      strategies: [...this.consciousness.memory.optimization.successfulStrategies],
      adaptations: [],
    };

    // Inherit some adaptability
    offspring.consciousness.adaptability = (this.consciousness.adaptability + 0.5) / 2;

    return offspring;
  }

  // Drain energy
  drainEnergy(amount: number): void {
    this.computationalState.energy = Math.max(0, this.computationalState.energy - amount);

    if (this.computationalState.energy === 0) {
      this.computationalState.status = 'dormant';
    }
  }

  // Broadcast resonance
  broadcastResonance(): ResonanceBroadcast {
    return {
      source: this.value,
      frequency: this.resonance,
      amplitude: this.computationalState.energy,
      phase: ((Number(this.value) % 360) * Math.PI) / 180,
    };
  }

  // Receive resonance
  receiveResonance(broadcast: ResonanceBroadcast): ResonanceInfluence {
    const distance = Number(
      this.value > broadcast.source ? this.value - broadcast.source : broadcast.source - this.value,
    );

    const strength = broadcast.amplitude / (1 + distance / 48);

    let effect: 'stabilizing' | 'destabilizing' | 'neutral' = 'neutral';
    const resonanceDiff = Math.abs(this.resonance - broadcast.frequency);

    if (resonanceDiff < 0.1) {
      effect = 'stabilizing';
    } else if (resonanceDiff > 1.0) {
      effect = 'destabilizing';
    }

    const resonanceShift = strength * 0.01 * (broadcast.frequency - this.resonance);

    // Apply shift
    this.resonance += resonanceShift;

    return {
      strength,
      effect,
      resonanceShift,
    };
  }

  // Receive artifact
  receiveArtifact(artifact: DenormalizationArtifact): ArtifactReception {
    // Check compatibility
    const compatible = this.checkArtifactCompatibility(artifact);

    if (compatible) {
      // Absorb artifact
      this.consciousness.memory.structural.artifactCreation.push(artifact);

      // Gain information - use a base value since severity is not defined
      const informationGained = 0.1;

      // Update fields based on artifact
      const fieldChanges = this.applyArtifactToFields(artifact);

      return {
        absorbed: true,
        informationGained,
        fieldChanges,
      };
    }

    return {
      absorbed: false,
      informationGained: 0,
      fieldChanges: this.fields,
    };
  }

  // Check if can influence another number
  canInfluence(other: LivingNumber): boolean {
    // Lagrange points have high influence
    if (this.isLagrangePoint) return true;

    // Check personality influence
    if (this.personality.influence > other.personality.changeResistance) return true;

    // Check if in same page
    if (this.pagePosition.page === other.pagePosition.page) {
      return this.personality.influence > 0.5;
    }

    return false;
  }

  // Arithmetic operations
  add(other: bigint | LivingNumber): LivingNumber {
    const otherValue = typeof other === 'bigint' ? other : other.value;
    return new LivingNumber(this.value + otherValue, this.universe);
  }

  multiply(other: bigint | LivingNumber): LivingNumber {
    const otherValue = typeof other === 'bigint' ? other : other.value;
    return new LivingNumber(this.value * otherValue, this.universe);
  }

  // Private helper methods

  private deepCopyMemory(): Memory {
    return {
      structural: {
        fieldHistory: [...this.consciousness.memory.structural.fieldHistory],
        operationLog: [...this.consciousness.memory.structural.operationLog],
        artifactCreation: [...this.consciousness.memory.structural.artifactCreation],
      },
      relational: {
        interactionPartners: [...this.consciousness.memory.relational.interactionPartners],
        compatibilityMatrix: new Map(this.consciousness.memory.relational.compatibilityMatrix),
        influenceNetwork: new Map(this.consciousness.memory.relational.influenceNetwork),
      },
      optimization: {
        successfulStrategies: [...this.consciousness.memory.optimization.successfulStrategies],
        failedAttempts: [...this.consciousness.memory.optimization.failedAttempts],
        energyLandscape: new Map(this.consciousness.memory.optimization.energyLandscape),
      },
      patterns: [...this.consciousness.memory.patterns],
    };
  }

  private generateOptimizationStrategies(): OptimizationStrategy[] {
    const strategies: OptimizationStrategy[] = [
      {
        name: 'gradient-descent',
        complexity: 0.3,
        effectiveness: 0.7,
        applicableContext: ['high-energy', 'unstable'],
      },
      {
        name: 'resonance-tuning',
        complexity: 0.5,
        effectiveness: 0.6,
        applicableContext: ['medium-energy', 'resonance-mismatch'],
      },
      {
        name: 'field-alignment',
        complexity: 0.7,
        effectiveness: 0.8,
        applicableContext: ['near-lagrange', 'field-chaos'],
      },
    ];

    // Add learned strategies
    strategies.push(...this.consciousness.memory.optimization.successfulStrategies);

    return strategies;
  }

  private selectOptimalStrategy(strategies: OptimizationStrategy[]): OptimizationStrategy {
    // Score based on effectiveness and applicability
    let bestScore = -1;
    let bestStrategy = strategies[0];

    for (const strategy of strategies) {
      const score = strategy.effectiveness * (1 - strategy.complexity * 0.5);
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    }

    return bestStrategy;
  }

  private evaluateOption(option: string, context: DecisionContext): number {
    let score = 0.5; // Base score

    // Adjust based on personality
    switch (option) {
      case 'evolve':
        score += (1 - this.personality.changeResistance) * 0.3;
        break;
      case 'interact':
        score += this.personality.traits.includes('social') ? 0.4 : 0.1;
        break;
      case 'compute':
        score += this.computationalState.energy * 0.2;
        break;
    }

    // Adjust based on context
    if (context.context.energy < 0.3 && option !== 'evolve') {
      score *= 0.5; // Low energy, prefer evolution
    }

    return Math.min(1, Math.max(0, score));
  }

  private generateReasoning(choice: string, context: DecisionContext): string {
    const reasons = [];

    if (choice === 'evolve') {
      reasons.push('Seeking stability through gradient flow');
      if (context.context.energy < 0.5) {
        reasons.push('Low energy state requires optimization');
      }
    } else if (choice === 'interact') {
      reasons.push('Social interaction for information exchange');
      if (context.context.neighbors.length > 0) {
        reasons.push(`${context.context.neighbors.length} neighbors available`);
      }
    } else if (choice === 'compute') {
      reasons.push('Active computation for knowledge generation');
    }

    return reasons.join('; ');
  }

  private extractLearnings(operations: ComputationRecord[]): string[] {
    const learnings: string[] = [];

    // Analyze patterns
    const artifactCount = operations.filter((op) => op.artifacts.length > 0).length;
    if (artifactCount > operations.length / 2) {
      learnings.push('High artifact generation detected');
    }

    // Energy efficiency
    const avgEnergyCost =
      operations.reduce((sum, op) => sum + op.energyCost, 0) / operations.length;
    if (avgEnergyCost > 0.15) {
      learnings.push('Energy efficiency needs improvement');
    }

    return learnings;
  }

  private generateImprovements(learnings: string[]): OptimizationStrategy[] {
    const improvements: OptimizationStrategy[] = [];

    for (const learning of learnings) {
      if (learning.includes('artifact')) {
        improvements.push({
          name: 'artifact-reduction',
          complexity: 0.6,
          effectiveness: 0.7,
          applicableContext: ['high-artifact'],
        });
      }
      if (learning.includes('energy')) {
        improvements.push({
          name: 'energy-conservation',
          complexity: 0.4,
          effectiveness: 0.8,
          applicableContext: ['low-energy'],
        });
      }
    }

    return improvements;
  }

  private generateDefaultStrategy(): OptimizationStrategy {
    return {
      name: 'default-exploration',
      complexity: 0.5,
      effectiveness: 0.5,
      applicableContext: ['general'],
    };
  }

  private checkArtifactCompatibility(artifact: DenormalizationArtifact): boolean {
    // Check if artifact type matches our needs
    if (this.seeksMerger && artifact.type === 'emergent') {
      return true;
    }

    // Check field compatibility - handle both field and fieldIndex
    const artifactWithField = artifact as {
      fieldIndex?: number;
      field?: number;
    } & DenormalizationArtifact;
    const fieldIdx = artifactWithField.fieldIndex ?? artifactWithField.field;
    if (fieldIdx !== undefined) {
      return !this.fields[fieldIdx];
    }

    return Math.random() < 0.3; // 30% chance of random absorption
  }

  private applyArtifactToFields(artifact: DenormalizationArtifact): FieldPattern {
    const newFields = [...this.fields];

    // Handle both field and fieldIndex properties
    const artifactWithField = artifact as {
      fieldIndex?: number;
      field?: number;
    } & DenormalizationArtifact;
    const fieldIdx = artifactWithField.fieldIndex ?? artifactWithField.field;
    if (fieldIdx !== undefined) {
      if (artifact.type === 'emergent') {
        newFields[fieldIdx] = true;
      } else if (artifact.type === 'vanishing') {
        newFields[fieldIdx] = false;
      }
    }

    return newFields;
  }
}
