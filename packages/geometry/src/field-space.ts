import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ExtendedFieldPattern, FieldManifold } from './index';

export interface FieldCoordinate {
  pattern: boolean[];
  index: number;
  activeCount: number;
}

export interface FieldNeighborhood {
  center: FieldCoordinate;
  neighbors: FieldCoordinate[];
  radius: number;
}

export class FieldSpaceGeometry {
  private readonly dimension = 8;
  private readonly totalPatterns = 256;

  constructor(private fieldSubstrate: FieldSubstrate) {}

  getFieldCoordinate(n: bigint): FieldCoordinate {
    const pattern = this.fieldSubstrate.getFieldPattern(n);
    const index = Number(n % 256n);
    const activeCount = pattern.filter((b) => b).length;

    return {
      pattern,
      index,
      activeCount,
    };
  }

  patternToIndex(pattern: boolean[]): number {
    let index = 0;
    for (let i = 0; i < this.dimension; i++) {
      if (pattern[i]) {
        index |= 1 << i;
      }
    }
    return index;
  }

  indexToPattern(index: number): boolean[] {
    const pattern = Array.from({ length: this.dimension }, () => false);
    for (let i = 0; i < this.dimension; i++) {
      pattern[i] = (index & (1 << i)) !== 0;
    }
    return pattern;
  }

  hammingDistance(p1: boolean[], p2: boolean[]): number {
    let distance = 0;
    for (let i = 0; i < this.dimension; i++) {
      if (p1[i] !== p2[i]) {
        distance++;
      }
    }
    return distance;
  }

  fieldSpaceDistance(coord1: FieldCoordinate, coord2: FieldCoordinate): number {
    return this.hammingDistance(coord1.pattern, coord2.pattern);
  }

  getNeighborhood(coord: FieldCoordinate, radius: number): FieldNeighborhood {
    const neighbors: FieldCoordinate[] = [];
    const centerIndex = this.patternToIndex(coord.pattern);

    for (let i = 0; i < this.totalPatterns; i++) {
      if (i === centerIndex) continue;

      const pattern = this.indexToPattern(i);
      const distance = this.hammingDistance(coord.pattern, pattern);

      if (distance <= radius) {
        neighbors.push({
          pattern,
          index: i,
          activeCount: pattern.filter((b) => b).length,
        });
      }
    }

    return {
      center: coord,
      neighbors,
      radius,
    };
  }

  getFieldPath(start: FieldCoordinate, end: FieldCoordinate): FieldCoordinate[] {
    const path: FieldCoordinate[] = [start];
    const current = [...start.pattern];

    for (let i = 0; i < this.dimension; i++) {
      if (current[i] !== end.pattern[i]) {
        current[i] = end.pattern[i];
        const index = this.patternToIndex(current);
        path.push({
          pattern: [...current],
          index,
          activeCount: current.filter((b) => b).length,
        });
      }
    }

    return path;
  }

  getOrthogonalBasis(coord: FieldCoordinate): boolean[][] {
    const basis: boolean[][] = [];

    for (let i = 0; i < this.dimension; i++) {
      const basisVector = new Array(this.dimension).fill(false);
      basisVector[i] = true;

      const newPattern = coord.pattern.map((bit, idx) => (idx === i ? !bit : bit));

      basis.push(newPattern);
    }

    return basis;
  }

  getFieldVolume(region: FieldCoordinate[]): number {
    const uniquePatterns = new Set<number>();

    for (const coord of region) {
      uniquePatterns.add(this.patternToIndex(coord.pattern));
    }

    return uniquePatterns.size;
  }

  isConnected(region: FieldCoordinate[]): boolean {
    if (region.length === 0) return true;
    if (region.length === 1) return true;

    const visited = new Set<number>();
    const queue: FieldCoordinate[] = [region[0]];
    visited.add(this.patternToIndex(region[0].pattern));

    const regionIndices = new Set(region.map((coord) => this.patternToIndex(coord.pattern)));

    while (queue.length > 0) {
      const current = queue.shift() as FieldCoordinate;
      const neighborhood = this.getNeighborhood(current, 1);

      for (const neighbor of neighborhood.neighbors) {
        const neighborIndex = neighbor.index;

        if (regionIndices.has(neighborIndex) && !visited.has(neighborIndex)) {
          visited.add(neighborIndex);
          queue.push(neighbor);
        }
      }
    }

    return visited.size === region.length;
  }

  getGrayCodePath(): FieldCoordinate[] {
    const path: FieldCoordinate[] = [];
    const grayCode: number[] = [];

    for (let i = 0; i < this.totalPatterns; i++) {
      grayCode.push(i ^ (i >> 1));
    }

    for (const code of grayCode) {
      const pattern = this.indexToPattern(code);
      path.push({
        pattern,
        index: code,
        activeCount: pattern.filter((b) => b).length,
      });
    }

    return path;
  }

  getHypercubeEmbedding(): Map<number, number[]> {
    const embedding = new Map<number, number[]>();

    for (let i = 0; i < this.totalPatterns; i++) {
      const pattern = this.indexToPattern(i);
      const coords = pattern.map((bit) => (bit ? 1 : -1));
      embedding.set(i, coords);
    }

    return embedding;
  }

  getFieldManifold(): FieldManifold {
    const allPatterns: ExtendedFieldPattern[] = [];

    for (let i = 0; i < this.totalPatterns; i++) {
      const pattern = this.indexToPattern(i);
      const activeFields = pattern
        .map((active, idx) => (active ? idx : -1))
        .filter((idx) => idx >= 0);

      allPatterns.push({ pattern, activeFields });
    }

    const metric = (p1: ExtendedFieldPattern, p2: ExtendedFieldPattern): number => {
      return this.hammingDistance(p1.pattern, p2.pattern);
    };

    const curvature = this.computeHypercubeCurvature();

    return {
      dimension: this.dimension as 8,
      points: allPatterns,
      metric,
      curvature,
      topology: 'torus',
    };
  }

  private computeHypercubeCurvature(): {
    scalar: number;
    ricci: number[][];
    sectional: Map<string, number>;
  } {
    const scalar = 0;

    const ricci = Array(this.dimension)
      .fill(null)
      .map(() => Array(this.dimension).fill(0) as number[]);
    for (let i = 0; i < this.dimension; i++) {
      ricci[i][i] = 0;
    }

    const sectional = new Map<string, number>();
    for (let i = 0; i < this.dimension; i++) {
      for (let j = i + 1; j < this.dimension; j++) {
        sectional.set(`${i}-${j}`, 0);
      }
    }

    return { scalar, ricci, sectional };
  }

  projectToLowerDimension(coord: FieldCoordinate, dimensions: number[]): boolean[] {
    const projection = Array.from({ length: dimensions.length }, () => false);

    for (let i = 0; i < dimensions.length; i++) {
      const dim = dimensions[i];
      if (dim < this.dimension) {
        projection[i] = coord.pattern[dim];
      }
    }

    return projection;
  }

  liftFromLowerDimension(lowDimPattern: boolean[], dimensions: number[]): FieldCoordinate {
    const pattern = Array.from({ length: this.dimension }, () => false);

    for (let i = 0; i < dimensions.length && i < lowDimPattern.length; i++) {
      const dim = dimensions[i];
      if (dim < this.dimension) {
        pattern[dim] = lowDimPattern[i];
      }
    }

    const index = this.patternToIndex(pattern);
    const activeCount = pattern.filter((b) => b).length;

    return { pattern, index, activeCount };
  }

  getSymmetryGroup(): string[] {
    const symmetries: string[] = [];

    symmetries.push('bit_flip_all');

    for (let i = 0; i < this.dimension; i++) {
      symmetries.push(`bit_flip_${i}`);
    }

    for (let i = 0; i < this.dimension; i++) {
      for (let j = i + 1; j < this.dimension; j++) {
        symmetries.push(`swap_${i}_${j}`);
      }
    }

    symmetries.push('rotation');

    return symmetries;
  }

  applySymmetry(coord: FieldCoordinate, symmetry: string): FieldCoordinate {
    let pattern = Array.from(coord.pattern);

    if (symmetry === 'bit_flip_all') {
      pattern = pattern.map((bit) => !bit);
    } else if (symmetry.startsWith('bit_flip_')) {
      const bit = parseInt(symmetry.split('_')[2]);
      pattern[bit] = !pattern[bit];
    } else if (symmetry.startsWith('swap_')) {
      const [i, j] = symmetry.split('_').slice(1).map(Number);
      [pattern[i], pattern[j]] = [pattern[j], pattern[i]];
    } else if (symmetry === 'rotation') {
      pattern = [pattern[this.dimension - 1], ...pattern.slice(0, -1)];
    }

    const index = this.patternToIndex(pattern);
    const activeCount = pattern.filter((b) => b).length;

    return { pattern, index, activeCount };
  }
}
