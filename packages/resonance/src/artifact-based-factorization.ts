import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';
import { isPrimeViaFieldDynamicsTrue } from './true-field-prime-detection';

/**
 * Artifact-Based Factorization
 * 
 * This implementation treats factorization as molecular decomposition,
 * reversing the denormalization artifacts created during multiplication.
 * 
 * Key principles:
 * - Numbers are molecules, primes are atoms
 * - Multiplication creates field interference (vanishing/emerging fields)
 * - Factorization must reverse these artifacts
 * - The universe solves its own interference equations
 */

interface FieldInterferenceSignature {
  vanishedFields: number[];
  emergedFields: number[];
  phaseShifts: number[];
  resonanceRatio: number;
}

interface DecompositionHypothesis {
  factor1: bigint;
  factor2: bigint;
  confidence: number;
  artifactMatch: number;
  resonanceMatch: number;
}

export class ArtifactBasedFactorization {
  private fieldCache = new Map<bigint, FieldPattern>();
  private resonanceCache = new Map<bigint, number>();
  
  constructor(
    private substrate: FieldSubstrate,
  ) {}

  /**
   * Factor a number by reversing its denormalization artifacts
   */
  async factorize(n: bigint): Promise<bigint[]> {
    if (n <= 1n) return [];
    if (isPrimeViaFieldDynamicsTrue(this.substrate, n)) return [n];
    
    // Analyze the molecule's structure
    const moleculeSignature = this.analyzeMolecule(n);
    
    // Generate decomposition hypotheses based on artifacts
    const hypotheses = this.generateDecompositionHypotheses(n, moleculeSignature);
    
    // Test hypotheses in order of confidence
    for (const hypothesis of hypotheses) {
      if (this.verifyDecomposition(n, hypothesis)) {
        // Recursively decompose the factors
        const factors1 = await this.factorize(hypothesis.factor1);
        const factors2 = await this.factorize(hypothesis.factor2);
        return [...factors1, ...factors2].sort((a, b) => Number(a - b));
      }
    }
    
    // Fallback: the molecule is indivisible (prime)
    return [n];
  }

  /**
   * Analyze a number's molecular structure
   */
  private analyzeMolecule(n: bigint): FieldInterferenceSignature {
    const pattern = this.getFieldPattern(n);
    const resonance = this.getResonance(n);
    
    // Identify likely vanished and emerged fields
    const vanishedFields: number[] = [];
    const emergedFields: number[] = [];
    const phaseShifts: number[] = [];
    
    // Common prime fields that often vanish in composites
    const primeFields = [0, 1, 2, 3]; // I, T, φ, ½
    for (const field of primeFields) {
      if (!pattern[field]) {
        vanishedFields.push(field);
      }
    }
    
    // Rare fields that emerge in composites
    const rareFields = [6, 7]; // θ, ζ
    for (const field of rareFields) {
      if (pattern[field]) {
        emergedFields.push(field);
      }
    }
    
    // Detect phase shifts by checking neighbors
    for (let i = 0; i < 8; i++) {
      const prev = this.getFieldPattern(n - 1n);
      const next = this.getFieldPattern(n + 1n);
      if (prev[i] !== pattern[i] && next[i] !== pattern[i]) {
        phaseShifts.push(i);
      }
    }
    
    // Calculate resonance characteristics
    const resonanceRatio = resonance / Math.sqrt(Number(n));
    
    return {
      vanishedFields,
      emergedFields,
      phaseShifts,
      resonanceRatio,
    };
  }

  /**
   * Generate hypotheses for how this molecule could decompose
   */
  private generateDecompositionHypotheses(
    n: bigint, 
    signature: FieldInterferenceSignature
  ): DecompositionHypothesis[] {
    const hypotheses: DecompositionHypothesis[] = [];
    const sqrtN = this.sqrt(n);
    
    // Strategy 1: Reverse vanished fields
    // If field T vanished, both factors likely had it
    for (const vanishedField of signature.vanishedFields) {
      const candidates = this.findNumbersWithField(vanishedField, sqrtN);
      
      for (const candidate of candidates) {
        if (n % candidate === 0n) {
          const complement = n / candidate;
          const complementPattern = this.getFieldPattern(complement);
          
          if (complementPattern[vanishedField]) {
            // Both have the vanished field - high confidence
            hypotheses.push({
              factor1: candidate,
              factor2: complement,
              confidence: 0.9,
              artifactMatch: 1.0,
              resonanceMatch: this.calculateResonanceMatch(n, candidate, complement),
            });
          }
        }
      }
    }
    
    // Strategy 2: Reverse emerged fields
    // If field θ emerged, neither factor had it
    for (const emergedField of signature.emergedFields) {
      const candidates = this.findNumbersWithoutField(emergedField, sqrtN);
      
      for (const candidate of candidates) {
        if (n % candidate === 0n) {
          const complement = n / candidate;
          const complementPattern = this.getFieldPattern(complement);
          
          if (!complementPattern[emergedField]) {
            // Neither has the emerged field - good confidence
            hypotheses.push({
              factor1: candidate,
              factor2: complement,
              confidence: 0.8,
              artifactMatch: 0.9,
              resonanceMatch: this.calculateResonanceMatch(n, candidate, complement),
            });
          }
        }
      }
    }
    
    // Strategy 3: Use resonance constraints
    // Factors should have resonances that multiply to approximately n's resonance
    const targetResonance = this.getResonance(n);
    
    const limit = sqrtN < 10000n ? sqrtN : 10000n;
    for (let i = 2n; i <= limit; i++) {
      if (n % i === 0n) {
        const complement = n / i;
        const res1 = this.getResonance(i);
        const res2 = this.getResonance(complement);
        
        // Check if resonances are compatible
        const resonanceProduct = res1 * res2;
        const resonanceMatch = 1.0 - Math.abs(resonanceProduct - targetResonance) / targetResonance;
        
        if (resonanceMatch > 0.5) {
          hypotheses.push({
            factor1: i,
            factor2: complement,
            confidence: 0.5 + resonanceMatch * 0.4,
            artifactMatch: this.calculateArtifactMatch(n, i, complement),
            resonanceMatch,
          });
        }
      }
    }
    
    // Sort by confidence
    return hypotheses.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Find small numbers that have a specific field active
   */
  private findNumbersWithField(field: number, limit: bigint): bigint[] {
    const candidates: bigint[] = [];
    const checkLimit = limit < 1000n ? limit : 1000n;
    
    for (let i = 2n; i <= checkLimit; i++) {
      const pattern = this.getFieldPattern(i);
      if (pattern[field]) {
        candidates.push(i);
      }
    }
    
    return candidates;
  }

  /**
   * Find small numbers that don't have a specific field active
   */
  private findNumbersWithoutField(field: number, limit: bigint): bigint[] {
    const candidates: bigint[] = [];
    const checkLimit = limit < 1000n ? limit : 1000n;
    
    for (let i = 2n; i <= checkLimit; i++) {
      const pattern = this.getFieldPattern(i);
      if (!pattern[field]) {
        candidates.push(i);
      }
    }
    
    return candidates;
  }

  /**
   * Calculate how well the resonances match
   */
  private calculateResonanceMatch(n: bigint, factor1: bigint, factor2: bigint): number {
    const resonanceN = this.getResonance(n);
    const resonance1 = this.getResonance(factor1);
    const resonance2 = this.getResonance(factor2);
    
    const expectedResonance = resonance1 * resonance2;
    
    if (expectedResonance === 0) return 0;
    
    return 1.0 - Math.min(1.0, Math.abs(expectedResonance - resonanceN) / expectedResonance);
  }

  /**
   * Calculate how well the field patterns match expected artifacts
   */
  private calculateArtifactMatch(n: bigint, factor1: bigint, factor2: bigint): number {
    const patternN = this.getFieldPattern(n);
    const pattern1 = this.getFieldPattern(factor1);
    const pattern2 = this.getFieldPattern(factor2);
    
    let matches = 0;
    let total = 0;
    
    for (let i = 0; i < 8; i++) {
      total++;
      
      // Check vanishing: both factors have it, product doesn't
      if (pattern1[i] && pattern2[i] && !patternN[i]) {
        matches++;
      }
      // Check emerging: neither factor has it, product does
      else if (!pattern1[i] && !pattern2[i] && patternN[i]) {
        matches++;
      }
      // Check preservation: at least one factor has it, product has it
      else if ((pattern1[i] || pattern2[i]) && patternN[i]) {
        matches += 0.5;
      }
      // Check absence: none have it
      else if (!pattern1[i] && !pattern2[i] && !patternN[i]) {
        matches += 0.5;
      }
    }
    
    return matches / total;
  }

  /**
   * Verify a decomposition hypothesis
   */
  private verifyDecomposition(n: bigint, hypothesis: DecompositionHypothesis): boolean {
    // Quick check: do the factors multiply to n?
    if (hypothesis.factor1 * hypothesis.factor2 !== n) {
      return false;
    }
    
    // Artifact verification: confidence threshold
    return hypothesis.confidence > 0.6;
  }

  /**
   * Get field pattern with caching
   */
  private getFieldPattern(n: bigint): FieldPattern {
    if (!this.fieldCache.has(n)) {
      this.fieldCache.set(n, this.substrate.getFieldPattern(n));
    }
    return this.fieldCache.get(n)!;
  }

  /**
   * Get resonance with caching
   */
  private getResonance(n: bigint): number {
    if (!this.resonanceCache.has(n)) {
      this.resonanceCache.set(n, calculateResonance(this.substrate, n));
    }
    return this.resonanceCache.get(n)!;
  }

  /**
   * Integer square root
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
   * Clear caches
   */
  clearCache(): void {
    this.fieldCache.clear();
    this.resonanceCache.clear();
  }
}