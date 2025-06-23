import { DimensionalVisualization } from './packages/higher-dimensions/src/dimensional-visualization';
import { HyperdimensionalFactorization } from './packages/higher-dimensions/src/hyperdimensional-factorization';

/**
 * Test the higher-dimensional number representation and factorization system
 */

async function testHyperdimensionalSystem() {
  const viz = new DimensionalVisualization();
  const factorizer = new HyperdimensionalFactorization();
  
  console.log('=== HIGHER-DIMENSIONAL NUMBER REPRESENTATION ===\n');
  console.log('Total Dimensionality: 96 (8 base + 8 composite + 8 phase + 64 entanglement + 8 topology)\n');
  
  // Test 1: Visualize prime numbers in extended space
  console.log('\n--- PRIMES IN EXTENDED SPACE ---');
  
  const primes = [7n, 23n, 73n, 137n, 211n];
  for (const p of primes) {
    console.log(viz.visualizeExtendedPattern(p));
  }
  
  // Test 2: Compare related numbers
  console.log('\n--- COMPARING RELATED NUMBERS ---');
  
  // Compare 73 and 137 (factors of 10001)
  console.log(viz.compareNumbers(73n, 137n));
  
  // Compare 73 and 37 (digit reversal)
  console.log(viz.compareNumbers(73n, 37n));
  
  // Test 3: Visualize semiprimes
  console.log('\n--- SEMIPRIMES IN EXTENDED SPACE ---');
  
  const semiprimes = [
    { n: 77n, factors: [7n, 11n] },
    { n: 10001n, factors: [73n, 137n] },
    { n: 99400891n, factors: [9967n, 9973n] },
  ];
  
  for (const { n, factors } of semiprimes) {
    console.log(viz.visualizeExtendedPattern(n));
    console.log(viz.visualizeFactorization(n, factors));
  }
  
  // Test 4: Test hyperdimensional factorization
  console.log('\n--- HYPERDIMENSIONAL FACTORIZATION ---\n');
  
  const testNumbers = [
    77n,       // 7 × 11
    143n,      // 11 × 13
    10001n,    // 73 × 137
    10403n,    // 101 × 103
    100003n,   // 17 × 5883 (harder)
    1000003n,  // Prime
  ];
  
  for (const n of testNumbers) {
    console.log(`\nFactoring ${n}...`);
    const start = Date.now();
    const result = await factorizer.factorize(n);
    const elapsed = Date.now() - start;
    
    console.log(`Result: ${result.factors.join(' × ')}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Method: ${result.dimensionalSignature}`);
    console.log(`Time: ${elapsed}ms`);
    
    // Verify
    const product = result.factors.reduce((a, b) => a * b, 1n);
    console.log(`Verification: ${product === n ? '✓' : '✗'}`);
    
    if (result.factors.length > 1) {
      console.log(factorizer.analyzeFactorization(n, result.factors));
    }
  }
  
  // Test 5: Explore dimensional neighborhoods
  console.log('\n--- DIMENSIONAL NEIGHBORHOODS ---\n');
  
  console.log(viz.exploreNeighborhood(73n, 10));
  console.log(viz.exploreNeighborhood(10001n, 5));
  
  // Test 6: Large semiprime challenge
  console.log('\n--- LARGE SEMIPRIME CHALLENGE ---\n');
  
  const largeSemiprimes = [
    { n: 10000019n, desc: 'Near 10^7' },
    { n: 100000007n, desc: 'Near 10^8' },
    { n: 99400891n, desc: 'Product of twin primes' },
  ];
  
  for (const { n, desc } of largeSemiprimes) {
    console.log(`\nChallenge: ${n} (${desc})`);
    
    const start = Date.now();
    const result = await factorizer.factorize(n);
    const elapsed = Date.now() - start;
    
    if (result.factors.length > 1) {
      console.log(`Success! ${n} = ${result.factors.join(' × ')}`);
      console.log(`Method: ${result.dimensionalSignature}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`Time: ${elapsed}ms`);
    } else {
      console.log(`Could not factor (likely prime)`);
    }
  }
  
  // Test 7: Dimensional evolution
  console.log('\n--- DIMENSIONAL EVOLUTION ---\n');
  
  console.log('Tracking how patterns evolve through multiplication:\n');
  
  const base = 7n;
  let current = base;
  
  for (let i = 1; i <= 5; i++) {
    console.log(`${base}^${i} = ${current}`);
    const pattern = viz.visualizeExtendedPattern(current);
    
    // Show just the summary
    const lines = pattern.split('\n');
    console.log(lines.slice(0, 10).join('\n'));
    console.log('...\n');
    
    current *= base;
  }
  
  console.log('\n=== SUMMARY ===\n');
  console.log('The higher-dimensional representation provides:');
  console.log('1. 96-dimensional space capturing multiple aspects of numbers');
  console.log('2. Phase relationships encoding multiplicative structure');
  console.log('3. Entanglement patterns revealing factor relationships');
  console.log('4. Topological charges indicating arithmetic boundaries');
  console.log('5. Multiple factorization strategies leveraging different dimensions');
  console.log('\nNumbers are not just points but rich geometric objects in high-dimensional space!');
}

testHyperdimensionalSystem().catch(console.error);