import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { ScalableAgentFactorization } from '@uor-foundation/resonance';

async function testScalableFactorization() {
  const substrate = createFieldSubstrate();
  const factorizer = new ScalableAgentFactorization(substrate);

  console.log('=== Testing Scalable Field-Based Factorization ===\n');

  const testCases = [
    // Small cases we know work
    { n: 77n, expected: [7n, 11n] },
    { n: 1001n, expected: [7n, 11n, 13n] },
    { n: 10001n, expected: [73n, 137n] },
    
    // Larger cases to test scaling
    { n: 100003n, expected: [100003n] }, // Prime
    { n: 1000003n, expected: [1000003n] }, // Prime
    { n: 10000019n, expected: [10000019n] }, // Prime
    
    // Large composites
    { n: 1000007n, expected: [1000007n] }, // Actually prime
    { n: 1000009n, expected: [293n, 3413n] }, // Composite
    { n: 10000079n, expected: [10000079n] }, // Prime
    { n: 10000169n, expected: [7n, 1428881n] }, // Composite
    
    // Very large to see limits
    { n: 1000000007n, expected: [1000000007n] }, // Prime
    { n: 1000000009n, expected: [293n, 3413003n] }, // Composite
  ];

  for (const { n, expected } of testCases) {
    console.log(`\nFactoring ${n}:`);
    const start = Date.now();
    
    try {
      const factors = await factorizer.factorize(n);
      const time = Date.now() - start;
      
      // Verify product
      const product = factors.reduce((a, b) => a * b, 1n);
      const correct = product === n;
      
      console.log(`Result: ${factors.join(' × ')} ${correct ? '✓' : '✗'}`);
      console.log(`Time: ${time}ms`);
      
      // Show field patterns
      if (factors.length > 1 && factors[0] !== n) {
        console.log('Field analysis:');
        const nPattern = substrate.getFieldPattern(n);
        console.log(`${n}: ${nPattern.map(b => b ? '1' : '0').join('')}`);
        
        for (const factor of [...new Set(factors)]) {
          const fPattern = substrate.getFieldPattern(factor);
          console.log(`${factor}: ${fPattern.map(b => b ? '1' : '0').join('')}`);
        }
        
        // Show field transformations
        if (factors.length === 2) {
          const p1 = substrate.getFieldPattern(factors[0]);
          const p2 = substrate.getFieldPattern(factors[1]);
          
          console.log('Field transformations:');
          for (let i = 0; i < 8; i++) {
            if (p1[i] && p2[i] && !nPattern[i]) {
              console.log(`  Field ${i} vanished`);
            } else if (!p1[i] && !p2[i] && nPattern[i]) {
              console.log(`  Field ${i} emerged`);
            }
          }
        }
      }
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
  
  // Test the limits - what's the largest number we can factor?
  console.log('\n\n=== Finding Limits ===');
  
  const limitTests = [
    10001n * 10007n,    // ~100 million
    100003n * 100019n,  // ~10 billion  
    1000003n * 1000033n // ~1 trillion
  ];
  
  for (const n of limitTests) {
    console.log(`\nFactoring ${n} (${n.toString().length} digits):`);
    const start = Date.now();
    
    try {
      const factors = await factorizer.factorize(n);
      const time = Date.now() - start;
      
      console.log(`Result: ${factors.join(' × ')}`);
      console.log(`Time: ${time}ms`);
      
      if (factors.length === 1 && factors[0] === n) {
        console.log('Failed to factor - limit reached');
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

testScalableFactorization().catch(console.error);