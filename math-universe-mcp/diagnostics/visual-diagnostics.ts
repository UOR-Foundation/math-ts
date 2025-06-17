/**
 * Visual Diagnostics for Mathematical Universe
 * 
 * This tool provides visual representations of field patterns, resonances,
 * and other mathematical properties to help understand and tune the system.
 */

import { MathematicalUniverseDB } from '../src/math-universe';
import { LargeNumberFieldAnalysis } from '../src/math-universe-large';

interface VisualizationData {
  number: number | bigint;
  binary: string;
  fields: string;
  resonance: number;
  isPrime: boolean;
  factors?: (number | bigint)[];
}

class VisualDiagnostics {
  private db: MathematicalUniverseDB;
  private analyzer: LargeNumberFieldAnalysis;

  constructor() {
    this.db = new MathematicalUniverseDB();
    this.analyzer = new LargeNumberFieldAnalysis();
  }

  /**
   * Display field pattern visualization for a range of numbers
   */
  visualizeFieldPatterns(start: number, count: number): void {
    console.log('\n📊 Field Pattern Visualization');
    console.log('================================');
    console.log('Number | Binary   | Fields      | Resonance | Prime');
    console.log('-------|----------|-------------|-----------|------');

    for (let i = start; i < start + count; i++) {
      const num = this.db.createNumber(i);
      const binary = i.toString(2).padStart(8, '0').slice(-8);
      const fields = this.formatFields(num.computed.field_signature);
      const resonance = num.computed.resonance.toFixed(4);
      const isPrime = num.integrity.is_normalized;

      console.log(
        `${i.toString().padStart(6)} | ${binary} | ${fields.padEnd(11)} | ${resonance.padStart(9)} | ${isPrime ? '✓' : ' '}`
      );
    }
  }

  /**
   * Visualize resonance distribution
   */
  visualizeResonanceDistribution(start: number, count: number): void {
    console.log('\n📈 Resonance Distribution');
    console.log('========================');

    const buckets: { [key: string]: number } = {
      '0.0-0.1': 0,
      '0.1-0.5': 0,
      '0.5-1.0': 0,
      '1.0': 0,
      '1.0-2.0': 0,
      '2.0-5.0': 0,
      '5.0-10.0': 0,
      '10.0+': 0
    };

    for (let i = start; i < start + count; i++) {
      const num = this.db.createNumber(i);
      const r = num.computed.resonance;

      if (r < 0.1) buckets['0.0-0.1']++;
      else if (r < 0.5) buckets['0.1-0.5']++;
      else if (r < 1.0) buckets['0.5-1.0']++;
      else if (r === 1.0) buckets['1.0']++;
      else if (r < 2.0) buckets['1.0-2.0']++;
      else if (r < 5.0) buckets['2.0-5.0']++;
      else if (r < 10.0) buckets['5.0-10.0']++;
      else buckets['10.0+']++;
    }

    // Display histogram
    const maxCount = Math.max(...Object.values(buckets));
    
    for (const [range, count] of Object.entries(buckets)) {
      const barLength = Math.round((count / maxCount) * 40);
      const bar = '█'.repeat(barLength);
      const percentage = ((count / (count)) * 100).toFixed(1);
      
      console.log(
        `${range.padEnd(9)} | ${bar.padEnd(40)} | ${count.toString().padStart(4)} (${percentage}%)`
      );
    }
  }

  /**
   * Visualize page structure
   */
  visualizePageStructure(pageNumber: number): void {
    console.log(`\n📄 Page ${pageNumber} Structure`);
    console.log('=====================');

    const start = pageNumber * 48;
    const end = start + 48;
    const pageAnalysis = this.db.analyzePage(pageNumber);

    // Display page grid (8x6)
    console.log('\nPage Grid (8 columns × 6 rows):');
    console.log('  0   1   2   3   4   5   6   7');
    console.log('┌───┬───┬───┬───┬───┬───┬───┬───┐');

    for (let row = 0; row < 6; row++) {
      let rowStr = '│';
      for (let col = 0; col < 8; col++) {
        const n = start + row * 8 + col;
        const num = this.db.createNumber(n);
        const symbol = this.getNumberSymbol(num);
        rowStr += ` ${symbol} │`;
      }
      console.log(rowStr);
      
      if (row < 5) {
        console.log('├───┼───┼───┼───┼───┼───┼───┼───┤');
      }
    }
    console.log('└───┴───┴───┴───┴───┴───┴───┴───┘');

    // Legend
    console.log('\nLegend:');
    console.log('  · = Composite, ○ = Prime, ◆ = Perfect resonance, ▪ = Primitive');

    // Page statistics
    console.log('\nPage Statistics:');
    console.log(`  Primes: ${pageAnalysis.primes}/${pageAnalysis.total} (${pageAnalysis.prime_percentage.toFixed(1)}%)`);
    console.log(`  Mean resonance: ${pageAnalysis.resonance_stats.mean.toFixed(4)}`);
    console.log(`  Resonance range: ${pageAnalysis.resonance_stats.min.toFixed(4)} - ${pageAnalysis.resonance_stats.max.toFixed(4)}`);
  }

  /**
   * Visualize field interference in multiplication
   */
  visualizeMultiplication(a: number, b: number): void {
    const numA = this.db.createNumber(a);
    const numB = this.db.createNumber(b);
    const result = this.db.multiply(a, b);

    console.log(`\n🔄 Field Interference: ${a} × ${b} = ${result.value}`);
    console.log('=====================================');

    // Show field patterns
    console.log('\nField Patterns:');
    console.log(`  ${a}: ${this.visualizeFieldBits(a)} → ${numA.computed.field_signature}`);
    console.log(`  ${b}: ${this.visualizeFieldBits(b)} → ${numB.computed.field_signature}`);
    console.log(`  ${result.value}: ${this.visualizeFieldBits(result.value)} → ${result.computed.field_signature}`);

    // Show field changes
    const normalized = this.db.normalize(result.value);
    const recon = normalized.process.field_reconciliation as any;

    if (recon.artifacts && recon.artifacts.length > 0) {
      console.log('\n✨ Field Artifacts (appeared):');
      for (const artifact of recon.artifacts) {
        console.log(`  - Field ${artifact}: ${this.getFieldName(artifact)}`);
      }
    }

    if (recon.missing && recon.missing.length > 0) {
      console.log('\n💨 Field Elimination (disappeared):');
      for (const missing of recon.missing) {
        console.log(`  - Field ${missing}: ${this.getFieldName(missing)}`);
      }
    }

    // Show resonance calculation
    console.log('\n🎵 Resonance Calculation:');
    console.log(`  ${a}: ${numA.computed.resonance.toFixed(6)}`);
    console.log(`  ${b}: ${numB.computed.resonance.toFixed(6)}`);
    console.log(`  ${a} × ${b} = ${result.value}: ${result.computed.resonance.toFixed(6)}`);
    console.log(`  Simple product: ${(numA.computed.resonance * numB.computed.resonance).toFixed(6)}`);
    console.log(`  Difference: ${Math.abs(result.computed.resonance - numA.computed.resonance * numB.computed.resonance).toFixed(6)}`);
  }

  /**
   * Visualize primality patterns
   */
  visualizePrimalityPatterns(limit: number): void {
    console.log(`\n🔍 Primality Patterns (up to ${limit})`);
    console.log('===================================');

    const patterns: { [key: string]: number[] } = {};
    const primes: number[] = [];

    // Collect primes and their patterns
    for (let i = 2; i <= limit; i++) {
      const num = this.db.createNumber(i);
      if (num.integrity.is_normalized) {
        primes.push(i);
        const pattern = num.computed.field_signature;
        if (!patterns[pattern]) {
          patterns[pattern] = [];
        }
        patterns[pattern].push(i);
      }
    }

    // Display patterns
    console.log(`\nFound ${primes.length} primes with ${Object.keys(patterns).length} unique field patterns:`);
    
    // Sort patterns by frequency
    const sortedPatterns = Object.entries(patterns)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10); // Top 10 patterns

    for (const [pattern, primeList] of sortedPatterns) {
      const examples = primeList.slice(0, 5).join(', ');
      const more = primeList.length > 5 ? `, ... (${primeList.length - 5} more)` : '';
      console.log(`  ${pattern}: ${examples}${more}`);
    }

    // Display prime gaps
    console.log('\nPrime Gaps:');
    const gaps: { [key: number]: number } = {};
    
    for (let i = 1; i < primes.length; i++) {
      const gap = primes[i] - primes[i - 1];
      gaps[gap] = (gaps[gap] || 0) + 1;
    }

    const sortedGaps = Object.entries(gaps)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .slice(0, 10);

    for (const [gap, count] of sortedGaps) {
      console.log(`  Gap ${gap}: ${count} occurrences`);
    }
  }

  /**
   * Compare field theory vs actual behavior
   */
  compareTheoryVsActual(): void {
    console.log('\n🔬 Theory vs Actual Behavior');
    console.log('============================');

    const tests = [
      { n: 48, theory: 'Perfect resonance (1.0)', check: (num: any) => num.computed.resonance === 1.0 },
      { n: 77, theory: 'Field artifacts in multiplication', check: (num: any) => num.computed.field_signature.includes('θ') },
      { n: 2304, theory: 'Field cancellation (48²)', check: (num: any) => num.computed.field_signature === '∅' },
      { n: 255, theory: 'All fields active', check: (num: any) => num.computed.field_signature.split('+').length === 8 },
    ];

    for (const test of tests) {
      const num = this.db.createNumber(test.n);
      const passed = test.check(num);
      const symbol = passed ? '✅' : '❌';
      
      console.log(`${symbol} n=${test.n}: ${test.theory}`);
      if (!passed) {
        console.log(`   Actual: ${num.computed.field_signature}, resonance=${num.computed.resonance.toFixed(6)}`);
      }
    }
  }

  // Helper methods

  private formatFields(signature: string): string {
    if (signature === '∅') return 'none';
    return signature.replace(/\+/g, '');
  }

  private visualizeFieldBits(n: number): string {
    const bits = n.toString(2).padStart(8, '0').slice(-8);
    return bits.split('').map(b => b === '1' ? '█' : '·').join('');
  }

  private getNumberSymbol(num: any): string {
    if (num.computed.resonance === 1.0) return '◆';
    if (num.integrity.is_primitive) return '▪';
    if (num.integrity.is_normalized) return '○';
    return '·';
  }

  private getFieldName(index: number): string {
    const names = ['identity', 'tribonacci', 'golden', 'half', 'inv_freq', 'freq', 'phase', 'zeta'];
    return names[index] || `field_${index}`;
  }
}

// Export and provide CLI interface
export { VisualDiagnostics };

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const visual = new VisualDiagnostics();
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'patterns':
      visual.visualizeFieldPatterns(parseInt(args[1]) || 0, parseInt(args[2]) || 32);
      break;
    
    case 'resonance':
      visual.visualizeResonanceDistribution(parseInt(args[1]) || 0, parseInt(args[2]) || 256);
      break;
    
    case 'page':
      visual.visualizePageStructure(parseInt(args[1]) || 0);
      break;
    
    case 'multiply':
      visual.visualizeMultiplication(parseInt(args[1]) || 6, parseInt(args[2]) || 8);
      break;
    
    case 'primes':
      visual.visualizePrimalityPatterns(parseInt(args[1]) || 100);
      break;
    
    case 'theory':
      visual.compareTheoryVsActual();
      break;
    
    default:
      console.log(`
Visual Diagnostics for Mathematical Universe

Usage: tsx diagnostics/visual-diagnostics.ts [command] [args...]

Commands:
  patterns [start] [count]    Show field patterns (default: 0, 32)
  resonance [start] [count]   Show resonance distribution (default: 0, 256)
  page [number]              Visualize page structure (default: 0)
  multiply [a] [b]           Show field interference in multiplication
  primes [limit]             Analyze primality patterns (default: 100)
  theory                     Compare theory vs actual behavior

Examples:
  tsx diagnostics/visual-diagnostics.ts patterns 40 16
  tsx diagnostics/visual-diagnostics.ts page 1
  tsx diagnostics/visual-diagnostics.ts multiply 7 11
`);
  }
}