import {
  type FieldSubstrate,
  type FieldPattern,
  FIELD_COUNT,
} from '@uor-foundation/field-substrate';

/**
 * Carry operator 𝒞(m,n) - encodes all interference effects during multiplication
 * This is the quantum mechanism where the universe creates/destroys information
 */
export class CarryOperator {
  constructor(private substrate: FieldSubstrate) {}

  /**
   * Compute the carry operator 𝒞(m,n) for multiplication m × n
   * This encodes which fields vanish and which emerge during the operation
   */
  compute(m: bigint, n: bigint): FieldPattern {
    // Get field patterns for the operands
    const patternM = this.substrate.getFieldPattern(m);
    const patternN = this.substrate.getFieldPattern(n);

    // Get the product's pattern
    const product = m * n;
    const patternProduct = this.substrate.getFieldPattern(product);

    // The carry operator is the XOR difference between:
    // 1. What we'd expect from simple XOR (patternM ⊕ patternN)
    // 2. What we actually get (patternProduct)
    const carry: FieldPattern = new Array<boolean>(FIELD_COUNT);

    for (let i = 0; i < FIELD_COUNT; i++) {
      // Expected from simple XOR
      const expected = patternM[i] !== patternN[i];
      // Actual result
      const actual = patternProduct[i];
      // Carry bit encodes the difference
      carry[i] = expected !== actual;
    }

    return carry;
  }

  /**
   * Compute partial products for binary multiplication
   * This is used in the full carry computation algorithm
   */
  private computePartialProducts(m: bigint, n: bigint): number[] {
    // Convert to binary representations
    const bitsM = this.toBinary(m);
    const bitsN = this.toBinary(n);

    // Calculate maximum possible bits in result
    const maxBits = bitsM.length + bitsN.length;
    const partialProducts = new Array<number>(maxBits).fill(0);

    // Compute s_k = Σ_{i+j=k} a_i * c_j
    for (let i = 0; i < bitsM.length; i++) {
      for (let j = 0; j < bitsN.length; j++) {
        if (bitsM[i] && bitsN[j]) {
          partialProducts[i + j]++;
        }
      }
    }

    return partialProducts;
  }

  /**
   * Propagate carries through the partial products
   */
  private propagateCarries(partialProducts: number[]): number[] {
    const result = new Array<number>(partialProducts.length).fill(0);
    let carry = 0;

    for (let k = 0; k < partialProducts.length; k++) {
      result[k] = partialProducts[k] + carry;
      carry = Math.floor(result[k] / 2);
      result[k] = result[k] % 2;
    }

    return result;
  }

  /**
   * Convert bigint to binary array (LSB first)
   */
  private toBinary(n: bigint): boolean[] {
    if (n === 0n) return [false];

    const bits: boolean[] = [];
    let num = n < 0n ? -n : n;

    while (num > 0n) {
      bits.push((num & 1n) === 1n);
      num >>= 1n;
    }

    return bits;
  }

  /**
   * Analyze denormalization artifacts from multiplication
   */
  analyzeArtifacts(m: bigint, n: bigint): DenormalizationArtifact[] {
    const patternM = this.substrate.getFieldPattern(m);
    const patternN = this.substrate.getFieldPattern(n);
    const product = m * n;
    const patternProduct = this.substrate.getFieldPattern(product);
    const carry = this.compute(m, n);

    const artifacts: DenormalizationArtifact[] = [];

    for (let i = 0; i < FIELD_COUNT; i++) {
      if (carry[i]) {
        // Determine if this is a vanishing or emergent field
        const activeInM = patternM[i];
        const activeInN = patternN[i];
        const activeInProduct = patternProduct[i];

        if ((activeInM || activeInN) && !activeInProduct) {
          // Vanishing field
          artifacts.push({
            type: 'vanishing',
            field: i,
            factors: [Number(m), Number(n)],
            product: Number(product),
            interferencePattern: { real: 0, imag: 0 }, // Simplified for now
          });
        } else if (!activeInM && !activeInN && activeInProduct) {
          // Emergent field
          artifacts.push({
            type: 'emergent',
            field: i,
            factors: [Number(m), Number(n)],
            product: Number(product),
            interferencePattern: { real: 1, imag: 0 }, // Simplified for now
          });
        }
      }
    }

    return artifacts;
  }
}

/**
 * Denormalization artifact - records field creation/destruction during multiplication
 */
export interface DenormalizationArtifact {
  type: 'vanishing' | 'emergent';
  field: number; // Field index (0-7)
  factors: number[];
  product: number;
  interferencePattern: Complex;
}

/**
 * Complex number for interference patterns
 */
export interface Complex {
  real: number;
  imag: number;
}
