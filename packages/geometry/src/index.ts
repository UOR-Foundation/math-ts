export interface GeometricManifolds {
  getMetric(a: bigint, b: bigint): number;
  findGeodesic(start: bigint, end: bigint): bigint[];
  getCurvature(n: bigint): CurvatureTensor;
}

export interface CurvatureTensor {
  scalar: number;
  ricci: number[][];
  sectional: Map<string, number>;
}

export interface PageManifold {
  basePoint: bigint;
  dimension: number;
  curvature: number;
  lagrangeWells: bigint[];
}

import type { FieldPattern } from '@uor-foundation/field-substrate';

export interface ExtendedFieldPattern {
  pattern: FieldPattern; // This is boolean[]
  activeFields: number[];
}

export interface FieldManifold {
  dimension: 8;
  points: ExtendedFieldPattern[];
  metric: (p1: ExtendedFieldPattern, p2: ExtendedFieldPattern) => number;
  curvature: CurvatureTensor;
  topology: 'torus';
}

export interface TangentSpace {
  basePoint: bigint;
  dimension: number;
  basis: TangentVector[];
  metric: RiemannianMetric;
}

export interface TangentVector {
  components: number[];
  magnitude: number;
}

export interface RiemannianMetric {
  tensor: number[][];
  determinant: number;
}

export interface UniversalBundle {
  base: 'NumberLine';
  fiber: 'FieldSpace';
  projection: (n: bigint, fields: ExtendedFieldPattern) => bigint;
  connection: FieldConnection;
}

export interface FieldConnection {
  parallelTransport: (v: TangentVector, path: bigint[]) => TangentVector;
  curvatureForm: number[][];
}

export * from './manifold';
export * from './metric';
export * from './geodesics';
export * from './field-space';
export * from './resonance-surface';
export * from './topology';
export * from './differential';
export * from './embedding';
