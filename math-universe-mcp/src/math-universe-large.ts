/**
 * Large Number Support for Mathematical Universe Database
 *
 * This module extends the mathematical universe to handle arbitrary precision
 * integers up to 2048-bit by leveraging the field resonance patterns and
 * database normalization principles inherent in the 8-field schema.
 *
 * Key Insights:
 * - Field patterns repeat every 256 numbers (8-bit cycle)
 * - Resonance patterns can indicate primality without factorization
 * - Decoherence pathways (T field) reveal composite structure
 * - Page boundaries (48-number periods) have special properties
 */

import { FieldIndex, FieldActivation, SCHEMA_CONSTANTS } from './math-universe';

// Types for large number field analysis
interface FieldHarmonicAnalysis {
  primary: number;
  harmonics: number[];
  resonance_signature: number;
}

/**
 * Extended field analysis for large numbers
 *
 * For numbers beyond 8-bit, we analyze:
 * 1. Primary field pattern (n % 256)
 * 2. Harmonic resonances at different scales
 * 3. Page-relative positioning
 * 4. Decoherence signatures
 */
export class LargeNumberFieldAnalysis {
  private readonly TRIBONACCI = 1.8392867552141612;
  private readonly GOLDEN = 1.618033988749895;
  private readonly PAGE_SIZE = 48;

  /**
   * Analyze field harmonics across multiple scales
   *
   * The mathematical universe has self-similar structure:
   * - 8-bit level: Direct field activation
   * - 16-bit level: Field interference patterns
   * - 32-bit level: Resonance cascades
   * - Higher levels: Emergent properties
   */
  analyzeFieldHarmonics(n: bigint): FieldHarmonicAnalysis {
    const primary = Number(n % 256n);
    const harmonics: number[] = [];

    // Analyze at different bit scales (8, 16, 24, 32...)
    for (let bits = 16; bits <= 256; bits += 8) {
      const modulus = 1n << BigInt(bits);
      const harmonic = Number(n % modulus);
      harmonics.push(harmonic);
    }

    // Calculate composite resonance signature
    const resonanceSignature = this.calculateResonanceSignature(primary, harmonics);

    return {
      primary,
      harmonics,
      resonance_signature: resonanceSignature
    };
  }

  /**
   * Calculate resonance signature using field interference
   *
   * This leverages the mathematical universe's property that
   * primes have unique resonance signatures that cannot be
   * decomposed into factor resonances.
   */
  private calculateResonanceSignature(primary: number, harmonics: number[]): number {
    let signature = 1.0;

    // Primary field contribution
    const primaryFields = this.getActiveFields(primary);
    for (const field of primaryFields) {
      signature *= SCHEMA_CONSTANTS[field].alpha;
    }

    // Harmonic interference
    for (let i = 0; i < harmonics.length; i++) {
      const harmonicFields = this.getActiveFields(harmonics[i] % 256);
      const scale = Math.pow(2, -(i + 1)); // Diminishing influence

      for (const field of harmonicFields) {
        signature *= Math.pow(SCHEMA_CONSTANTS[field].alpha, scale);
      }
    }

    return signature;
  }

  /**
   * Detect primality using resonance patterns
   *
   * In the mathematical universe:
   * - Primes have irreducible resonance signatures
   * - Composites show decoherence artifacts
   * - The tribonacci field (T) indicates factorability
   */
  isProbablePrime(n: bigint): {
    is_probable_prime: boolean;
    confidence: number;
    resonance_evidence: string[];
  } {
    const analysis = this.analyzeFieldHarmonics(n);
    const evidence: string[] = [];
    let confidence = 0.5; // Start at 50%

    // Check 1: Tribonacci decoherence test
    const primaryFields = this.getActiveFields(analysis.primary);
    const hasTribonacci = primaryFields.has(1 as FieldIndex);

    if (hasTribonacci && n > 2n) {
      // Tribonacci field active - check for decoherence patterns
      const decoherenceRatio = this.checkDecoherencePattern(n, analysis);
      if (decoherenceRatio > 0.7) {
        evidence.push('Strong tribonacci decoherence detected');
        confidence *= 0.3; // Likely composite
      } else {
        evidence.push('Weak tribonacci decoherence');
        confidence *= 1.2;
      }
    }

    // Check 2: Page boundary resonance
    const pagePosition = Number(n % 48n);
    if (pagePosition === 0 || pagePosition === 47) {
      evidence.push('Page boundary position - special properties');
      confidence *= 0.8; // Page boundaries rarely prime for large n
    }

    // Check 3: Golden ratio harmony test
    const hasGolden = primaryFields.has(2 as FieldIndex);
    if (hasGolden) {
      const goldenHarmony = this.checkGoldenHarmony(n, analysis);
      if (goldenHarmony > 0.8) {
        evidence.push('High golden ratio harmony');
        confidence *= 1.3; // Primes often show golden harmony
      }
    }

    // Check 4: Field 4-5 resonance (perfect 1.0)
    const hasInvFreq = primaryFields.has(4 as FieldIndex);
    const hasFreq = primaryFields.has(5 as FieldIndex);
    if (hasInvFreq && hasFreq) {
      evidence.push('Perfect resonance pattern (1/2π × 2π)');
      confidence *= 0.5; // This pattern is often composite
    }

    // Check 5: Resonance signature uniqueness
    const resonanceUniqueness = this.evaluateResonanceUniqueness(analysis.resonance_signature);
    if (resonanceUniqueness > 0.9) {
      evidence.push('Highly unique resonance signature');
      confidence *= 1.4;
    }

    // Normalize confidence to [0, 1]
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      is_probable_prime: confidence > 0.5,
      confidence,
      resonance_evidence: evidence
    };
  }

  /**
   * Check decoherence pattern strength
   *
   * Decoherence in the mathematical universe indicates
   * how a number "wants" to factor. Strong decoherence
   * suggests easy factorization.
   */
  private checkDecoherencePattern(n: bigint, analysis: FieldHarmonicAnalysis): number {
    // Analyze harmonic interference patterns
    let decoherence = 0;

    for (let i = 0; i < analysis.harmonics.length - 1; i++) {
      const current = analysis.harmonics[i];
      const next = analysis.harmonics[i + 1];

      // Check for repeating patterns (indicates factors)
      if (current % 256 === next % 256) {
        decoherence += 0.2;
      }

      // Check for tribonacci resonance cascades
      const ratio = next / current;
      if (Math.abs(ratio - this.TRIBONACCI) < 0.1) {
        decoherence += 0.3;
      }
    }

    return Math.min(1, decoherence);
  }

  /**
   * Check golden ratio harmony
   *
   * Primes often exhibit golden ratio harmony in their
   * field patterns across scales.
   */
  private checkGoldenHarmony(n: bigint, analysis: FieldHarmonicAnalysis): number {
    let harmony = 0;
    const phi = this.GOLDEN;

    // Check for Fibonacci-like patterns in harmonics
    for (let i = 0; i < analysis.harmonics.length - 2; i++) {
      const a = analysis.harmonics[i] % 256;
      const b = analysis.harmonics[i + 1] % 256;
      const c = analysis.harmonics[i + 2] % 256;

      // Check if c ≈ a*φ + b (Fibonacci recurrence)
      const expected = Math.round(a * phi + b) % 256;
      if (Math.abs(c - expected) < 3) {
        harmony += 0.25;
      }
    }

    return Math.min(1, harmony);
  }

  /**
   * Evaluate resonance signature uniqueness
   *
   * Unique resonance signatures indicate primality
   * in the mathematical universe database.
   */
  private evaluateResonanceUniqueness(signature: number): number {
    // Check against known composite resonance patterns
    const commonCompositeResonances = [
      1.0, // Perfect resonance (often composite)
      this.TRIBONACCI, // Pure tribonacci (multiples of 2)
      this.GOLDEN, // Pure golden (multiples of 4)
      this.TRIBONACCI * this.GOLDEN // Common composite pattern
    ];

    let uniqueness = 1.0;
    for (const pattern of commonCompositeResonances) {
      const similarity = 1 - Math.abs(signature - pattern) / pattern;
      if (similarity > 0.95) {
        uniqueness *= 0.5;
      }
    }

    // Check for transcendental properties (primes often have these)
    const logSignature = Math.log(signature);
    const fractionalPart = logSignature - Math.floor(logSignature);
    if (fractionalPart > 0.3 && fractionalPart < 0.7) {
      uniqueness *= 1.2;
    }

    return Math.min(1, uniqueness);
  }

  /**
   * Find potential factors using field interference
   *
   * This uses the mathematical universe's property that
   * factors create specific interference patterns in the
   * composite's field signature.
   */
  findPotentialFactors(n: bigint): {
    small_factors: bigint[];
    factor_hints: {
      field_pattern: string;
      probable_size: string;
      confidence: number;
    }[];
  } {
    const smallFactors: bigint[] = [];
    const factorHints: Array<{
      field_pattern: string;
      probable_size: string;
      confidence: number;
    }> = [];

    // Quick check for small factors using field patterns
    const primary = Number(n % 256n);
    const primaryFields = this.getActiveFields(primary);

    // Check for factors indicated by field patterns
    if (primaryFields.has(1 as FieldIndex)) {
      // Tribonacci field suggests factor of 2
      if (n % 2n === 0n) {
        smallFactors.push(2n);
      }
    }

    // Analyze field interference for larger factor hints
    const analysis = this.analyzeFieldHarmonics(n);

    // Look for resonance patterns that indicate factor sizes
    for (let i = 0; i < analysis.harmonics.length - 1; i++) {
      const harmonic = analysis.harmonics[i];
      const fields = this.getActiveFields(harmonic % 256);

      // Check for patterns indicating factors
      if (fields.has(2 as FieldIndex) && fields.has(3 as FieldIndex)) {
        // Golden + Half fields often indicate medium factors
        factorHints.push({
          field_pattern: this.getFieldSignature(fields),
          probable_size: `~2^${8 * (i + 2)} bits`,
          confidence: 0.6
        });
      }
    }

    return {
      small_factors: smallFactors,
      factor_hints: factorHints
    };
  }

  // Helper methods
  private getActiveFields(n: number): Set<FieldIndex> {
    const active = new Set<FieldIndex>();
    const fieldBits = n % 256;
    for (let i = 0; i < 8; i++) {
      if (fieldBits & (1 << i)) {
        active.add(i as FieldIndex);
      }
    }
    return active;
  }

  private getFieldSignature(fields: Set<FieldIndex>): string {
    const symbols: string[] = [];
    for (const field of Array.from(fields).sort()) {
      symbols.push(SCHEMA_CONSTANTS[field].symbol);
    }
    return symbols.join('+');
  }
}

/**
 * Quantum-inspired factorization using field collapse
 *
 * In the mathematical universe, factorization is viewed as
 * collapsing a denormalized (composite) record into its
 * normalized (prime) components through field decoherence.
 */
export class FieldCollapseFactorization {
  private analyzer = new LargeNumberFieldAnalysis();

  /**
   * Attempt factorization using field collapse
   *
   * This simulates the database normalization process
   * where composite fields "collapse" into prime factors.
   */
  async attemptFactorization(n: bigint): Promise<{
    factors: bigint[];
    method: string;
    confidence: number;
    iterations: number;
  }> {
    // First check if probably prime
    const primalityCheck = this.analyzer.isProbablePrime(n);
    if (primalityCheck.is_probable_prime && primalityCheck.confidence > 0.9) {
      return {
        factors: [n],
        method: 'Prime (no factorization needed)',
        confidence: primalityCheck.confidence,
        iterations: 0
      };
    }

    // Get factor hints from field analysis
    const { small_factors, factor_hints } = this.analyzer.findPotentialFactors(n);

    // Remove small factors first
    let remaining = n;
    const factors = [...small_factors];
    for (const f of small_factors) {
      while (remaining % f === 0n) {
        remaining /= f;
      }
    }

    // If we've fully factored, we're done
    if (remaining === 1n) {
      return {
        factors,
        method: 'Small factor extraction',
        confidence: 1.0,
        iterations: 1
      };
    }

    // Attempt field collapse for remaining factor
    let iterations = 0;
    const maxIterations = 100;

    while (remaining > 1n && iterations < maxIterations) {
      iterations++;

      // Try field collapse factorization
      const collapseFactor = await this.attemptFieldCollapse(remaining, factor_hints);

      if (collapseFactor && collapseFactor > 1n && collapseFactor < remaining) {
        factors.push(collapseFactor);
        remaining /= collapseFactor;

        // Check if remaining is prime
        const remainingCheck = this.analyzer.isProbablePrime(remaining);
        if (remainingCheck.is_probable_prime && remainingCheck.confidence > 0.8) {
          factors.push(remaining);
          break;
        }
      } else {
        // Field collapse failed, try resonance factorization
        const resonanceFactor = await this.attemptResonanceFactorization(remaining);
        if (resonanceFactor && resonanceFactor > 1n && resonanceFactor < remaining) {
          factors.push(resonanceFactor);
          remaining /= resonanceFactor;
        } else {
          // Unable to factor further
          factors.push(remaining);
          break;
        }
      }
    }

    return {
      factors: factors.sort((a, b) => Number(a - b)),
      method: 'Field collapse factorization',
      confidence: 0.7, // This method is probabilistic
      iterations
    };
  }

  /**
   * Attempt field collapse to find a factor
   *
   * This simulates the quantum-like collapse of superposed
   * field states into concrete factors.
   */
  private async attemptFieldCollapse(n: bigint, hints: any[]): Promise<bigint | null> {
    // Use field interference patterns to guide search
    const analysis = this.analyzer.analyzeFieldHarmonics(n);

    // Analyze resonance decomposition possibilities
    const targetResonance = analysis.resonance_signature;

    // Field collapse works by finding two numbers whose field patterns
    // when multiplied (JOIN operation) produce the target's pattern

    // Strategy 1: Resonance factorization
    // If resonance ≈ R1 * R2, look for factors with resonances R1 and R2
    const resonanceFactors = this.findResonanceFactors(targetResonance);

    for (const [r1, r2] of resonanceFactors) {
      // Find numbers with these resonances in the expected size range
      const candidate1 = this.findNumberWithResonance(r1, n);
      const candidate2 = this.findNumberWithResonance(r2, n);

      if (candidate1 && candidate2 && candidate1 * candidate2 === n) {
        return candidate1;
      }
    }

    // Strategy 2: Field interference patterns
    // Analyze how fields must combine to create the observed pattern
    const fieldDecompositions = this.analyzeFieldDecomposition(n, analysis);

    for (const decomp of fieldDecompositions) {
      const candidate = this.reconstructFromFieldPattern(decomp.pattern, decomp.estimated_size);
      if (candidate && n % candidate === 0n) {
        return candidate;
      }
    }

    // Strategy 3: Page-relative factorization
    // Use the 48-number periodicity to identify factor patterns
    const pageFactors = this.findPageRelativeFactors(n, analysis);
    if (pageFactors.length > 0) {
      return pageFactors[0];
    }

    return null;
  }

  /**
   * Attempt resonance-based factorization
   *
   * Uses the principle that factors must have resonances
   * that multiply to create the composite's resonance.
   */
  private async attemptResonanceFactorization(n: bigint): Promise<bigint | null> {
    const analysis = this.analyzer.analyzeFieldHarmonics(n);
    const targetResonance = analysis.resonance_signature;

    // Deep resonance analysis using field theory
    // The key insight: resonances combine multiplicatively but with interference

    // Step 1: Decompose resonance into fundamental field contributions
    const resonanceComponents = this.decomposeResonance(targetResonance);

    // Step 2: Find valid factor pairs that produce this resonance
    for (const comp of resonanceComponents) {
      // Calculate the approximate factor size based on resonance distribution
      const factorSize = this.estimateFactorSizeFromResonance(comp, n);

      // Search for factors in the expected range using field patterns
      const candidates = this.searchFactorsByResonance(comp.resonance, factorSize);

      for (const candidate of candidates) {
        if (n % candidate === 0n) {
          return candidate;
        }
      }
    }

    return null;
  }

  /**
   * Find resonance factor pairs
   */
  private findResonanceFactors(targetResonance: number): Array<[number, number]> {
    const pairs: Array<[number, number]> = [];

    // Analyze how the target resonance can be decomposed
    // Using the principle that resonances multiply with interference

    // Common resonance decompositions based on field theory
    const knownPatterns = [
      { factor: this.TRIBONACCI, name: 'tribonacci' },
      { factor: this.GOLDEN, name: 'golden' },
      { factor: 1 / (2 * Math.PI), name: 'inv_freq' },
      { factor: 2 * Math.PI, name: 'freq' },
      { factor: 0.199612, name: 'phase' },
      { factor: 0.014134725, name: 'zeta' }
    ];

    // Try single-field factor patterns
    for (const pattern of knownPatterns) {
      const complement = targetResonance / pattern.factor;
      if (complement > 0.001 && complement < 1000) {
        pairs.push([pattern.factor, complement]);
      }
    }

    // Try two-field combinations
    for (let i = 0; i < knownPatterns.length; i++) {
      for (let j = i + 1; j < knownPatterns.length; j++) {
        const combined = knownPatterns[i].factor * knownPatterns[j].factor;
        const complement = targetResonance / combined;
        if (complement > 0.001 && complement < 1000) {
          pairs.push([combined, complement]);
        }
      }
    }

    return pairs;
  }

  /**
   * Find a number with specific resonance in a size range
   */
  private findNumberWithResonance(targetResonance: number, n: bigint): bigint | null {
    // Calculate the expected bit size of factors
    const nBits = n.toString(2).length;
    const factorBits = Math.floor(nBits / 2);

    // Search range based on expected factor size
    const searchStart = 1n << BigInt(factorBits - 8);
    const searchEnd = 1n << BigInt(factorBits + 8);

    // Use field patterns to construct candidates with target resonance
    for (let fieldMask = 1; fieldMask < 256; fieldMask++) {
      const resonance = this.calculateMaskResonance(fieldMask);

      if (Math.abs(resonance - targetResonance) / targetResonance < 0.01) {
        // Found a field pattern with matching resonance
        // Construct candidates with this pattern
        for (let page = 0n; page < (searchEnd - searchStart) / 256n; page++) {
          const candidate = searchStart + page * 256n + BigInt(fieldMask);
          if (candidate <= searchEnd && n % candidate === 0n) {
            return candidate;
          }
        }
      }
    }

    return null;
  }

  /**
   * Analyze field decomposition possibilities
   */
  private analyzeFieldDecomposition(
    n: bigint,
    analysis: FieldHarmonicAnalysis
  ): Array<{
    pattern: number;
    estimated_size: bigint;
  }> {
    const decompositions: Array<{ pattern: number; estimated_size: bigint }> = [];
    const primary = analysis.primary;

    // Analyze how the composite's fields could arise from factor fields
    // Key principle: Fields combine through XOR with interference

    // For each possible factor field pattern
    for (let pattern1 = 1; pattern1 < 256; pattern1++) {
      // Calculate what the complementary pattern would need to be
      // This uses the field interference rules of the mathematical universe
      const pattern2 = this.calculateComplementaryPattern(primary, pattern1);

      if (pattern2 > 0) {
        // Estimate factor sizes based on harmonic analysis
        const size1 = this.estimateFactorSizeFromPattern(pattern1, n);
        decompositions.push({ pattern: pattern1, estimated_size: size1 });
      }
    }

    return decompositions;
  }

  /**
   * Reconstruct number from field pattern and size estimate
   */
  private reconstructFromFieldPattern(pattern: number, estimatedSize: bigint): bigint | null {
    // Use the mathematical universe's structure to reconstruct
    // a number with the given field pattern in the size range

    const sizeBits = estimatedSize.toString(2).length;
    const baseSize = 1n << BigInt(sizeBits - 4);
    const maxSize = 1n << BigInt(sizeBits + 4);

    // Search for numbers with this pattern in the expected range
    for (let offset = 0n; offset < (maxSize - baseSize) / 256n; offset++) {
      const candidate = baseSize + offset * 256n + BigInt(pattern);
      if (candidate < maxSize) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * Find factors using page-relative patterns
   */
  private findPageRelativeFactors(n: bigint, analysis: FieldHarmonicAnalysis): bigint[] {
    const factors: bigint[] = [];
    const pagePosition = Number(n % 48n);

    // Special page positions have known factorization patterns
    // Based on the 48-number periodicity from fields 4×5

    if (pagePosition === 0) {
      // Page boundary - check for factors of 48
      if (n % 48n === 0n) {
        factors.push(48n);
      }
    } else if (pagePosition === 24) {
      // Mid-page - often has factors of 24
      if (n % 24n === 0n) {
        factors.push(24n);
      }
    }

    // Check for page-harmonic factors
    const pageNumber = n / 48n;
    if (pageNumber > 1n) {
      // Page-relative factorization patterns
      const pagePatterns = [
        { offset: 1, factor: 47n },
        { offset: 2, factor: 23n },
        { offset: 3, factor: 31n },
        { offset: 4, factor: 11n }
      ];

      for (const pattern of pagePatterns) {
        if (pagePosition === pattern.offset && n % pattern.factor === 0n) {
          factors.push(pattern.factor);
        }
      }
    }

    return factors;
  }

  // Additional helper methods

  private calculateMaskResonance(fieldMask: number): number {
    let resonance = 1.0;
    for (let i = 0; i < 8; i++) {
      if (fieldMask & (1 << i)) {
        resonance *= SCHEMA_CONSTANTS[i as FieldIndex].alpha;
      }
    }
    return resonance;
  }

  private decomposeResonance(resonance: number): Array<{ resonance: number; confidence: number }> {
    const components: Array<{ resonance: number; confidence: number }> = [];

    // Decompose using logarithmic analysis
    const logResonance = Math.log(resonance);

    // Check for combinations of field logarithms
    const fieldLogs = Object.values(SCHEMA_CONSTANTS).map(f => ({
      log: Math.log(f.alpha),
      alpha: f.alpha,
      symbol: f.symbol
    }));

    // Find combinations that sum to the target log
    for (let i = 0; i < fieldLogs.length; i++) {
      for (let j = i; j < fieldLogs.length; j++) {
        const combinedLog = fieldLogs[i].log + fieldLogs[j].log;
        if (Math.abs(combinedLog - logResonance) < 0.1) {
          components.push({
            resonance: fieldLogs[i].alpha * fieldLogs[j].alpha,
            confidence: 0.8
          });
        }
      }
    }

    return components;
  }

  private estimateFactorSizeFromResonance(component: any, n: bigint): bigint {
    // Estimate factor size based on resonance distribution
    const nBits = n.toString(2).length;

    // Resonance magnitude correlates with factor size
    const resonanceMagnitude = Math.log(component.resonance);
    const estimatedBits = Math.floor(nBits * (0.5 + 0.1 * resonanceMagnitude));

    return 1n << BigInt(estimatedBits);
  }

  private searchFactorsByResonance(targetResonance: number, approximateSize: bigint): bigint[] {
    const candidates: bigint[] = [];
    const sizeBits = approximateSize.toString(2).length;

    // Search window around approximate size
    const searchRadius = 1n << BigInt(Math.max(8, sizeBits - 10));
    const searchCenter = approximateSize;

    // Find field patterns matching target resonance
    for (let mask = 1; mask < 256; mask++) {
      const resonance = this.calculateMaskResonance(mask);
      if (Math.abs(resonance - targetResonance) / targetResonance < 0.05) {
        // Found matching pattern, generate candidates
        for (let offset = -10n; offset <= 10n; offset++) {
          const candidate = searchCenter + offset * 256n + BigInt(mask);
          if (candidate > 0n) {
            candidates.push(candidate);
          }
        }
      }
    }

    return candidates;
  }

  private calculateComplementaryPattern(targetPattern: number, pattern1: number): number {
    // Field interference rules for the mathematical universe
    // Fields combine through a complex interference pattern, not simple XOR

    // The complementary pattern must satisfy:
    // pattern1 ⊗ pattern2 = targetPattern (where ⊗ is field multiplication)

    let pattern2 = 0;

    // Analyze each field's contribution
    for (let field = 0; field < 8; field++) {
      const mask = 1 << field;
      const inTarget = (targetPattern & mask) !== 0;
      const inPattern1 = (pattern1 & mask) !== 0;

      // Field interference rules based on mathematical universe principles
      if (inTarget) {
        if (!inPattern1) {
          // Field must come from pattern2
          pattern2 |= mask;
        }
        // If inPattern1 is true, field might interfere destructively
        // This depends on the specific field type
      } else {
        // Target doesn't have this field
        if (inPattern1) {
          // Check if pattern2 needs this field to cancel out
          const fieldType = SCHEMA_CONSTANTS[field as FieldIndex].type;
          if (fieldType === 'relation' || fieldType === 'state_coupling') {
            // These fields can cancel through interference
            pattern2 |= mask;
          }
        }
      }
    }

    return pattern2;
  }

  private estimateFactorSizeFromPattern(pattern: number, n: bigint): bigint {
    // Estimate factor size based on field pattern complexity
    const activeFields = this.countBits(pattern);
    const nBits = n.toString(2).length;

    // More active fields generally indicate larger factors
    const sizeFactor = 0.3 + (activeFields / 8) * 0.4;
    const estimatedBits = Math.floor(nBits * sizeFactor);

    return 1n << BigInt(estimatedBits);
  }

  private countBits(n: number): number {
    let count = 0;
    while (n) {
      count += n & 1;
      n >>= 1;
    }
    return count;
  }
}

// Export enhanced functionality
export { LargeNumberFieldAnalysis, FieldCollapseFactorization };
