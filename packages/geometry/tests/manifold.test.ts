import { MathematicalManifold } from '../src/manifold';
import { FieldSubstrate } from '@uor-foundation/field-substrate';
import { ResonanceDynamics } from '@uor-foundation/resonance';
import { PageTopology } from '@uor-foundation/topology';
import { ArithmeticOperators } from '@uor-foundation/operators';
import { AlgebraicStructures } from '@uor-foundation/algebra';

describe('MathematicalManifold', () => {
  let manifold: MathematicalManifold;
  let mockFieldSubstrate: jest.Mocked<FieldSubstrate>;
  let mockResonance: jest.Mocked<ResonanceDynamics>;
  let mockTopology: jest.Mocked<PageTopology>;
  let mockOperators: jest.Mocked<ArithmeticOperators>;
  let mockAlgebra: jest.Mocked<AlgebraicStructures>;

  beforeEach(() => {
    mockFieldSubstrate = {
      getFieldPattern: jest.fn(),
      getFieldConstants: jest.fn(),
      isFieldActive: jest.fn(),
    } as any;

    mockResonance = {
      calculateResonance: jest.fn(),
      fieldInterference: jest.fn(),
      getResonanceEvidence: jest.fn(),
    } as any;

    mockTopology = {
      getPageInfo: jest.fn(),
      getStabilityMetric: jest.fn(),
    } as any;

    mockOperators = {
      add: jest.fn(),
      multiply: jest.fn(),
      factorize: jest.fn(),
    } as any;

    mockAlgebra = {
      detectGroups: jest.fn(),
      findRingStructure: jest.fn(),
      analyzeSymmetries: jest.fn(),
    } as any;

    manifold = new MathematicalManifold(
      mockFieldSubstrate,
      mockResonance,
      mockTopology,
      mockOperators,
      mockAlgebra,
    );
  });

  describe('getMetric', () => {
    it('should compute metric between two numbers', () => {
      mockFieldSubstrate.getFieldPattern
        .mockReturnValueOnce([true, false, true, false, false, false, false, false])
        .mockReturnValueOnce([false, true, true, false, false, false, false, false]);

      mockResonance.calculateResonance.mockReturnValueOnce(2.5).mockReturnValueOnce(3.2);

      mockTopology.getPageInfo
        .mockReturnValueOnce({ pageNumber: 0 } as any)
        .mockReturnValueOnce({ pageNumber: 1 } as any);

      const distance = manifold.getMetric(5n, 58n);

      expect(distance).toBeGreaterThan(0);
      expect(mockFieldSubstrate.getFieldPattern).toHaveBeenCalledTimes(2);
      expect(mockResonance.calculateResonance).toHaveBeenCalledTimes(2);
    });

    it('should return 0 for same number', () => {
      mockFieldSubstrate.getFieldPattern.mockReturnValue(
        [true, false, true, false, false, false, false, false]
      );

      mockResonance.calculateResonance.mockReturnValue(2.5);

      mockTopology.getPageInfo.mockReturnValue({ pageNumber: 0 } as any);

      const distance = manifold.getMetric(5n, 5n);

      expect(distance).toBe(0);
    });
  });

  describe('findGeodesic', () => {
    it('should find path between two numbers', () => {
      mockFieldSubstrate.getFieldPattern.mockReturnValue(
        [true, false, false, false, false, false, false, false]
      );

      mockResonance.calculateResonance.mockReturnValue(1.0);

      mockTopology.getPageInfo.mockReturnValue({ pageNumber: 0 } as any);

      const geodesic = manifold.findGeodesic(0n, 5n);

      expect(geodesic).toContain(0n);
      expect(geodesic).toContain(5n);
      expect(geodesic.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getCurvature', () => {
    it('should compute curvature tensor at a point', () => {
      mockFieldSubstrate.getFieldPattern.mockReturnValue(
        [true, true, false, false, false, false, false, false]
      );

      mockFieldSubstrate.getFieldConstants.mockReturnValue([
        2.71, 3.14, 1.61, 1.73, 2.24, 2.44, 1.41, 1.92,
      ]);

      mockResonance.calculateResonance
        .mockReturnValueOnce(2.0)
        .mockReturnValueOnce(2.1)
        .mockReturnValueOnce(1.9)
        .mockReturnValueOnce(2.2)
        .mockReturnValueOnce(1.8);

      const curvature = manifold.getCurvature(10n);

      expect(curvature.scalar).toBeDefined();
      expect(curvature.ricci).toBeDefined();
      expect(curvature.ricci.length).toBe(8);
      expect(curvature.sectional).toBeDefined();
      expect(curvature.sectional.size).toBeGreaterThan(0);
    });
  });

  describe('getPageManifold', () => {
    it('should create page manifold structure', () => {
      mockTopology.getPageInfo.mockReturnValue({ pageNumber: 1 } as any);

      mockFieldSubstrate.getFieldPattern.mockReturnValue(
        [true, false, true, false, false, false, false, false]
      );

      mockResonance.calculateResonance.mockReturnValue(2.0);

      mockFieldSubstrate.getFieldConstants.mockReturnValue([
        2.71, 3.14, 1.61, 1.73, 2.24, 2.44, 1.41, 1.92,
      ]);

      const pageManifold = manifold.getPageManifold(1n);

      expect(pageManifold.basePoint).toBe(48n);
      expect(pageManifold.dimension).toBeGreaterThan(0);
      expect(pageManifold.lagrangeWells).toEqual([]);
    });
  });

  describe('getTangentSpace', () => {
    it('should create tangent space at a point', () => {
      mockFieldSubstrate.getFieldPattern.mockReturnValue(
        [true, true, false, false, false, false, false, false]
      );

      mockFieldSubstrate.getFieldConstants.mockReturnValue([
        2.71, 3.14, 1.61, 1.73, 2.24, 2.44, 1.41, 1.92,
      ]);

      mockResonance.calculateResonance.mockReturnValue(2.5);

      const tangentSpace = manifold.getTangentSpace(7n);

      expect(tangentSpace.basePoint).toBe(7n);
      expect(tangentSpace.dimension).toBe(2);
      expect(tangentSpace.basis.length).toBe(8);
      expect(tangentSpace.metric.tensor).toBeDefined();
      expect(tangentSpace.metric.determinant).toBeDefined();
    });
  });

  describe('getUniversalBundle', () => {
    it('should create universal bundle structure', () => {
      const bundle = manifold.getUniversalBundle();

      expect(bundle.base).toBe('NumberLine');
      expect(bundle.fiber).toBe('FieldSpace');
      expect(bundle.projection).toBeDefined();
      expect(bundle.connection).toBeDefined();
      expect(bundle.connection.parallelTransport).toBeDefined();
      expect(bundle.connection.curvatureForm).toBeDefined();
    });

    it('should correctly project from total space', () => {
      const bundle = manifold.getUniversalBundle();
      const result = bundle.projection(42n, { pattern: [true, false], activeFields: [0] });

      expect(result).toBe(42n);
    });
  });
});