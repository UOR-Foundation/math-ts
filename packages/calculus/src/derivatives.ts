/**
 * Field Derivatives and Jacobian Calculations
 *
 * Implements partial derivatives with respect to fields and
 * the Jacobian matrix showing how operations affect each field.
 */

import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { FieldDerivative, JacobianMatrix } from './index';

/**
 * Calculate how resonance changes when a specific field is activated/deactivated
 *
 * Resonance/field_i = {
 *   alpha_i * Resonance(n) / product_of_active_alphas,  if field_i active
 *   alpha_i * Resonance(n),                              if field_i inactive
 * }
 */
export function computeFieldDerivative(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
  fieldIndex: number,
): FieldDerivative {
  if (fieldIndex < 0 || fieldIndex > 7) {
    throw new Error(`Invalid field index: ${fieldIndex}. Must be between 0 and 7.`);
  }

  const currentResonance = resonanceDynamics.calculateResonance(n);
  const fieldConstants = fieldSubstrate.getFieldConstants();
  const alpha_i = fieldConstants[fieldIndex];

  const isActive = fieldSubstrate.isFieldActive(n, fieldIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7);

  let derivative: number;

  if (isActive) {
    // Field is currently active
    // Derivative is the change in resonance if we deactivate this field
    // When active: Res includes alpha_i, so removing it divides by alpha_i
    derivative = -currentResonance * (1 - 1 / alpha_i);
  } else {
    // Field is currently inactive
    // Derivative is the change in resonance if we activate this field
    // When inactive: Res doesn't include alpha_i, so adding it multiplies by alpha_i
    derivative = currentResonance * (alpha_i - 1);
  }

  return {
    fieldIndex,
    derivative,
    isActive,
  };
}

/**
 * Compute the Jacobian matrix J[i,j] = field_i/operation_j
 *
 * This reveals the "gears" of the computational engine,
 * showing how each operation affects each field.
 */
export function computeJacobianMatrix(
  fieldSubstrate: FieldSubstrate,
  n: bigint,
  operations: Array<(pattern: boolean[]) => boolean[]>,
): JacobianMatrix {
  const pattern = fieldSubstrate.getFieldPattern(n);
  const numFields = 8;
  const numOperations = operations.length;

  const values: number[][] = Array(numFields)
    .fill(null)
    .map(() => Array(numOperations).fill(0) as number[]);

  // For each operation
  for (let j = 0; j < numOperations; j++) {
    const operation = operations[j];

    // Apply operation to get new pattern
    const newPattern = operation(pattern);

    // Compute change in each field
    for (let i = 0; i < numFields; i++) {
      // Change is 1 if field flipped, 0 if unchanged
      values[i][j] = pattern[i] !== newPattern[i] ? 1 : 0;
    }
  }

  return {
    rows: numFields,
    cols: numOperations,
    values,
  };
}

/**
 * Compute sensitivity of resonance to small perturbations in field pattern
 * This is the gradient of resonance in field space
 */
export function resonanceGradient(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
): number[] {
  const gradient: number[] = [];

  for (let i = 0; i < 8; i++) {
    const fieldDeriv = computeFieldDerivative(fieldSubstrate, resonanceDynamics, n, i);
    gradient.push(fieldDeriv.derivative);
  }

  return gradient;
}

/**
 * Compute the Hessian matrix of resonance (second-order derivatives)
 * H[i,j] = �Resonance/field_ifield_j
 */
export function resonanceHessian(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
): number[][] {
  const pattern = fieldSubstrate.getFieldPattern(n);
  const fieldConstants = fieldSubstrate.getFieldConstants();
  const currentResonance = resonanceDynamics.calculateResonance(n);

  const hessian: number[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(0) as number[]);

  // For diagonal elements H[i,i]
  for (let i = 0; i < 8; i++) {
    const alpha_i = fieldConstants[i];
    const isActive_i = pattern[i];

    if (isActive_i) {
      // Second derivative when field is active
      hessian[i][i] = (currentResonance * 2 * (1 / alpha_i - 1)) / alpha_i;
    } else {
      // Second derivative when field is inactive
      hessian[i][i] = 0; // Linear change
    }
  }

  // For off-diagonal elements H[i,j] where i ` j
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const alpha_i = fieldConstants[i];
      const alpha_j = fieldConstants[j];
      const isActive_i = pattern[i];
      const isActive_j = pattern[j];

      let crossDerivative = 0;

      if (isActive_i && isActive_j) {
        // Both fields active
        crossDerivative = currentResonance * (1 / alpha_i - 1) * (1 / alpha_j - 1);
      } else if (!isActive_i && !isActive_j) {
        // Both fields inactive
        crossDerivative = currentResonance * (alpha_i - 1) * (alpha_j - 1);
      } else if (isActive_i && !isActive_j) {
        // i active, j inactive
        crossDerivative = currentResonance * (1 / alpha_i - 1) * (alpha_j - 1);
      } else {
        // i inactive, j active
        crossDerivative = currentResonance * (alpha_i - 1) * (1 / alpha_j - 1);
      }

      hessian[i][j] = crossDerivative;
      hessian[j][i] = crossDerivative; // Symmetric matrix
    }
  }

  return hessian;
}

/**
 * Compute directional derivative of resonance in field space
 * Given a direction vector in 8D field space
 */
export function directionalDerivative(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
  direction: number[],
): number {
  if (direction.length !== 8) {
    throw new Error('Direction vector must have 8 components');
  }

  // Normalize direction vector
  const magnitude = Math.sqrt(direction.reduce((sum, d) => sum + d * d, 0));
  if (magnitude === 0) {
    return 0;
  }

  const normalizedDir = direction.map((d) => d / magnitude);

  // Compute gradient
  const gradient = resonanceGradient(fieldSubstrate, resonanceDynamics, n);

  // Dot product of gradient and direction
  return gradient.reduce((sum, g, i) => sum + g * normalizedDir[i], 0);
}

/**
 * Find critical points where all field derivatives are zero
 * These are potential equilibrium points in field space
 */
export function findFieldCriticalPoints(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  searchRange: { start: bigint; end: bigint },
): bigint[] {
  const criticalPoints: bigint[] = [];
  const tolerance = 1e-10;

  for (let n = searchRange.start; n <= searchRange.end; n++) {
    const gradient = resonanceGradient(fieldSubstrate, resonanceDynamics, n);

    // Check if all gradient components are near zero
    const isZeroGradient = gradient.every((g) => Math.abs(g) < tolerance);

    if (isZeroGradient) {
      criticalPoints.push(n);
    }
  }

  return criticalPoints;
}

/**
 * Classify critical points using the Hessian matrix
 * Returns: 'minimum', 'maximum', 'saddle', or 'degenerate'
 */
export function classifyCriticalPoint(
  fieldSubstrate: FieldSubstrate,
  resonanceDynamics: ResonanceDynamics,
  n: bigint,
): 'minimum' | 'maximum' | 'saddle' | 'degenerate' {
  const hessian = resonanceHessian(fieldSubstrate, resonanceDynamics, n);

  // Compute eigenvalues using power iteration for symmetric matrix
  const eigenvalues = computeEigenvalues(hessian);

  let positiveCount = 0;
  let negativeCount = 0;
  let zeroCount = 0;
  const tolerance = 1e-10;

  for (const lambda of eigenvalues) {
    if (Math.abs(lambda) < tolerance) {
      zeroCount++;
    } else if (lambda > 0) {
      positiveCount++;
    } else {
      negativeCount++;
    }
  }

  if (zeroCount > 0) {
    return 'degenerate';
  } else if (positiveCount === 8) {
    return 'minimum';
  } else if (negativeCount === 8) {
    return 'maximum';
  } else {
    return 'saddle';
  }
}

/**
 * Compute eigenvalues of a symmetric matrix using Jacobi method
 * This is a proper implementation for the 8x8 Hessian matrix
 */
function computeEigenvalues(matrix: number[][]): number[] {
  const n = matrix.length;
  const A = matrix.map((row) => [...row]); // Copy matrix
  const tolerance = 1e-10;
  const maxIterations = 100;

  // Jacobi eigenvalue algorithm for symmetric matrices
  let iterations = 0;

  while (iterations < maxIterations) {
    // Find largest off-diagonal element
    let maxVal = 0;
    let p = 0,
      q = 1;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(A[i][j]) > maxVal) {
          maxVal = Math.abs(A[i][j]);
          p = i;
          q = j;
        }
      }
    }

    // Check convergence
    if (maxVal < tolerance) {
      break;
    }

    // Compute rotation angle
    const theta = 0.5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    // Apply Jacobi rotation
    const App = A[p][p];
    const Aqq = A[q][q];
    const Apq = A[p][q];

    A[p][p] = c * c * App - 2 * c * s * Apq + s * s * Aqq;
    A[q][q] = s * s * App + 2 * c * s * Apq + c * c * Aqq;
    A[p][q] = 0;
    A[q][p] = 0;

    // Update other elements
    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const Aip = A[i][p];
        const Aiq = A[i][q];
        A[i][p] = c * Aip - s * Aiq;
        A[p][i] = A[i][p];
        A[i][q] = s * Aip + c * Aiq;
        A[q][i] = A[i][q];
      }
    }

    iterations++;
  }

  // Extract eigenvalues from diagonal
  return Array.from({ length: n }, (_, i) => A[i][i]);
}
