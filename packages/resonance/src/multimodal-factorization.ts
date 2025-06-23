import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';
import { isPrimeViaFieldDynamicsTrue } from './true-field-prime-detection';

/**
 * Multi-modal factorization using all layers of the Mathematical Universe
 * 
 * Combines:
 * - Layer 0: Field patterns and interference
 * - Layer 1: Resonance dynamics and energy landscapes  
 * - Layer 2: Page topology and Lagrange navigation
 * - Layer 3: Arithmetic chemistry and denormalization
 * - Layer 4: Algebraic structures and group actions
 * - Layer 5: Geometric manifolds and geodesics
 * - Layer 6: Calculus engine and gradient flows
 * - Layer 7: Self-reference and recursive patterns
 */

/**
 * Complete factorization state across all modalities
 */
interface FactorizationState {
  n: bigint;
  
  // Layer 0: Field substrate
  fieldPattern: FieldPattern;
  activeFields: number[];
  
  // Layer 1: Resonance dynamics
  resonance: number;
  resonanceGradient: number;
  energyWell: 'high' | 'medium' | 'low';
  
  // Layer 2: Page topology
  page: number;
  pageOffset: number;
  nearestLagrange: number;
  distanceToLagrange: number;
  
  // Layer 3: Arithmetic operators
  possibleArtifacts: ArtifactHypothesis[];
  
  // Layer 4: Algebraic structures
  modularProperties: Map<bigint, bigint>;
  groupOrder: bigint | null;
  
  // Layer 5: Geometric manifold
  fieldSpaceCoordinates: number[];
  curvature: number;
  geodesicDirection: number[];
  
  // Layer 6: Calculus engine
  derivative: number;
  secondDerivative: number;
  flowVector: number[];
  
  // Layer 7: Self-reference
  patternSignature: string;
  recursiveDepth: number;
}

interface ArtifactHypothesis {
  vanishedField: number | null;
  emergedField: number | null;
  likelihood: number;
  impliedFactors: bigint[];
}

/**
 * Cached computation state to prevent redundant calculations
 */
interface ComputationCache {
  fieldPatterns: Map<bigint, FieldPattern>;
  resonances: Map<bigint, number>;
  primalityTests: Map<bigint, boolean>;
}

export class MultiModalFactorization {
  private cache: ComputationCache;
  
  constructor(
    private substrate: FieldSubstrate,
  ) {
    this.cache = {
      fieldPatterns: new Map(),
      resonances: new Map(),
      primalityTests: new Map(),
    };
  }

  /**
   * Factor using all modalities
   */
  async factorize(n: bigint, debug: boolean = false): Promise<bigint[]> {
    if (n <= 1n) return [];
    
    // Check cache first
    if (this.cache.primalityTests.has(n)) {
      if (this.cache.primalityTests.get(n)) return [n];
    } else {
      const isPrime = isPrimeViaFieldDynamicsTrue(this.substrate, n);
      this.cache.primalityTests.set(n, isPrime);
      if (isPrime) return [n];
    }

    // Analyze across all layers
    const state = this.analyzeAcrossLayers(n);
    
    if (debug) {
      console.log('\nMulti-modal analysis:');
      console.log(`- Resonance: ${state.resonance.toFixed(4)}, gradient: ${state.resonanceGradient.toFixed(4)}`);
      console.log(`- Page ${state.page}, offset ${state.pageOffset}, nearest Lagrange: ${state.nearestLagrange}`);
      console.log(`- Curvature: ${state.curvature.toFixed(4)}`);
      console.log(`- Artifact hypotheses: ${state.possibleArtifacts.length}`);
    }
    
    // Try multiple strategies based on the analysis
    const strategies = [
      { name: 'Field Interference', fn: () => this.factorViaFieldInterference(state) },
      { name: 'Resonance Flow', fn: () => this.factorViaResonanceFlow(state) },
      { name: 'Page Structure', fn: () => this.factorViaPageStructure(state) },
      { name: 'Algebraic Properties', fn: () => this.factorViaAlgebraicProperties(state) },
      { name: 'Geometric Geodesics', fn: () => this.factorViaGeometricGeodesics(state) },
      { name: 'Calculus Optimization', fn: () => this.factorViaCalculusOptimization(state) },
      { name: 'Self-Reference', fn: () => this.factorViaSelfReferencePatterns(state) }
    ];
    
    // Execute strategies
    for (const strategy of strategies) {
      if (debug) console.log(`\nTrying ${strategy.name}...`);
      
      const factors = await strategy.fn();
      
      if (factors.length > 1 && this.verifyFactorization(n, factors)) {
        if (debug) console.log(`  Success! Found: ${factors.join(' × ')}`);
        
        // Try to factor further
        const completeFactors: bigint[] = [];
        for (const factor of factors) {
          if (this.isPrimeCached(factor)) {
            completeFactors.push(factor);
          } else {
            const subFactors = await this.factorize(factor, false);
            completeFactors.push(...subFactors);
          }
        }
        return completeFactors.sort((a, b) => Number(a - b));
      } else {
        if (debug) console.log(`  No factors found`);
      }
    }
    
    // If all strategies fail, return n
    return [n];
  }

  /**
   * Analyze number across all layers
   */
  private analyzeAcrossLayers(n: bigint): FactorizationState {
    const pattern = this.getFieldPatternCached(n);
    const activeFields = pattern.map((active, i) => active ? i : -1).filter(i => i >= 0);
    
    // Layer 1: Resonance
    const resonance = this.getResonanceCached(n);
    const resonanceNext = this.getResonanceCached(n + 1n);
    const resonancePrev = n > 0n ? this.getResonanceCached(n - 1n) : resonance;
    const resonanceGradient = resonanceNext - resonance;
    
    // Layer 2: Page topology
    const page = Number(n / 48n);
    const pageOffset = Number(n % 48n);
    const nearestLagrange = this.findNearestLagrange(n);
    
    // Layer 3: Artifact analysis
    const possibleArtifacts = this.hypothesizeArtifacts(pattern, activeFields);
    
    // Layer 4: Algebraic properties
    const modularProperties = this.computeModularProperties(n);
    
    // Layer 5: Geometric analysis
    const fieldSpaceCoordinates = this.embedInFieldSpace(pattern);
    const curvature = this.computeLocalCurvature(n);
    
    // Layer 6: Calculus
    const derivative = resonanceGradient;
    const secondDerivative = resonanceNext - 2 * resonance + resonancePrev;
    
    // Layer 7: Self-reference
    const patternSignature = pattern.map(b => b ? '1' : '0').join('');
    
    return {
      n,
      fieldPattern: pattern,
      activeFields,
      resonance,
      resonanceGradient,
      energyWell: resonance < 1 ? 'low' : resonance < 10 ? 'medium' : 'high',
      page,
      pageOffset,
      nearestLagrange,
      distanceToLagrange: Math.abs(nearestLagrange - Number(n % 256n)),
      possibleArtifacts,
      modularProperties,
      groupOrder: null, // TODO: Compute
      fieldSpaceCoordinates,
      curvature,
      geodesicDirection: this.computeGeodesicDirection(n),
      derivative,
      secondDerivative,
      flowVector: [derivative, 0], // Simplified 2D
      patternSignature,
      recursiveDepth: 0
    };
  }

  /**
   * Layer 0 strategy: Field interference patterns (true artifact-based)
   */
  private async factorViaFieldInterference(state: FactorizationState): Promise<bigint[]> {
    // This is the core of the Mathematical Universe factorization:
    // Reverse the denormalization artifacts created during multiplication
    
    const sqrtN = this.sqrt(state.n);
    const searchLimit = sqrtN < 10000n ? sqrtN : 10000n;
    
    // Priority 1: Reverse vanished fields (highest confidence)
    // If field T vanished, both factors must have had it
    for (const hypothesis of state.possibleArtifacts.filter(h => h.vanishedField !== null)) {
      const vanishedField = hypothesis.vanishedField!;
      
      // Smart search: only check numbers that have the vanished field
      const candidates = this.findFactorsWithField(state.fieldPattern, vanishedField, searchLimit);
      
      for (const candidate of candidates) {
        if (state.n % candidate === 0n) {
          const complement = state.n / candidate;
          const compPattern = this.getFieldPatternCached(complement);
          
          // Verify: both factors must have the vanished field
          if (compPattern[vanishedField]) {
            // Additional verification: check if this explains other artifacts
            const artifactScore = this.scoreArtifactMatch(state.n, candidate, complement);
            if (artifactScore > 0.7) {
              return [candidate, complement];
            }
          }
        }
      }
    }
    
    // Priority 2: Reverse emerged fields
    // If field θ emerged, neither factor had it
    for (const hypothesis of state.possibleArtifacts.filter(h => h.emergedField !== null)) {
      const emergedField = hypothesis.emergedField!;
      
      // Smart search: only check numbers without the emerged field
      const candidates = this.findFactorsWithoutField(state.fieldPattern, emergedField, searchLimit);
      
      for (const candidate of candidates) {
        if (state.n % candidate === 0n) {
          const complement = state.n / candidate;
          const compPattern = this.getFieldPatternCached(complement);
          
          // Verify: neither factor should have the emerged field
          if (!compPattern[emergedField]) {
            const artifactScore = this.scoreArtifactMatch(state.n, candidate, complement);
            if (artifactScore > 0.6) {
              return [candidate, complement];
            }
          }
        }
      }
    }
    
    // Priority 3: Use resonance interference patterns
    // The resonance of the product relates to factor resonances through interference
    const targetResonance = state.resonance;
    
    const limit = searchLimit < 1000n ? searchLimit : 1000n;
    for (let i = 2n; i <= limit; i++) {
      if (state.n % i === 0n) {
        const complement = state.n / i;
        const res1 = this.getResonanceCached(i);
        const res2 = this.getResonanceCached(complement);
        
        // Check if resonances interfere correctly
        const resonanceMatch = this.checkResonanceInterference(targetResonance, res1, res2);
        if (resonanceMatch > 0.8) {
          return [i, complement];
        }
      }
    }
    
    return [state.n];
  }

  /**
   * Layer 1 strategy: Follow resonance gradients
   */
  private async factorViaResonanceFlow(state: FactorizationState): Promise<bigint[]> {
    // Numbers with similar resonance might be related
    const targetResonance = state.resonance;
    
    // Search in resonance neighborhood
    const searchRadius = 100n;
    for (let delta = 1n; delta <= searchRadius; delta++) {
      for (const dir of [1n, -1n]) {
        const candidate = state.n + dir * delta;
        if (candidate > 1n && candidate < state.n) {
          const candidateRes = this.getResonanceCached(candidate);
          if (Math.abs(candidateRes - targetResonance) < 0.1) {
            if (state.n % candidate === 0n) {
              return [candidate, state.n / candidate];
            }
          }
        }
      }
    }
    
    return [state.n];
  }

  /**
   * Layer 2 strategy: Use page structure
   */
  private async factorViaPageStructure(state: FactorizationState): Promise<bigint[]> {
    // Factors often relate to page boundaries
    const pageSize = 48n;
    
    // Check factors near page boundaries (optimized)
    const maxPages = Number(state.n / pageSize) + 1;
    const checkPages = Math.min(maxPages, 100); // Limit to prevent memory issues
    
    for (let p = 1; p <= checkPages; p++) {
      const pageStart = BigInt(p) * pageSize;
      // Only check boundary region
      for (const offset of [-1n, 0n, 1n]) {
        const candidate = pageStart + offset;
        if (candidate > 1n && candidate * candidate <= state.n && state.n % candidate === 0n) {
          return [candidate, state.n / candidate];
        }
      }
    }
    
    return [state.n];
  }

  /**
   * Layer 4 strategy: Algebraic properties
   */
  private async factorViaAlgebraicProperties(state: FactorizationState): Promise<bigint[]> {
    // First check our pre-computed modular properties
    for (const [modulus, remainder] of state.modularProperties) {
      if (remainder === 0n && modulus > 1n && modulus < state.n) {
        return [modulus, state.n / modulus];
      }
    }
    
    // Extended search using algebraic constraints
    // Based on field pattern, generate likely divisors
    const sqrtN = this.sqrt(state.n);
    
    // Strategy 1: Check near field-suggested values
    const fieldValue = BigInt(parseInt(state.patternSignature, 2));
    if (fieldValue > 1n && fieldValue <= sqrtN) {
      for (let delta = 0n; delta <= 10n; delta++) {
        for (const candidate of [fieldValue + delta, fieldValue - delta]) {
          if (candidate > 1n && state.n % candidate === 0n) {
            return [candidate, state.n / candidate];
          }
        }
      }
    }
    
    // Strategy 2: Check factors related to page structure
    const pageRelated = [
      BigInt(state.page),
      BigInt(state.pageOffset),
      48n * BigInt(state.page) + BigInt(state.pageOffset),
      BigInt(state.nearestLagrange)
    ];
    
    for (const base of pageRelated) {
      if (base > 1n && base <= sqrtN) {
        if (state.n % base === 0n) {
          return [base, state.n / base];
        }
      }
    }
    
    // Strategy 3: Scalable trial division with field optimization
    
    // First check small primes (most common factors)
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];
    for (const p of smallPrimes) {
      if (state.n % p === 0n) {
        return [p, state.n / p];
      }
    }
    
    // Check page-related values
    const pageRelatedChecks = [
      48n - 1n, 48n, 48n + 1n, // Page boundary
      96n - 1n, 96n, 96n + 1n, // Double page
      BigInt(state.nearestLagrange),
    ];
    
    for (const candidate of pageRelatedChecks) {
      if (candidate > 1n && candidate < state.n && state.n % candidate === 0n) {
        return [candidate, state.n / candidate];
      }
    }
    
    // For larger numbers, use Pollard's rho with field optimization
    if (state.n > 1000000n) {
      const factor = this.pollardRhoWithFields(state.n, state.fieldPattern);
      if (factor > 1n && factor < state.n) {
        return [factor, state.n / factor];
      }
    }
    
    // Limited systematic search based on number size
    const searchLimit = state.n < 1000n ? sqrtN : 
                       state.n < 1000000n ? 10000n : 
                       1000n; // Very limited for large numbers
    
    for (let i = 53n; i <= searchLimit; i += 2n) {
      if (state.n % i === 0n) {
        return [i, state.n / i];
      }
    }
    
    return [state.n];
  }

  /**
   * Layer 5 strategy: Follow geometric geodesics (enhanced)
   */
  private async factorViaGeometricGeodesics(state: FactorizationState): Promise<bigint[]> {
    // Follow geodesics toward Lagrange points (stability wells)
    const lagrangeTargets = [48n, 49n, 96n, 97n, 144n, 145n];
    
    for (const target of lagrangeTargets) {
      if (target >= state.n) break;
      
      // Check if n/target gives a clean factor
      const quotient = state.n / target;
      const remainder = state.n % target;
      
      if (remainder === 0n && quotient > 1n) {
        return [target, quotient];
      }
      
      // Check nearby values (geodesic neighborhood)
      for (let delta = 1n; delta <= 5n; delta++) {
        for (const candidate of [target - delta, target + delta]) {
          if (candidate > 1n && state.n % candidate === 0n) {
            return [candidate, state.n / candidate];
          }
        }
      }
    }
    
    // Follow gradient direction
    const direction = state.geodesicDirection[0];
    if (Math.abs(direction) > 0.1) {
      const movement = BigInt(Math.floor(Math.abs(direction)));
      const candidate = direction > 0 ? state.n - movement : state.n + movement;
      
      if (candidate > 1n && candidate < state.n && state.n % candidate === 0n) {
        return [candidate, state.n / candidate];
      }
    }
    
    return [state.n];
  }

  /**
   * Layer 6 strategy: Calculus optimization (enhanced)
   */
  private async factorViaCalculusOptimization(state: FactorizationState): Promise<bigint[]> {
    // Use derivatives to find critical points (potential factors)
    const criticalThreshold = 0.1;
    
    // Check if we're near a critical point
    if (Math.abs(state.derivative) < criticalThreshold) {
      // Near critical point - check neighborhood
      for (let delta = 1n; delta <= 10n; delta++) {
        for (const dir of [-1n, 1n]) {
          const candidate = state.n + dir * delta;
          if (candidate > 1n && candidate < state.n && state.n % candidate === 0n) {
            return [candidate, state.n / candidate];
          }
        }
      }
    }
    
    // High curvature indicates rapid change
    if (Math.abs(state.secondDerivative) > 1.0) {
      // Search in direction of decreasing energy
      const searchDir = state.derivative > 0 ? -1n : 1n;
      const searchRange = Math.min(20, Math.floor(Math.abs(state.secondDerivative) * 10));
      
      for (let delta = 1n; delta <= BigInt(searchRange); delta++) {
        const candidate = state.n + searchDir * delta;
        if (candidate > 1n && candidate < state.n) {
          // Check if resonance matches expected pattern
          const candRes = this.getResonanceCached(candidate);
          const complement = state.n / candidate;
          if (state.n % candidate === 0n) {
            const compRes = this.getResonanceCached(complement);
            // Verify resonance multiplication approximation
            const expectedRes = candRes * compRes;
            if (Math.abs(expectedRes - state.resonance) < expectedRes * 0.2) {
              return [candidate, complement];
            }
          }
        }
      }
    }
    
    return [state.n];
  }

  /**
   * Layer 7 strategy: Self-reference patterns
   */
  private async factorViaSelfReferencePatterns(state: FactorizationState): Promise<bigint[]> {
    // Look for self-referential patterns
    const patternNum = BigInt(parseInt(state.patternSignature, 2));
    
    if (patternNum > 1n && patternNum < state.n && state.n % patternNum === 0n) {
      return [patternNum, state.n / patternNum];
    }
    
    // Check if n encodes information about its factors
    const encoded = this.decodeFactorHint(state.n);
    if (encoded && state.n % encoded === 0n) {
      return [encoded, state.n / encoded];
    }
    
    return [state.n];
  }

  /**
   * Helper: Find nearest Lagrange point
   */
  private findNearestLagrange(n: bigint): number {
    const pos = Number(n % 256n);
    const lagrangePoints = [0, 1, 48, 49, 96, 97, 144, 145, 192, 193, 240, 241];
    
    let nearest = lagrangePoints[0];
    let minDist = Math.abs(pos - nearest);
    
    for (const point of lagrangePoints) {
      const dist = Math.abs(pos - point);
      if (dist < minDist) {
        minDist = dist;
        nearest = point;
      }
    }
    
    return nearest;
  }

  /**
   * Helper: Hypothesize artifacts from field pattern (enhanced)
   */
  private hypothesizeArtifacts(pattern: FieldPattern, _activeFields: number[]): ArtifactHypothesis[] {
    const hypotheses: ArtifactHypothesis[] = [];
    
    // Common prime fields that often vanish in composites
    const commonPrimeFields = [0, 1, 2]; // Identity, Tribonacci, Golden
    
    // For each inactive common field, it likely vanished
    for (const field of commonPrimeFields) {
      if (!pattern[field]) {
        hypotheses.push({
          vanishedField: field,
          emergedField: null,
          likelihood: 0.7, // Higher likelihood
          impliedFactors: this.findFactorsWithField(pattern, field)
        });
      }
    }
    
    // Rare fields that emerge in composites
    const rareFields = [6, 7]; // Phase, Zeta
    
    // For each active rare field, it likely emerged
    for (const field of rareFields) {
      if (pattern[field]) {
        hypotheses.push({
          vanishedField: null,
          emergedField: field,
          likelihood: 0.6,
          impliedFactors: this.findFactorsWithoutField(pattern, field)
        });
      }
    }
    
    // Check field 4 & 5 interaction (perfect resonance)
    if (pattern[4] && pattern[5]) {
      // Near Lagrange point - special handling
      hypotheses.push({
        vanishedField: null,
        emergedField: null,
        likelihood: 0.8,
        impliedFactors: this.findLagrangeRelatedFactors(pattern)
      });
    }
    
    return hypotheses;
  }

  /**
   * Helper: Compute modular properties
   */
  private computeModularProperties(n: bigint): Map<bigint, bigint> {
    const props = new Map<bigint, bigint>();
    
    // Check small moduli
    const moduli = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 48n, 256n];
    for (const m of moduli) {
      props.set(m, n % m);
    }
    
    return props;
  }

  /**
   * Helper: Embed in field space
   */
  private embedInFieldSpace(pattern: FieldPattern): number[] {
    return pattern.map(b => b ? 1 : 0);
  }

  /**
   * Helper: Compute local curvature
   */
  private computeLocalCurvature(n: bigint): number {
    const res = this.getResonanceCached(n);
    const resNext = this.getResonanceCached(n + 1n);
    const resPrev = n > 0n ? this.getResonanceCached(n - 1n) : res;
    
    // Discrete curvature
    return resNext - 2 * res + resPrev;
  }

  /**
   * Helper: Compute geodesic direction
   */
  private computeGeodesicDirection(n: bigint): number[] {
    // Simplified: point toward nearest Lagrange
    const nearest = this.findNearestLagrange(n);
    const current = Number(n % 256n);
    const direction = nearest - current;
    
    return [direction, 0];
  }

  /**
   * Helper: Find factors without specific field (enhanced)
   */
  private findFactorsWithoutField(_pattern: FieldPattern, field: number, limit: bigint = 100n): bigint[] {
    const candidates: bigint[] = [];
    const checkLimit = limit < 1000n ? limit : 1000n;
    
    // Smart candidates based on field type
    if (field === 6) { // Phase field - rarely in small primes
      candidates.push(2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n);
    } else if (field === 7) { // Zeta field - rarely in small numbers
      candidates.push(...Array.from({length: 20}, (_, i) => BigInt(i + 2)));
    }
    
    // General search
    for (let i = 2n; i <= checkLimit; i++) {
      const p = this.getFieldPatternCached(i);
      if (!p[field] && !candidates.includes(i)) {
        candidates.push(i);
      }
    }
    
    return candidates.sort((a, b) => Number(a - b));
  }

  /**
   * Helper: Find factors with specific field (enhanced)
   */
  private findFactorsWithField(_pattern: FieldPattern, field: number, limit: bigint = 100n): bigint[] {
    const candidates: bigint[] = [];
    const checkLimit = limit < 1000n ? limit : 1000n;
    
    // Smart candidates based on field type
    if (field === 1) { // Tribonacci field - often in primes
      candidates.push(7n, 11n, 13n, 23n, 29n, 31n, 37n, 41n, 43n, 47n);
    } else if (field === 2) { // Golden ratio field
      candidates.push(5n, 7n, 13n, 21n, 34n, 55n, 89n); // Fibonacci-related
    } else if (field === 3) { // Half field
      candidates.push(11n, 13n, 19n, 27n, 29n, 35n, 37n, 43n);
    }
    
    // General search
    for (let i = 2n; i <= checkLimit; i++) {
      const p = this.getFieldPatternCached(i);
      if (p[field] && !candidates.includes(i)) {
        candidates.push(i);
      }
    }
    
    return candidates.sort((a, b) => Number(a - b));
  }
  
  /**
   * Helper: Find Lagrange-related factors
   */
  private findLagrangeRelatedFactors(_pattern: FieldPattern): bigint[] {
    // Factors near Lagrange points (48, 49, 96, 97, etc.)
    return [47n, 48n, 49n, 50n, 95n, 96n, 97n, 98n];
  }

  /**
   * Helper: Decode factor hint from self-reference
   */
  private decodeFactorHint(n: bigint): bigint | null {
    // Check if n encodes information about its factors
    // This is speculative - looking for patterns
    
    // Example: Check if the field pattern number divides n
    const pattern = this.substrate.getFieldPattern(n);
    const patternNum = pattern.reduce((acc, bit, i) => acc + (bit ? 2n**BigInt(i) : 0n), 0n);
    
    if (patternNum > 1n && patternNum < n) {
      return patternNum;
    }
    
    return null;
  }

  /**
   * Helper: Verify factorization
   */
  private verifyFactorization(n: bigint, factors: bigint[]): boolean {
    const product = factors.reduce((a, b) => a * b, 1n);
    return product === n;
  }

  /**
   * Helper: Integer square root
   */
  private sqrt(n: bigint): bigint {
    if (n < 2n) return n;
    let x = n;
    let y = (x + 1n) / 2n;
    while (y < x) {
      x = y;
      y = (x + n / x) / 2n;
    }
    return x;
  }

  /**
   * Helper: Get field pattern with caching
   */
  private getFieldPatternCached(n: bigint): FieldPattern {
    if (!this.cache.fieldPatterns.has(n)) {
      this.cache.fieldPatterns.set(n, this.substrate.getFieldPattern(n));
    }
    return this.cache.fieldPatterns.get(n)!;
  }

  /**
   * Helper: Get resonance with caching
   */
  private getResonanceCached(n: bigint): number {
    if (!this.cache.resonances.has(n)) {
      this.cache.resonances.set(n, calculateResonance(this.substrate, n));
    }
    return this.cache.resonances.get(n)!;
  }

  /**
   * Helper: Check primality with caching
   */
  private isPrimeCached(n: bigint): boolean {
    if (!this.cache.primalityTests.has(n)) {
      this.cache.primalityTests.set(n, isPrimeViaFieldDynamicsTrue(this.substrate, n));
    }
    return this.cache.primalityTests.get(n)!;
  }

  /**
   * Clear cache to free memory
   */
  clearCache(): void {
    this.cache.fieldPatterns.clear();
    this.cache.resonances.clear();
    this.cache.primalityTests.clear();
  }

  /**
   * Pollard's rho algorithm with field pattern optimization
   */
  private pollardRhoWithFields(n: bigint, pattern: FieldPattern): bigint {
    if (n % 2n === 0n) return 2n;
    
    // Use field pattern to seed the algorithm
    let x = 2n;
    let y = 2n;
    let d = 1n;
    
    // Custom function based on field pattern
    const patternValue = pattern.reduce((acc, bit, i) => acc + (bit ? BigInt(1 << i) : 0n), 0n);
    const c = patternValue % n || 1n;
    
    const f = (x: bigint): bigint => (x * x + c) % n;
    
    // Limit iterations to prevent infinite loops
    let iterations = 0;
    const maxIterations = Number(this.sqrt(this.sqrt(n)));
    
    while (d === 1n && iterations < maxIterations) {
      x = f(x);
      y = f(f(y));
      d = this.gcd(this.abs(x - y), n);
      iterations++;
    }
    
    return d === n ? 1n : d;
  }
  
  /**
   * Helper: GCD for Pollard's rho
   */
  private gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  /**
   * Helper: Absolute value
   */
  private abs(n: bigint): bigint {
    return n < 0n ? -n : n;
  }
  
  /**
   * Score how well a factorization matches expected artifacts
   */
  private scoreArtifactMatch(n: bigint, factor1: bigint, factor2: bigint): number {
    const patternN = this.getFieldPatternCached(n);
    const pattern1 = this.getFieldPatternCached(factor1);
    const pattern2 = this.getFieldPatternCached(factor2);
    
    let matches = 0;
    let total = 0;
    
    for (let i = 0; i < 8; i++) {
      total += 2; // Each field contributes 2 points max
      
      // Vanishing artifact: both factors have it, product doesn't
      if (pattern1[i] && pattern2[i] && !patternN[i]) {
        matches += 2; // Perfect artifact match
      }
      // Emerging artifact: neither factor has it, product does
      else if (!pattern1[i] && !pattern2[i] && patternN[i]) {
        matches += 2; // Perfect artifact match
      }
      // Field preservation: at least one has it, product has it
      else if ((pattern1[i] || pattern2[i]) === patternN[i]) {
        matches += 1; // Expected behavior
      }
    }
    
    return matches / total;
  }
  
  /**
   * Check if resonances interfere correctly
   */
  private checkResonanceInterference(targetResonance: number, res1: number, res2: number): number {
    // In the Mathematical Universe, resonances don't simply multiply
    // They interfere based on field patterns
    
    const naiveProduct = res1 * res2;
    const ratio = targetResonance / naiveProduct;
    
    // Perfect interference would give ratio = 1
    // But artifacts cause deviations
    if (ratio > 0.1 && ratio < 10) {
      // Within reasonable range
      return 1.0 - Math.abs(Math.log(ratio)) / 3;
    }
    
    return 0;
  }
}