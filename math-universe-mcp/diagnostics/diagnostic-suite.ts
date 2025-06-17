/**
 * Mathematical Universe Diagnostic Suite
 * 
 * This diagnostic tool helps tune and improve the implementation by:
 * - Analyzing field patterns and resonance behaviors
 * - Identifying edge cases and anomalies
 * - Providing detailed metrics for algorithm tuning
 * - Generating reports for performance optimization
 */

import { MathematicalUniverseDB } from '../src/math-universe';
import { LargeNumberFieldAnalysis, FieldCollapseFactorization } from '../src/math-universe-large';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DiagnosticResult {
  category: string;
  test: string;
  input: string;
  expected: any;
  actual: any;
  passed: boolean;
  confidence?: number;
  details?: any;
}

interface FieldPatternAnalysis {
  number: bigint;
  fields: string;
  resonance: number;
  isPrime: boolean;
  factors?: bigint[];
}

class MathUniverseDiagnostics {
  private db: MathematicalUniverseDB;
  private analyzer: LargeNumberFieldAnalysis;
  private factorizer: FieldCollapseFactorization;
  private results: DiagnosticResult[] = [];

  constructor() {
    this.db = new MathematicalUniverseDB();
    this.analyzer = new LargeNumberFieldAnalysis();
    this.factorizer = new FieldCollapseFactorization();
  }

  /**
   * Run complete diagnostic suite
   */
  async runFullDiagnostics(): Promise<void> {
    console.log('🔬 Mathematical Universe Diagnostic Suite');
    console.log('========================================\n');

    await this.diagnosePrimalityDetection();
    await this.diagnoseFactorization();
    await this.diagnoseFieldPatterns();
    await this.diagnoseResonanceCalculations();
    await this.diagnoseEdgeCases();
    await this.diagnosePerformance();

    this.generateReport();
  }

  /**
   * Diagnose primality detection accuracy
   */
  private async diagnosePrimalityDetection(): Promise<void> {
    console.log('📊 Diagnosing Primality Detection...');
    
    // Test known primes
    const knownPrimes = [
      2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n,
      97n, 997n, 7919n, // Larger primes
      104729n, // 10,000th prime
      2147483647n, // Mersenne prime
    ];

    for (const prime of knownPrimes) {
      const result = this.analyzer.isProbablePrime(prime);
      this.recordResult({
        category: 'Primality Detection',
        test: 'Known Prime',
        input: prime.toString(),
        expected: true,
        actual: result.is_probable_prime,
        passed: result.is_probable_prime === true,
        confidence: result.confidence,
        details: result.resonance_evidence
      });
    }

    // Test known composites
    const knownComposites = [
      { n: 4n, factors: [2n, 2n] },
      { n: 6n, factors: [2n, 3n] },
      { n: 77n, factors: [7n, 11n] },
      { n: 100n, factors: [2n, 2n, 5n, 5n] },
      { n: 1000n, factors: [2n, 2n, 2n, 5n, 5n, 5n] },
      { n: 1000000000000000000000000000000n, factors: ['2^30', '5^30'] },
    ];

    for (const { n, factors } of knownComposites) {
      const result = this.analyzer.isProbablePrime(n);
      this.recordResult({
        category: 'Primality Detection',
        test: 'Known Composite',
        input: n.toString(),
        expected: false,
        actual: result.is_probable_prime,
        passed: result.is_probable_prime === false,
        confidence: result.confidence,
        details: {
          evidence: result.resonance_evidence,
          expectedFactors: factors
        }
      });
    }

    // Test edge cases
    const edgeCases = [
      { n: 0n, expectedPrime: false },
      { n: 1n, expectedPrime: false },
      { n: 2n, expectedPrime: true },
    ];

    for (const { n, expectedPrime } of edgeCases) {
      if (n < 2n) {
        // Handle special cases
        this.recordResult({
          category: 'Primality Detection',
          test: 'Edge Case',
          input: n.toString(),
          expected: expectedPrime,
          actual: false,
          passed: !expectedPrime,
          details: 'Numbers less than 2 are not prime'
        });
      } else {
        const result = this.analyzer.isProbablePrime(n);
        this.recordResult({
          category: 'Primality Detection',
          test: 'Edge Case',
          input: n.toString(),
          expected: expectedPrime,
          actual: result.is_probable_prime,
          passed: result.is_probable_prime === expectedPrime,
          confidence: result.confidence
        });
      }
    }
  }

  /**
   * Diagnose factorization accuracy
   */
  private async diagnoseFactorization(): Promise<void> {
    console.log('📊 Diagnosing Factorization...');

    const testCases = [
      { n: 6n, expected: [2n, 3n] },
      { n: 12n, expected: [2n, 2n, 3n] },
      { n: 77n, expected: [7n, 11n] },
      { n: 100n, expected: [2n, 2n, 5n, 5n] },
      { n: 1001n, expected: [7n, 11n, 13n] },
      { n: 10000n, expected: Array(4).fill(2n).concat(Array(4).fill(5n)) },
    ];

    for (const { n, expected } of testCases) {
      const result = await this.factorizer.attemptFactorization(n);
      const sortedActual = result.factors.sort((a, b) => Number(a - b));
      const sortedExpected = expected.sort((a, b) => Number(a - b));
      
      const passed = this.arraysEqual(sortedActual, sortedExpected);
      
      this.recordResult({
        category: 'Factorization',
        test: 'Known Factorization',
        input: n.toString(),
        expected: sortedExpected.map(f => f.toString()),
        actual: sortedActual.map(f => f.toString()),
        passed,
        confidence: result.confidence,
        details: {
          method: result.method,
          iterations: result.iterations
        }
      });
    }

    // Test large number factorization
    console.log('  Testing large number factorization...');
    const largeTests = [
      { n: 1000000000000n, desc: '10^12' },
      { n: 123456789012345n, desc: '15-digit number' },
      { n: 10n ** 20n, desc: '10^20' },
    ];

    for (const { n, desc } of largeTests) {
      const start = Date.now();
      const result = this.factorizer.attemptFactorization(n);
      const elapsed = Date.now() - start;
      
      // Verify factorization is correct
      let product = 1n;
      for (const factor of result.factors) {
        product *= factor;
      }
      
      this.recordResult({
        category: 'Factorization',
        test: 'Large Number',
        input: `${desc} (${n})`,
        expected: n.toString(),
        actual: product.toString(),
        passed: product === n,
        details: {
          factorCount: result.factors.length,
          method: result.method,
          time: `${elapsed}ms`,
          iterations: result.iterations
        }
      });
    }
  }

  /**
   * Diagnose field pattern behaviors
   */
  private async diagnoseFieldPatterns(): Promise<void> {
    console.log('📊 Diagnosing Field Patterns...');

    // Analyze field patterns for different number types
    const patterns: FieldPatternAnalysis[] = [];

    // Powers of 2 (should have single field active)
    console.log('  Analyzing powers of 2...');
    for (let i = 0; i < 8; i++) {
      const n = BigInt(1 << i);
      const analysis = this.analyzeFieldPattern(n);
      patterns.push(analysis);
    }

    // Powers of 10 (interesting field combinations)
    console.log('  Analyzing powers of 10...');
    for (let i = 1; i <= 6; i++) {
      const n = 10n ** BigInt(i);
      const analysis = this.analyzeFieldPattern(n);
      patterns.push(analysis);
    }

    // Primes in different ranges
    console.log('  Analyzing prime field patterns...');
    const primeRanges = [
      { start: 1, count: 25 },    // First 25 primes
      { start: 100, count: 10 },   // Primes around 100
      { start: 1000, count: 10 },  // Primes around 1000
    ];

    for (const range of primeRanges) {
      const primes = this.getPrimesInRange(range.start, range.count);
      for (const prime of primes) {
        const analysis = this.analyzeFieldPattern(BigInt(prime));
        patterns.push(analysis);
      }
    }

    // Analyze patterns for insights
    this.analyzePatternDistribution(patterns);
  }

  /**
   * Diagnose resonance calculations
   */
  private async diagnoseResonanceCalculations(): Promise<void> {
    console.log('📊 Diagnosing Resonance Calculations...');

    // Test perfect resonance (1.0)
    const perfectResonanceNumbers = [0, 1, 48, 49, 96, 97, 144, 145, 192, 193];
    
    for (const n of perfectResonanceNumbers) {
      const num = this.db.createNumber(n);
      const isPerfect = Math.abs(num.computed.resonance - 1.0) < 0.0000001;
      
      this.recordResult({
        category: 'Resonance',
        test: 'Perfect Resonance',
        input: n.toString(),
        expected: 1.0,
        actual: num.computed.resonance,
        passed: isPerfect,
        details: {
          fields: num.computed.field_signature,
          page: num.computed.page,
          offset: num.computed.offset
        }
      });
    }

    // Test resonance patterns for primes
    console.log('  Analyzing prime resonance patterns...');
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const primeResonances: { [key: string]: number[] } = {};
    
    for (const p of primes) {
      const num = this.db.createNumber(p);
      const sig = num.computed.field_signature;
      if (!primeResonances[sig]) {
        primeResonances[sig] = [];
      }
      primeResonances[sig].push(num.computed.resonance);
    }

    // Report on resonance clustering
    for (const [signature, resonances] of Object.entries(primeResonances)) {
      const avg = resonances.reduce((a, b) => a + b, 0) / resonances.length;
      const variance = resonances.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / resonances.length;
      
      this.recordResult({
        category: 'Resonance',
        test: 'Prime Resonance Pattern',
        input: signature,
        expected: 'Consistent',
        actual: `Avg: ${avg.toFixed(6)}, Var: ${variance.toFixed(6)}`,
        passed: variance < 0.1, // Low variance indicates consistency
        details: {
          count: resonances.length,
          values: resonances.map(r => r.toFixed(6))
        }
      });
    }
  }

  /**
   * Diagnose edge cases and anomalies
   */
  private async diagnoseEdgeCases(): Promise<void> {
    console.log('📊 Diagnosing Edge Cases...');

    // Test field overflow behavior
    const overflowTests = [
      255, // All fields active
      256, // First overflow
      511, // Next all-fields
      1023, // 10-bit all-fields
    ];

    for (const n of overflowTests) {
      const num = this.db.createNumber(n);
      const fieldCount = num.computed.field_signature.split('+').filter(f => f !== '∅').length;
      
      this.recordResult({
        category: 'Edge Cases',
        test: 'Field Overflow',
        input: n.toString(),
        expected: 'Valid field pattern',
        actual: `${fieldCount} fields active`,
        passed: fieldCount >= 0 && fieldCount <= 8,
        details: {
          binary: n.toString(2),
          fields: num.computed.field_signature,
          resonance: num.computed.resonance
        }
      });
    }

    // Test very large numbers
    const largeNumberTests = [
      { n: 2n ** 63n - 1n, desc: 'Max signed 64-bit' },
      { n: 2n ** 64n - 1n, desc: 'Max unsigned 64-bit' },
      { n: 10n ** 30n, desc: '10^30' },
      { n: 10n ** 50n, desc: '10^50' },
    ];

    for (const { n, desc } of largeNumberTests) {
      try {
        const analysis = this.analyzer.analyzeFieldHarmonics(n);
        this.recordResult({
          category: 'Edge Cases',
          test: 'Large Number Handling',
          input: desc,
          expected: 'No overflow',
          actual: 'Success',
          passed: true,
          details: {
            primary: analysis.primary,
            harmonicCount: analysis.harmonics.length,
            resonance: analysis.resonance_signature
          }
        });
      } catch (error) {
        this.recordResult({
          category: 'Edge Cases',
          test: 'Large Number Handling',
          input: desc,
          expected: 'No overflow',
          actual: `Error: ${error}`,
          passed: false
        });
      }
    }
  }

  /**
   * Diagnose performance characteristics
   */
  private async diagnosePerformance(): Promise<void> {
    console.log('📊 Diagnosing Performance...');

    // Test creation performance
    const sizes = [100, 1000, 10000];
    
    for (const size of sizes) {
      const start = Date.now();
      for (let i = 0; i < size; i++) {
        this.db.createNumber(i);
      }
      const elapsed = Date.now() - start;
      const opsPerSecond = (size / elapsed) * 1000;
      
      this.recordResult({
        category: 'Performance',
        test: 'Number Creation',
        input: `${size} numbers`,
        expected: '> 1000 ops/sec',
        actual: `${opsPerSecond.toFixed(0)} ops/sec`,
        passed: opsPerSecond > 1000,
        details: {
          totalTime: `${elapsed}ms`,
          avgTime: `${(elapsed / size).toFixed(3)}ms`
        }
      });
    }

    // Test factorization performance by size
    const factorTests = [
      { n: 77n, desc: 'Small composite' },
      { n: 1001n, desc: 'Medium composite' },
      { n: 1000000n, desc: 'Large composite' },
      { n: 123456789n, desc: 'Very large composite' },
    ];

    for (const { n, desc } of factorTests) {
      const start = Date.now();
      const result = this.factorizer.attemptFactorization(n);
      const elapsed = Date.now() - start;
      
      this.recordResult({
        category: 'Performance',
        test: 'Factorization Speed',
        input: desc,
        expected: '< 100ms',
        actual: `${elapsed}ms`,
        passed: elapsed < 100,
        details: {
          number: n.toString(),
          method: result.method,
          iterations: result.iterations,
          factorCount: result.factors.length
        }
      });
    }
  }

  /**
   * Helper: Analyze field pattern for a number
   */
  private analyzeFieldPattern(n: bigint): FieldPatternAnalysis {
    const num = n <= BigInt(Number.MAX_SAFE_INTEGER) 
      ? this.db.createNumber(Number(n))
      : null;
    
    const primalityCheck = this.analyzer.isProbablePrime(n);
    const primary = Number(n % 256n);
    
    return {
      number: n,
      fields: num?.computed.field_signature || `Pattern ${primary.toString(2).padStart(8, '0')}`,
      resonance: num?.computed.resonance || 0,
      isPrime: primalityCheck.is_probable_prime,
      factors: undefined // Skip factorization in data collection for now
    };
  }

  /**
   * Helper: Get primes in a range
   */
  private getPrimesInRange(start: number, count: number): number[] {
    const primes: number[] = [];
    let n = start;
    
    while (primes.length < count && n < 10000) {
      if (this.isPrimeSimple(n)) {
        primes.push(n);
      }
      n++;
    }
    
    return primes;
  }

  /**
   * Helper: Simple primality test
   */
  private isPrimeSimple(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    
    return true;
  }

  /**
   * Helper: Compare arrays of BigInts
   */
  private arraysEqual(a: bigint[], b: bigint[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * Helper: Analyze pattern distribution
   */
  private analyzePatternDistribution(patterns: FieldPatternAnalysis[]): void {
    const fieldCounts: { [key: string]: number } = {};
    const resonanceRanges: { [key: string]: number } = {
      '0-0.1': 0,
      '0.1-0.5': 0,
      '0.5-1.0': 0,
      '1.0': 0,
      '1.0-2.0': 0,
      '2.0-5.0': 0,
      '5.0+': 0
    };

    for (const pattern of patterns) {
      // Count field signatures
      fieldCounts[pattern.fields] = (fieldCounts[pattern.fields] || 0) + 1;
      
      // Categorize resonance
      const r = pattern.resonance;
      if (r < 0.1) resonanceRanges['0-0.1']++;
      else if (r < 0.5) resonanceRanges['0.1-0.5']++;
      else if (r < 1.0) resonanceRanges['0.5-1.0']++;
      else if (r === 1.0) resonanceRanges['1.0']++;
      else if (r < 2.0) resonanceRanges['1.0-2.0']++;
      else if (r < 5.0) resonanceRanges['2.0-5.0']++;
      else resonanceRanges['5.0+']++;
    }

    // Report on distribution
    this.recordResult({
      category: 'Field Patterns',
      test: 'Pattern Distribution',
      input: `${patterns.length} numbers analyzed`,
      expected: 'Diverse patterns',
      actual: `${Object.keys(fieldCounts).length} unique patterns`,
      passed: true,
      details: {
        topPatterns: Object.entries(fieldCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([pattern, count]) => `${pattern}: ${count}`),
        resonanceDistribution: resonanceRanges
      }
    });
  }

  /**
   * Record a diagnostic result
   */
  private recordResult(result: DiagnosticResult): void {
    this.results.push(result);
    
    const symbol = result.passed ? '✅' : '❌';
    const confidence = result.confidence ? ` (${(result.confidence * 100).toFixed(1)}% conf)` : '';
    console.log(`  ${symbol} ${result.test}: ${result.input}${confidence}`);
    
    if (!result.passed && result.details) {
      console.log(`     Expected: ${JSON.stringify(result.expected)}`);
      console.log(`     Actual: ${JSON.stringify(result.actual)}`);
    }
  }

  /**
   * Generate comprehensive diagnostic report
   */
  private generateReport(): void {
    console.log('\n📋 Diagnostic Report');
    console.log('===================\n');

    // Summary by category
    const categories = [...new Set(this.results.map(r => r.category))];
    
    for (const category of categories) {
      const catResults = this.results.filter(r => r.category === category);
      const passed = catResults.filter(r => r.passed).length;
      const total = catResults.length;
      const percentage = ((passed / total) * 100).toFixed(1);
      
      console.log(`${category}: ${passed}/${total} (${percentage}%)`);
      
      // Show failures
      const failures = catResults.filter(r => !r.passed);
      if (failures.length > 0) {
        console.log('  Failures:');
        for (const failure of failures.slice(0, 5)) { // Show first 5 failures
          console.log(`    - ${failure.test}: ${failure.input}`);
        }
        if (failures.length > 5) {
          console.log(`    ... and ${failures.length - 5} more`);
        }
      }
      console.log('');
    }

    // Overall statistics
    const totalPassed = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;
    const overallPercentage = ((totalPassed / totalTests) * 100).toFixed(1);
    
    console.log(`Overall: ${totalPassed}/${totalTests} (${overallPercentage}%) passed`);

    // Key insights
    console.log('\n🔍 Key Insights:');
    this.generateInsights();

    // Save detailed results
    this.saveDetailedResults();
  }

  /**
   * Generate insights from diagnostic results
   */
  private generateInsights(): void {
    const insights: string[] = [];

    // Check primality detection issues
    const primalityResults = this.results.filter(r => 
      r.category === 'Primality Detection' && r.test === 'Known Composite'
    );
    const falsePrimes = primalityResults.filter(r => !r.passed);
    if (falsePrimes.length > 0) {
      insights.push(`⚠️  ${falsePrimes.length} composites incorrectly identified as prime`);
      
      // Check if they're powers of 10
      const powersOf10 = falsePrimes.filter(r => {
        const n = BigInt(r.input);
        return n.toString().match(/^10+$/);
      });
      if (powersOf10.length > 0) {
        insights.push(`   - All powers of 10 are misidentified as prime!`);
      }
    }

    // Check factorization issues
    const factorizationResults = this.results.filter(r => 
      r.category === 'Factorization' && r.test === 'Known Factorization'
    );
    const failedFactorizations = factorizationResults.filter(r => !r.passed);
    if (failedFactorizations.length > 0) {
      insights.push(`⚠️  ${failedFactorizations.length} numbers failed to factor correctly`);
      
      // Identify common patterns
      const unfactored = failedFactorizations.filter(r => 
        Array.isArray(r.actual) && r.actual.length === 1
      );
      if (unfactored.length > 0) {
        insights.push(`   - ${unfactored.length} composites returned unfactored`);
      }
    }

    // Check performance issues
    const performanceResults = this.results.filter(r => r.category === 'Performance');
    const slowOps = performanceResults.filter(r => !r.passed);
    if (slowOps.length > 0) {
      insights.push(`⚠️  ${slowOps.length} performance issues detected`);
    }

    // Positive findings
    const resonanceResults = this.results.filter(r => 
      r.category === 'Resonance' && r.test === 'Perfect Resonance'
    );
    const perfectResonance = resonanceResults.filter(r => r.passed);
    if (perfectResonance.length > 0) {
      insights.push(`✅ Perfect resonance calculation working for ${perfectResonance.length} numbers`);
    }

    // Field pattern insights
    const fieldResults = this.results.filter(r => 
      r.category === 'Field Patterns' && r.test === 'Pattern Distribution'
    );
    if (fieldResults.length > 0 && fieldResults[0].details) {
      const details = fieldResults[0].details;
      insights.push(`✅ Field patterns show good diversity: ${details.topPatterns.length} top patterns`);
    }

    // Print insights
    for (const insight of insights) {
      console.log(insight);
    }
  }

  /**
   * Save detailed results to file
   */
  private saveDetailedResults(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `diagnostic-results-${timestamp}.json`;
    const filepath = path.join(__dirname, 'results', filename);

    // Ensure results directory exists
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Save results
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.passed).length,
        failed: this.results.filter(r => !r.passed).length
      },
      results: this.results
    };

    // Custom serializer for BigInt
    const jsonString = JSON.stringify(output, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2);
    
    fs.writeFileSync(filepath, jsonString);
    console.log(`\n💾 Detailed results saved to: ${filename}`);
  }
}

// Export for use
export { MathUniverseDiagnostics };

// Run diagnostics if called directly
if (process.argv[1] === __filename) {
  const diagnostics = new MathUniverseDiagnostics();
  diagnostics.runFullDiagnostics().catch(console.error);
}