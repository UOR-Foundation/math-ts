import { CyclicFactorization } from './packages/higher-dimensions/src/cyclic-factorization';

/**
 * Debug cyclic factorization
 */

async function debugCyclic() {
  console.log('=== DEBUGGING CYCLIC FACTORIZATION ===\n');
  
  const factorizer = new CyclicFactorization();
  
  // Test simple cases first
  const testCases = [
    { n: 15n, expected: '3 × 5' },
    { n: 21n, expected: '3 × 7' },
    { n: 35n, expected: '5 × 7' },
    { n: 77n, expected: '7 × 11' },
    { n: 143n, expected: '11 × 13' },
  ];
  
  for (const { n, expected } of testCases) {
    console.log(`\nTesting ${n} (expected: ${expected})...`);
    
    try {
      console.time(`Factor ${n}`);
      const result = await factorizer.factorize(n);
      console.timeEnd(`Factor ${n}`);
      
      console.log(`Result: ${result.factors.join(' × ')}`);
      console.log(`Method: ${result.method}`);
      
      // Verify
      const product = result.factors.reduce((a, b) => a * b, 1n);
      console.log(`Verification: ${product === n ? '✓' : '✗'} (product = ${product})`);
    } catch (error) {
      console.error(`ERROR: ${error}`);
    }
  }
  
  // Test a prime
  console.log('\n\nTesting prime detection:');
  const primes = [7n, 23n, 73n];
  
  for (const p of primes) {
    console.log(`\nTesting ${p}...`);
    try {
      const result = await factorizer.factorize(p);
      console.log(`Result: ${result.factors.join(' × ')}`);
      console.log(`Method: ${result.method}`);
    } catch (error) {
      console.error(`ERROR: ${error}`);
    }
  }
  
  // Debug the pattern cache
  console.log('\n\nPattern Cache Info:');
  console.log('Cache initialized with patterns for residues 0-255');
  
  // Test specific residue class
  console.log('\n\nTesting numbers in same residue class:');
  const base = 77n; // residue 77
  const residue = Number(base % 256n);
  console.log(`Base: ${base}, Residue: ${residue}`);
  
  const sameResidue = [
    base,
    base + 256n,
    base + 512n,
  ];
  
  for (const n of sameResidue) {
    console.log(`\n${n} (residue ${n % 256n}):`);
    const result = await factorizer.factorize(n);
    console.log(`  Factors: ${result.factors.join(' × ')}`);
    console.log(`  Method: ${result.method}`);
  }
}

debugCyclic().catch(console.error);