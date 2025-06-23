import { CyclicFactorization } from './packages/higher-dimensions/src/cyclic-factorization';

/**
 * Debug advanced cyclic factorization cases
 */

async function debugCyclicAdvanced() {
  console.log('=== DEBUGGING ADVANCED CYCLIC FACTORIZATION ===\n');
  
  const factorizer = new CyclicFactorization();
  
  // Test larger numbers that might trigger advanced methods
  const advancedCases = [
    { n: 1001n, desc: 'Composite with 3 factors' },
    { n: 10001n, desc: 'Large semiprime' },
    { n: 100003n, desc: 'Large prime' },
    { n: 256n * 10n + 77n, desc: 'Scaled pattern' },
  ];
  
  for (const { n, desc } of advancedCases) {
    console.log(`\nTesting ${n} (${desc})...`);
    console.log(`Residue: ${n % 256n}`);
    
    try {
      console.time(`Factor ${n}`);
      
      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const factorPromise = factorizer.factorize(n);
      
      const result = await Promise.race([factorPromise, timeoutPromise]) as any;
      console.timeEnd(`Factor ${n}`);
      
      console.log(`Result: ${result.factors.join(' × ')}`);
      console.log(`Method: ${result.method}`);
      
      // Verify
      const product = result.factors.reduce((a: bigint, b: bigint) => a * b, 1n);
      console.log(`Verification: ${product === n ? '✓' : '✗'}`);
    } catch (error: any) {
      console.timeEnd(`Factor ${n}`);
      console.error(`ERROR: ${error.message}`);
    }
  }
  
  // Test each strategy individually
  console.log('\n\nTesting individual strategies on 77:');
  const n = 77n;
  const residue = Number(n % 256n);
  
  // Create a mock pattern
  const pattern = {
    residue,
    basePattern: [true, false, true, true, false, false, true, false],
    knownFactorizations: new Map()
  };
  
  // We can't easily test private methods, so let's test factorization behavior
  console.log('\nChecking which methods succeed for different numbers:');
  
  const methodTests = [
    15n,    // Should use PATTERN_DIRECT
    257n,   // 257 = prime, should be PRIME
    1001n,  // Should use advanced method
  ];
  
  for (const test of methodTests) {
    const result = await factorizer.factorize(test);
    console.log(`${test}: ${result.method}`);
  }
}

debugCyclicAdvanced().catch(console.error);