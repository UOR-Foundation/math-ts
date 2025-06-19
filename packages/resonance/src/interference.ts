import type { FieldPattern } from '@uor-foundation/field-substrate';

/**
 * Denormalization artifact tracking during field interference.
 */
export interface DenormalizationArtifact {
  fieldIndex: number;
  type: 'vanished' | 'emerged';
  description: string;
}

/**
 * Result of field interference between two patterns.
 */
export interface InterferenceResult {
  resultPattern: FieldPattern;
  artifacts: DenormalizationArtifact[];
  interferenceType: 'constructive' | 'destructive' | 'mixed';
  coherence: number; // 0-1, how coherent the interference is
}

/**
 * Calculate field interference between two patterns.
 * This models how fields interact during arithmetic operations.
 *
 * @param a - First field pattern
 * @param b - Second field pattern
 * @returns The interference result
 */
export function fieldInterference(a: FieldPattern, b: FieldPattern): InterferenceResult {
  if (a.length !== b.length) {
    throw new Error(`Pattern length mismatch: ${a.length} vs ${b.length}`);
  }

  const resultPattern: FieldPattern = new Array<boolean>(a.length);
  const artifacts: DenormalizationArtifact[] = [];

  let constructiveCount = 0;
  let destructiveCount = 0;
  let activeInResult = 0;

  for (let i = 0; i < a.length; i++) {
    const aActive = a[i];
    const bActive = b[i];

    // Interference rules based on field dynamics
    if (aActive && bActive) {
      // Both fields active - complex interference
      if (i === 4 || i === 5) {
        // Special case: fields 4 and 5 (1/2π and 2π) cancel when both active
        resultPattern[i] = false;
        destructiveCount++;
        artifacts.push({
          fieldIndex: i,
          type: 'vanished',
          description: `Field ${i} vanished due to perfect cancellation`,
        });
      } else {
        // Most fields remain active when both are present
        resultPattern[i] = true;
        constructiveCount++;
        activeInResult++;
      }
    } else if (aActive || bActive) {
      // Only one field active - simple superposition
      resultPattern[i] = true;
      activeInResult++;

      // Check for emergence patterns
      if (!aActive && !bActive) {
        artifacts.push({
          fieldIndex: i,
          type: 'emerged',
          description: `Field ${i} emerged from interference`,
        });
      }
    } else {
      // Neither field active
      resultPattern[i] = false;
    }
  }

  // Determine interference type
  let interferenceType: 'constructive' | 'destructive' | 'mixed';
  if (destructiveCount === 0) {
    interferenceType = 'constructive';
  } else if (constructiveCount === 0) {
    interferenceType = 'destructive';
  } else {
    interferenceType = 'mixed';
  }

  // Calculate coherence (how "clean" the interference is)
  const totalActive = a.filter((x) => x).length + b.filter((x) => x).length;
  const coherence = totalActive > 0 ? activeInResult / totalActive : 1.0;

  return {
    resultPattern,
    artifacts,
    interferenceType,
    coherence,
  };
}

/**
 * Check if two patterns will create destructive interference.
 *
 * @param a - First pattern
 * @param b - Second pattern
 * @returns True if patterns will destructively interfere
 */
export function willDestructivelyInterfere(a: FieldPattern, b: FieldPattern): boolean {
  // Check for known destructive pairs
  // Fields 4 and 5 (1/2π and 2π) destructively interfere
  return a[4] && b[5] && a[5] && b[4];
}

/**
 * Calculate the phase relationship between two patterns.
 *
 * @param a - First pattern
 * @param b - Second pattern
 * @returns Phase relationship in radians (0 = in phase, π = out of phase)
 */
export function calculatePhaseRelationship(a: FieldPattern, b: FieldPattern): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    const aVal = a[i] ? 1 : 0;
    const bVal = b[i] ? 1 : 0;
    dotProduct += aVal * bVal;
    magnitudeA += aVal * aVal;
    magnitudeB += bVal * bVal;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // No phase relationship if one is zero
  }

  const cosAngle = dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
}

/**
 * Predict the resonance change from interference.
 *
 * @param resonanceA - Resonance of first number
 * @param resonanceB - Resonance of second number
 * @param interferenceResult - The interference result
 * @returns Predicted resonance multiplier
 */
export function predictResonanceChange(
  resonanceA: number,
  resonanceB: number,
  interferenceResult: InterferenceResult,
): number {
  // Base expectation is multiplication
  let expected = resonanceA * resonanceB;

  // Adjust for interference effects
  if (interferenceResult.interferenceType === 'destructive') {
    expected *= interferenceResult.coherence;
  } else if (interferenceResult.interferenceType === 'mixed') {
    // Mixed interference creates complex modulation
    expected *= 0.5 + 0.5 * interferenceResult.coherence;
  }

  // Account for artifacts
  const artifactFactor = Math.exp(-0.1 * interferenceResult.artifacts.length);
  expected *= artifactFactor;

  return expected;
}
