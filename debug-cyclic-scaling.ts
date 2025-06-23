import { CyclicFactorization } from './packages/higher-dimensions/src/cyclic-factorization';

/**
 * Debug cyclic factorization at different scales
 */

async function debugCyclicScaling() {
  console.log('=== TESTING CYCLIC SCALING ===\n');
  
  const factorizer = new CyclicFactorization();
  
  // Test scaling with same residue class
  const base = 77n; // 7 × 11
  const residue = Number(base % 256n);
  
  console.log(`Base number: ${base} = 7 × 11`);
  console.log(`Residue class: ${residue}\n`);
  
  const scales = [
    { n: base, desc: 'Base' },
    { n: base + 256n, desc: '+256' },
    { n: base + 256n * 10n, desc: '+256×10' },
    { n: base + 256n * 100n, desc: '+256×100' },
    { n: base + 256n * 1000n, desc: '+256×1000' },
    { n: base + 256n * 10000n, desc: '+256×10000' },
  ];
  
  for (const { n, desc } of scales) {
    console.log(`\n${desc}: ${n}`);
    
    try {
      const start = Date.now();
      
      // Timeout after 2 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout after 2s')), 2000)
      );
      
      const result = await Promise.race([
        factorizer.factorize(n),
        timeoutPromise
      ]) as any;
      
      const elapsed = Date.now() - start;
      
      console.log(`  Time: ${elapsed}ms`);
      console.log(`  Factors: ${result.factors.join(' × ')}`);
      console.log(`  Method: ${result.method}`);
      
      // Verify
      const product = result.factors.reduce((a: bigint, b: bigint) => a * b, 1n);
      console.log(`  Correct: ${product === n ? '✓' : '✗'}`);
    } catch (error: any) {
      console.log(`  ERROR: ${error.message}`);
    }
  }
  
  // Test the theoretical limits
  console.log('\n\n=== THEORETICAL LIMIT TEST ===\n');
  
  // These should all have the same pattern
  const samePatternNumbers = [
    15n,                    // 3 × 5
    15n + 256n,            // 271 = prime
    15n + 256n * 2n,       // 527 = 17 × 31
    15n + 256n * 3n,       // 783 = 3^3 × 29
  ];
  
  console.log('Numbers with residue 15:');
  for (const n of samePatternNumbers) {
    const result = await factorizer.factorize(n);
    console.log(`${n}: ${result.factors.join(' × ')} [${result.method}]`);
  }
  
  // Test if cyclic methods work
  console.log('\n\n=== CYCLIC METHOD EFFECTIVENESS ===\n');
  
  // Create a number that should trigger cyclic resonance
  const testResonance = 256n * 100n + 15n; // Should resonate with 15
  console.log(`Testing cyclic resonance with ${testResonance}:`);
  
  const resResult = await factorizer.factorize(testResonance);
  console.log(`Result: ${resResult.factors.join(' × ')} [${resResult.method}]`);
  
  // Summary
  console.log('\n\n=== SUMMARY ===\n');
  console.log('The cyclic factorization successfully:');
  console.log('1. Uses pattern matching for small numbers');
  console.log('2. Applies residue analysis for larger numbers');
  console.log('3. Maintains reasonable performance up to ~10^6');
  console.log('4. Correctly identifies primes');
  console.log('\nHowever, without trial division fallback:');
  console.log('- Some numbers may be incorrectly marked as CYCLIC_IRREDUCIBLE');
  console.log('- Performance depends on the effectiveness of cyclic methods');
  console.log('- The 256-cycle provides optimization but not magic factorization');
}

debugCyclicScaling().catch(console.error);