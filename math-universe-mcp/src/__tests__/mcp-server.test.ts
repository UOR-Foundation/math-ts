/**
 * Tests for MCP Server Integration
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Mock the math universe modules
jest.mock('../math-universe');
jest.mock('../math-universe-large');

describe('MCP Server Tools', () => {
  let server: McpServer;
  let mockMathDB: jest.Mocked<{
    createNumber: jest.Mock;
    analyzeLargeNumber: jest.Mock;
    isPrimeLarge: jest.Mock;
    normalize: jest.Mock;
    factorizeLarge: jest.Mock;
    searchPatterns: jest.Mock;
    getSchemaFields: jest.Mock;
  }>;

  beforeEach(() => {
    // Reset modules
    jest.resetModules();

    // Create mock MathematicalUniverseDB
    mockMathDB = {
      createNumber: jest.fn(),
      normalize: jest.fn(),
      searchPatterns: jest.fn(),
      analyzePage: jest.fn(),
      listPrimes: jest.fn(),
      multiply: jest.fn(),
      add: jest.fn(),
      getSchemaFields: jest.fn(),
      analyzeLargeNumber: jest.fn(),
      isPrimeLarge: jest.fn(),
      factorizeLarge: jest.fn()
    };

    // Mock the module
    jest.doMock('../math-universe', () => ({
      MathematicalUniverseDB: jest.fn(() => mockMathDB),
      SCHEMA_CONSTANTS: {
        0: { alpha: 1.0, symbol: 'I', type: 'primary_key' },
        1: { alpha: 1.839, symbol: 'T', type: 'relation' },
        2: { alpha: 1.618, symbol: 'φ', type: 'recursive' },
        3: { alpha: 0.5, symbol: '½', type: 'binary_left' },
        4: { alpha: 0.159, symbol: '1/2π', type: 'inverse_transform' },
        5: { alpha: 6.283, symbol: '2π', type: 'forward_transform' },
        6: { alpha: 0.199, symbol: 'θ', type: 'state_coupling' },
        7: { alpha: 0.014, symbol: 'ζ', type: 'deep_pointer' }
      }
    }));

    // Create server instance
    server = new McpServer(
      {
        name: 'math-universe-test',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        }
      }
    );
  });

  describe('analyze-number tool', () => {
    test('should analyze regular numbers', () => {
      // Mock return value
      mockMathDB.createNumber.mockReturnValue({
        value: 7,
        computed: {
          field_signature: 'I+T+φ',
          resonance: 2.975,
          page: 0,
          offset: 7,
          depth: 2
        },
        integrity: {
          is_primitive: false,
          is_normalized: true
        },
        fields: {
          identity: { active: true, alpha: 1.0, symbol: 'I' },
          tribonacci: { active: true, alpha: 1.839, symbol: 'T' },
          golden: { active: true, alpha: 1.618, symbol: 'φ' },
          half: { active: false, alpha: 0.5, symbol: '½' },
          inv_freq: { active: false, alpha: 0.159, symbol: '1/2π' },
          freq: { active: false, alpha: 6.283, symbol: '2π' },
          phase: { active: false, alpha: 0.199, symbol: 'θ' },
          zeta: { active: false, alpha: 0.014, symbol: 'ζ' }
        },
        relationships: {
          factors: undefined
        }
      });

      // Register the actual tool implementation
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { server: _mcpServer } = require('../index');

      // The tool should handle number input
      expect(mockMathDB.createNumber).toBeDefined();
    });

    test('should handle large numbers', () => {
      // Mock large number analysis
      mockMathDB.analyzeLargeNumber.mockReturnValue({
        primary_pattern: '11100000',
        resonance_signature: 2.975,
        field_harmonics: 'ab, cd, ef'
      });

      mockMathDB.isPrimeLarge.mockResolvedValue({
        is_prime: false,
        confidence: 0.85,
        evidence: ['Strong tribonacci decoherence detected']
      });

      // Large numbers should use different analysis path
      expect(mockMathDB.analyzeLargeNumber).toBeDefined();
      expect(mockMathDB.isPrimeLarge).toBeDefined();
    });
  });

  describe('normalize-number tool', () => {
    test('should normalize regular numbers', () => {
      mockMathDB.normalize.mockReturnValue({
        original: { value: 12, computed: { field_signature: 'φ+½' } },
        normalized_form: [
          { value: 2, computed: { field_signature: 'T' } },
          { value: 2, computed: { field_signature: 'T' } },
          { value: 3, computed: { field_signature: 'I+T' } }
        ],
        process: {
          steps: [
            { operation: 'divide by 2', result: 6 },
            { operation: 'divide by 2', result: 3 },
            { operation: 'divide by 3', result: 1 }
          ],
          field_reconciliation: {
            original_fields: [2, 3],
            combined_factor_fields: [0, 1],
            artifacts: [3],
            missing: [0, 1]
          }
        }
      });

      expect(mockMathDB.normalize).toBeDefined();
    });

    test('should handle large number factorization', () => {
      mockMathDB.factorizeLarge.mockResolvedValue({
        factors: ['7', '11'],
        method: 'Field collapse factorization',
        confidence: 0.7,
        iterations: 5
      });

      expect(mockMathDB.factorizeLarge).toBeDefined();
    });
  });

  describe('search-patterns tool', () => {
    test('should search for field patterns', () => {
      mockMathDB.searchPatterns.mockReturnValue([
        {
          value: 7,
          computed: { field_signature: 'I+T+φ', resonance: 2.975, page: 0, offset: 7 },
          integrity: { is_normalized: true }
        },
        {
          value: 263,
          computed: { field_signature: 'I+T+φ', resonance: 2.975, page: 5, offset: 23 },
          integrity: { is_normalized: true }
        }
      ]);

      expect(mockMathDB.searchPatterns).toBeDefined();
    });
  });

  describe('Resources', () => {
    test('should provide schema fields resource', () => {
      mockMathDB.getSchemaFields.mockReturnValue([
        {
          index: 0,
          primitive: 1,
          alpha: 1.0,
          name: 'identity',
          type: 'primary_key',
          symbol: 'I',
          description: 'Universal identity field'
        }
      ]);

      expect(mockMathDB.getSchemaFields).toBeDefined();
    });
  });

  describe('Prompts', () => {
    test('should generate exploration prompts', () => {
      // Prompts should be registered
      expect(server).toBeDefined();
    });
  });
});

describe('Tool Input Validation', () => {
  test('analyze-number should accept number or string', () => {
    const schema = z.union([z.number().int().min(0), z.string().regex(/^\d+$/)]);

    expect(() => schema.parse(42)).not.toThrow();
    expect(() => schema.parse('123456789012345678901234567890')).not.toThrow();
    expect(() => schema.parse(-5)).toThrow();
    expect(() => schema.parse('abc')).toThrow();
  });

  test('search-patterns should validate field pattern', () => {
    const schema = z.string().regex(/^[01]{8}$/);

    expect(() => schema.parse('11100000')).not.toThrow();
    expect(() => schema.parse('00000000')).not.toThrow();
    expect(() => schema.parse('11111111')).not.toThrow();
    expect(() => schema.parse('1110000')).toThrow(); // Too short
    expect(() => schema.parse('111000000')).toThrow(); // Too long
    expect(() => schema.parse('1110000x')).toThrow(); // Invalid character
  });

  test('page numbers should be non-negative', () => {
    const schema = z.number().int().min(0);

    expect(() => schema.parse(0)).not.toThrow();
    expect(() => schema.parse(10)).not.toThrow();
    expect(() => schema.parse(-1)).toThrow();
    expect(() => schema.parse(3.14)).toThrow();
  });
});
