import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { MultiModalFactorization } from '@uor-foundation/resonance';

async function debugMultiModal() {
  const substrate = createFieldSubstrate();
  const factorizer = new MultiModalFactorization(substrate);

  console.log('=== Multi-Modal Factorization Debug ===\n');

  // Test cases we know the answers to
  const testCases = [
    { n: 77n, expected: [7n, 11n], description: '77 = 7 × 11' },
    { n: 1001n, expected: [7n, 11n, 13n], description: '1001 = 7 × 11 × 13' },
    { n: 10001n, expected: [73n, 137n], description: '10001 = 73 × 137' },
    { n: 100003n, expected: [100003n], description: '100003 is prime' },
    { n: 1000007n, expected: [29n, 34483n], description: '1000007 = 29 × 34483' },
  ];

  for (const { n, expected, description } of testCases) {
    console.log(`\n--- Testing ${description} ---`);
    console.log(`Number: ${n}`);
    
    // Show field analysis
    const pattern = substrate.getFieldPattern(n);
    console.log(`Field pattern: ${pattern.map(b => b ? '1' : '0').join('')}`);
    console.log(`Active fields: ${pattern.map((b, i) => b ? i : -1).filter(i => i >= 0).join(', ')}`);
    
    // Show resonance
    const resonance = calculateResonance(substrate, n);
    console.log(`Resonance: ${resonance.toFixed(4)}`);
    
    // Show page position
    const page = Number(n / 48n);
    const offset = Number(n % 48n);
    console.log(`Page: ${page}, Offset: ${offset}`);
    
    // Run factorization
    console.log('\nRunning multi-modal factorization...');
    const start = Date.now();
    
    try {
      const factors = await factorizer.factorize(n);
      const time = Date.now() - start;
      
      console.log(`Result: ${factors.join(' × ')}`);
      console.log(`Time: ${time}ms`);
      
      // Verify
      const product = factors.reduce((a, b) => a * b, 1n);
      const correct = product === n;
      console.log(`Verification: ${correct ? '✓' : '✗'}`);
      
      // Compare with expected
      const expectedProduct = expected.reduce((a, b) => a * b, 1n);
      if (expectedProduct === n) {
        console.log(`Expected: ${expected.join(' × ')}`);
        const match = factors.length === expected.length && 
                     factors.every((f, i) => f === expected[i]);
        console.log(`Match: ${match ? '✓' : '✗'}`);
      }
      
      // Show field interference if composite
      if (factors.length > 1 && factors[0] !== n) {
        console.log('\nField interference analysis:');
        const f1Pattern = substrate.getFieldPattern(factors[0]);
        const f2Pattern = substrate.getFieldPattern(factors[factors.length - 1]);
        
        for (let i = 0; i < 8; i++) {
          if (f1Pattern[i] && f2Pattern[i] && !pattern[i]) {
            console.log(`  Field ${i}: VANISHED`);
          } else if (!f1Pattern[i] && !f2Pattern[i] && pattern[i]) {
            console.log(`  Field ${i}: EMERGED`);
          }
        }
      }
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
      console.log(error.stack);
    }
  }
}

// Helper function we need
function calculateResonance(substrate: any, n: bigint): number {
  const pattern = substrate.getFieldPattern(n);
  const constants = substrate.getFieldConstants();
  
  let resonance = 1;
  for (let i = 0; i < 8; i++) {
    if (pattern[i]) {
      resonance *= constants[i];
    }
  }
  
  return resonance;
}

debugMultiModal().catch(console.error);