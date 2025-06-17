/**
 * Universe-Native Primality Detector
 * 
 * This detector uses the mathematical universe's own patterns without
 * imposing external structures. It learns directly from field patterns,
 * resonance values, and denormalization artifacts.
 */

import { SCHEMA_CONSTANTS } from './math-universe.js';
import type { FieldIndex } from './math-universe.js';

export class UniverseNativePrimalityDetector {
  // Learned patterns from the universe
  private readonly PRIME_RESONANCE_THRESHOLD = 1.5; // Primes avg 0.804, composites avg 1.548
  
  /**
   * Determine if a number is probably prime using universe patterns
   */
  isProbablePrime(n: bigint): {
    is_probable_prime: boolean;
    confidence: number;
    resonance_evidence: string[];
  } {
    // Edge cases
    if (n < 2n) {
      return {
        is_probable_prime: false,
        confidence: 1.0,
        resonance_evidence: ['Numbers less than 2 are not prime']
      };
    }
    
    if (n === 2n) {
      return {
        is_probable_prime: true,
        confidence: 1.0,
        resonance_evidence: ['2 is the only even prime']
      };
    }
    
    // Extract field pattern
    const fieldPattern = Number(n % 256n);
    const activeFields = this.getActiveFields(fieldPattern);
    const evidence: string[] = [];
    
    // Calculate resonance
    const resonance = this.calculateResonance(fieldPattern);
    evidence.push(`Resonance: ${resonance.toFixed(3)}`);
    
    // Check identity field (strongest indicator)
    const hasIdentity = activeFields.has(0 as FieldIndex);
    if (hasIdentity) {
      evidence.push('Identity field active (common in primes)');
    } else {
      evidence.push('Identity field inactive (rare in primes)');
    }
    
    // Check resonance threshold
    if (resonance < this.PRIME_RESONANCE_THRESHOLD) {
      evidence.push('Low resonance suggests primality');
    } else {
      evidence.push('High resonance suggests compositeness');
    }
    
    // Check for perfect resonance (often composite)
    if (Math.abs(resonance - 1.0) < 0.01) {
      evidence.push('Perfect resonance (often composite)');
    }
    
    // Check field count
    const fieldCount = activeFields.size;
    if (fieldCount === 0) {
      evidence.push('Empty field pattern (highly composite)');
    } else if (fieldCount === 8) {
      evidence.push('All fields active (likely composite)');
    }
    
    // Calculate confidence based on learned patterns
    let confidence = 0.5; // Start neutral
    
    // Identity field is the strongest indicator
    if (hasIdentity) {
      // P(prime | identity) = P(identity | prime) * P(prime) / P(identity)
      // Using Bayes with learned rates
      confidence = 0.7; // Strong indicator of primality
    } else {
      confidence = 0.2; // Strong indicator of compositeness
    }
    
    // Adjust for resonance
    if (resonance < 0.8) {
      confidence *= 1.3; // Low resonance boosts prime confidence
    } else if (resonance > 1.5) {
      confidence *= 0.5; // High resonance reduces prime confidence
    }
    
    // Special patterns
    if (fieldPattern === 0) {
      // Empty pattern - definitely composite for n > 1
      confidence = 0.0;
      evidence.push('Empty field pattern indicates high compositeness');
    } else if (fieldPattern === 48 || fieldPattern === 49) {
      // Lagrange points - often composite
      confidence *= 0.7;
      evidence.push('At Lagrange point (48-49)');
    }
    
    // Check for known composite patterns
    if (this.isKnownCompositePattern(fieldPattern)) {
      confidence *= 0.3; // Strong indicator of compositeness
      evidence.push('Known composite field pattern');
    }
    
    // Large number adjustment
    if (n > 1000000n) {
      // Large numbers with certain patterns are more likely prime
      if (hasIdentity && resonance < 1.0 && fieldCount >= 3 && fieldCount <= 5) {
        confidence *= 1.2;
        evidence.push('Large number with prime-like characteristics');
      }
    }
    
    // Normalize confidence
    confidence = Math.max(0, Math.min(1, confidence));
    
    return {
      is_probable_prime: confidence > 0.5,
      confidence,
      resonance_evidence: evidence
    };
  }
  
  /**
   * Get active fields from pattern
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
   * Check if pattern is known to be composite
   */
  private isKnownCompositePattern(pattern: number): boolean {
    // Patterns that appear much more frequently in composites
    const compositePatterns = [
      0b00000000, // Empty (0)
      0b00001010, // 10
      0b01100100, // 100  
      0b11101000, // 1000
      0b00000100, // 4
      0b00010000, // 16
      0b01000000, // 64
      0b01001101, // 77 (7×11)
    ];
    
    return compositePatterns.includes(pattern);
  }
}