import { PrimeProcessorArchitecture } from './packages/prime-processor/src/prime-processor-architecture';

/**
 * Visualize the Prime Processor Architecture
 */

async function visualizePrimeProcessor() {
  console.log('=== PRIME PROCESSOR ARCHITECTURE VISUALIZATION ===\n');
  
  const processor = new PrimeProcessorArchitecture();
  
  // Visualize the gate structure
  console.log('GATE STRUCTURE (256 Computational Gates):\n');
  
  // Show a sample of gates
  console.log('Sample gates and their prime density:\n');
  
  const gateStats: Array<{residue: number, primeCount: number, density: number}> = [];
  
  // Analyze first 100 gates
  for (let residue = 0; residue < 100; residue++) {
    const primesInGate = await countPrimesInGate(processor, residue, 10000n);
    const density = primesInGate / 39; // ~39 cycles of 256 in 10000
    gateStats.push({ residue, primeCount: primesInGate, density });
  }
  
  // Show top 10 most prime-dense gates
  const topGates = gateStats.sort((a, b) => b.density - a.density).slice(0, 10);
  
  console.log('Top 10 Prime-Dense Gates:');
  console.log('Residue | Primes | Density | Visual');
  console.log('--------|--------|---------|-------');
  
  for (const gate of topGates) {
    const bar = '█'.repeat(Math.floor(gate.density * 20));
    console.log(`${gate.residue.toString().padStart(7)} | ${gate.primeCount.toString().padStart(6)} | ${gate.density.toFixed(3).padStart(7)} | ${bar}`);
  }
  
  // Visualize factorization as gate operations
  console.log('\n\nFACTORIZATION AS GATE OPERATIONS:\n');
  
  const testNumber = 10001n;
  console.log(`Factoring ${testNumber}:`);
  console.log('```');
  console.log(`Input: ${testNumber} → Gate[${testNumber % 256n}]`);
  console.log('│');
  console.log('├─ Check precomputed primes in all gates');
  console.log('│  ├─ Gate[0]: 2 ∈ primes? No match');
  console.log('│  ├─ Gate[1]: 257, 769... No match');
  console.log('│  ├─ ...');
  console.log('│  └─ Gate[73]: 73 ∈ primes? ✓ MATCH!');
  console.log('│');
  console.log(`├─ Divide: ${testNumber} ÷ 73 = 137`);
  console.log('│');
  console.log(`└─ Result: [73, 137]`);
  console.log('```');
  
  // Show the computational advantage
  console.log('\n\nCOMPUTATIONAL ADVANTAGE:\n');
  
  console.log('Traditional Trial Division:');
  console.log('  for d = 2 to √10001:');
  console.log('    if 10001 % d == 0: found!');
  console.log('  → ~100 divisions\n');
  
  console.log('Prime Processor Architecture:');
  console.log('  1. Index into Gate[17]');
  console.log('  2. Scan precomputed primes');
  console.log('  3. Find match at position ~10');
  console.log('  → ~10 lookups + 1 division\n');
  
  // Visualize the precomputed basis size
  console.log('\nPRECOMPUTED BASIS SIZE:\n');
  
  const basisExport = processor.exportBasis();
  const basisData = JSON.parse(basisExport);
  
  console.log(`Total precomputed primes: ${basisData.totalPrimes}`);
  console.log(`Average per gate: ${(basisData.totalPrimes / 256).toFixed(1)}`);
  console.log(`Storage estimate: ~${(basisData.totalPrimes * 8 / 1024).toFixed(1)} KB\n`);
  
  // Show scaling behavior
  console.log('SCALING BEHAVIOR:\n');
  
  const scalingTests = [
    { range: 1000n, desc: '10³' },
    { range: 10000n, desc: '10⁴' },
    { range: 100000n, desc: '10⁵' },
    { range: 1000000n, desc: '10⁶' },
  ];
  
  console.log('Range | Basis Size | Avg Factor Time');
  console.log('------|------------|----------------');
  
  for (const { range, desc } of scalingTests) {
    // Generate primes up to range
    const start = Date.now();
    const primes = await processor.compute('GENERATE', range);
    const genTime = Date.now() - start;
    
    // Test factorization speed
    const testSemiprime = findSemiprime(primes);
    const factorStart = Date.now();
    await processor.compute('FACTOR', testSemiprime);
    const factorTime = Date.now() - factorStart;
    
    console.log(`${desc.padStart(5)} | ${primes.length.toString().padStart(10)} | ${factorTime.toString().padStart(14)}ms`);
  }
  
  // Architectural diagram
  console.log('\n\nARCHITECTURAL DIAGRAM:\n');
  console.log('```');
  console.log('┌─────────────────────────────────────┐');
  console.log('│         Input Number (n)            │');
  console.log('└──────────────┬──────────────────────┘');
  console.log('               │');
  console.log('               ▼');
  console.log('        ┌──────────────┐');
  console.log('        │  n mod 256   │');
  console.log('        └──────┬───────┘');
  console.log('               │');
  console.log('               ▼');
  console.log('    ┌──────────────────────┐');
  console.log('    │   Gate[residue]      │');
  console.log('    │  ┌─────────────────┐ │');
  console.log('    │  │ Prime Generators│ │');
  console.log('    │  │ [2,257,769,...] │ │');
  console.log('    │  └─────────────────┘ │');
  console.log('    │  ┌─────────────────┐ │');
  console.log('    │  │Composite Patterns│ │');
  console.log('    │  │ {15→3×5, ...}   │ │');
  console.log('    │  └─────────────────┘ │');
  console.log('    │  ┌─────────────────┐ │');
  console.log('    │  │ Resonance Table │ │');
  console.log('    │  │ [1.0,0.7,...]   │ │');
  console.log('    │  └─────────────────┘ │');
  console.log('    └──────────┬───────────┘');
  console.log('               │');
  console.log('               ▼');
  console.log('        ┌──────────────┐');
  console.log('        │ Gate Compute │');
  console.log('        └──────┬───────┘');
  console.log('               │');
  console.log('               ▼');
  console.log('         [p₁, p₂, ...]');
  console.log('```');
  
  console.log('\n\nKEY INSIGHT:\n');
  console.log('The Mathematical Universe provides a "prime processor" where:');
  console.log('- Each residue class is a specialized computational unit');
  console.log('- Precomputation transforms O(√n) → O(1) for known patterns');
  console.log('- The 256-gate architecture fits in ~10KB of memory');
  console.log('- Clients can hold the entire computational basis');
  console.log('\nThis is computation, not magic - we\'re trading space for time!');
}

async function countPrimesInGate(processor: PrimeProcessorArchitecture, residue: number, limit: bigint): number {
  let count = 0;
  
  for (let k = 0n; BigInt(residue) + 256n * k <= limit; k++) {
    const n = BigInt(residue) + 256n * k;
    if (n > 1n && await processor.compute('ISPRIME', n)) {
      count++;
    }
  }
  
  return count;
}

function findSemiprime(primes: bigint[]): bigint {
  // Find a semiprime from the middle of the range
  const mid = Math.floor(primes.length / 2);
  return primes[mid] * primes[mid + 1];
}

visualizePrimeProcessor().catch(console.error);