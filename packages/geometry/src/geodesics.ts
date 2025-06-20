import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import { ResonanceMetric } from './metric';

export interface GeodesicPath {
  start: bigint;
  end: bigint;
  path: bigint[];
  length: number;
  curvature: number[];
}

export interface GeodesicFlow {
  position: bigint;
  velocity: number;
  acceleration: number;
}

export class GeodesicCalculator {
  private metric: ResonanceMetric;

  constructor(
    private fieldSubstrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {
    this.metric = new ResonanceMetric(fieldSubstrate, resonance, topology);
  }

  findGeodesic(start: bigint, end: bigint): GeodesicPath {
    const path = this.dijkstraGeodesic(start, end);
    const length = this.computePathLength(path);
    const curvature = this.computePathCurvature(path);

    return {
      start,
      end,
      path,
      length,
      curvature,
    };
  }

  dijkstraGeodesic(start: bigint, end: bigint): bigint[] {
    if (start === end) return [start];

    const visited = new Set<string>();
    const distances = new Map<string, number>();
    const previous = new Map<string, bigint>();
    const queue = new Set<bigint>([start]);

    distances.set(start.toString(), 0);

    while (queue.size > 0) {
      let current: bigint | undefined;
      let minDist = Infinity;

      for (const node of queue) {
        const dist = distances.get(node.toString()) ?? Infinity;
        if (dist < minDist) {
          minDist = dist;
          current = node;
        }
      }

      if (current === undefined || current === end) break;

      queue.delete(current);
      visited.add(current.toString());

      const neighbors = this.getGeodesicNeighbors(current, end);

      for (const neighbor of neighbors) {
        if (visited.has(neighbor.toString())) continue;

        const alt =
          (distances.get(current.toString()) ?? 0) + this.metric.distance(current, neighbor);

        if (alt < (distances.get(neighbor.toString()) ?? Infinity)) {
          distances.set(neighbor.toString(), alt);
          previous.set(neighbor.toString(), current);
          queue.add(neighbor);
        }
      }

      if (queue.size > 1000) {
        break;
      }
    }

    const path: bigint[] = [];
    let current: bigint | undefined = end;

    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current.toString());
      if (current === start) {
        path.unshift(start);
        break;
      }
    }

    if (path[0] !== start) {
      return this.straightLineGeodesic(start, end);
    }

    return path;
  }

  straightLineGeodesic(start: bigint, end: bigint): bigint[] {
    const path: bigint[] = [];
    const step = start < end ? 1n : -1n;

    for (let n = start; n !== end; n += step) {
      path.push(n);
    }
    path.push(end);

    return path;
  }

  private getGeodesicNeighbors(n: bigint, target: bigint): bigint[] {
    const neighbors: bigint[] = [];

    neighbors.push(n - 1n, n + 1n);

    const pageNumber = Number(n / 48n);
    const targetPageNumber = Number(target / 48n);
    const pageInfo = this.topology.getPageInfo(pageNumber);
    const targetPageInfo = this.topology.getPageInfo(targetPageNumber);
    const targetPage = targetPageInfo.pageNumber;

    if (Math.abs(targetPage - pageInfo.pageNumber) > 1) {
      const jumpDistance = 48n;
      neighbors.push(n - jumpDistance, n + jumpDistance);
    }

    const gradient = this.metric.gradient(n);
    const maxGradientIdx = gradient.indexOf(Math.max(...gradient.map(Math.abs)));
    if (maxGradientIdx >= 0) {
      const fieldJump = n + BigInt(1 << maxGradientIdx);
      if (fieldJump !== n) {
        neighbors.push(fieldJump);
      }
    }

    return neighbors.filter((neighbor) => neighbor >= 0n);
  }

  computePathLength(path: bigint[]): number {
    if (path.length < 2) return 0;

    let length = 0;
    for (let i = 0; i < path.length - 1; i++) {
      length += this.metric.distance(path[i], path[i + 1]);
    }

    return length;
  }

  computePathCurvature(path: bigint[]): number[] {
    if (path.length < 3) return [];

    const curvatures: number[] = [];

    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];

      const v1 = { x: Number(curr - prev), y: 0 };
      const v2 = { x: Number(next - curr), y: 0 };

      const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
      const curvature = angle / Math.sqrt(v1.x * v1.x + v1.y * v1.y);

      curvatures.push(curvature);
    }

    return curvatures;
  }

  geodesicFlow(start: bigint, velocity: number, time: number): GeodesicFlow {
    const position = start + BigInt(Math.floor(velocity * time));

    const resonanceGradient = this.metric.gradient(position);
    const acceleration = -resonanceGradient.reduce((sum, g) => sum + g * g, 0);

    return {
      position,
      velocity: velocity + acceleration * time,
      acceleration,
    };
  }

  exponentialMap(basePoint: bigint, tangentVector: number[], t: number): bigint {
    const displacement = tangentVector.reduce((sum, v, i) => {
      return sum + BigInt(Math.floor(v * t * (1 << i)));
    }, 0n);

    return basePoint + displacement;
  }

  parallelTransport(vector: number[], path: bigint[]): number[] {
    if (path.length < 2) return vector;

    let current = [...vector];

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];

      const christoffel = this.metric.christoffelSymbols(from);
      const transported = [...current];

      for (let j = 0; j < 8; j++) {
        let correction = 0;
        for (let k = 0; k < 8; k++) {
          for (let l = 0; l < 8; l++) {
            correction += christoffel[j][k][l] * current[k] * current[l];
          }
        }
        transported[j] -= correction * Number(to - from);
      }

      const norm = Math.sqrt(transported.reduce((sum, v) => sum + v * v, 0));
      if (norm > 0) {
        for (let j = 0; j < 8; j++) {
          transported[j] /= norm;
        }
      }

      current = transported;
    }

    return current;
  }

  isGeodesic(path: bigint[]): boolean {
    if (path.length < 2) return true;

    const direct = this.findGeodesic(path[0], path[path.length - 1]);

    if (direct.path.length !== path.length) return false;

    const epsilon = 1e-6;
    return direct.path.every((point, i) => {
      const dist = this.metric.distance(point, path[i]);
      return dist < epsilon;
    });
  }

  geodesicDeviation(path1: bigint[], path2: bigint[]): number[] {
    const minLength = Math.min(path1.length, path2.length);
    const deviations: number[] = [];

    for (let i = 0; i < minLength; i++) {
      const dist = this.metric.distance(path1[i], path2[i]);
      deviations.push(dist);
    }

    return deviations;
  }

  conjugatePoints(start: bigint, direction: number[]): bigint[] {
    const conjugates: bigint[] = [];
    const maxDistance = 1000n;

    for (let t = 1; t <= 100; t++) {
      const point = this.exponentialMap(start, direction, t);

      if (point - start > maxDistance) break;

      const jacobian = this.computeJacobian(start, point);
      if (Math.abs(jacobian) < 1e-10) {
        conjugates.push(point);
      }
    }

    return conjugates;
  }

  private computeJacobian(start: bigint, end: bigint): number {
    const h = 1n;
    const geodesic = this.findGeodesic(start, end);
    const perturbedGeodesic = this.findGeodesic(start + h, end + h);

    const deviation = this.geodesicDeviation(geodesic.path, perturbedGeodesic.path);
    return deviation.length > 0 ? deviation[deviation.length - 1] / Number(h) : 0;
  }
}
