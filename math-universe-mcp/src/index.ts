#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { MathematicalUniverseDB } from './math-universe.js';
import type { MathematicalNumber } from './math-universe.js';

// Initialize the mathematical universe database
const mathDB = new MathematicalUniverseDB();

// Create the MCP server instance
const server = new McpServer(
  {
    name: 'math-universe',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      logging: {}
    }
  }
);

// Tool: Analyze a number
server.registerTool(
  'analyze-number',
  {
    description:
      'Analyze a number in the mathematical universe database, showing its field activation pattern, resonance, and database properties. Supports large numbers as strings.',
    inputSchema: {
      value: z
        .union([z.number().int().min(0), z.string().regex(/^\d+$/)])
        .describe('The integer to analyze (number or string for large values)')
    }
  },
  async ({ value }: { value: number | string }) => {
    // Handle large numbers
    if (typeof value === 'string' && value.length > 15) {
      const largeAnalysis = mathDB.analyzeLargeNumber(value);
      const primalityCheck = await mathDB.isPrimeLarge(value);

      const analysis = [
        `# Analysis of ${value}`,
        `(Large number: ${value.length} digits)`,
        '',
        '## Field Activation Pattern',
        `Primary Pattern: ${largeAnalysis.primary_pattern}`,
        `Field Harmonics: ${largeAnalysis.field_harmonics}`,
        '',
        '## Database Properties',
        `- Resonance Signature: ${largeAnalysis.resonance_signature}`,
        `- Is Probable Prime: ${primalityCheck.is_prime}`,
        `- Confidence: ${(primalityCheck.confidence * 100).toFixed(1)}%`,
        '',
        '## Primality Evidence',
        ...primalityCheck.evidence.map((e: string) => `- ${e}`)
      ];

      return {
        content: [
          {
            type: 'text',
            text: analysis.join('\n')
          }
        ]
      };
    }

    // Regular number analysis
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    const number = mathDB.createNumber(numValue);

    const analysis = [
      `# Analysis of ${value}`,
      '',
      '## Field Activation Pattern',
      numValue > 255
        ? `Binary: ${numValue.toString(2)} → ${(numValue % 256).toString(2).padStart(8, '0')} (mod 256)`
        : `Binary: ${numValue.toString(2).padStart(8, '0')}`,
      `Active Fields: ${number.computed.field_signature}`,
      '',
      '## Database Properties',
      `- Resonance: ${number.computed.resonance}`,
      `- Page: ${number.computed.page} (offset: ${number.computed.offset})`,
      `- Depth: ${number.computed.depth}`,
      `- Is Primitive: ${number.integrity.is_primitive}`,
      `- Is Normalized (Prime): ${number.integrity.is_normalized}`,
      ''
    ];

    if (number.relationships?.factors) {
      analysis.push('## Prime Factorization');
      analysis.push(`${value} = ${number.relationships.factors.join(' × ')}`);
      analysis.push('');
    }

    // Add field details
    analysis.push('## Active Field Details');
    const fields = ['identity', 'tribonacci', 'golden', 'half', 'inv_freq', 'freq', 'phase', 'zeta'] as const;
    for (const fieldName of fields) {
      const field = number.fields[fieldName];
      if (field.active) {
        analysis.push(`- ${field.symbol} (${fieldName}): α = ${field.alpha}`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: analysis.join('\n')
        }
      ]
    };
  }
);

// Tool: Normalize a number (factorization)
server.registerTool(
  'normalize-number',
  {
    description:
      'Normalize a composite number to its prime factors, showing the denormalization artifacts and field reconciliation. Supports large numbers using field collapse factorization.',
    inputSchema: {
      value: z
        .union([z.number().int().min(2), z.string().regex(/^\d+$/)])
        .describe('The integer to normalize (number or string for large values)')
    }
  },
  async ({ value }: { value: number | string }) => {
    // Handle large numbers with field collapse factorization
    if (typeof value === 'string' && value.length > 15) {
      const factorization = await mathDB.factorizeLarge(value);

      const output = [
        `# Normalization of ${value}`,
        `(Large number: ${value.length} digits)`,
        '',
        `## Factorization Method: ${factorization.method}`,
        `- Confidence: ${(factorization.confidence * 100).toFixed(1)}%`,
        `- Iterations: ${factorization.iterations}`,
        '',
        '## Prime Factors',
        factorization.factors.length === 1 && factorization.factors[0] === value
          ? `${value} is prime (already normalized)`
          : factorization.factors.join(' × '),
        '',
        '## Field Theory Analysis',
        'Large numbers use field collapse factorization which:',
        '- Analyzes field harmonics across multiple scales',
        '- Identifies resonance decomposition patterns',
        '- Uses page-relative factorization',
        '- Avoids trial division entirely'
      ];

      return {
        content: [
          {
            type: 'text',
            text: output.join('\n')
          }
        ]
      };
    }

    // Regular normalization for smaller numbers
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    const result = mathDB.normalize(numValue);

    const output = [
      `# Normalization of ${value}`,
      '',
      '## Original (Denormalized) Record',
      `- Value: ${result.original.value}`,
      `- Fields: ${result.original.computed.field_signature}`,
      `- Resonance: ${result.original.computed.resonance}`,
      '',
      '## Normalized Form',
      `${value} = ${result.normalized_form.map(n => n.value).join(' × ')}`,
      ''
    ];

    // Show each factor's details
    for (const factor of result.normalized_form) {
      output.push(`### Factor: ${factor.value}`);
      output.push(`- Fields: ${factor.computed.field_signature}`);
      output.push(`- Resonance: ${factor.computed.resonance}`);
      output.push('');
    }

    // Field reconciliation
    output.push('## Field Reconciliation');
    output.push('This shows how denormalization creates/destroys field information:');
    output.push('');

    const recon = result.process.field_reconciliation;
    if (recon['artifacts'] && recon['artifacts'].length > 0) {
      output.push('### Denormalization Artifacts');
      output.push(`Fields that appeared in ${value} but not in its factors:`);
      for (const artifact of recon['artifacts']) {
        const fieldDef = Object.values(result.normalized_form[0]?.fields ?? {}).find(
          (f: any) => f.type === Object.values(result.original.fields)[artifact as any]?.type
        );
        output.push(`- Field ${artifact}: ${fieldDef?.symbol || '?'}`);
      }
      output.push('');
    }

    if (recon['missing'] && recon['missing'].length > 0) {
      output.push('### Redundancy Elimination');
      output.push(`Fields from factors that disappeared in ${value}:`);
      for (const missing of recon['missing']) {
        const fieldDef = Object.values(result.normalized_form[0]?.fields ?? {}).find(
          (f: any) => f.type === Object.values(result.original.fields)[missing as any]?.type
        );
        output.push(`- Field ${missing}: ${fieldDef?.symbol || '?'}`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n')
        }
      ]
    };
  }
);

// Tool: Search patterns
server.registerTool(
  'search-patterns',
  {
    description: 'Search for numbers matching specific field patterns or resonance ranges',
    inputSchema: {
      field_pattern: z
        .string()
        .regex(/^[01]{8}$/)
        .optional()
        .describe("8-bit binary string for field pattern (e.g., '11100000' for fields 0,1,2)"),
      resonance_min: z.number().optional().describe('Minimum resonance value'),
      resonance_max: z.number().optional().describe('Maximum resonance value'),
      page_start: z.number().int().min(0).default(0).describe('Starting page number'),
      page_end: z.number().int().min(0).default(2).describe('Ending page number'),
      limit: z.number().int().min(1).max(100).default(20).describe('Maximum results to return')
    }
  },
  async ({
    field_pattern,
    resonance_min,
    resonance_max,
    page_start,
    page_end,
    limit
  }: {
    field_pattern?: string;
    resonance_min?: number;
    resonance_max?: number;
    page_start: number;
    page_end: number;
    limit: number;
  }) => {
    const searchOptions: {
      field_pattern?: string;
      resonance_range?: { min: number; max: number };
      page_range?: { start: number; end: number };
    } = {
      page_range: { start: page_start, end: page_end }
    };

    if (field_pattern) {
      searchOptions.field_pattern = field_pattern;
    }

    if (resonance_min !== undefined || resonance_max !== undefined) {
      searchOptions.resonance_range = {
        min: resonance_min ?? 0,
        max: resonance_max ?? Infinity
      };
    }

    const results = mathDB.searchPatterns(searchOptions).slice(0, limit);

    const output = [
      '# Pattern Search Results',
      '',
      '## Search Criteria',
      field_pattern ? `- Field Pattern: ${field_pattern}` : null,
      resonance_min !== undefined ? `- Min Resonance: ${resonance_min}` : null,
      resonance_max !== undefined ? `- Max Resonance: ${resonance_max}` : null,
      `- Pages: ${page_start} to ${page_end}`,
      '',
      `## Results (${results.length} found)`,
      ''
    ].filter(Boolean);

    for (const number of results) {
      output.push(`### ${number.value}`);
      output.push(`- Fields: ${number.computed.field_signature}`);
      output.push(`- Resonance: ${number.computed.resonance}`);
      output.push(`- Page: ${number.computed.page}, Offset: ${number.computed.offset}`);
      output.push(`- Is Prime: ${number.integrity.is_normalized}`);
      output.push('');
    }

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n')
        }
      ]
    };
  }
);

// Tool: Analyze a page
server.registerTool(
  'analyze-page',
  {
    description: 'Analyze a 48-number page showing statistics about primes, field activations, and resonance patterns',
    inputSchema: {
      page_number: z.number().int().min(0).describe('The page number to analyze (each page contains 48 numbers)')
    }
  },
  async ({ page_number }: { page_number: number }) => {
    const analysis = mathDB.analyzePage(page_number);

    const output = [
      `# Page ${page_number} Analysis`,
      `Numbers: ${page_number * 48} to ${page_number * 48 + 47}`,
      '',
      '## Summary Statistics',
      `- Total Numbers: ${analysis.total_numbers}`,
      `- Primes: ${analysis.prime_count} (${((analysis.prime_count / analysis.total_numbers) * 100).toFixed(1)}%)`,
      `- Composites: ${analysis.composite_count} (${((analysis.composite_count / analysis.total_numbers) * 100).toFixed(1)}%)`,
      '',
      '## Field Activation Rates',
      'Percentage of numbers with each field active:'
    ];

    // Sort fields by activation rate
    const fieldRates = Object.entries(analysis.field_activation_rates).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    );

    for (const [field, rate] of fieldRates) {
      output.push(`- ${field}: ${((rate as number) * 100).toFixed(1)}%`);
    }

    output.push('');
    output.push('## Resonance Distribution');
    output.push(`- Mean: ${analysis.resonance_distribution.mean.toFixed(6)}`);
    output.push(`- Median: ${analysis.resonance_distribution.median.toFixed(6)}`);
    output.push(`- Std Dev: ${analysis.resonance_distribution.std_dev.toFixed(6)}`);

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n')
        }
      ]
    };
  }
);

// Tool: List primes
server.registerTool(
  'list-primes',
  {
    description: 'List prime numbers (normalized records) with their field patterns',
    inputSchema: {
      page: z.number().int().min(0).default(0).describe('Page number for pagination'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of primes to return')
    }
  },
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = mathDB.listPrimes(page, limit);

    const output = ['# Prime Numbers (Normalized Records)', `Page ${page + 1} of many`, '', '## Primes'];

    for (const prime of result.primes) {
      output.push(`### ${prime.value}`);
      output.push(`- Fields: ${prime.computed.field_signature}`);
      output.push(`- Resonance: ${prime.computed.resonance}`);
      output.push(`- Binary: ${prime.value.toString(2).padStart(8, '0')}`);
      output.push('');
    }

    output.push('## Navigation');
    output.push(`- Current Page: ${result.pagination.page}`);
    output.push(`- Has Next: ${result.pagination.has_next}`);
    output.push(`- Has Previous: ${result.pagination.has_previous}`);

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n')
        }
      ]
    };
  }
);

// Tool: Database operations (multiply/join, add/merge)
server.registerTool(
  'database-operation',
  {
    description: 'Perform database operations (multiply=JOIN, add=MERGE) on numbers and analyze the results',
    inputSchema: {
      operation: z.enum(['multiply', 'add']).describe('The operation to perform'),
      a: z.number().int().min(0).describe('First operand'),
      b: z.number().int().min(0).describe('Second operand')
    }
  },
  async ({ operation, a, b }: { operation: 'multiply' | 'add'; a: number; b: number }) => {
    const numA = mathDB.createNumber(a);
    const numB = mathDB.createNumber(b);

    let result: MathematicalNumber;
    let opSymbol: string;
    let opName: string;

    if (operation === 'multiply') {
      result = mathDB.multiply(a, b);
      opSymbol = '×';
      opName = 'JOIN';
    } else {
      result = mathDB.add(a, b);
      opSymbol = '+';
      opName = 'MERGE';
    }

    const output = [
      `# Database ${opName} Operation`,
      `${a} ${opSymbol} ${b} = ${result.value}`,
      '',
      '## Operand Analysis',
      '',
      `### ${a}`,
      `- Fields: ${numA.computed.field_signature}`,
      `- Resonance: ${numA.computed.resonance}`,
      `- Is Prime: ${numA.integrity.is_normalized}`,
      '',
      `### ${b}`,
      `- Fields: ${numB.computed.field_signature}`,
      `- Resonance: ${numB.computed.resonance}`,
      `- Is Prime: ${numB.integrity.is_normalized}`,
      '',
      '## Result Analysis',
      `### ${result.value}`,
      `- Fields: ${result.computed.field_signature}`,
      `- Resonance: ${result.computed.resonance}`,
      `- Is Prime: ${result.integrity.is_normalized}`,
      ''
    ];

    // For multiplication, show field interference
    if (operation === 'multiply') {
      output.push('## Field Interference Analysis');

      // Get active fields for each number
      const fieldsA = new Set<number>();
      const fieldsB = new Set<number>();
      const fieldsResult = new Set<number>();

      const fieldNames = ['identity', 'tribonacci', 'golden', 'half', 'inv_freq', 'freq', 'phase', 'zeta'] as const;

      fieldNames.forEach((name, idx) => {
        if (numA.fields[name].active) {
          fieldsA.add(idx);
        }
        if (numB.fields[name].active) {
          fieldsB.add(idx);
        }
        if (result.fields[name].active) {
          fieldsResult.add(idx);
        }
      });

      // Expected union
      const expectedUnion = new Set([...fieldsA, ...fieldsB]);

      // Find artifacts and missing
      const artifacts = [...fieldsResult].filter(f => !expectedUnion.has(f));
      const missing = [...expectedUnion].filter(f => !fieldsResult.has(f));

      if (artifacts.length > 0) {
        output.push('### Denormalization Artifacts');
        output.push('Fields that appeared from nowhere:');
        for (const idx of artifacts) {
          if (idx < fieldNames.length) {
            const fieldName = fieldNames[idx];
            if (fieldName) {
              const field = result.fields[fieldName];
              if (field) {
                output.push(`- ${field.symbol} (${fieldName})`);
              }
            }
          }
        }
        output.push('');
      }

      if (missing.length > 0) {
        output.push('### Redundancy Elimination');
        output.push('Fields that disappeared:');
        for (const idx of missing) {
          if (idx < fieldNames.length) {
            const fieldName = fieldNames[idx];
            if (fieldName) {
              const field = numA.fields[fieldName] || numB.fields[fieldName];
              if (field) {
                output.push(`- ${field.symbol} (${fieldName})`);
              }
            }
          }
        }
        output.push('');
      }

      output.push('This demonstrates that multiplication is not simple set union,');
      output.push('but involves complex field interference patterns.');
    }

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n')
        }
      ]
    };
  }
);

// Resource: Schema fields
server.resource(
  'schema-fields',
  'math://schema/fields',
  {
    description: 'The complete 8-field mathematical schema with constants and descriptions',
    mimeType: 'application/json'
  },
  async (uri: URL) => {
    const fields = mathDB.getSchemaFields();
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(fields, null, 2),
          mimeType: 'application/json'
        }
      ]
    };
  }
);

// Resource: Special numbers
server.resource(
  'special-numbers',
  'math://special/numbers',
  {
    description: 'Numbers with special mathematical properties in the universe',
    mimeType: 'text/plain'
  },
  async (uri: URL) => {
    const special = [
      '# Special Numbers in the Mathematical Universe',
      '',
      '## Perfect Resonance (1.0)',
      'Numbers where field products equal exactly 1:',
      '',
      '- 48: Fields 1/2π and 2π active → 1/2π × 2π = 1.0',
      '- This creates the 48-number page structure',
      '',
      '## Tribonacci Resonance (1.839...)',
      '- 2: Pure tribonacci field',
      '- All multiples of 2 inherit this decoherence property',
      '',
      '## Powers of 2 (Primitives)',
      'Each activates exactly one field:',
      '- 1: Identity (I)',
      '- 2: Tribonacci (T)',
      '- 4: Golden ratio (φ)',
      '- 8: Half (½)',
      '- 16: Inverse frequency (1/2π)',
      '- 32: Frequency (2π)',
      '- 64: Phase coupling (θ)',
      '- 128: Deep structure (ζ)',
      '',
      '## Primes (Normalized Records)',
      'Well-formed numbers with no redundancy:',
      '- Cannot be factored further',
      '- Represent atomic mathematical structures',
      '- Each has a unique field signature'
    ];

    return {
      contents: [
        {
          uri: uri.href,
          text: special.join('\n')
        }
      ]
    };
  }
);

// Prompt: Explore number relationships
server.prompt(
  'explore-relationships',
  'Generate an analysis prompt for exploring relationships between numbers',
  {
    numbers: z.string().describe('Array of 2-5 numbers to explore, comma-separated')
  },
  ({ numbers }: { numbers: string }) => {
    const numberArray = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Analyze the mathematical relationships between these numbers: ${numberArray.join(', ')}

Please explore:
1. Their individual field patterns and what they reveal
2. How they relate through multiplication (JOIN operations)
3. Any shared factors or common patterns
4. Their positions in the 48-number page structure
5. Any special resonances or field interference patterns

Focus on the database interpretation where:
- Multiplication is a JOIN creating denormalization artifacts
- Prime factorization is normalization to remove redundancy
- Field patterns reveal the deep mathematical structure`
        }
      }
    ]
  };
}
);

// Prompt: Page exploration
server.prompt(
  'explore-page',
  'Generate an analysis prompt for exploring a specific 48-number page',
  {
    page_number: z.string().describe('The page number to explore')
  },
  ({ page_number }: { page_number: string }) => {
    const pageNum = parseInt(page_number);
    return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Analyze page ${pageNum} of the mathematical universe (numbers ${pageNum * 48} to ${pageNum * 48 + 47}).

Please investigate:
1. The distribution of primes vs composites on this page
2. Which fields are most/least active and why
3. Any special resonance patterns or anomalies
4. How this page relates to the overall 48-number periodicity
5. Any interesting number relationships within the page

Remember that pages emerge from the field 4 × field 5 = 1 relationship,
creating natural boundaries in the mathematical structure.`
        }
      }
    ]
  };
}
);

// Prompt: Field pattern investigation
server.prompt(
  'investigate-field-pattern',
  'Generate a prompt to investigate numbers with specific field patterns',
  {
    pattern: z
      .string()
      .regex(/^[01]{8}$/)
      .describe("8-bit binary pattern (e.g., '11100000' for fields 0,1,2)")
  },
  ({ pattern }: { pattern: string }) => {
    // Convert pattern to human-readable field list
    const fieldNames = ['I', 'T', 'φ', '½', '1/2π', '2π', 'θ', 'ζ'];
    const activeFields = pattern
      .split('')
      .map((bit: string, idx: number) => (bit === '1' ? fieldNames[idx] : null))
      .filter(Boolean)
      .join('+');

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Investigate numbers with field pattern ${pattern} (${activeFields}).

Please analyze:
1. What mathematical properties do numbers with this pattern share?
2. Are they predominantly prime or composite?
3. What is their typical resonance range?
4. How does this pattern emerge from the binary representation?
5. Any special relationships or interference patterns?

This investigation helps understand how binary structure maps to
mathematical properties through the 8-field schema.`
          }
        }
      ]
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Send initial notification
  await server.server.sendLoggingMessage({
    level: 'info',
    data: 'Mathematical Universe MCP Server started. Explore mathematics as a relational database!'
  });

  console.error('Math Universe MCP server running on stdio');
}

main().catch(console.error);
