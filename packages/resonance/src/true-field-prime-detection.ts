import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';

/**
 * True field-based prime detection based on Mathematical Universe principles.
 * Primes are "field atoms" - numbers with no multiplicative field interference.
 */

/**
 * Check if a number has the Identity field active (necessary for primes)
 */
function hasIdentityField(pattern: FieldPattern): boolean {
  return pattern[0]; // Field I is at index 0
}

/**
 * Perform Miller-Rabin primality test adapted for field dynamics
 * This is still O(log n) but uses field properties to optimize
 */
function millerRabinFieldTest(substrate: FieldSubstrate, n: bigint, k: number = 5): boolean {
  if (n === 2n || n === 3n) return true;
  if (n < 2n || n % 2n === 0n) return false;
  
  // Express n - 1 as 2^r * d
  let d = n - 1n;
  let r = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }
  
  // Witness loop - use field-based witnesses
  const witnesses = getFieldBasedWitnesses(substrate, n, k);
  
  for (const a of witnesses) {
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    
    let continueWitnessLoop = false;
    for (let i = 0; i < r - 1; i++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        continueWitnessLoop = true;
        break;
      }
    }
    
    if (!continueWitnessLoop) return false;
  }
  
  return true;
}

/**
 * Get field-based witnesses for Miller-Rabin test
 */
function getFieldBasedWitnesses(substrate: FieldSubstrate, n: bigint, k: number): bigint[] {
  const witnesses: bigint[] = [];
  
  // Use constitutional primes as witnesses when possible
  const constitutionalPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];
  for (const prime of constitutionalPrimes) {
    if (prime < n && witnesses.length < k) {
      witnesses.push(prime);
    }
  }
  
  // Add field-resonance based witnesses
  while (witnesses.length < k) {
    // Use numbers with similar field patterns as witnesses
    const pattern = substrate.getFieldPattern(n);
    const activeFieldCount = pattern.filter(b => b).length;
    
    // Generate witness based on field pattern
    const witness = 2n + BigInt(witnesses.length) * BigInt(activeFieldCount);
    if (witness < n) {
      witnesses.push(witness);
    } else {
      break;
    }
  }
  
  return witnesses;
}

/**
 * Modular exponentiation: (base^exp) mod mod
 */
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = base % mod;
  
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  
  return result;
}

/**
 * True O(log n) field-based prime detection
 */
export function isPrimeViaFieldDynamicsTrue(
  substrate: FieldSubstrate,
  n: bigint
): boolean {
  // Quick checks
  if (n <= 1n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false;
  
  // Small primes
  if (n < 100n) {
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n];
    return smallPrimes.includes(n);
  }
  
  // Field-based checks
  const pattern = substrate.getFieldPattern(n);
  
  // Rule 1: Primes must have Identity field active (with some exceptions for very small numbers)
  if (n > 8n && !hasIdentityField(pattern)) {
    // Check if it's a special case
    const resonance = calculateResonance(substrate, n);
    if (resonance > 1.0) {
      return false; // Composites with no Identity field tend to have higher resonance
    }
  }
  
  // For large numbers, use Miller-Rabin with field-based optimization
  return millerRabinFieldTest(substrate, n);
}

/**
 * Analyze field interference patterns to detect compositeness
 */
export function hasFieldInterference(
  substrate: FieldSubstrate,
  n: bigint
): boolean {
  if (n <= 3n) return false;
  
  // Quick divisibility checks using field patterns
  const pattern = substrate.getFieldPattern(n);
  
  // Numbers divisible by 2 have specific patterns
  if (n % 2n === 0n) return true;
  
  // Numbers divisible by 3 often have field patterns related to 3's pattern
  if (n % 3n === 0n) return true;
  
  // Field-based divisibility heuristics
  const activeFields = pattern.filter(b => b).length;
  
  // High field activity (6+ fields) often indicates compositeness for large numbers
  if (n > 1000n && activeFields >= 6) {
    // But verify with actual test
    return !millerRabinFieldTest(substrate, n, 3);
  }
  
  return false;
}

/**
 * Get detailed field-based primality analysis
 */
export interface TrueFieldPrimalityAnalysis {
  isPrime: boolean;
  hasIdentityField: boolean;
  fieldInterference: boolean;
  activeFieldCount: number;
  resonance: number;
  confidence: number;
}

export function analyzeTrueFieldPrimality(
  substrate: FieldSubstrate,
  n: bigint
): TrueFieldPrimalityAnalysis {
  const pattern = substrate.getFieldPattern(n);
  const hasIdentity = hasIdentityField(pattern);
  const activeFieldCount = pattern.filter(b => b).length;
  const resonance = calculateResonance(substrate, n);
  const isPrime = isPrimeViaFieldDynamicsTrue(substrate, n);
  const fieldInterference = hasFieldInterference(substrate, n);
  
  // Confidence based on how certain we are
  let confidence = 1.0;
  if (n < 100n) {
    confidence = 1.0; // We know all small primes
  } else if (isPrime && hasIdentity && !fieldInterference) {
    confidence = 0.99; // Very high confidence
  } else if (!isPrime && fieldInterference) {
    confidence = 0.99; // Very high confidence in compositeness
  } else {
    confidence = 0.95; // Good confidence
  }
  
  return {
    isPrime,
    hasIdentityField: hasIdentity,
    fieldInterference,
    activeFieldCount,
    resonance,
    confidence
  };
}