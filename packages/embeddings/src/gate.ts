import type { GateEmbedding } from './types';

/**
 * Get Gate Embedding (256D) - Complete quantum state space (2^8 = 256)
 * Represents the full quantum computational state of a number
 * Spec §3.3
 */
export function getGateEmbedding(n: bigint): GateEmbedding {
  const cyclePosition = Number(n % 256n);
  const gateConfiguration = n % 256n;

  // Calculate quantum phase based on position in cycle
  // Phase ranges from 0 to 2π over the 256-number cycle
  const quantumPhase = (cyclePosition / 256) * 2 * Math.PI;

  // Create 256-dimensional vector
  // Use a combination of position encoding and field-based activation
  const vector: number[] = new Array(256).fill(0) as number[];

  // Primary activation at cycle position
  vector[cyclePosition] = 1;

  // Secondary activations based on field pattern
  // Each active field influences nearby dimensions
  const fieldBits = Number(n & 0xffn); // First 8 bits
  for (let i = 0; i < 8; i++) {
    if ((fieldBits >> i) & 1) {
      // Each active field creates ripples in the gate space
      const baseIndex = i * 32; // 256 / 8 = 32 dimensions per field
      for (let j = 0; j < 32; j++) {
        const index = (baseIndex + j) % 256;
        const distance = Math.abs(j - 16) / 16; // Normalized distance from center
        vector[index] += Math.exp(-distance * distance) * 0.1; // Gaussian ripple
      }
    }
  }

  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum: number, val: number) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < 256; i++) {
      vector[i] /= magnitude;
    }
  }

  return {
    dimensions: 256,
    cyclePosition,
    gateConfiguration,
    quantumPhase,
    vector,
  };
}

/**
 * Calculate quantum interference between two gate embeddings
 */
export function gateInterference(a: GateEmbedding, b: GateEmbedding): number {
  // Calculate phase difference
  const phaseDiff = Math.abs(a.quantumPhase - b.quantumPhase);

  // Calculate vector dot product
  let dotProduct = 0;
  for (let i = 0; i < 256; i++) {
    dotProduct += a.vector[i] * b.vector[i];
  }

  // Combine phase and amplitude interference
  const phaseInterference = Math.cos(phaseDiff);
  return dotProduct * phaseInterference;
}

/**
 * Get the gate configuration as a bit string
 */
export function getGateBitString(embedding: GateEmbedding): string {
  return embedding.gateConfiguration.toString(2).padStart(8, '0');
}

/**
 * Calculate the entropy of a gate embedding
 */
export function gateEntropy(embedding: GateEmbedding): number {
  let entropy = 0;

  for (const value of embedding.vector) {
    if (value > 0) {
      entropy -= value * Math.log2(value);
    }
  }

  return entropy;
}
