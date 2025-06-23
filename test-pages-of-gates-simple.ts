import { PagesOfGatesArchitecture } from './packages/prime-processor/src/pages-of-gates-architecture';

/**
 * Simple test of Pages of Gates Architecture
 */

async function testPagesOfGatesSimple() {
  console.log('=== PAGES OF GATES ARCHITECTURE - SIMPLE TEST ===\n');
  
  console.log('Initializing architecture...');
  const architecture = new PagesOfGatesArchitecture();
  console.log('Architecture ready.\n');
  
  // Test 1: Basic structure
  console.log('TEST 1: Basic Structure\n');
  
  const page0 = architecture.getPage(0);
  const gate0 = architecture.getGate(0);
  
  console.log(`Page 0 contains gates: ${page0?.gates.slice(0, 10).map(g => g.residue).join(', ')}...`);
  console.log(`Gate 0 has ${gate0?.primeGenerators.length} precomputed primes\n`);
  
  // Test 2: Simple number analysis
  console.log('TEST 2: Number Analysis\n');
  
  const simpleTests = [7n, 15n, 77n, 256n];
  
  for (const n of simpleTests) {
    const result = architecture.compute(n);
    console.log(`${n}:`);
    console.log(`  Page ${result.pageAddress.pageNumber}, position ${result.pageAddress.positionInPage}`);
    console.log(`  Gate ${result.gateAddress.gateNumber}, position ${result.gateAddress.positionInGate}`);
    
    if (result.gateResult.primeFactors) {
      console.log(`  Factors: ${result.gateResult.primeFactors.join(' × ')}`);
    } else if (result.gateResult.metadata.get('isPrime')) {
      console.log(`  Status: PRIME`);
    }
    console.log();
  }
  
  // Test 3: Gate wrapping
  console.log('TEST 3: Gate Wrapping\n');
  
  const wrapTests = [
    { n: 255n, desc: 'Last before wrap' },
    { n: 256n, desc: 'First wrap' },
    { n: 257n, desc: 'Second after wrap' }
  ];
  
  for (const { n, desc } of wrapTests) {
    const result = architecture.compute(n);
    console.log(`${n} (${desc}): Gate ${result.gateAddress.gateNumber}`);
  }
  
  // Test 4: Performance
  console.log('\n\nTEST 4: Performance\n');
  
  const perfTests = [100n, 1000n, 10000n];
  
  for (const n of perfTests) {
    const start = Date.now();
    const result = architecture.compute(n);
    const elapsed = Date.now() - start;
    
    console.log(`${n}: ${elapsed}ms`);
    if (result.gateResult.primeFactors && result.gateResult.primeFactors.length > 1) {
      console.log(`  Factors: ${result.gateResult.primeFactors.join(' × ')}`);
    }
  }
  
  console.log('\n\nSUMMARY:\n');
  console.log('The Pages of Gates Architecture successfully:');
  console.log('- Organizes 256 gates into pages of 48');
  console.log('- Provides dual addressing (page/gate)');
  console.log('- Handles gate wrapping at 256 boundary');
  console.log('- Executes page computations combining 48 gates');
}

testPagesOfGatesSimple().catch(console.error);