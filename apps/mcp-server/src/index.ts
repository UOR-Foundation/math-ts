#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { MathematicalUniverse } from '@uor-foundation/math-ts-core';

// Create the Mathematical Universe instance
const universe = new MathematicalUniverse();

// Create an MCP server
const server = new McpServer({
  name: 'math-universe-server',
  version: '0.1.0',
  description: 'MCP server for the Mathematical Universe - where mathematics computes itself',
});

// Core Tools

// analyze_number - Complete universe analysis
server.registerTool(
  'analyze_number',
  {
    title: 'Analyze Number',
    description: 'Perform complete Mathematical Universe analysis on a number',
    inputSchema: {
      number: z.union([z.string(), z.number()]).describe('Number to analyze'),
    },
  },
  ({ number }: { number: string | number }) => {
    try {
      const n = BigInt(number);
      const analysis = universe.analyze(n);

      // Format the response
      const response = `
# Mathematical Universe Analysis of ${n}

## Field Pattern
Active Fields: ${analysis.fields
        .map((active: boolean, i: number) =>
          active ? ['I', 'N', 'T', 'φ', 'P', '∞', '½', 'ζ'][i] : null,
        )
        .filter(Boolean)
        .join(', ')}
Binary: ${analysis.fields.map((b: boolean) => (b ? '1' : '0')).join('')}

## Resonance
Value: ${analysis.resonance.toFixed(6)}
${analysis.isPrime ? '🔷 PRIME - Computational Atom' : '🔶 Composite'}

## Topology
Page: ${analysis.pageInfo.pageNumber}
Position: ${analysis.pageInfo.startNumber} - ${analysis.pageInfo.endNumber}
Stability: ${analysis.stabilityMetric.toFixed(4)}
${analysis.isLagrangePoint ? '🌟 LAGRANGE POINT' : `Distance to nearest Lagrange: ${analysis.distanceToLagrange}`}

## Denormalization Artifacts
${analysis.artifacts.length > 0 ? analysis.artifacts.map((a) => `- Field ${a.field}: ${a.type}`).join('\n') : 'None detected'}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing number: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// find_primes - Prime discovery via field patterns
server.registerTool(
  'find_primes',
  {
    title: 'Find Primes',
    description: 'Find prime numbers in a range using field pattern analysis',
    inputSchema: {
      start: z.union([z.string(), z.number()]).describe('Start of range'),
      end: z.union([z.string(), z.number()]).describe('End of range'),
      limit: z.number().optional().default(100).describe('Maximum primes to return'),
    },
  },
  ({ start, end, limit }: { start: string | number; end: string | number; limit: number }) => {
    try {
      const startN = BigInt(start);
      const endN = BigInt(end);

      if (endN < startN) {
        throw new Error('End must be greater than start');
      }

      const primes: bigint[] = [];
      let current = startN < 2n ? 2n : startN;

      while (current <= endN && primes.length < limit) {
        const analysis = universe.analyze(current);
        if (analysis.isPrime) {
          primes.push(current);
        }
        current++;
      }

      const response = `
# Prime Discovery Results

Range: ${startN} to ${endN}
Found: ${primes.length} primes

## Primes (Computational Atoms)
${primes
  .map((p) => {
    const analysis = universe.analyze(p);
    return `${p}: Resonance ${analysis.resonance.toFixed(4)}, Fields: ${analysis.fields
      .map((active, i) => (active ? ['I', 'N', 'T', 'φ', 'P', '∞', '½', 'ζ'][i] : null))
      .filter(Boolean)
      .join(', ')}`;
  })
  .join('\n')}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error finding primes: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// factorize - Field-based factorization
server.registerTool(
  'factorize',
  {
    title: 'Factorize Number',
    description: 'Decompose a number into its prime factors using field analysis',
    inputSchema: {
      number: z.union([z.string(), z.number()]).describe('Number to factorize'),
    },
  },
  ({ number }: { number: string | number }) => {
    try {
      const n = BigInt(number);
      const result = universe.factorize(n);

      const response = `
# Factorization of ${n}

## Prime Factors
${result.factors.map((f: bigint) => `${f}`).join(' × ')} = ${n}

## Field Analysis
${
  result.isPrime
    ? '🔷 This is a PRIME number (computational atom)'
    : `🔶 Composite number with ${result.factors.length} prime factors`
}

## Field Reconstruction
${result.fieldReconstruction
  .map(
    (pattern: boolean[], i: number) =>
      `Step ${i}: ${pattern.map((b: boolean) => (b ? '1' : '0')).join('')}`,
  )
  .join('\n')}

## Artifact Sources
${
  result.artifactSources.length > 0
    ? result.artifactSources
        .map((a: { field: number; type: string }) => `- Field ${a.field}: ${a.type}`)
        .join('\n')
    : 'No denormalization artifacts detected'
}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error factorizing: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// explore_patterns - Pattern discovery tools
server.registerTool(
  'explore_patterns',
  {
    title: 'Explore Patterns',
    description: 'Discover patterns in number sequences using Mathematical Universe analysis',
    inputSchema: {
      start: z.union([z.string(), z.number()]).describe('Start of range'),
      count: z.number().default(20).describe('Number of values to analyze'),
      pattern: z
        .enum(['resonance', 'fields', 'stability', 'lagrange'])
        .default('resonance')
        .describe('Pattern type to explore'),
    },
  },
  ({ start, count, pattern }: { start: string | number; count: number; pattern: string }) => {
    try {
      const startN = BigInt(start);
      const results: Array<{ n: bigint; value: string }> = [];

      for (let i = 0n; i < count; i++) {
        const n = startN + i;
        const analysis = universe.analyze(n);

        let value: string = '';
        switch (pattern) {
          case 'resonance':
            value = analysis.resonance.toFixed(4);
            break;
          case 'fields':
            value = analysis.fields
              .map((active, i) => (active ? ['I', 'N', 'T', 'φ', 'P', '∞', '½', 'ζ'][i] : null))
              .filter(Boolean)
              .join(',');
            break;
          case 'stability':
            value = analysis.stabilityMetric.toFixed(4);
            break;
          case 'lagrange':
            value = analysis.isLagrangePoint
              ? '🌟 LAGRANGE'
              : `dist: ${analysis.distanceToLagrange}`;
            break;
        }

        results.push({ n, value });
      }

      const response = `
# Pattern Exploration: ${pattern}

Starting from: ${startN}
Count: ${count}

## Results
${results.map((r) => `${r.n}: ${r.value}`).join('\n')}

## Pattern Analysis
${pattern === 'resonance' ? 'Resonance represents the computational mass/energy of each number.' : ''}
${pattern === 'fields' ? 'Active fields determine the computational properties of numbers.' : ''}
${pattern === 'stability' ? 'Stability metric indicates computational equilibrium points.' : ''}
${pattern === 'lagrange' ? 'Lagrange points are computational stability wells in number space.' : ''}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error exploring patterns: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// Advanced Tools

// resonance_landscape - Multi-dimensional analysis
server.registerTool(
  'resonance_landscape',
  {
    title: 'Resonance Landscape',
    description: 'Explore the multi-dimensional resonance landscape around a number',
    inputSchema: {
      center: z.union([z.string(), z.number()]).describe('Center point for analysis'),
      radius: z.number().default(10).describe('Radius of exploration'),
      dimensions: z
        .array(z.enum(['arithmetic', 'field', 'page']))
        .default(['arithmetic'])
        .describe('Dimensions to explore'),
    },
  },
  ({
    center,
    radius,
    dimensions,
  }: {
    center: string | number;
    radius: number;
    dimensions: string[];
  }) => {
    try {
      const centerN = BigInt(center);
      const landscape: Array<{ position: bigint; resonance: number; fields: string }> = [];

      // Arithmetic dimension
      if (dimensions.includes('arithmetic')) {
        for (let i = -radius; i <= radius; i++) {
          const n = centerN + BigInt(i);
          if (n > 0n) {
            const analysis = universe.analyze(n);
            landscape.push({
              position: n,
              resonance: analysis.resonance,
              fields: analysis.fields.map((b) => (b ? '1' : '0')).join(''),
            });
          }
        }
      }

      const response = `
# Resonance Landscape Analysis

Center: ${centerN}
Radius: ${radius}
Dimensions: ${dimensions.join(', ')}

## Landscape Data
${landscape
  .map(
    (point) =>
      `${point.position}: Resonance ${point.resonance.toFixed(4)} | Fields ${point.fields}`,
  )
  .join('\n')}

## Landscape Features
- Maximum resonance: ${Math.max(...landscape.map((p) => p.resonance)).toFixed(4)}
- Minimum resonance: ${Math.min(...landscape.map((p) => p.resonance)).toFixed(4)}
- Average resonance: ${(landscape.reduce((sum, p) => sum + p.resonance, 0) / landscape.length).toFixed(4)}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing landscape: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// lagrange_navigation - Stability point routing
server.registerTool(
  'lagrange_navigation',
  {
    title: 'Lagrange Navigation',
    description: 'Navigate through number space via Lagrange stability points',
    inputSchema: {
      start: z.union([z.string(), z.number()]).describe('Starting position'),
      target: z.union([z.string(), z.number()]).describe('Target position'),
      maxHops: z.number().default(10).describe('Maximum navigation hops'),
    },
  },
  ({
    start,
    target,
    maxHops,
  }: {
    start: string | number;
    target: string | number;
    maxHops: number;
  }) => {
    try {
      const startN = BigInt(start);
      const targetN = BigInt(target);

      const path: bigint[] = [startN];
      let current = startN;
      let hops = 0;

      while (current !== targetN && hops < maxHops) {
        // Find next hop towards target
        const step = targetN > current ? 48n : -48n; // Move by pages
        const next = current + step;

        // Check if we've reached or passed the target
        if ((step > 0n && next >= targetN) || (step < 0n && next <= targetN)) {
          path.push(targetN);
          break;
        }

        // Check if next position is a Lagrange point
        const analysis = universe.analyze(next);
        if (analysis.isLagrangePoint) {
          path.push(next);
        } else {
          // Find nearest Lagrange point
          const nearestLagrange = analysis.nearestLagrangePoint;
          path.push(nearestLagrange);
          current = nearestLagrange;
        }
        current = next;
        hops++;
      }

      const response = `
# Lagrange Navigation Path

From: ${startN} to ${targetN}
Hops: ${path.length - 1}

## Navigation Path
${path
  .map((p, i) => {
    const analysis = universe.analyze(p);
    return `${i}. ${p} ${analysis.isLagrangePoint ? '🌟' : ''} | Stability: ${analysis.stabilityMetric.toFixed(4)}`;
  })
  .join('\n')}

## Path Properties
- Total distance: ${Number(targetN > startN ? targetN - startN : startN - targetN)}
- Stability points crossed: ${path.filter((p) => universe.analyze(p).isLagrangePoint).length}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error navigating: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// field_archaeology - Deep pattern excavation
server.registerTool(
  'field_archaeology',
  {
    title: 'Field Archaeology',
    description: 'Excavate deep field patterns and denormalization artifacts',
    inputSchema: {
      number: z.union([z.string(), z.number()]).describe('Number to excavate'),
      depth: z.enum(['surface', 'deep', 'quantum']).default('surface').describe('Excavation depth'),
    },
  },
  ({ number, depth }: { number: string | number; depth: string }) => {
    try {
      const n = BigInt(number);
      const analysis = universe.analyze(n);

      // Deep analysis based on depth
      const artifacts: string[] = [];

      if (depth === 'surface' || depth === 'deep' || depth === 'quantum') {
        // Basic field analysis
        artifacts.push(
          `Field Pattern: ${analysis.fields
            .map((active, i) =>
              active ? `${i}:${['I', 'N', 'T', 'φ', 'P', '∞', '½', 'ζ'][i]}` : null,
            )
            .filter(Boolean)
            .join(', ')}`,
        );
        artifacts.push(`Resonance: ${analysis.resonance.toFixed(6)}`);
      }

      if (depth === 'deep' || depth === 'quantum') {
        // Arithmetic archaeology
        const factors = universe.factorize(n);
        artifacts.push(`Prime decomposition: ${factors.factors.join(' × ')}`);

        // Field interference patterns
        if (factors.factors.length > 1) {
          const f1 = factors.factors[0];
          const f2 = factors.factors[1];
          const interference = universe.multiply(f1, f2);
          artifacts.push(`Field interference detected in multiplication`);
          if (interference.artifacts.length > 0) {
            artifacts.push(...interference.artifacts.map((a) => `  - Field ${a.field}: ${a.type}`));
          }
        }
      }

      if (depth === 'quantum') {
        // Quantum field analysis
        const livingNum = universe.number(n);
        artifacts.push(`Consciousness level: ${livingNum.consciousness.awareness.toFixed(4)}`);
        artifacts.push(`Computational state: ${livingNum.computationalState.status}`);
        artifacts.push(`Energy level: ${livingNum.computationalState.energy.toFixed(4)}`);
      }

      const response = `
# Field Archaeology Report

Subject: ${n}
Depth: ${depth}

## Excavation Results
${artifacts.join('\n')}

## Archaeological Significance
${analysis.isPrime ? '🔷 PRIME ARTIFACT - Fundamental computational atom' : '🔶 Composite structure with internal complexity'}

## Field Stratigraphy
- Surface: Basic field activation pattern
- Deep: Arithmetic decomposition and interference
- Quantum: Living computational properties
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error in excavation: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// universe_health - System consistency monitoring
server.registerTool(
  'universe_health',
  {
    title: 'Universe Health',
    description: 'Check Mathematical Universe system health and consistency',
    inputSchema: {
      checkType: z
        .enum(['quick', 'full', 'conservation'])
        .default('quick')
        .describe('Type of health check'),
    },
  },
  ({ checkType }: { checkType: string }) => {
    try {
      const healthReport: string[] = [];

      // Quick check
      healthReport.push('## System Status');
      healthReport.push(`- Universe initialized: ✓`);
      healthReport.push(
        `- Field constants: ${universe
          .getFieldConstants()
          .map((c) => c.toFixed(4))
          .join(', ')}`,
      );

      if (checkType === 'full' || checkType === 'conservation') {
        // Test some known values
        const testCases = [
          { n: 2n, expectedPrime: true },
          { n: 7n, expectedPrime: true },
          { n: 48n, expectedLagrange: true },
          { n: 77n, expectedPrime: false },
        ];

        healthReport.push('\n## Validation Tests');
        for (const test of testCases) {
          const analysis = universe.analyze(test.n);
          if (test.expectedPrime !== undefined) {
            const primeCheck = analysis.isPrime === test.expectedPrime ? '✓' : '✗';
            healthReport.push(`- ${test.n} primality: ${primeCheck}`);
          }
          if (test.expectedLagrange !== undefined) {
            const lagrangeCheck = analysis.isLagrangePoint === test.expectedLagrange ? '✓' : '✗';
            healthReport.push(`- ${test.n} Lagrange point: ${lagrangeCheck}`);
          }
        }
      }

      if (checkType === 'conservation') {
        // Conservation law checks
        healthReport.push('\n## Conservation Laws');

        // Field parity conservation
        const nums = [7n, 11n, 77n];
        const conservation = universe.checkFieldParityConservation(nums);
        healthReport.push(`- Field parity conservation: ${conservation.isConserved ? '✓' : '✗'}`);

        // Resonance flux
        const flux = universe.checkResonanceFlux(nums);
        healthReport.push(`- Resonance flux balanced: ${flux.isBalanced ? '✓' : '✗'}`);
      }

      const response = `
# Mathematical Universe Health Report

Type: ${checkType}

${healthReport.join('\n')}

## Overall Health
${healthReport.filter((line) => line.includes('✗')).length === 0 ? '✅ All systems operational' : '⚠️ Some checks failed'}
`;

      return {
        content: [{ type: 'text', text: response.trim() }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error checking health: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

// Start the server
async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Mathematical Universe MCP Server started');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void main();
