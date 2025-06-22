import type { FieldPattern } from '@uor-foundation/field-substrate';
// InterferenceResult is used elsewhere in the package
import type { PageInfo } from '@uor-foundation/topology';
import type { DenormalizationArtifact } from '@uor-foundation/operators';
export type { DenormalizationArtifact } from '@uor-foundation/operators';
import type { GroupStructure, RingStructure, Module } from '@uor-foundation/algebra';
// CurvatureTensor is used elsewhere in the package
// LimitResult is used elsewhere in the package
// Self-reference types are used elsewhere in the package

// Core analysis result
export interface UniverseAnalysis {
  number: bigint;
  fields: FieldPattern;
  resonance: number;
  isPrime: boolean;
  artifacts: DenormalizationArtifact[];
  pageInfo: PageInfo;
  stabilityMetric: number;
  nearestLagrangePoint: bigint;
  distanceToLagrange: number;
  isLagrangePoint: boolean;
}

// Living number computational state
export interface ComputationalState {
  status: 'virgin' | 'active' | 'dormant' | 'crystallized' | 'artifact';
  energy: number;
  history: ComputationRecord[];
  lastComputation: Date | null;
  rebirth: boolean;
}

// Computation record
export interface ComputationRecord {
  timestamp: Date;
  operation: string;
  operands: bigint[];
  result: bigint;
  energyCost: number;
  artifacts: DenormalizationArtifact[];
}

// Consciousness properties
export interface Consciousness {
  awareness: number;
  memory: Memory;
  adaptability: number;
  selfAwareness: SelfAwareness;
  metaCognition: MetaCognition;
  inheritedTraits?: InheritedTraits;
}

// Memory system
export interface Memory {
  structural: StructuralMemory;
  relational: RelationalMemory;
  optimization: OptimizationMemory;
  patterns: LearnedPattern[];
}

export interface StructuralMemory {
  fieldHistory: FieldPattern[];
  operationLog: ComputationRecord[];
  artifactCreation: DenormalizationArtifact[];
}

export interface RelationalMemory {
  interactionPartners: bigint[];
  compatibilityMatrix: Map<bigint, number>;
  influenceNetwork: Map<bigint, number>;
}

export interface OptimizationMemory {
  successfulStrategies: OptimizationStrategy[];
  failedAttempts: OptimizationStrategy[];
  energyLandscape: Map<bigint, number>;
}

export interface LearnedPattern {
  pattern: string;
  frequency: number;
  success: number;
}

// Self-awareness
export interface SelfAwareness {
  knowsOwnValue: boolean;
  knowsOwnFields: boolean;
  knowsOwnResonance: boolean;
  knowsOwnPosition: boolean;
}

// Meta-cognition
export interface MetaCognition {
  canReasonAboutReasoning: boolean;
  canModifyOwnBehavior: boolean;
  understandsOwnLimitations: boolean;
}

// Inherited traits
export interface InheritedTraits {
  fromParent: bigint;
  strategies: OptimizationStrategy[];
  adaptations: Adaptation[];
}

// Personality
export interface Personality {
  type: 'prime' | 'composite' | 'lagrange' | 'power' | 'random';
  traits: string[];
  changeResistance: number;
  influence: number;
}

// Decision making
export interface Decision {
  choice: string;
  reasoning: string;
  confidence: number;
}

export interface DecisionContext {
  options: string[];
  context: {
    energy: number;
    neighbors: bigint[];
    [key: string]: unknown;
  };
}

// Interaction result
export interface InteractionResult {
  result: LivingNumber;
  artifacts: DenormalizationArtifact[];
  informationExchange: number;
  fieldEntanglement: FieldPattern;
  energyExchange: number;
}

// Optimization result
export interface OptimizationResult {
  improvement: number;
  strategy: string;
  newState: ComputationalState;
}

export interface OptimizationStrategy {
  name: string;
  complexity: number;
  effectiveness: number;
  applicableContext: string[];
}

// Evolution
export interface EvolutionStep {
  generation: number;
  fitness: number;
  mutations: string[];
  structures: Array<GroupStructure | RingStructure>;
  resonanceGradient: number;
  conservationCompliance: number;
  fieldCoherence: number;
}

// Conservation checks
export interface FieldParityConservation {
  isConserved: boolean;
  xorPattern: boolean[];
  violations: bigint[];
}

export interface ResonanceFluxResult {
  totalFlux: number;
  isBalanced: boolean;
  maxDeviation: number;
}

export interface InformationBalance {
  created: DenormalizationArtifact[];
  destroyed: DenormalizationArtifact[];
  conserved: boolean;
  netInformation: number;
}

// Collective intelligence
export interface PageConsensus {
  decision: string;
  coherence: number;
  dissenters: LivingNumber[];
  convergenceTime: number;
}

export interface SwarmOptimizationOptions {
  target: 'minimum-energy' | 'maximum-stability' | 'information-discovery';
  iterations: number;
}

export interface Hierarchy {
  individuals: LivingNumber[];
  pages: LivingNumber[][];
  leaders: LivingNumber[];
  structure: 'flat' | 'hierarchical' | 'network';
}

// Broadcast and resonance
export interface ResonanceBroadcast {
  source: bigint;
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface ResonanceInfluence {
  strength: number;
  effect: 'stabilizing' | 'destabilizing' | 'neutral';
  resonanceShift: number;
}

// Artifact reception
export interface ArtifactReception {
  absorbed: boolean;
  informationGained: number;
  fieldChanges: FieldPattern;
}

// Reflection
export interface Reflection {
  performance: number;
  learnings: string[];
  improvements: OptimizationStrategy[];
}

// Strategy
export interface Strategy {
  name: string;
  complexity: number;
  effectiveness: number;
  evolution: number;
}

// Adaptation
export interface Adaptation {
  context: Record<string, unknown>;
  strategy: string;
  success: number;
}

// Universe metrics
export interface UniverseMetrics {
  totalNumbers: number;
  activeNumbers: number;
  dormantNumbers: number;
  totalResonance: number;
  informationContent: number;
  computationalComplexity: number;
  evolutionaryPressure: number;
}

// Batch analysis
export interface BatchAnalysisResult extends UniverseAnalysis {
  optimized: boolean;
  cacheHit: boolean;
}

// Extended arithmetic results
export interface ExtendedArithmeticResult {
  result: bigint;
  artifacts: DenormalizationArtifact[];
  fieldTransitions: FieldPattern[];
  energyFlow: number;
  entanglementComplexity: number;
  informationBalance: InformationBalance;
}

// Extended factorization result
export interface ExtendedFactorizationResult {
  factors: bigint[];
  isPrime: boolean;
  fieldReconstruction: FieldPattern[];
  artifactSources: DenormalizationArtifact[];
}

// Algebraic structure detection result
export interface AlgebraicStructureResult {
  groups: GroupStructure[];
  rings: RingStructure[];
  modules: Module[];
  categoryStructure: unknown;
}

// Dynamics analysis
export interface DynamicsAnalysis {
  isStable: boolean;
  lyapunovExponent: number;
  attractorType: 'fixed' | 'periodic' | 'strange' | 'none';
  basinOfAttraction: bigint[];
}

// Meta information
export interface MetaInformation {
  godelNumber: bigint;
  selfDescription: string;
  evolutionCapability: boolean;
  computationalLimits: Record<string, number>;
}

// Living number interface
export interface LivingNumber {
  // Core properties
  value: bigint;
  fields: FieldPattern;
  resonance: number;
  isPrime: boolean;
  pagePosition: { page: bigint; offset: number };
  isLagrangePoint: boolean;
  stabilityMetric: number;

  // Living properties
  consciousness: Consciousness;
  computationalState: ComputationalState;
  personality: Personality;
  seeksMerger: boolean;

  // Methods
  evolve(): LivingNumber;
  interact(
    other: LivingNumber,
    options?: { operation?: string; intent?: string },
  ): InteractionResult;
  optimize(): OptimizationResult;
  compute(operation: (n: LivingNumber) => LivingNumber): LivingNumber;
  age(time: number): void;
  makeDecision(context: DecisionContext): Decision;
  reflect(): Reflection;
  getStrategy(): Strategy;
  adaptTo(environment: Record<string, unknown>): Adaptation;
  reproduce(): LivingNumber;
  drainEnergy(amount: number): void;

  // Communication
  broadcastResonance(): ResonanceBroadcast;
  receiveResonance(broadcast: ResonanceBroadcast): ResonanceInfluence;
  receiveArtifact(artifact: DenormalizationArtifact): ArtifactReception;
  canInfluence(other: LivingNumber): boolean;

  // Arithmetic operations (for interaction)
  add(other: bigint | LivingNumber): LivingNumber;
  multiply(other: bigint | LivingNumber): LivingNumber;
}
