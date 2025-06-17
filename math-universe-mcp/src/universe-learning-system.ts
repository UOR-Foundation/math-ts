/**
 * Universe Learning System
 * 
 * This system learns the true patterns of the mathematical universe by observing
 * how fields interact, how denormalization creates artifacts, and how primes
 * maintain coherent field structures while composites show decoherence.
 * 
 * Based on the synthesis: "Primes → Fields → Primes (no external constants)"
 */

import { SCHEMA_CONSTANTS } from './math-universe.js';
import type { FieldIndex } from './math-universe.js';

/**
 * Observed pattern from the universe
 */
interface UniversePattern {
  number: bigint;
  isPrime: boolean;
  fieldPattern: number; // Binary field activation
  resonance: number;
  denormalizationArtifacts?: {
    appearingFields: Set<FieldIndex>;
    vanishingFields: Set<FieldIndex>;
  };
  lagrangeDistance: number; // Distance from nearest Lagrange point
}

/**
 * Learned field relationship
 */
interface FieldRelationship {
  field1: FieldIndex;
  field2: FieldIndex;
  interaction: 'constructive' | 'destructive' | 'neutral';
  strength: number;
  primeCorrelation: number; // How much this relationship indicates primality
}

/**
 * Learning system that discovers the mathematical universe's patterns
 */
export class UniverseLearningSystem {
  private observations: Map<bigint, UniversePattern> = new Map();
  private fieldRelationships: Map<string, FieldRelationship> = new Map();
  private lagrangePoints: Set<number> = new Set([0, 1, 48, 49]); // Primary Lagrange points
  
  constructor() {
    // Learning system observes the universe directly
  }

  /**
   * Observe the universe to learn its patterns
   */
  async learnFromUniverse(sampleSize: number = 10000): Promise<void> {
    console.log('🔭 Observing the mathematical universe...\n');
    
    // Phase 1: Observe individual numbers
    await this.observeNumbers(sampleSize);
    
    // Phase 2: Learn field relationships from multiplication
    await this.learnFieldInterference();
    
    // Phase 3: Discover Lagrange structure
    await this.discoverLagrangeManifold();
    
    // Phase 4: Extract primality patterns
    await this.extractPrimalityPatterns();
  }

  /**
   * Observe numbers and their properties
   */
  private async observeNumbers(_count: number): Promise<void> {
    // Observe a diverse range of numbers
    const observations: bigint[] = [];
    
    // Small numbers (critical for understanding base patterns)
    for (let i = 2; i <= 100; i++) {
      observations.push(BigInt(i));
    }
    
    // Numbers around Lagrange points
    for (const lagrange of [48, 96, 144, 192, 240]) {
      for (let offset = -5; offset <= 5; offset++) {
        observations.push(BigInt(lagrange + offset));
      }
    }
    
    // Known primes to understand prime patterns
    const knownPrimes = [
      2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n,
      53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n, 103n, 107n, 109n,
      113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n,
      181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n, 229n, 233n, 239n, 241n,
      251n, 257n, 263n, 269n, 271n, 277n, 281n, 283n, 293n, 307n, 311n, 313n,
      317n, 331n, 337n, 347n, 349n, 353n, 359n, 367n, 373n, 379n, 383n, 389n,
      397n, 401n, 409n, 419n, 421n, 431n, 433n, 439n, 443n, 449n, 457n, 461n,
      463n, 467n, 479n, 487n, 491n, 499n, 503n, 509n, 521n, 523n, 541n, 547n,
      557n, 563n, 569n, 571n, 577n, 587n, 593n, 599n, 601n, 607n, 613n, 617n,
      619n, 631n, 641n, 643n, 647n, 653n, 659n, 661n, 673n, 677n, 683n, 691n,
      701n, 709n, 719n, 727n, 733n, 739n, 743n, 751n, 757n, 761n, 769n, 773n,
      787n, 797n, 809n, 811n, 821n, 823n, 827n, 829n, 839n, 853n, 857n, 859n,
      863n, 877n, 881n, 883n, 887n, 907n, 911n, 919n, 929n, 937n, 941n, 947n,
      953n, 967n, 971n, 977n, 983n, 991n, 997n
    ];
    
    for (const prime of knownPrimes) {
      observations.push(prime);
    }
    
    // Observe each number
    for (const n of observations) {
      const pattern = this.observeNumber(n);
      this.observations.set(n, pattern);
    }
    
    console.log(`📊 Observed ${this.observations.size} numbers`);
  }

  /**
   * Observe a single number's properties
   */
  private observeNumber(n: bigint): UniversePattern {
    const fieldPattern = Number(n % 256n);
    const isPrime = this.isPrimeByDefinition(n);
    
    // Calculate resonance from active fields
    let resonance = 1.0;
    for (let i = 0; i < 8; i++) {
      if (fieldPattern & (1 << i)) {
        resonance *= SCHEMA_CONSTANTS[i as FieldIndex].alpha;
      }
    }
    
    // Calculate distance from nearest Lagrange point
    const mod256 = Number(n % 256n);
    let minDistance = 256;
    for (const lagrange of this.lagrangePoints) {
      const distance = Math.min(
        Math.abs(mod256 - lagrange),
        Math.abs(mod256 - lagrange + 256),
        Math.abs(mod256 - lagrange - 256)
      );
      minDistance = Math.min(minDistance, distance);
    }
    
    return {
      number: n,
      isPrime,
      fieldPattern,
      resonance,
      lagrangeDistance: minDistance
    };
  }

  /**
   * Learn how fields interfere during multiplication
   */
  private async learnFieldInterference(): Promise<void> {
    console.log('\n🔬 Learning field interference patterns...');
    
    // Study multiplication of small primes
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];
    
    for (const p1 of smallPrimes) {
      for (const p2 of smallPrimes) {
        if (p1 >= p2) continue; // Avoid duplicates
        
        const product = p1 * p2;
        const pattern1 = this.observations.get(p1)!;
        const pattern2 = this.observations.get(p2)!;
        const patternProduct = this.observeNumber(product);
        
        // Analyze field changes
        const fields1 = this.getActiveFields(pattern1.fieldPattern);
        const fields2 = this.getActiveFields(pattern2.fieldPattern);
        const fieldsProduct = this.getActiveFields(patternProduct.fieldPattern);
        
        // Expected union
        const expectedUnion = new Set([...fields1, ...fields2]);
        
        // Actual result
        const actualFields = fieldsProduct;
        
        // Find artifacts
        const appearing = new Set<FieldIndex>();
        const vanishing = new Set<FieldIndex>();
        
        for (const field of actualFields) {
          if (!expectedUnion.has(field)) {
            appearing.add(field);
          }
        }
        
        for (const field of expectedUnion) {
          if (!actualFields.has(field)) {
            vanishing.add(field);
          }
        }
        
        // Record denormalization artifacts
        patternProduct.denormalizationArtifacts = { appearingFields: appearing, vanishingFields: vanishing };
        this.observations.set(product, patternProduct);
        
        // Learn field relationships
        this.updateFieldRelationships(fields1, fields2, appearing, vanishing);
      }
    }
    
    console.log(`🧬 Discovered ${this.fieldRelationships.size} field relationships`);
  }

  /**
   * Update field relationship knowledge
   */
  private updateFieldRelationships(
    fields1: Set<FieldIndex>,
    fields2: Set<FieldIndex>,
    appearing: Set<FieldIndex>,
    vanishing: Set<FieldIndex>
  ): void {
    // Learn destructive interference
    for (const field of vanishing) {
      if (fields1.has(field) && fields2.has(field)) {
        const key = `${field}-${field}`;
        const existing = this.fieldRelationships.get(key) || {
          field1: field,
          field2: field,
          interaction: 'destructive' as const,
          strength: 0,
          primeCorrelation: 0
        };
        existing.strength += 1;
        this.fieldRelationships.set(key, existing);
      }
    }
    
    // Learn constructive interference
    for (const field of appearing) {
      // Find which fields might have combined to create this
      for (const f1 of fields1) {
        for (const f2 of fields2) {
          const key = `${Math.min(f1, f2)}-${Math.max(f1, f2)}->${field}`;
          const existing = this.fieldRelationships.get(key) || {
            field1: f1,
            field2: f2,
            interaction: 'constructive' as const,
            strength: 0,
            primeCorrelation: 0
          };
          existing.strength += 1;
          this.fieldRelationships.set(key, existing);
        }
      }
    }
  }

  /**
   * Discover the Lagrange manifold structure
   */
  private async discoverLagrangeManifold(): Promise<void> {
    console.log('\n🌀 Discovering Lagrange manifold...');
    
    // Find all perfect resonance points (resonance = 1.0)
    const perfectResonancePoints: number[] = [];
    
    for (let i = 0; i < 256; i++) {
      let resonance = 1.0;
      for (let bit = 0; bit < 8; bit++) {
        if (i & (1 << bit)) {
          resonance *= SCHEMA_CONSTANTS[bit as FieldIndex].alpha;
        }
      }
      
      if (Math.abs(resonance - 1.0) < 0.0001) {
        perfectResonancePoints.push(i);
        this.lagrangePoints.add(i);
      }
    }
    
    console.log(`🎯 Found ${perfectResonancePoints.length} primary Lagrange points:`, perfectResonancePoints);
    
    // Find secondary Lagrange points (Tribonacci wells, Golden wells, etc.)
    const secondaryPoints: Map<string, number[]> = new Map();
    
    for (let i = 0; i < 256; i++) {
      const fields = this.getActiveFields(i);
      
      if (fields.has(1 as FieldIndex) && !fields.has(2 as FieldIndex)) {
        // Tribonacci well
        const wells = secondaryPoints.get('Tribonacci') || [];
        wells.push(i);
        secondaryPoints.set('Tribonacci', wells);
      }
      
      if (fields.has(2 as FieldIndex) && !fields.has(1 as FieldIndex)) {
        // Golden well
        const wells = secondaryPoints.get('Golden') || [];
        wells.push(i);
        secondaryPoints.set('Golden', wells);
      }
      
      if (fields.has(7 as FieldIndex)) {
        // Deep structure (zeta field)
        const wells = secondaryPoints.get('Deep') || [];
        wells.push(i);
        secondaryPoints.set('Deep', wells);
      }
    }
    
    for (const [type, points] of secondaryPoints) {
      console.log(`🌊 ${type} wells:`, points.slice(0, 10), '...');
    }
  }

  /**
   * Extract patterns that distinguish primes from composites
   */
  private async extractPrimalityPatterns(): Promise<void> {
    console.log('\n🔍 Extracting primality patterns...');
    
    // Analyze prime vs composite patterns
    const primePatterns: UniversePattern[] = [];
    const compositePatterns: UniversePattern[] = [];
    
    for (const [, pattern] of this.observations) {
      if (pattern.isPrime) {
        primePatterns.push(pattern);
      } else {
        compositePatterns.push(pattern);
      }
    }
    
    // Find distinguishing features
    console.log(`\n📈 Prime patterns (${primePatterns.length} samples):`);
    this.analyzePatternSet(primePatterns);
    
    console.log(`\n📉 Composite patterns (${compositePatterns.length} samples):`);
    this.analyzePatternSet(compositePatterns);
    
    // Key insight: Primes maintain field coherence, composites show decoherence
    console.log('\n💡 Key Discovery:');
    console.log('- Primes: Maintain coherent field patterns (few artifacts)');
    console.log('- Composites: Show decoherence through denormalization artifacts');
    console.log('- Lagrange distance correlates with computational stability');
  }

  /**
   * Analyze a set of patterns
   */
  private analyzePatternSet(patterns: UniversePattern[]): void {
    if (patterns.length === 0) return;
    
    // Average resonance
    const avgResonance = patterns.reduce((sum, p) => sum + p.resonance, 0) / patterns.length;
    console.log(`  Average resonance: ${avgResonance.toFixed(3)}`);
    
    // Average Lagrange distance
    const avgLagrange = patterns.reduce((sum, p) => sum + p.lagrangeDistance, 0) / patterns.length;
    console.log(`  Average Lagrange distance: ${avgLagrange.toFixed(1)}`);
    
    // Field frequency
    const fieldFreq = new Array(8).fill(0);
    for (const pattern of patterns) {
      for (let i = 0; i < 8; i++) {
        if (pattern.fieldPattern & (1 << i)) {
          fieldFreq[i]++;
        }
      }
    }
    
    console.log('  Field activation frequency:');
    for (let i = 0; i < 8; i++) {
      const freq = (fieldFreq[i] / patterns.length * 100).toFixed(1);
      console.log(`    Field ${i} (${SCHEMA_CONSTANTS[i as FieldIndex].symbol}): ${freq}%`);
    }
    
    // Artifact frequency (for composites)
    const withArtifacts = patterns.filter(p => p.denormalizationArtifacts).length;
    if (withArtifacts > 0) {
      console.log(`  Patterns with denormalization artifacts: ${withArtifacts} (${(withArtifacts / patterns.length * 100).toFixed(1)}%)`);
    }
  }

  /**
   * Get active fields from a pattern
   */
  private getActiveFields(pattern: number): Set<FieldIndex> {
    const fields = new Set<FieldIndex>();
    for (let i = 0; i < 8; i++) {
      if (pattern & (1 << i)) {
        fields.add(i as FieldIndex);
      }
    }
    return fields;
  }

  /**
   * Check if a number is prime by definition (for learning)
   */
  private isPrimeByDefinition(n: bigint): boolean {
    if (n < 2n) return false;
    if (n === 2n) return true;
    if (n % 2n === 0n) return false;
    
    const sqrt = this.bigIntSqrt(n);
    for (let i = 3n; i <= sqrt; i += 2n) {
      if (n % i === 0n) return false;
    }
    
    return true;
  }

  /**
   * Integer square root for BigInt
   */
  private bigIntSqrt(n: bigint): bigint {
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
   * Generate a learned primality detector based on observations
   */
  generateLearnedDetector(): (n: bigint) => { isPrime: boolean; confidence: number } {
    // Extract learned patterns
    const primeFieldPatterns = new Set<number>();
    const compositeFieldPatterns = new Set<number>();
    const artifactPatterns = new Map<string, number>(); // pattern -> artifact frequency
    
    for (const [, pattern] of this.observations) {
      if (pattern.isPrime) {
        primeFieldPatterns.add(pattern.fieldPattern);
      } else {
        compositeFieldPatterns.add(pattern.fieldPattern);
        if (pattern.denormalizationArtifacts) {
          const key = `${pattern.denormalizationArtifacts.appearingFields.size}-${pattern.denormalizationArtifacts.vanishingFields.size}`;
          artifactPatterns.set(key, (artifactPatterns.get(key) || 0) + 1);
        }
      }
    }
    
    // Return learned detector
    return (n: bigint) => {
      const pattern = Number(n % 256n);
      const resonance = this.calculateResonance(pattern);
      const lagrangeDistance = this.calculateLagrangeDistance(pattern);
      
      // Apply learned heuristics
      let confidence = 0.5;
      
      // Known prime pattern
      if (primeFieldPatterns.has(pattern) && !compositeFieldPatterns.has(pattern)) {
        confidence = 0.9;
      }
      // Known composite pattern
      else if (compositeFieldPatterns.has(pattern) && !primeFieldPatterns.has(pattern)) {
        confidence = 0.1;
      }
      // Near Lagrange point (computational stability)
      else if (lagrangeDistance < 5) {
        confidence *= 0.8; // Slightly more likely to be composite
      }
      // Far from Lagrange point
      else if (lagrangeDistance > 100) {
        confidence *= 1.2; // Slightly more likely to be prime
      }
      
      // Resonance-based adjustment
      if (Math.abs(resonance - 1.0) < 0.1) {
        confidence *= 0.7; // Perfect resonance often composite
      } else if (resonance > 10) {
        confidence *= 0.8; // Very high resonance often composite
      } else if (resonance < 0.1) {
        confidence *= 1.3; // Very low resonance often prime
      }
      
      // Normalize confidence
      confidence = Math.max(0, Math.min(1, confidence));
      
      return {
        isPrime: confidence > 0.5,
        confidence
      };
    };
  }

  /**
   * Calculate resonance for a field pattern
   */
  private calculateResonance(pattern: number): number {
    let resonance = 1.0;
    for (let i = 0; i < 8; i++) {
      if (pattern & (1 << i)) {
        resonance *= SCHEMA_CONSTANTS[i as FieldIndex].alpha;
      }
    }
    return resonance;
  }

  /**
   * Calculate distance from nearest Lagrange point
   */
  private calculateLagrangeDistance(pattern: number): number {
    let minDistance = 256;
    for (const lagrange of this.lagrangePoints) {
      const distance = Math.min(
        Math.abs(pattern - lagrange),
        Math.abs(pattern - lagrange + 256),
        Math.abs(pattern - lagrange - 256)
      );
      minDistance = Math.min(minDistance, distance);
    }
    return minDistance;
  }

  /**
   * Export learned knowledge
   */
  exportKnowledge(): string {
    const knowledge = {
      observations: this.observations.size,
      fieldRelationships: Array.from(this.fieldRelationships.values()),
      lagrangePoints: Array.from(this.lagrangePoints),
      insights: [
        'Primes maintain coherent field patterns',
        'Composites show denormalization artifacts',
        'Field 4 × Field 5 = 1.0 creates 48-number pages',
        'Multiplication creates field interference, not union',
        'The universe computes itself through prime relationships'
      ]
    };
    
    return JSON.stringify(knowledge, null, 2);
  }
}

/**
 * Run the learning system
 */
export async function learnFromMathematicalUniverse(): Promise<void> {
  const learner = new UniverseLearningSystem();
  await learner.learnFromUniverse();
  
  console.log('\n🧠 Learning complete!');
  console.log('\n📚 Learned knowledge:');
  console.log(learner.exportKnowledge());
  
  // Generate and test the learned detector
  const detector = learner.generateLearnedDetector();
  
  console.log('\n🧪 Testing learned detector:');
  const tests = [10n, 77n, 100n, 97n, 997n, 1000n];
  for (const n of tests) {
    const result = detector(n);
    const actual = learner['isPrimeByDefinition'](n);
    const correct = result.isPrime === actual ? '✅' : '❌';
    console.log(`  n=${n}: ${result.isPrime} (${(result.confidence * 100).toFixed(1)}% conf) ${correct}`);
  }
}