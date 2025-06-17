/**
 * Mathematical Universe Database - TypeScript Implementation
 *
 * Core Theory: Mathematics IS a relational database with an 8-field schema where:
 * - Every integer is a database record
 * - Primes are normalized records (third normal form - no redundancy)
 * - Composites are denormalized records (contain redundant field information)
 * - Factorization is the database normalization process
 * - Arithmetic operations are database operations (JOIN, MERGE, etc.)
 *
 * The 8 fields represent fundamental mathematical constants that, when combined,
 * generate all mathematical structures through their activation patterns.
 *
 * KEY INSIGHT: Denormalization Artifacts
 * When we multiply primes (JOIN operation), the resulting composite doesn't simply
 * inherit the union of factor fields. Instead:
 * - Some fields appear from nowhere (artifacts)
 * - Some fields disappear (redundancy elimination)
 * - Special resonances emerge (like 48 = 1.0 exactly)
 *
 * Example: 77 = 7 × 11
 * - 7 has fields {I, T, φ}
 * - 11 has fields {I, T, ½}
 * - Expected union: {I, T, φ, ½}
 * - Actual 77: {I, φ, ½, θ} - Field T disappeared, field θ appeared!
 *
 * This proves that multiplication is not simple set union but involves
 * complex field interference patterns, exactly like denormalization in databases.
 */

// Note: We use dynamic imports for large number support to avoid circular dependencies
// Type imports are used here for type checking only

// Type definitions based on the schema
// Each number activates a subset of these 8 fields based on its binary representation
type FieldIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Each field has a specific type that describes its role in the mathematical structure
// These types emerge from the synthesis of NTT, UOR, and COC theories
type FieldType =
  | 'primary_key' // Field 0: Universal reference/identity
  | 'relation' // Field 1: Decoherence/relationship formation
  | 'recursive' // Field 2: Self-referential growth (golden ratio)
  | 'binary_left' // Field 3: Binary division/branching
  | 'inverse_transform' // Field 4: Inverse frequency (1/2π)
  | 'forward_transform' // Field 5: Forward frequency (2π)
  | 'state_coupling' // Field 6: Phase relationships
  | 'deep_pointer'; // Field 7: Deep structure (Riemann zeta connection)

// Represents a single field in the 8-field schema
// Each field can be active or inactive for a given number
interface Field {
  active: boolean; // Whether this field contributes to the number's structure
  alpha: number; // The field's constant value (resonance contribution)
  symbol: string; // Mathematical symbol representation
  type: FieldType; // The field's role in the schema
}

// Complete definition of a field including metadata
interface FieldDefinition {
  index: FieldIndex; // Position in the 8-field schema (0-7)
  primitive: number; // Power of 2 value (1, 2, 4, 8, 16, 32, 64, 128)
  alpha: number; // The mathematical constant this field represents
  name: string; // Human-readable field name
  type: FieldType; // Functional type of the field
  symbol: string; // Mathematical notation symbol
  description: string; // Explanation of the field's purpose
}

// The complete field activation pattern for a number
// This is like a database record's column values
interface FieldActivation {
  identity: Field; // Field 0: Always preserves structure
  tribonacci: Field; // Field 1: Creates composite relationships
  golden: Field; // Field 2: Recursive/growth patterns
  half: Field; // Field 3: Division/binary operations
  inv_freq: Field; // Field 4: Inverse frequency space
  freq: Field; // Field 5: Forward frequency space
  phase: Field; // Field 6: Phase relationships
  zeta: Field; // Field 7: Deep mathematical structure
}

// Properties computed from a number's field activation pattern
interface ComputedProperties {
  resonance: number; // Product of all active field alphas - key metric
  page: number; // Which 48-number page this number belongs to
  offset: number; // Position within the page (0-47)
  depth: number; // Hierarchical depth in the mathematical structure
  field_signature: string; // Human-readable string of active fields (e.g., "I+T+φ")
}

// Database integrity status - determines if a record is normalized
interface IntegrityStatus {
  is_primitive: boolean; // True if only one field is active (powers of 2)
  is_normalized: boolean; // True if prime (well-formed, no redundancy)
  normalization_depth: number; // Number of prime factors (0 for primes)
  circular_references?: Array<{
    // Decoherence pathways that lead to this number
    source: number;
    path_type: string;
  }>;
  integrity_violations?: string[]; // List of any constraint violations
}

// Relationships to other numbers in the database
interface Relationships {
  factors?: number[]; // Prime factorization (normalization) if composite
  multiples?: number[]; // First few multiples of this number
  neighbors?: {
    // Adjacent numbers in the sequence
    previous?: number;
    next?: number;
  };
}

// Complete representation of a number in the mathematical universe
// This is equivalent to a full database record with all fields and metadata
interface MathematicalNumber {
  value: number; // The integer value (primary key)
  fields: FieldActivation; // Which of the 8 fields are active
  computed: ComputedProperties; // Derived properties
  integrity: IntegrityStatus; // Normalization status
  relationships?: Relationships; // Connections to other records
}

// The 8-field schema constants - these are the fundamental building blocks
// Each constant was discovered through the synthesis of three theories:
// - NTT (Number Tree Theory): Modular arithmetic patterns
// - UOR (Universal Operating Rhythm): Prime emergence at 1.839...
// - COC (Cosmic Oscillation Conjecture): Universal resonance patterns
const SCHEMA_CONSTANTS: Record<FieldIndex, FieldDefinition> = {
  0: {
    index: 0,
    primitive: 1, // Binary: 00000001
    alpha: 1.0, // Unity - the multiplicative identity
    name: 'identity',
    type: 'primary_key',
    symbol: 'I',
    description: 'Universal identity/reference field - always preserves structure'
  },
  1: {
    index: 1,
    primitive: 2, // Binary: 00000010
    alpha: 1.8392867552141612, // Tribonacci constant - critical for decoherence
    name: 'tribonacci',
    type: 'relation',
    symbol: 'T',
    description: 'Decoherence/relationship field - creates composite structures'
  },
  2: {
    index: 2,
    primitive: 4, // Binary: 00000100
    alpha: 1.618033988749895, // Golden ratio φ - self-referential growth
    name: 'golden',
    type: 'recursive',
    symbol: 'φ',
    description: 'Growth/self-reference field - appears in Fibonacci patterns'
  },
  3: {
    index: 3,
    primitive: 8, // Binary: 00001000
    alpha: 0.5, // One half - fundamental division
    name: 'half',
    type: 'binary_left',
    symbol: '½',
    description: 'Division/branching field - binary tree left branch'
  },
  4: {
    index: 4,
    primitive: 16, // Binary: 00010000
    alpha: 0.15915494309189535, // 1/(2π) - inverse circular constant
    name: 'inv_freq',
    type: 'inverse_transform',
    symbol: '1/2π',
    description: 'Inverse frequency transform - wavelength space'
  },
  5: {
    index: 5,
    primitive: 32, // Binary: 00100000
    alpha: 6.283185307179586, // 2π - full circle/cycle
    name: 'freq',
    type: 'forward_transform',
    symbol: '2π',
    description: 'Forward frequency transform - frequency space'
  },
  6: {
    index: 6,
    primitive: 64, // Binary: 01000000
    alpha: 0.199612, // Phase coupling constant
    name: 'phase',
    type: 'state_coupling',
    symbol: 'θ',
    description: 'Phase coupling field - quantum state relationships'
  },
  7: {
    index: 7,
    primitive: 128, // Binary: 10000000
    alpha: 0.014134725, // Deep structure constant
    name: 'zeta',
    type: 'deep_pointer',
    symbol: 'ζ',
    description: 'Deep structure pointer - connection to Riemann zeta function'
  }
};

// PAGE_SIZE emerges from field 4 × field 5 = 1/(2π) × 2π = 1
// This creates a natural 48-number periodicity in the structure
const PAGE_SIZE = 48; // Fundamental page size from fields 4×5 = 1

/**
 * Mathematical Universe Database
 *
 * This class implements the core database operations on the mathematical universe.
 * It treats every integer as a database record and provides methods to:
 * - Create and analyze number records
 * - Perform normalization (factorization)
 * - Execute database operations (JOIN/multiply, MERGE/add)
 * - Search for patterns and analyze structure
 */
class MathematicalUniverseDB {
  // Cache for performance - stores computed number records
  private cache: Map<number, MathematicalNumber> = new Map();

  // Pre-computed prime cache for faster normalization operations
  // These are the "well-formed" records in our database
  private primeCache: Set<number> = new Set([
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
  ]);

  // Large number analyzer for handling up to 2048-bit integers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private largeNumberAnalyzer: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private fieldCollapseFactorizer: any = null;

  /**
   * Get large number analyzer (lazy initialization)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getLargeNumberAnalyzer(): any {
    if (!this.largeNumberAnalyzer) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const largeModule = require('./math-universe-large.js') as typeof import('./math-universe-large.js');
      this.largeNumberAnalyzer = new largeModule.LargeNumberFieldAnalysis();
    }
    return this.largeNumberAnalyzer;
  }

  /**
   * Get field collapse factorizer (lazy initialization)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getFieldCollapseFactorizer(): any {
    if (!this.fieldCollapseFactorizer) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const largeModule = require('./math-universe-large.js') as typeof import('./math-universe-large.js');
      this.fieldCollapseFactorizer = new largeModule.FieldCollapseFactorization();
    }
    return this.fieldCollapseFactorizer;
  }

  /**
   * Get active fields for a number using bit decomposition
   *
   * The binary representation of a number directly maps to field activation:
   * - Bit 0 set → Field 0 (identity) active
   * - Bit 1 set → Field 1 (tribonacci) active
   * - And so on...
   *
   * Example: 7 = 0b00000111 → Fields 0,1,2 active → "I+T+φ"
   */
  private getActiveFields(n: number): Set<FieldIndex> {
    const active = new Set<FieldIndex>();
    // For numbers > 255, use modulo 256 to map to 8-bit space
    // This preserves the field pattern while handling arbitrary integers
    const fieldBits = n % 256;
    for (let i = 0; i < 8; i++) {
      if (fieldBits & (1 << i)) {
        // Check if bit i is set
        active.add(i as FieldIndex);
      }
    }
    return active;
  }

  /**
   * Create field activation object from active field indices
   *
   * Converts a set of active field indices into a complete FieldActivation object
   * with all 8 fields, marking which are active/inactive and including their
   * constant values and metadata.
   */
  private createFieldActivation(activeFields: Set<FieldIndex>): FieldActivation {
    const fieldNames = ['identity', 'tribonacci', 'golden', 'half', 'inv_freq', 'freq', 'phase', 'zeta'] as const;

    // Build the complete field activation pattern
    const fields: Partial<FieldActivation> = {};
    for (let i = 0; i < 8; i++) {
      const def = SCHEMA_CONSTANTS[i as FieldIndex];
      const fieldName = fieldNames[i];
      fields[fieldName as keyof FieldActivation] = {
        active: activeFields.has(i as FieldIndex),
        alpha: def.alpha,
        symbol: def.symbol,
        type: def.type
      };
    }

    return fields as FieldActivation;
  }

  /**
   * Compute resonance - the product of all active field alphas
   *
   * Resonance is a key metric that emerges from field interactions.
   * Special resonances include:
   * - 1.0: Perfect resonance (e.g., 48 with fields 4,5 active: 1/2π × 2π = 1)
   * - 1.839...: Tribonacci resonance (indicates decoherence)
   * - Low values: Often indicate deep structure (field 7 active)
   */
  private computeResonance(activeFields: Set<FieldIndex>): number {
    let resonance = 1.0;
    for (const field of activeFields) {
      resonance *= SCHEMA_CONSTANTS[field].alpha;
    }
    return resonance;
  }

  /**
   * Generate human-readable field signature string
   *
   * Creates a string representation of active fields using their symbols.
   * Examples:
   * - 7 → "I+T+φ" (identity + tribonacci + golden)
   * - 48 → "1/2π+2π" (creates perfect resonance)
   * - 1 → "I" (identity only)
   * - 263 → "I+T+φ" (same as 7, since 263 % 256 = 7)
   */
  private generateFieldSignature(activeFields: Set<FieldIndex>): string {
    if (activeFields.size === 0) {
      return '∅'; // Empty set symbol for 0
    }

    const symbols: string[] = [];
    for (const field of Array.from(activeFields).sort()) {
      symbols.push(SCHEMA_CONSTANTS[field].symbol);
    }
    return symbols.join('+');
  }

  /**
   * Check if a number is prime (normalized form)
   *
   * In database terms, a prime is a "normalized" record with no redundancy.
   * It cannot be decomposed into smaller records through multiplication.
   * Primes are the atomic building blocks of the mathematical universe.
   */
  private isPrime(n: number): boolean {
    if (n < 2) {
      return false;
    }
    if (this.primeCache.has(n)) {
      return true; // Check cache first
    }
    if (n % 2 === 0) {
      return false; // Even numbers (except 2) are composite
    }

    // Trial division up to √n
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
      if (n % i === 0) {
        return false;
      }
    }

    // Add to cache for future lookups
    this.primeCache.add(n);
    return true;
  }

  /**
   * Get prime factors of a number (normalization process)
   *
   * This is the core normalization algorithm that decomposes a denormalized
   * (composite) record into its normalized (prime) components.
   *
   * Example: 77 = 7 × 11
   * - 77 has fields {I, φ, ½, θ} - denormalized with artifacts
   * - 7 has fields {I, T, φ} - normalized
   * - 11 has fields {I, T, ½} - normalized
   *
   * The denormalization created field θ and removed redundant field T
   */
  private getPrimeFactors(n: number): number[] {
    if (n < 2) {
      return [];
    }
    if (this.isPrime(n)) {
      return [n]; // Already normalized
    }

    const factors: number[] = [];
    let temp = n;

    // Check small primes from cache first (more efficient)
    for (const p of Array.from(this.primeCache).sort((a, b) => a - b)) {
      if (p * p > temp) {
        break;
      }
      while (temp % p === 0) {
        factors.push(p);
        temp /= p;
      }
    }

    // Check remaining odd numbers if needed
    let i = Math.max(...Array.from(this.primeCache)) + 2;
    while (i * i <= temp) {
      while (temp % i === 0) {
        factors.push(i);
        temp /= i;
      }
      i += 2;
    }

    // If temp > 1, it's a prime factor
    if (temp > 1) {
      factors.push(temp);
    }

    return factors;
  }

  /**
   * Compute hierarchical depth of a number
   *
   * Depth represents the number's position in the mathematical hierarchy.
   * This simple implementation uses logarithmic scale, but could be
   * extended to consider field patterns or other structural properties.
   */
  private computeDepth(n: number): number {
    // Simple depth based on magnitude
    return Math.floor(Math.log2(n + 1));
  }

  /**
   * Create a mathematical number record (core database operation)
   *
   * This method creates a complete database record for any integer, computing:
   * - Field activation pattern (from binary representation)
   * - Resonance (product of active field constants)
   * - Page/offset location (based on 48-number pages)
   * - Normalization status (prime vs composite)
   * - Relationships to other numbers
   *
   * This is equivalent to INSERT or SELECT in a traditional database
   */
  createNumber(value: number): MathematicalNumber {
    // Check cache first to avoid recomputation
    if (this.cache.has(value)) {
      return this.cache.get(value)!;
    }

    // Step 1: Determine which fields are active based on binary representation
    const activeFields = this.getActiveFields(value);

    // Step 2: Create the complete field activation pattern
    const fields = this.createFieldActivation(activeFields);

    // Step 3: Calculate resonance (key metric for pattern detection)
    const resonance = this.computeResonance(activeFields);

    // Step 4: Generate human-readable field signature
    const fieldSignature = this.generateFieldSignature(activeFields);

    // Step 5: Calculate page location (48 numbers per page)
    // Page boundaries have special properties due to field 4×5 interaction
    const page = Math.floor(value / PAGE_SIZE);
    const offset = value % PAGE_SIZE;

    // Step 6: Compute hierarchical depth
    const depth = this.computeDepth(value);

    // Step 7: Check integrity constraints
    // Primitive = only one field active (powers of 2: 1,2,4,8,16,32,64,128)
    const isPrimitive = activeFields.size === 1;

    // Normalized = prime (no redundancy, cannot be factored)
    const isNormalized = this.isPrime(value);

    // Get prime factorization if composite (denormalized)
    const factors = isNormalized ? [] : this.getPrimeFactors(value);
    const normalizationDepth = factors.length;

    // Step 8: Create the complete database record
    const number: MathematicalNumber = {
      value,
      fields,
      computed: {
        resonance,
        page,
        offset,
        depth,
        field_signature: fieldSignature
      },
      integrity: {
        is_primitive: isPrimitive,
        is_normalized: isNormalized,
        normalization_depth: normalizationDepth
      },
      relationships: {
        factors: factors.length > 0 ? factors : undefined,
        multiples: this.getFirstMultiples(value, 10),
        neighbors: {
          previous: value > 0 ? value - 1 : undefined,
          next: value + 1
        }
      }
    };

    // Cache the result for future queries
    this.cache.set(value, number);
    return number;
  }

  /**
   * Get first n multiples of a number
   * Helper method for relationship tracking
   */
  private getFirstMultiples(value: number, count: number): number[] {
    const multiples: number[] = [];
    for (let i = 2; i <= count + 1; i++) {
      multiples.push(value * i);
    }
    return multiples;
  }

  /**
   * Normalize a number (factorization as database normalization)
   *
   * This is the KEY operation that demonstrates mathematics as database theory.
   *
   * In database terms:
   * - Composite numbers are denormalized records with redundancy
   * - Prime factors are the normalized form (3NF - third normal form)
   * - Factorization removes redundancy and artifacts
   *
   * The process reveals:
   * - Which fields are artifacts of denormalization
   * - How fields combine during multiplication (JOIN)
   * - Why certain patterns emerge in composite numbers
   *
   * Example: 77 = 7 × 11
   * - 77 has extra field θ (artifact) and missing field T (redundancy removed)
   * - This shows how denormalization creates and destroys field information
   */
  normalize(value: number): {
    original: MathematicalNumber;
    normalized_form: MathematicalNumber[];
    process: {
      steps: Array<{ operation: string; result: number }>;
      field_reconciliation: Record<string, any>;
    };
  } {
    // Get the original (potentially denormalized) record
    const original = this.createNumber(value);

    // Get prime factors (normalized components)
    const factors = this.getPrimeFactors(value);
    const normalizedForm = factors.map(f => this.createNumber(f));

    // Track the normalization process step by step
    const steps: Array<{ operation: string; result: number }> = [];
    let temp = value;
    for (const factor of factors) {
      steps.push({
        operation: `divide by ${factor}`,
        result: temp / factor
      });
      temp /= factor;
    }

    // Field reconciliation: analyze how fields combine/interfere
    // This is the core insight - multiplication creates field interference
    const combinedFields = new Set<FieldIndex>();
    for (const factor of normalizedForm) {
      const factorFields = this.getActiveFields(factor.value);
      for (const field of factorFields) {
        combinedFields.add(field);
      }
    }

    // Identify artifacts and missing fields
    const originalFields = this.getActiveFields(value);
    const fieldReconciliation = {
      original_fields: Array.from(originalFields),
      combined_factor_fields: Array.from(combinedFields),
      artifacts: Array.from(originalFields).filter(f => !combinedFields.has(f)), // Fields that appeared from nowhere
      missing: Array.from(combinedFields).filter(f => !originalFields.has(f)) // Fields that disappeared
    };

    return {
      original,
      normalized_form: normalizedForm,
      process: {
        steps,
        field_reconciliation: fieldReconciliation
      }
    };
  }

  /**
   * Multiply numbers (JOIN operation in database terms)
   *
   * Multiplication is equivalent to a database JOIN where:
   * - Fields from both numbers combine with interference
   * - The result may have artifacts (denormalization)
   * - Resonance is NOT simply the product of input resonances
   *
   * This operation can create or destroy field information
   */
  multiply(a: number, b: number): MathematicalNumber {
    const result = a * b;
    return this.createNumber(result);
  }

  /**
   * Add numbers (MERGE operation in database terms)
   *
   * Addition creates field interference patterns that are
   * more complex than multiplication. The resulting field
   * pattern depends on phase relationships between inputs.
   */
  add(a: number, b: number): MathematicalNumber {
    const result = a + b;
    return this.createNumber(result);
  }

  /**
   * Search for patterns in the mathematical universe
   *
   * This method allows querying the database for numbers matching
   * specific criteria, similar to SQL WHERE clauses:
   * - field_pattern: Binary string showing which fields must be active
   * - resonance_range: Numbers within a specific resonance range
   * - page_range: Search within specific pages
   *
   * Example: Find all numbers with fields 0,1,2 active (pattern "11100000")
   */
  searchPatterns(options: {
    field_pattern?: string;
    resonance_range?: { min: number; max: number };
    page_range?: { start: number; end: number };
  }): MathematicalNumber[] {
    const matches: MathematicalNumber[] = [];

    // Define search boundaries
    const startPage = options.page_range?.start ?? 0;
    const endPage = options.page_range?.end ?? 10;

    // Scan through pages and offsets
    for (let page = startPage; page <= endPage; page++) {
      for (let offset = 0; offset < PAGE_SIZE; offset++) {
        const value = page * PAGE_SIZE + offset;
        const number = this.createNumber(value);

        let isMatch = true;

        // Check field pattern match
        if (options.field_pattern) {
          const activePattern = this.getFieldPatternString(number);
          if (activePattern !== options.field_pattern) {
            isMatch = false;
          }
        }

        // Check resonance range
        if (options.resonance_range && isMatch) {
          const { min, max } = options.resonance_range;
          if (number.computed.resonance < min || number.computed.resonance > max) {
            isMatch = false;
          }
        }

        if (isMatch) {
          matches.push(number);
        }
      }
    }

    return matches;
  }

  /**
   * Get binary field pattern string for pattern matching
   *
   * Converts field activation to an 8-bit binary string
   * Example: Fields 0,1,2 active → "11100000"
   */
  private getFieldPatternString(number: MathematicalNumber): string {
    let pattern = '';
    const fieldNames = ['identity', 'tribonacci', 'golden', 'half', 'inv_freq', 'freq', 'phase', 'zeta'] as const;

    for (const fieldName of fieldNames) {
      const field = number.fields[fieldName];
      pattern += field.active ? '1' : '0';
    }

    return pattern;
  }

  /**
   * Analyze a page of numbers (statistical analysis of 48-number blocks)
   *
   * Pages are fundamental units in the mathematical universe due to
   * the field 4 × field 5 = 1 relationship. Each page of 48 numbers
   * exhibits specific patterns and properties.
   *
   * This analysis reveals:
   * - Distribution of primes vs composites
   * - Field activation frequencies
   * - Resonance patterns within the page
   *
   * Special properties emerge at page boundaries and specific offsets
   */
  analyzePage(pageNumber: number): {
    page_number: number;
    total_numbers: number;
    prime_count: number;
    composite_count: number;
    field_activation_rates: Record<string, number>;
    resonance_distribution: {
      mean: number;
      median: number;
      std_dev: number;
    };
  } {
    const numbers: MathematicalNumber[] = [];
    let primeCount = 0;
    let compositeCount = 0;
    const fieldCounts: Record<string, number> = {};
    const resonances: number[] = [];

    // Initialize field counters
    const fieldNames = ['identity', 'tribonacci', 'golden', 'half', 'inv_freq', 'freq', 'phase', 'zeta'];
    for (const name of fieldNames) {
      fieldCounts[name] = 0;
    }

    // Analyze each number in the page
    for (let offset = 0; offset < PAGE_SIZE; offset++) {
      const value = pageNumber * PAGE_SIZE + offset;
      const number = this.createNumber(value);
      numbers.push(number);

      // Count primes vs composites
      if (number.integrity.is_normalized) {
        primeCount++;
      } else {
        compositeCount++;
      }

      // Collect resonance values
      resonances.push(number.computed.resonance);

      // Count field activations
      for (const fieldName of fieldNames) {
        const field = number.fields[fieldName as keyof FieldActivation];
        if (field && field.active) {
          fieldCounts[fieldName] = (fieldCounts[fieldName] || 0) + 1;
        }
      }
    }

    // Calculate resonance statistics
    const mean = resonances.reduce((a, b) => a + b, 0) / resonances.length;
    const sortedResonances = [...resonances].sort((a: number, b: number) => a - b);
    const median = sortedResonances[Math.floor(sortedResonances.length / 2)] ?? 0;
    const variance = resonances.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / resonances.length;
    const stdDev = Math.sqrt(variance);

    // Calculate field activation rates (percentage of numbers with each field active)
    const activationRates: Record<string, number> = {};
    for (const [name, count] of Object.entries(fieldCounts)) {
      activationRates[name] = count / PAGE_SIZE;
    }

    return {
      page_number: pageNumber,
      total_numbers: PAGE_SIZE,
      prime_count: primeCount,
      composite_count: compositeCount,
      field_activation_rates: activationRates,
      resonance_distribution: {
        mean,
        median,
        std_dev: stdDev
      }
    };
  }

  /**
   * Get schema field definitions
   *
   * Returns the complete 8-field schema definition.
   * This is equivalent to DESCRIBE TABLE in SQL.
   */
  getSchemaFields(): FieldDefinition[] {
    return Object.values(SCHEMA_CONSTANTS);
  }

  /**
   * Check if a large number is prime using field analysis
   * For numbers that may exceed JavaScript's safe integer range
   */
  isPrimeLarge(n: string | bigint): {
    is_prime: boolean;
    confidence: number;
    evidence: string[];
  } {
    const bigN = typeof n === 'string' ? BigInt(n) : n;
    const analyzer = this.getLargeNumberAnalyzer();
    const result = analyzer.isProbablePrime(bigN);

    return {
      is_prime: result.is_probable_prime,
      confidence: result.confidence,
      evidence: result.resonance_evidence
    };
  }

  /**
   * Factorize a large number using field collapse
   * For numbers up to 2048-bit
   */
  async factorizeLarge(n: string | bigint): Promise<{
    factors: string[];
    method: string;
    confidence: number;
    iterations: number;
  }> {
    const bigN = typeof n === 'string' ? BigInt(n) : n;
    const factorizer = this.getFieldCollapseFactorizer();
    const result = await factorizer.attemptFactorization(bigN);

    return {
      factors: result.factors.map((f: bigint) => f.toString()),
      method: result.method,
      confidence: result.confidence,
      iterations: result.iterations
    };
  }

  /**
   * Analyze a large number's field patterns
   */
  analyzeLargeNumber(n: string | bigint): {
    primary_pattern: string;
    resonance_signature: number;
    field_harmonics: string;
  } {
    const bigN = typeof n === 'string' ? BigInt(n) : n;
    const analyzer = this.getLargeNumberAnalyzer();
    const analysis = analyzer.analyzeFieldHarmonics(bigN);

    return {
      primary_pattern: analysis.primary.toString(2).padStart(8, '0'),
      resonance_signature: analysis.resonance_signature,
      field_harmonics: analysis.harmonics.map((h: number) => h.toString(16)).join(', ')
    };
  }

  /**
   * List primes (normalized numbers) with pagination
   *
   * Primes are the "well-formed" records in our database.
   * They have no redundancy and cannot be further normalized.
   *
   * This method provides paginated access to all prime numbers,
   * similar to a SELECT query with WHERE is_normalized = true
   */
  listPrimes(
    page: number = 0,
    limit: number = 48
  ): {
    primes: MathematicalNumber[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      has_next: boolean;
      has_previous: boolean;
    };
  } {
    const primes: MathematicalNumber[] = [];
    let count = 0;
    let current = 2; // Start with first prime
    const startIndex = page * limit;

    // Find primes until we have enough for the requested page
    while (count < startIndex + limit) {
      if (this.isPrime(current)) {
        if (count >= startIndex) {
          primes.push(this.createNumber(current));
        }
        count++;
      }
      current++;
    }

    return {
      primes,
      pagination: {
        page,
        limit,
        total: count,
        has_next: true, // There are infinitely many primes
        has_previous: page > 0
      }
    };
  }
}

// ============================================================================
// EXAMPLE USAGE AND DEMONSTRATIONS
// ============================================================================

// The examples below demonstrate how to use the MathematicalUniverseDB class.
// They are commented out to avoid console output in production code.

// Example 1: Create and examine a prime (normalized record)
// const db = new MathematicalUniverseDB();
// const prime = db.createNumber(7);
// // Note: 7 = 0b00000111 → Fields 0,1,2 active → "I+T+φ"
// // This is a normalized record with no redundancy

// Example 2: Create and examine a composite (denormalized record)
// const composite = db.createNumber(15);
// // Note: 15 = 3 × 5, but its fields don't match the simple union of factor fields
// // This demonstrates denormalization artifacts

// Example 3: Normalize a composite number (factorization process)
// const normalization = db.normalize(77);
// // Original: 77
// // Normalized form: [7, 11]
// // This shows how 77's field θ is an artifact and field T was removed by redundancy

// Example 4: Page analysis
// const pageAnalysis = db.analyzePage(1);
// // Page 1 (numbers 48-95) shows special properties due to the field 4×5 boundary

// Example 5: Pattern search
// const patterns = db.searchPatterns({
//   field_pattern: '11100000', // Looking for numbers with fields 0,1,2 active
//   page_range: { start: 0, end: 2 }
// });
// // This demonstrates querying the mathematical database by field patterns

// Export the main class and types for use in other modules
export { MathematicalUniverseDB, SCHEMA_CONSTANTS };

export type {
  MathematicalNumber,
  FieldActivation,
  ComputedProperties,
  IntegrityStatus,
  Relationships,
  FieldDefinition,
  Field,
  FieldType,
  FieldIndex
};
