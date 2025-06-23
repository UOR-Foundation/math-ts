import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { AgentFactorization } from '@uor-foundation/resonance';

async function exploreAgentFactorization() {
  const substrate = createFieldSubstrate();
  const agentFactory = new AgentFactorization(substrate);

  console.log('=== Agent-Based Factorization: Living Number Exploration ===\n');

  // Test cases that gave us trouble
  const testCases = [
    77n,      // 7 × 11
    1001n,    // 7 × 11 × 13  
    10001n,   // 73 × 137
    100001n,  // 11 × 9091
    1000001n, // 101 × 3541 × ? (actually has more factors)
  ];

  for (const n of testCases) {
    console.log(`\n--- Interrogating ${n} ---`);
    
    // Let the number tell its story
    const story = await agentFactory.tellYourStory(n);
    console.log(story);
    
    // Perform agent-based factorization
    console.log('\nAgent interrogation results:');
    const factors = await agentFactory.interrogateComposite(n);
    console.log(`Factors discovered: ${factors.join(' × ')}`);
    
    // Verify the factorization
    const product = factors.reduce((a, b) => a * b, 1n);
    console.log(`Verification: ${factors.join(' × ')} = ${product} ${product === n ? '✓' : '✗'}`);
    
    // Show field patterns
    console.log('\nField analysis:');
    const pattern = substrate.getFieldPattern(n);
    console.log(`${n}: ${pattern.map(b => b ? '1' : '0').join('')}`);
    
    for (const factor of [...new Set(factors)]) {
      const factorPattern = substrate.getFieldPattern(factor);
      console.log(`${factor}: ${factorPattern.map(b => b ? '1' : '0').join('')}`);
    }
  }

  // Explore some primes to see how they behave
  console.log('\n\n=== Prime Agent Stories ===\n');
  const primes = [73n, 137n, 997n];
  
  for (const p of primes) {
    console.log(`\n--- Prime ${p} ---`);
    const story = await agentFactory.tellYourStory(p);
    console.log(story);
  }

  // Explore field interference in multiplication
  console.log('\n\n=== Field Interference Exploration ===\n');
  console.log('When 73 × 137 = 10001:');
  
  const p1 = substrate.getFieldPattern(73n);
  const p2 = substrate.getFieldPattern(137n);
  const pResult = substrate.getFieldPattern(10001n);
  
  console.log(`73:    ${p1.map(b => b ? '1' : '0').join('')}`);
  console.log(`137:   ${p2.map(b => b ? '1' : '0').join('')}`);
  console.log(`10001: ${pResult.map(b => b ? '1' : '0').join('')}`);
  
  // Show XOR to reveal interference
  const xor = p1.map((b, i) => b !== p2[i] ? '1' : '0').join('');
  console.log(`XOR:   ${xor}`);
  
  // Show which fields vanished or emerged
  console.log('\nField transformations:');
  for (let i = 0; i < 8; i++) {
    const in73 = p1[i];
    const in137 = p2[i];
    const in10001 = pResult[i];
    
    if (in73 && in137 && !in10001) {
      console.log(`Field ${i} VANISHED (was in both factors)`);
    } else if (!in73 && !in137 && in10001) {
      console.log(`Field ${i} EMERGED (wasn't in either factor)`);
    }
  }
}

// Run the exploration
exploreAgentFactorization().catch(console.error);