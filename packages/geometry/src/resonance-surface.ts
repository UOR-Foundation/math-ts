import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';

export interface ResonanceSurface {
  center: bigint;
  radius: bigint;
  values: Map<bigint, number>;
  criticalPoints: CriticalPoint[];
}

export interface CriticalPoint {
  position: bigint;
  value: number;
  type: 'minimum' | 'maximum' | 'saddle';
  hessian: number;
}

export interface EnergyLandscape {
  bounds: { min: bigint; max: bigint };
  resolution: bigint;
  potential: Map<bigint, number>;
  gradientField: Map<bigint, number>;
  flowLines: FlowLine[];
}

export interface FlowLine {
  start: bigint;
  path: bigint[];
  endpoint: bigint;
  endpointType: 'minimum' | 'boundary';
}

export class ResonanceSurfaceAnalyzer {
  constructor(
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {}

  computeResonanceSurface(center: bigint, radius: bigint): ResonanceSurface {
    const values = new Map<bigint, number>();

    for (let offset = -radius; offset <= radius; offset++) {
      const position = center + offset;
      if (position >= 0n) {
        const resonanceValue = this.resonance.calculateResonance(position);
        values.set(position, resonanceValue);
      }
    }

    const criticalPoints = this.findCriticalPoints(values);

    return {
      center,
      radius,
      values,
      criticalPoints,
    };
  }

  findCriticalPoints(surface: Map<bigint, number>): CriticalPoint[] {
    const points: CriticalPoint[] = [];
    const positions = Array.from(surface.keys()).sort((a, b) => Number(a - b));

    for (let i = 1; i < positions.length - 1; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      const next = positions[i + 1];

      const valuePrev = surface.get(prev);
      const valueCurr = surface.get(curr);
      const valueNext = surface.get(next);

      if (valuePrev === undefined || valueCurr === undefined || valueNext === undefined) {
        continue;
      }

      const firstDerivative = (valueNext - valuePrev) / 2;
      const secondDerivative = valueNext - 2 * valueCurr + valuePrev;

      if (Math.abs(firstDerivative) < 1e-6) {
        let type: 'minimum' | 'maximum' | 'saddle';

        if (secondDerivative > 0) {
          type = 'minimum';
        } else if (secondDerivative < 0) {
          type = 'maximum';
        } else {
          type = 'saddle';
        }

        points.push({
          position: curr,
          value: valueCurr,
          type,
          hessian: secondDerivative,
        });
      }
    }

    return points;
  }

  computeEnergyLandscape(min: bigint, max: bigint, resolution: bigint = 1n): EnergyLandscape {
    const potential = new Map<bigint, number>();
    const gradientField = new Map<bigint, number>();

    for (let n = min; n <= max; n += resolution) {
      const resonanceValue = this.resonance.calculateResonance(n);
      potential.set(n, resonanceValue);

      if (n > min && n < max) {
        const prev = this.resonance.calculateResonance(n - resolution);
        const next = this.resonance.calculateResonance(n + resolution);
        const gradient = (next - prev) / (2 * Number(resolution));
        gradientField.set(n, gradient);
      }
    }

    const flowLines = this.computeFlowLines(potential, gradientField, min, max, resolution);

    return {
      bounds: { min, max },
      resolution,
      potential,
      gradientField,
      flowLines,
    };
  }

  computeFlowLines(
    potential: Map<bigint, number>,
    gradientField: Map<bigint, number>,
    min: bigint,
    max: bigint,
    resolution: bigint,
  ): FlowLine[] {
    const flowLines: FlowLine[] = [];
    const visited = new Set<string>();

    for (let start = min; start <= max; start += resolution * 10n) {
      if (visited.has(start.toString())) continue;

      const flowLine = this.followGradientFlow(start, gradientField, min, max, resolution);
      flowLines.push(flowLine);

      for (const point of flowLine.path) {
        visited.add(point.toString());
      }
    }

    return flowLines;
  }

  followGradientFlow(
    start: bigint,
    gradientField: Map<bigint, number>,
    min: bigint,
    max: bigint,
    resolution: bigint,
  ): FlowLine {
    const path: bigint[] = [start];
    let current = start;
    const maxSteps = 1000;
    let steps = 0;

    while (steps < maxSteps) {
      const gradient = gradientField.get(current) ?? 0;

      if (Math.abs(gradient) < 1e-6) {
        return {
          start,
          path,
          endpoint: current,
          endpointType: 'minimum',
        };
      }

      const stepSize = BigInt(Math.sign(-gradient)) * resolution;
      const next = current + stepSize;

      if (next < min || next > max) {
        return {
          start,
          path,
          endpoint: current,
          endpointType: 'boundary',
        };
      }

      if (path.includes(next)) {
        return {
          start,
          path,
          endpoint: current,
          endpointType: 'minimum',
        };
      }

      current = next;
      path.push(current);
      steps++;
    }

    return {
      start,
      path,
      endpoint: current,
      endpointType: 'boundary',
    };
  }

  findBasinsOfAttraction(landscape: EnergyLandscape): Map<bigint, bigint[]> {
    const basins = new Map<bigint, bigint[]>();

    const minima = landscape.flowLines
      .filter((line) => line.endpointType === 'minimum')
      .map((line) => line.endpoint);

    for (const minimum of minima) {
      if (!basins.has(minimum)) {
        basins.set(minimum, []);
      }
    }

    for (const flowLine of landscape.flowLines) {
      if (flowLine.endpointType === 'minimum') {
        const basin = basins.get(flowLine.endpoint);
        if (basin) {
          basin.push(...flowLine.path);
        }
      }
    }

    for (const [minimum, points] of basins) {
      basins.set(
        minimum,
        [...new Set(points)].sort((a, b) => Number(a - b)),
      );
    }

    return basins;
  }

  computePotentialBarrier(from: bigint, to: bigint): number {
    const path = this.findOptimalPath(from, to);
    let maxPotential = -Infinity;

    for (const point of path) {
      const potential = this.resonance.calculateResonance(point);
      maxPotential = Math.max(maxPotential, potential);
    }

    const fromPotential = this.resonance.calculateResonance(from);
    const toPotential = this.resonance.calculateResonance(to);

    return maxPotential - Math.max(fromPotential, toPotential);
  }

  private findOptimalPath(from: bigint, to: bigint): bigint[] {
    const path: bigint[] = [];
    const step = from < to ? 1n : -1n;

    let current = from;
    while (current !== to) {
      path.push(current);
      current += step;
    }
    path.push(to);

    return path;
  }

  visualizeSlice(surface: ResonanceSurface): string {
    const positions = Array.from(surface.values.keys()).sort((a, b) => Number(a - b));
    if (positions.length === 0) return '';

    const minValue = Math.min(...Array.from(surface.values.values()));
    const maxValue = Math.max(...Array.from(surface.values.values()));
    const range = maxValue - minValue;

    const height = 20;
    const lines: string[] = [];

    for (let h = height; h >= 0; h--) {
      let line = '';
      const threshold = minValue + (h / height) * range;

      for (const pos of positions) {
        const value = surface.values.get(pos) ?? 0;
        if (value >= threshold) {
          line += '█';
        } else {
          line += ' ';
        }
      }

      lines.push(line);
    }

    return lines.join('\n');
  }

  computeMorseComplex(landscape: EnergyLandscape): MorseComplex {
    const criticalPoints: CriticalPoint[] = [];

    for (const [position] of landscape.potential) {
      const gradient = landscape.gradientField.get(position) ?? 0;

      if (Math.abs(gradient) < 1e-6) {
        const prev = landscape.potential.get(position - landscape.resolution);
        const curr = landscape.potential.get(position);
        if (curr === undefined) continue;
        const next = landscape.potential.get(position + landscape.resolution);

        if (prev !== undefined && next !== undefined) {
          const secondDerivative = next - 2 * curr + prev;

          let type: 'minimum' | 'maximum' | 'saddle';
          if (secondDerivative > 0) {
            type = 'minimum';
          } else if (secondDerivative < 0) {
            type = 'maximum';
          } else {
            type = 'saddle';
          }

          criticalPoints.push({
            position,
            value: curr,
            type,
            hessian: secondDerivative,
          });
        }
      }
    }

    const connections = this.findMorseConnections(criticalPoints, landscape);

    return {
      criticalPoints,
      connections,
      dimension: 1,
    };
  }

  private findMorseConnections(
    criticalPoints: CriticalPoint[],
    _landscape: EnergyLandscape,
  ): Array<[bigint, bigint]> {
    const connections: Array<[bigint, bigint]> = [];

    const saddles = criticalPoints.filter((p) => p.type === 'saddle');
    const minima = criticalPoints.filter((p) => p.type === 'minimum');

    for (const saddle of saddles) {
      let closestMinimum: bigint | null = null;
      let minDistance = Infinity;

      for (const minimum of minima) {
        if (minimum.position < saddle.position) {
          const distance = Number(saddle.position - minimum.position);
          if (distance < minDistance) {
            minDistance = distance;
            closestMinimum = minimum.position;
          }
        }
      }

      if (closestMinimum !== null) {
        connections.push([saddle.position, closestMinimum]);
      }
    }

    return connections;
  }
}

interface MorseComplex {
  criticalPoints: CriticalPoint[];
  connections: Array<[bigint, bigint]>;
  dimension: number;
}
