import { FieldSpaceGeometry } from '../src/field-space';
import { FieldSubstrate } from '@uor-foundation/field-substrate';

describe('FieldSpaceGeometry', () => {
  let fieldSpace: FieldSpaceGeometry;
  let mockFieldSubstrate: jest.Mocked<FieldSubstrate>;

  beforeEach(() => {
    mockFieldSubstrate = {
      getFieldPattern: jest.fn(),
      getFieldConstants: jest.fn(),
      isFieldActive: jest.fn(),
    } as any;

    fieldSpace = new FieldSpaceGeometry(mockFieldSubstrate);
  });

  describe('patternToIndex and indexToPattern', () => {
    it('should correctly convert between pattern and index', () => {
      const testCases = [
        { pattern: [false, false, false, false, false, false, false, false], index: 0 },
        { pattern: [true, false, false, false, false, false, false, false], index: 1 },
        { pattern: [false, true, false, false, false, false, false, false], index: 2 },
        { pattern: [true, true, false, false, false, false, false, false], index: 3 },
        { pattern: [true, true, true, true, true, true, true, true], index: 255 },
      ];

      for (const { pattern, index } of testCases) {
        expect(fieldSpace.patternToIndex(pattern)).toBe(index);
        expect(fieldSpace.indexToPattern(index)).toEqual(pattern);
      }
    });

    it('should be inverse operations', () => {
      for (let i = 0; i < 256; i++) {
        const pattern = fieldSpace.indexToPattern(i);
        expect(fieldSpace.patternToIndex(pattern)).toBe(i);
      }
    });
  });

  describe('hammingDistance', () => {
    it('should compute correct Hamming distance', () => {
      const p1 = [true, false, true, false, false, false, false, false];
      const p2 = [false, false, true, true, false, false, false, false];

      expect(fieldSpace.hammingDistance(p1, p2)).toBe(2);
    });

    it('should return 0 for identical patterns', () => {
      const pattern = [true, false, true, false, true, false, true, false];

      expect(fieldSpace.hammingDistance(pattern, pattern)).toBe(0);
    });

    it('should return 8 for opposite patterns', () => {
      const p1 = new Array(8).fill(true);
      const p2 = new Array(8).fill(false);

      expect(fieldSpace.hammingDistance(p1, p2)).toBe(8);
    });
  });

  describe('getFieldCoordinate', () => {
    it('should create field coordinate from number', () => {
      mockFieldSubstrate.getFieldPattern.mockReturnValue([
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
      ]);

      const coord = fieldSpace.getFieldCoordinate(42n);

      expect(coord.pattern).toEqual([true, false, true, false, false, false, false, false]);
      expect(coord.index).toBe(42);
      expect(coord.activeCount).toBe(2);
    });
  });

  describe('getNeighborhood', () => {
    it('should find all neighbors within radius', () => {
      const center = {
        pattern: [false, false, false, false, false, false, false, false],
        index: 0,
        activeCount: 0,
      };

      const neighborhood = fieldSpace.getNeighborhood(center, 1);

      expect(neighborhood.center).toBe(center);
      expect(neighborhood.radius).toBe(1);
      expect(neighborhood.neighbors.length).toBe(8);
    });

    it('should exclude center from neighbors', () => {
      const center = {
        pattern: [true, false, false, false, false, false, false, false],
        index: 1,
        activeCount: 1,
      };

      const neighborhood = fieldSpace.getNeighborhood(center, 1);

      const centerInNeighbors = neighborhood.neighbors.some(
        (n) => fieldSpace.patternToIndex(n.pattern) === center.index,
      );

      expect(centerInNeighbors).toBe(false);
    });
  });

  describe('getFieldPath', () => {
    it('should find shortest path between coordinates', () => {
      const start = {
        pattern: [false, false, false, false, false, false, false, false],
        index: 0,
        activeCount: 0,
      };

      const end = {
        pattern: [true, true, false, false, false, false, false, false],
        index: 3,
        activeCount: 2,
      };

      const path = fieldSpace.getFieldPath(start, end);

      expect(path[0]).toEqual(start);
      expect(path[path.length - 1].pattern).toEqual(end.pattern);
      expect(path.length).toBe(3);
    });
  });

  describe('getGrayCodePath', () => {
    it('should generate Gray code path through all patterns', () => {
      const path = fieldSpace.getGrayCodePath();

      expect(path.length).toBe(256);

      for (let i = 1; i < path.length; i++) {
        const distance = fieldSpace.hammingDistance(path[i - 1].pattern, path[i].pattern);
        expect(distance).toBe(1);
      }
    });
  });

  describe('isConnected', () => {
    it('should detect connected regions', () => {
      const region = [
        {
          pattern: [false, false, false, false, false, false, false, false],
          index: 0,
          activeCount: 0,
        },
        {
          pattern: [true, false, false, false, false, false, false, false],
          index: 1,
          activeCount: 1,
        },
        {
          pattern: [false, true, false, false, false, false, false, false],
          index: 2,
          activeCount: 1,
        },
      ];

      expect(fieldSpace.isConnected(region)).toBe(true);
    });

    it('should handle empty regions', () => {
      expect(fieldSpace.isConnected([])).toBe(true);
    });

    it('should handle single-point regions', () => {
      const region = [
        {
          pattern: [true, true, true, false, false, false, false, false],
          index: 7,
          activeCount: 3,
        },
      ];

      expect(fieldSpace.isConnected(region)).toBe(true);
    });
  });

  describe('getSymmetryGroup', () => {
    it('should list all symmetry operations', () => {
      const symmetries = fieldSpace.getSymmetryGroup();

      expect(symmetries).toContain('bit_flip_all');
      expect(symmetries).toContain('rotation');
      expect(symmetries.some((s) => s.startsWith('bit_flip_'))).toBe(true);
      expect(symmetries.some((s) => s.startsWith('swap_'))).toBe(true);
    });
  });

  describe('applySymmetry', () => {
    it('should apply bit flip all symmetry', () => {
      const coord = {
        pattern: [true, false, true, false, false, false, false, false],
        index: 5,
        activeCount: 2,
      };

      const result = fieldSpace.applySymmetry(coord, 'bit_flip_all');

      expect(result.pattern).toEqual([false, true, false, true, true, true, true, true]);
      expect(result.activeCount).toBe(6);
    });

    it('should apply rotation symmetry', () => {
      const coord = {
        pattern: [true, false, false, false, false, false, false, false],
        index: 1,
        activeCount: 1,
      };

      const result = fieldSpace.applySymmetry(coord, 'rotation');

      expect(result.pattern).toEqual([false, true, false, false, false, false, false, false]);
    });
  });

  describe('getFieldVolume', () => {
    it('should count unique patterns in region', () => {
      const region = [
        {
          pattern: [false, false, false, false, false, false, false, false],
          index: 0,
          activeCount: 0,
        },
        {
          pattern: [true, false, false, false, false, false, false, false],
          index: 1,
          activeCount: 1,
        },
        {
          pattern: [true, false, false, false, false, false, false, false],
          index: 1,
          activeCount: 1,
        },
        {
          pattern: [false, true, false, false, false, false, false, false],
          index: 2,
          activeCount: 1,
        },
      ];

      expect(fieldSpace.getFieldVolume(region)).toBe(3);
    });
  });
});
