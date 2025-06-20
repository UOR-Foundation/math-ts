import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { TangentSpace, TangentVector, RiemannianMetric } from './index';
import { ResonanceMetric } from './metric';

export interface VectorField {
  name: string;
  evaluate(point: bigint): TangentVector;
  isSmooth: boolean;
}

export interface DifferentialForm {
  degree: number;
  evaluate(point: bigint, vectors: TangentVector[]): number;
}

export interface Flow {
  vectorField: VectorField;
  flowMap(start: bigint, time: number): bigint;
  isComplete: boolean;
}

export interface PoissonBracket {
  f: (n: bigint) => number;
  g: (n: bigint) => number;
  bracket: (n: bigint) => number;
}

export class DifferentialStructure {
  private metric: ResonanceMetric;

  constructor(
    private fieldSubstrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
  ) {
    this.metric = new ResonanceMetric(fieldSubstrate, resonance, {} as PageTopology);
  }

  createTangentSpace(basePoint: bigint): TangentSpace {
    const fieldPattern = this.fieldSubstrate.getFieldPattern(basePoint);
    const activeCount = fieldPattern.filter((b) => b).length;

    const basis: TangentVector[] = [];

    for (let i = 0; i < 8; i++) {
      const components = Array.from({ length: 8 }, () => 0);
      components[i] = 1;
      basis.push({
        components,
        magnitude: 1,
      });
    }

    const metric = this.computeMetricTensor(basePoint);

    return {
      basePoint,
      dimension: activeCount || 1,
      basis,
      metric,
    };
  }

  createGradientField(potential: (n: bigint) => number): VectorField {
    return {
      name: 'gradient',
      evaluate: (point: bigint): TangentVector => {
        const h = 1;
        const components = Array.from({ length: 8 }, () => 0);

        for (let i = 0; i < 8; i++) {
          const shift = BigInt(1 << i);
          const forward = potential(point + shift);
          const backward = potential(point - shift);
          components[i] = (forward - backward) / (2 * h);
        }

        const magnitude = Math.sqrt(components.reduce((sum, c) => sum + c * c, 0));

        return { components, magnitude };
      },
      isSmooth: true,
    };
  }

  createHamiltonianField(hamiltonian: (n: bigint) => number): VectorField {
    return {
      name: 'hamiltonian',
      evaluate: (point: bigint): TangentVector => {
        const grad = this.createGradientField(hamiltonian).evaluate(point);

        const components = [...grad.components];
        for (let i = 0; i < 4; i++) {
          [components[i], components[i + 4]] = [-components[i + 4], components[i]];
        }

        const magnitude = grad.magnitude;

        return { components, magnitude };
      },
      isSmooth: true,
    };
  }

  createArithmeticFlow(): VectorField {
    return {
      name: 'arithmetic',
      evaluate: (point: bigint): TangentVector => {
        const resonance = this.resonance.calculateResonance(point);
        const nextResonance = this.resonance.calculateResonance(point + 1n);

        const velocity = nextResonance - resonance;
        const components = Array.from({ length: 8 }, () => 0);
        components[0] = velocity;

        return {
          components,
          magnitude: Math.abs(velocity),
        };
      },
      isSmooth: false,
    };
  }

  computeFlow(field: VectorField, _start: bigint, time: number, steps: number = 100): Flow {
    const dt = time / steps;

    const flowMap = (startPoint: bigint, t: number): bigint => {
      let current = startPoint;
      const numSteps = Math.floor(Math.abs(t) / dt);
      const stepSize = t > 0 ? dt : -dt;

      for (let i = 0; i < numSteps; i++) {
        const velocity = field.evaluate(current);
        const displacement = velocity.components.reduce((sum, v, idx) => {
          return sum + BigInt(Math.floor(v * stepSize * (1 << idx)));
        }, 0n);

        current = current + displacement;

        if (current < 0n) {
          current = 0n;
          break;
        }
      }

      return current;
    };

    return {
      vectorField: field,
      flowMap,
      isComplete: true,
    };
  }

  create0Form(f: (n: bigint) => number): DifferentialForm {
    return {
      degree: 0,
      evaluate: (point: bigint): number => f(point),
    };
  }

  create1Form(components: ((n: bigint) => number)[]): DifferentialForm {
    return {
      degree: 1,
      evaluate: (point: bigint, vectors: TangentVector[]): number => {
        if (vectors.length !== 1) {
          throw new Error('1-form requires exactly one vector');
        }

        const vector = vectors[0];
        let result = 0;

        for (let i = 0; i < Math.min(components.length, vector.components.length); i++) {
          result += components[i](point) * vector.components[i];
        }

        return result;
      },
    };
  }

  create2Form(components: ((n: bigint) => number)[][]): DifferentialForm {
    return {
      degree: 2,
      evaluate: (point: bigint, vectors: TangentVector[]): number => {
        if (vectors.length !== 2) {
          throw new Error('2-form requires exactly two vectors');
        }

        const [v1, v2] = vectors;
        let result = 0;

        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (i < components.length && j < components[i].length) {
              result +=
                components[i][j](point) *
                (v1.components[i] * v2.components[j] - v1.components[j] * v2.components[i]);
            }
          }
        }

        return result;
      },
    };
  }

  exteriorDerivative(form: DifferentialForm): DifferentialForm {
    if (form.degree === 0) {
      const grad = this.createGradientField((n) => form.evaluate(n, []));
      const components = Array(8)
        .fill(null)
        .map(
          (_, i) =>
            (n: bigint): number =>
              grad.evaluate(n).components[i],
        );
      return this.create1Form(components);
    }

    if (form.degree === 1) {
      const components: ((n: bigint) => number)[][] = Array(8)
        .fill(null)
        .map(() => Array(8).fill((): number => 0) as ((n: bigint) => number)[]);

      for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
          components[i][j] = (n: bigint): number => {
            const h = 1n;
            const basis_i = this.createBasisVector(i);
            const basis_j = this.createBasisVector(j);

            const f_i = form.evaluate(n, [basis_i]);
            const f_i_plus = form.evaluate(n + h, [basis_i]);
            const f_j = form.evaluate(n, [basis_j]);
            const f_j_plus = form.evaluate(n + h, [basis_j]);

            return (f_i_plus - f_i) / Number(h) - (f_j_plus - f_j) / Number(h);
          };
          components[j][i] = (n: bigint): number => -components[i][j](n);
        }
      }

      return this.create2Form(components);
    }

    return {
      degree: form.degree + 1,
      evaluate: (): number => 0,
    };
  }

  lieDerivative(field: VectorField, form: DifferentialForm): DifferentialForm {
    const flow = this.computeFlow(field, 0n, 1);

    return {
      degree: form.degree,
      evaluate: (point: bigint, vectors: TangentVector[]): number => {
        const h = 0.01;
        const forward = flow.flowMap(point, h);
        const value_forward = form.evaluate(forward, vectors);
        const value_here = form.evaluate(point, vectors);

        return (value_forward - value_here) / h;
      },
    };
  }

  computePoissonBracket(f: (n: bigint) => number, g: (n: bigint) => number): PoissonBracket {
    const bracket = (n: bigint): number => {
      let result = 0;

      for (let i = 0; i < 4; i++) {
        const shift_p = BigInt(1 << i);
        const shift_q = BigInt(1 << (i + 4));

        const df_dp = (f(n + shift_p) - f(n - shift_p)) / 2;
        const df_dq = (f(n + shift_q) - f(n - shift_q)) / 2;
        const dg_dp = (g(n + shift_p) - g(n - shift_p)) / 2;
        const dg_dq = (g(n + shift_q) - g(n - shift_q)) / 2;

        result += df_dp * dg_dq - df_dq * dg_dp;
      }

      return result;
    };

    return { f, g, bracket };
  }

  covariantDerivative(
    vector: TangentVector,
    direction: TangentVector,
    point: bigint,
  ): TangentVector {
    const christoffel = this.metric.christoffelSymbols(point);
    const components = [...vector.components];

    for (let i = 0; i < 8; i++) {
      let correction = 0;
      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 8; k++) {
          correction += christoffel[i][j][k] * direction.components[j] * vector.components[k];
        }
      }
      components[i] += correction;
    }

    const magnitude = Math.sqrt(components.reduce((sum, c) => sum + c * c, 0));

    return { components, magnitude };
  }

  riemannCurvatureTensor(point: bigint): number[][][][] {
    const dim = 8;
    const R: number[][][][] = Array(dim)
      .fill(null)
      .map((): number[][][] =>
        Array(dim)
          .fill(null)
          .map((): number[][] =>
            Array(dim)
              .fill(null)
              .map((): number[] => Array(dim).fill(0) as number[]),
          ),
      );

    const christoffel = this.metric.christoffelSymbols(point);
    const h = 1n;
    const christoffel_plus = this.metric.christoffelSymbols(point + h);
    const christoffel_minus = this.metric.christoffelSymbols(point - h);

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        for (let k = 0; k < dim; k++) {
          for (let l = 0; l < dim; l++) {
            const partial_k = (christoffel_plus[i][j][l] - christoffel_minus[i][j][l]) / 2;
            const partial_l = (christoffel_plus[i][j][k] - christoffel_minus[i][j][k]) / 2;

            let contraction = 0;
            for (let m = 0; m < dim; m++) {
              contraction +=
                christoffel[i][k][m] * christoffel[m][j][l] -
                christoffel[i][l][m] * christoffel[m][j][k];
            }

            R[i][j][k][l] = partial_k - partial_l + contraction;
          }
        }
      }
    }

    return R;
  }

  private computeMetricTensor(basePoint: bigint): RiemannianMetric {
    const dim = 8;
    const tensor: number[][] = Array(dim)
      .fill(null)
      .map((): number[] => Array(dim).fill(0) as number[]);

    const fieldConstants = this.fieldSubstrate.getFieldConstants();
    const pattern = this.fieldSubstrate.getFieldPattern(basePoint);
    const resonance = this.resonance.calculateResonance(basePoint);

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        if (i === j) {
          tensor[i][j] = pattern[i] ? fieldConstants[i] / resonance : 1;
        } else if (pattern[i] && pattern[j]) {
          tensor[i][j] = (fieldConstants[i] * fieldConstants[j]) / (resonance * resonance * 10);
        }
      }
    }

    const determinant = this.computeDeterminant(tensor);

    return { tensor, determinant };
  }

  private computeDeterminant(matrix: number[][]): number {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let det = 0;
    for (let i = 0; i < n; i++) {
      const minor = this.getMinor(matrix, 0, i);
      det += Math.pow(-1, i) * matrix[0][i] * this.computeDeterminant(minor);
    }
    return det;
  }

  private getMinor(matrix: number[][], row: number, col: number): number[][] {
    return matrix.filter((_, r) => r !== row).map((row) => row.filter((_, c) => c !== col));
  }

  private createBasisVector(index: number): TangentVector {
    const components = Array.from({ length: 8 }, () => 0);
    components[index] = 1;
    return {
      components,
      magnitude: 1,
    };
  }
}
