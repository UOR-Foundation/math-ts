import {
  type FieldSubstrate,
  type FieldPattern,
  FIELD_COUNT,
} from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import { CarryOperator, type DenormalizationArtifact } from './carry';

/**
 * Tracks and analyzes denormalization artifacts during arithmetic operations
 * These artifacts are the universe's way of creating/destroying information
 */
export class DenormalizationEngine {
  private carryOperator: CarryOperator;

  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
  ) {
    this.carryOperator = new CarryOperator(substrate);
  }

  /**
   * Track artifacts during multiplication
   */
  trackMultiplication(a: bigint, b: bigint): MultiplicationArtifacts {
    const artifacts = this.carryOperator.analyzeArtifacts(a, b);
    const product = a * b;

    // Analyze field evolution
    const patternA = this.substrate.getFieldPattern(a);
    const patternB = this.substrate.getFieldPattern(b);
    const patternProduct = this.substrate.getFieldPattern(product);

    // Calculate resonance changes
    const resonanceA = this.resonance.calculateResonance(a);
    const resonanceB = this.resonance.calculateResonance(b);
    const resonanceProduct = this.resonance.calculateResonance(product);

    // Field statistics
    const vanishingFields = artifacts.filter((a) => a.type === 'vanishing');
    const emergentFields = artifacts.filter((a) => a.type === 'emergent');

    return {
      operands: { a: Number(a), b: Number(b) },
      product: Number(product),
      artifacts,
      fieldEvolution: {
        before: {
          activeInA: patternA.filter(Boolean).length,
          activeInB: patternB.filter(Boolean).length,
          totalActive: this.countUniqueActiveFields(patternA, patternB),
        },
        after: {
          activeInProduct: patternProduct.filter(Boolean).length,
        },
        vanished: vanishingFields.length,
        emerged: emergentFields.length,
      },
      resonanceEvolution: {
        before: { a: resonanceA, b: resonanceB },
        after: resonanceProduct,
        energyChange: resonanceProduct - resonanceA * resonanceB,
      },
    };
  }

  /**
   * Predict artifacts for a multiplication without performing it
   */
  predictArtifacts(a: bigint, b: bigint): PredictedArtifacts {
    // This is a simplified prediction based on field patterns
    const patternA = this.substrate.getFieldPattern(a);
    const patternB = this.substrate.getFieldPattern(b);

    const predictions: Array<{
      field: number;
      likelihood: number;
      type: 'vanishing' | 'emergent';
    }> = [];

    // Analyze each field
    for (let i = 0; i < FIELD_COUNT; i++) {
      const activeInA = patternA[i];
      const activeInB = patternB[i];

      if (activeInA && activeInB) {
        // Both active - high chance of vanishing
        predictions.push({
          field: i,
          likelihood: 0.7,
          type: 'vanishing',
        });
      } else if (!activeInA && !activeInB) {
        // Both inactive - chance of emergence
        predictions.push({
          field: i,
          likelihood: 0.3,
          type: 'emergent',
        });
      }
    }

    return {
      operands: { a: Number(a), b: Number(b) },
      predictions: predictions.sort((a, b) => b.likelihood - a.likelihood),
    };
  }

  /**
   * Find multiplication pairs that produce specific artifacts
   */
  findArtifactProducers(
    targetField: number,
    artifactType: 'vanishing' | 'emergent',
    searchRange: { min: bigint; max: bigint },
  ): ArtifactProducer[] {
    const producers: ArtifactProducer[] = [];

    // This is a simplified search - in practice would be optimized
    for (let a = searchRange.min; a <= searchRange.max; a++) {
      for (let b = a; b <= searchRange.max; b++) {
        const artifacts = this.carryOperator.analyzeArtifacts(a, b);

        const hasTargetArtifact = artifacts.some(
          (art) => art.field === targetField && art.type === artifactType,
        );

        if (hasTargetArtifact) {
          producers.push({
            factors: [Number(a), Number(b)],
            product: Number(a * b),
            targetField,
            artifactType,
          });
        }
      }
    }

    return producers;
  }

  /**
   * Analyze artifact patterns in a number sequence
   */
  analyzeSequence(numbers: bigint[]): SequenceArtifactAnalysis {
    const artifactCounts = new Map<string, number>();
    const fieldTransitions = new Map<number, number>();

    for (let i = 1; i < numbers.length; i++) {
      const artifacts = this.trackMultiplication(numbers[i - 1], numbers[i]);

      // Count artifact types
      artifacts.artifacts.forEach((art) => {
        const key = `${art.type}-${art.field}`;
        artifactCounts.set(key, (artifactCounts.get(key) ?? 0) + 1);
      });

      // Track field transitions
      artifacts.artifacts.forEach((art) => {
        fieldTransitions.set(art.field, (fieldTransitions.get(art.field) ?? 0) + 1);
      });
    }

    return {
      sequence: numbers.map((n) => Number(n)),
      totalArtifacts: Array.from(artifactCounts.values()).reduce((a, b) => a + b, 0),
      artifactDistribution: Object.fromEntries(artifactCounts),
      mostActiveField:
        Array.from(fieldTransitions.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || -1,
      averageArtifactsPerOperation:
        Array.from(artifactCounts.values()).reduce((a, b) => a + b, 0) / (numbers.length - 1),
    };
  }

  /**
   * Count unique active fields across patterns
   */
  private countUniqueActiveFields(patternA: FieldPattern, patternB: FieldPattern): number {
    let count = 0;
    for (let i = 0; i < FIELD_COUNT; i++) {
      if (patternA[i] || patternB[i]) count++;
    }
    return count;
  }
}

/**
 * Result of tracking multiplication artifacts
 */
export interface MultiplicationArtifacts {
  operands: { a: number; b: number };
  product: number;
  artifacts: DenormalizationArtifact[];
  fieldEvolution: {
    before: {
      activeInA: number;
      activeInB: number;
      totalActive: number;
    };
    after: {
      activeInProduct: number;
    };
    vanished: number;
    emerged: number;
  };
  resonanceEvolution: {
    before: { a: number; b: number };
    after: number;
    energyChange: number;
  };
}

/**
 * Predicted artifacts for a multiplication
 */
export interface PredictedArtifacts {
  operands: { a: number; b: number };
  predictions: Array<{
    field: number;
    likelihood: number;
    type: 'vanishing' | 'emergent';
  }>;
}

/**
 * A multiplication that produces a specific artifact
 */
export interface ArtifactProducer {
  factors: number[];
  product: number;
  targetField: number;
  artifactType: 'vanishing' | 'emergent';
}

/**
 * Analysis of artifacts in a number sequence
 */
export interface SequenceArtifactAnalysis {
  sequence: number[];
  totalArtifacts: number;
  artifactDistribution: Record<string, number>;
  mostActiveField: number;
  averageArtifactsPerOperation: number;
}
