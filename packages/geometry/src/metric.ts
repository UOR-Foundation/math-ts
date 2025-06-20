import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ExtendedFieldPattern } from './index';

export class ResonanceMetric {
  constructor(
    private fieldSubstrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {}

  distance(a: bigint, b: bigint): number {
    const euclideanDist = this.euclideanFieldDistance(a, b);
    const resonanceBarrier = this.resonanceBarrier(a, b);
    const topologicalDist = this.topologicalDistance(a, b);

    return Math.sqrt(
      euclideanDist * euclideanDist +
        resonanceBarrier * resonanceBarrier +
        topologicalDist * topologicalDist,
    );
  }

  euclideanFieldDistance(a: bigint, b: bigint): number {
    const patternA = this.fieldSubstrate.getFieldPattern(a);
    const patternB = this.fieldSubstrate.getFieldPattern(b);

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      if (patternA[i] !== patternB[i]) {
        sum += 1;
      }
    }

    return Math.sqrt(sum);
  }

  resonanceBarrier(a: bigint, b: bigint): number {
    const resA = this.resonance.calculateResonance(a);
    const resB = this.resonance.calculateResonance(b);
    return Math.abs(resA - resB);
  }

  topologicalDistance(a: bigint, b: bigint): number {
    const pageNumberA = Number(a / 48n);
    const pageNumberB = Number(b / 48n);
    const pageA = this.topology.getPageInfo(pageNumberA).pageNumber;
    const pageB = this.topology.getPageInfo(pageNumberB).pageNumber;

    const pageDiff = pageB > pageA ? pageB - pageA : pageA - pageB;
    const boundaries = Number(pageDiff);

    // Compute position within page (0-47)
    const posA = Number(a % 48n);
    const posB = Number(b % 48n);

    if (pageDiff === 0) {
      return Math.abs(posB - posA) / 48;
    }

    return boundaries + (48 - posA + posB) / 48;
  }

  intrinsicDistance(a: bigint, b: bigint): bigint {
    return a > b ? a - b : b - a;
  }

  fieldMetric(p1: ExtendedFieldPattern, p2: ExtendedFieldPattern): number {
    let hammingDistance = 0;
    for (let i = 0; i < 8; i++) {
      if (p1.pattern[i] !== p2.pattern[i]) {
        hammingDistance++;
      }
    }
    return hammingDistance;
  }

  resonanceSurface(n: bigint, radius: bigint = 10n): Map<bigint, number> {
    const surface = new Map<bigint, number>();

    for (let offset = -radius; offset <= radius; offset++) {
      const point = n + offset;
      if (point >= 0n) {
        const resonance = this.resonance.calculateResonance(point);
        surface.set(point, resonance);
      }
    }

    return surface;
  }

  gradient(n: bigint, h: bigint = 1n): number[] {
    const grad: number[] = new Array(8).fill(0) as number[];
    const baseResonance = this.resonance.calculateResonance(n);

    for (let fieldIdx = 0; fieldIdx < 8; fieldIdx++) {
      const testPoint = n + BigInt(1 << fieldIdx);
      const testResonance = this.resonance.calculateResonance(testPoint);
      grad[fieldIdx] = (testResonance - baseResonance) / Number(h);
    }

    return grad;
  }

  laplacian(n: bigint, h: bigint = 1n): number {
    const center = this.resonance.calculateResonance(n);
    const forward = this.resonance.calculateResonance(n + h);
    const backward = this.resonance.calculateResonance(n - h);

    return (forward - 2 * center + backward) / Number(h * h);
  }

  christoffelSymbols(n: bigint): number[][][] {
    const dim = 8;
    const symbols: number[][][] = Array(dim)
      .fill(null)
      .map((): number[][] =>
        Array(dim)
          .fill(null)
          .map((): number[] => Array(dim).fill(0) as number[]),
      );

    const pattern = this.fieldSubstrate.getFieldPattern(n);
    const fieldConstants = this.fieldSubstrate.getFieldConstants();
    const resonance = this.resonance.calculateResonance(n);

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        for (let k = 0; k < dim; k++) {
          if (pattern[i] && pattern[j] && pattern[k]) {
            symbols[i][j][k] =
              (fieldConstants[i] * fieldConstants[j] * fieldConstants[k]) /
              (resonance * resonance * resonance * 1000);
          }
        }
      }
    }

    return symbols;
  }

  biLipschitzBounds(a: bigint, b: bigint): { lower: number; upper: number } {
    const intrinsic = Number(this.intrinsicDistance(a, b));
    const kMax = 1.92;

    return {
      lower: intrinsic / (1 + kMax),
      upper: intrinsic,
    };
  }

  isIsometry(f: (n: bigint) => bigint, a: bigint, b: bigint): boolean {
    const distBefore = this.distance(a, b);
    const distAfter = this.distance(f(a), f(b));
    const epsilon = 1e-10;

    return Math.abs(distBefore - distAfter) < epsilon;
  }
}
