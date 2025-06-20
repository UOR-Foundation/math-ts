import type { PageTopology } from '@uor-foundation/topology';

export interface Point2D {
  x: number;
  y: number;
}

export interface CurveSegment {
  start: bigint;
  end: bigint;
  curvature: number;
  points: Point2D[];
}

export interface GeometricEmbedding {
  folio: bigint;
  curve: Point2D[];
  segments: CurveSegment[];
  totalRotation: number;
}

export interface RotationMatrix {
  cos: number;
  sin: number;
}

export class ContinuousEmbedding {
  private readonly LAMBDA = 256;
  private readonly FOLIO_SIZE = 65536;
  private readonly rotationCache: Map<number, RotationMatrix> = new Map();

  constructor(private topology: PageTopology) {
    this.precomputeRotations();
  }

  embedFolio(startIndex: bigint = 0n): GeometricEmbedding {
    const curve: Point2D[] = [];
    const segments: CurveSegment[] = [];

    let currentPos: Point2D = { x: 0, y: 0 };
    let currentAngle = 0;

    curve.push({ ...currentPos });

    for (let i = 0n; i < BigInt(this.FOLIO_SIZE); i++) {
      const n = startIndex + i;
      const curvature = this.computeCurvature(n);

      const segmentStart = { ...currentPos };
      const segmentPoints: Point2D[] = [segmentStart];

      currentAngle += curvature;

      const rotation = this.getRotation(currentAngle);
      const dx = rotation.cos;
      const dy = rotation.sin;

      currentPos = {
        x: currentPos.x + dx,
        y: currentPos.y + dy,
      };

      segmentPoints.push({ ...currentPos });
      curve.push({ ...currentPos });

      if (i % 48n === 0n) {
        segments.push({
          start: n,
          end: n + 47n,
          curvature: curvature,
          points: segmentPoints,
        });
      }
    }

    return {
      folio: startIndex / BigInt(this.FOLIO_SIZE),
      curve,
      segments,
      totalRotation: currentAngle,
    };
  }

  computeCurvature(n: bigint): number {
    const offset = Number(n % BigInt(this.LAMBDA));
    const pagePosition = Number(n % 48n);

    if (pagePosition === 0 || pagePosition === 1) {
      return 1.31;
    }

    if (pagePosition === 47) {
      return 1.92;
    }

    if (offset === 23) {
      return -0.42;
    }

    if (offset === 107) {
      return -0.57;
    }

    return 0;
  }

  getEmbedding(n: bigint): Point2D {
    const folioStart = (n / BigInt(this.FOLIO_SIZE)) * BigInt(this.FOLIO_SIZE);
    const relativeIndex = n - folioStart;

    const pos: Point2D = { x: 0, y: 0 };
    let angle = 0;

    for (let i = 0n; i < relativeIndex; i++) {
      const curvature = this.computeCurvature(folioStart + i);
      angle += curvature;

      const rotation = this.getRotation(angle);
      pos.x += rotation.cos;
      pos.y += rotation.sin;
    }

    return pos;
  }

  computeGeodesic(a: bigint, b: bigint): Point2D[] {
    if (a === b) return [this.getEmbedding(a)];

    const path: Point2D[] = [];
    const step = a < b ? 1n : -1n;

    for (let n = a; n !== b + step; n += step) {
      path.push(this.getEmbedding(n));
    }

    return path;
  }

  embeddingDistance(a: bigint, b: bigint): number {
    const pointA = this.getEmbedding(a);
    const pointB = this.getEmbedding(b);

    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  intrinsicDistance(a: bigint, b: bigint): bigint {
    return a > b ? a - b : b - a;
  }

  biLipschitzBounds(a: bigint, b: bigint): { lower: number; upper: number } {
    const intrinsic = Number(this.intrinsicDistance(a, b));
    const kMax = 1.92;

    return {
      lower: intrinsic / (1 + kMax),
      upper: intrinsic,
    };
  }

  computeArcLength(path: Point2D[]): number {
    if (path.length < 2) return 0;

    let length = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const dx = path[i + 1].x - path[i].x;
      const dy = path[i + 1].y - path[i].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }

    return length;
  }

  findCriticalCurvaturePoints(start: bigint, end: bigint): bigint[] {
    const criticalPoints: bigint[] = [];

    for (let n = start; n <= end; n++) {
      const curvature = this.computeCurvature(n);
      const nextCurvature = this.computeCurvature(n + 1n);
      const prevCurvature = n > 0n ? this.computeCurvature(n - 1n) : curvature;

      if (
        (curvature > prevCurvature && curvature > nextCurvature) ||
        (curvature < prevCurvature && curvature < nextCurvature)
      ) {
        criticalPoints.push(n);
      }

      if (prevCurvature * curvature < 0 || curvature * nextCurvature < 0) {
        criticalPoints.push(n);
      }
    }

    return criticalPoints;
  }

  visualizeEmbedding(
    embedding: GeometricEmbedding,
    width: number = 80,
    height: number = 40,
  ): string[] {
    const grid: string[][] = Array(height)
      .fill(null)
      .map((): string[] => Array(width).fill(' ') as string[]);

    const minX = Math.min(...embedding.curve.map((p) => p.x));
    const maxX = Math.max(...embedding.curve.map((p) => p.x));
    const minY = Math.min(...embedding.curve.map((p) => p.y));
    const maxY = Math.max(...embedding.curve.map((p) => p.y));

    const scaleX = (width - 2) / (maxX - minX);
    const scaleY = (height - 2) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);

    for (const point of embedding.curve) {
      const x = Math.floor((point.x - minX) * scale + 1);
      const y = Math.floor((point.y - minY) * scale + 1);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[height - 1 - y][x] = '█';
      }
    }

    return grid.map((row): string => row.join(''));
  }

  getWindingNumber(embedding: GeometricEmbedding): number {
    return Math.round(embedding.totalRotation / (2 * Math.PI));
  }

  interpolateOnCurve(n: bigint, t: number): Point2D {
    const basePoint = this.getEmbedding(n);
    const nextPoint = this.getEmbedding(n + 1n);

    return {
      x: basePoint.x + t * (nextPoint.x - basePoint.x),
      y: basePoint.y + t * (nextPoint.y - basePoint.y),
    };
  }

  private precomputeRotations(): void {
    for (let i = 0; i < this.LAMBDA; i++) {
      const curvatures: number[] = [];
      for (let j = 0; j <= i; j++) {
        curvatures.push(this.computeCurvature(BigInt(j)));
      }

      const totalAngle = curvatures.reduce((sum, k) => sum + k, 0);

      this.rotationCache.set(i, {
        cos: Math.cos(totalAngle),
        sin: Math.sin(totalAngle),
      });
    }
  }

  private getRotation(angle: number): RotationMatrix {
    return {
      cos: Math.cos(angle),
      sin: Math.sin(angle),
    };
  }

  extendToComplexPlane(n: bigint): { real: number; imag: number } {
    const point = this.getEmbedding(n);
    const resonance = Math.sin((Number(n) * Math.PI) / 128);

    return {
      real: point.x,
      imag: point.y * resonance,
    };
  }

  computeSpectralGap(start: bigint, end: bigint): number {
    const curvatures: number[] = [];

    for (let n = start; n <= end; n++) {
      curvatures.push(Math.abs(this.computeCurvature(n)));
    }

    curvatures.sort((a, b) => a - b);

    if (curvatures.length < 2) return 0;

    return curvatures[1] - curvatures[0];
  }

  detectBottlenecks(embedding: GeometricEmbedding): bigint[] {
    const bottlenecks: bigint[] = [];

    for (const segment of embedding.segments) {
      if (Math.abs(segment.curvature) > 1.5) {
        bottlenecks.push(segment.start);
      }
    }

    return bottlenecks;
  }
}
