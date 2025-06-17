#!/usr/bin/env node

/**
 * Mathematical Universe Diagnostics Runner
 * 
 * This script runs the diagnostic suite and provides tuning recommendations
 * to improve the implementation's accuracy and performance.
 */

import { MathUniverseDiagnostics } from './diagnostic-suite';
import { TuningAdvisor, DEFAULT_CONFIG, OPTIMIZED_CONFIGS } from './tuning-config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'run';

async function main() {
  switch (command) {
    case 'run':
      await runDiagnostics();
      break;
    
    case 'tune':
      await tuneBasedOnDiagnostics();
      break;
    
    case 'quick':
      await runQuickDiagnostics();
      break;
    
    case 'help':
      showHelp();
      break;
    
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

/**
 * Run full diagnostic suite
 */
async function runDiagnostics() {
  console.log('🚀 Starting Mathematical Universe Diagnostics...\n');
  
  const diagnostics = new MathUniverseDiagnostics();
  await diagnostics.runFullDiagnostics();
  
  console.log('\n✅ Diagnostics complete!');
}

/**
 * Run diagnostics and generate tuning recommendations
 */
async function tuneBasedOnDiagnostics() {
  console.log('🔧 Running diagnostics for tuning...\n');
  
  // First run diagnostics
  const diagnostics = new MathUniverseDiagnostics();
  await diagnostics.runFullDiagnostics();
  
  // Load the results
  const resultsDir = path.join(__dirname, 'results');
  const files = fs.readdirSync(resultsDir)
    .filter(f => f.startsWith('diagnostic-results-'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error('No diagnostic results found. Run diagnostics first.');
    process.exit(1);
  }
  
  const latestResults = JSON.parse(
    fs.readFileSync(path.join(resultsDir, files[0]), 'utf-8')
  );
  
  // Generate recommendations
  console.log('\n🔍 Analyzing results for tuning recommendations...\n');
  const recommendations = TuningAdvisor.generateRecommendations(latestResults.results);
  
  if (recommendations.length === 0) {
    console.log('✅ No tuning recommendations needed - implementation is performing well!');
    return;
  }
  
  console.log(`Found ${recommendations.length} tuning recommendations:\n`);
  
  // Display recommendations
  for (const rec of recommendations) {
    const impact = rec.impact.toUpperCase();
    const symbol = rec.impact === 'high' ? '🔴' : rec.impact === 'medium' ? '🟡' : '🟢';
    
    console.log(`${symbol} [${impact}] ${rec.parameter}`);
    console.log(`   Current: ${JSON.stringify(rec.currentValue)}`);
    console.log(`   Recommended: ${JSON.stringify(rec.recommendedValue)}`);
    console.log(`   Reason: ${rec.reason}\n`);
  }
  
  // Apply recommendations
  const newConfig = TuningAdvisor.applyRecommendations(DEFAULT_CONFIG, recommendations);
  
  // Save tuned configuration
  const configPath = path.join(__dirname, 'tuned-config.json');
  // Custom serializer for BigInt
  const jsonString = JSON.stringify(newConfig, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    return value;
  }, 2);
  
  fs.writeFileSync(configPath, jsonString);
  console.log(`\n💾 Tuned configuration saved to: tuned-config.json`);
  
  // Show comparison
  console.log('\n📊 Key changes in tuned configuration:');
  console.log('- Primality confidence threshold:', 
    `${DEFAULT_CONFIG.primality.minConfidenceForPrime} → ${newConfig.primality.minConfidenceForPrime}`);
  console.log('- Divisibility check limit:', 
    `${DEFAULT_CONFIG.primality.checkDivisibilityUpTo} → ${newConfig.primality.checkDivisibilityUpTo}`);
  console.log('- Trial division limit:', 
    `${DEFAULT_CONFIG.factorization.trialDivisionLimit} → ${newConfig.factorization.trialDivisionLimit}`);
}

/**
 * Run quick diagnostics (subset of tests)
 */
async function runQuickDiagnostics() {
  console.log('⚡ Running quick diagnostics...\n');
  
  // Run a subset of critical tests
  const db = new (await import('../src/math-universe')).MathematicalUniverseDB();
  const analyzer = new (await import('../src/math-universe-large')).LargeNumberFieldAnalysis();
  const factorizer = new (await import('../src/math-universe-large')).FieldCollapseFactorization();
  
  const criticalTests = [
    { n: 10n, expectedPrime: false, expectedFactors: [2n, 5n] },
    { n: 77n, expectedPrime: false, expectedFactors: [7n, 11n] },
    { n: 100n, expectedPrime: false, expectedFactors: [2n, 2n, 5n, 5n] },
    { n: 1000n, expectedPrime: false, expectedFactors: [2n, 2n, 2n, 5n, 5n, 5n] },
    { n: 97n, expectedPrime: true, expectedFactors: [97n] },
    { n: 10n ** 30n, expectedPrime: false, expectedFactors: null }, // Just check it's not prime
  ];
  
  let passed = 0;
  let failed = 0;
  
  console.log('Testing critical cases:');
  
  for (const test of criticalTests) {
    // Test primality
    const primeResult = analyzer.isProbablePrime(test.n);
    const primeCorrect = primeResult.is_probable_prime === test.expectedPrime;
    
    // Test factorization if we have expected factors
    let factorCorrect = true;
    if (test.expectedFactors) {
      const factorResult = await factorizer.attemptFactorization(test.n);
      const actualFactors = factorResult.factors.sort((a, b) => Number(a - b));
      const expectedFactors = test.expectedFactors.sort((a, b) => Number(a - b));
      
      factorCorrect = actualFactors.length === expectedFactors.length &&
        actualFactors.every((f, i) => f === expectedFactors[i]);
    }
    
    const testPassed = primeCorrect && factorCorrect;
    
    console.log(`  ${testPassed ? '✅' : '❌'} n=${test.n}: ` +
      `prime=${primeResult.is_probable_prime} (expected ${test.expectedPrime})`);
    
    if (testPassed) passed++;
    else failed++;
  }
  
  console.log(`\nQuick diagnostics: ${passed}/${passed + failed} passed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Critical issues detected! Run full diagnostics for details.');
  } else {
    console.log('\n✅ All critical tests passed!');
  }
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Mathematical Universe Diagnostics Runner

Usage: npm run diagnostics [command]

Commands:
  run     Run full diagnostic suite (default)
  tune    Run diagnostics and generate tuning recommendations
  quick   Run quick diagnostics (critical tests only)
  help    Show this help message

Examples:
  npm run diagnostics              # Run full diagnostics
  npm run diagnostics tune         # Run and generate tuning config
  npm run diagnostics quick        # Quick critical tests
`);
}

// Run main function
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});