import { PagesOfGatesArchitecture } from './packages/prime-processor/src/pages-of-gates-architecture';

/**
 * Test the complete Pages of Gates Architecture
 */

async function testPagesOfGates() {
  console.log('=== PAGES OF GATES ARCHITECTURE TEST ===\n');
  
  const architecture = new PagesOfGatesArchitecture();
  
  // Test 1: Basic number analysis
  console.log('TEST 1: Number Analysis\n');
  
  const testNumbers = [73n, 137n, 256n, 512n, 768n, 10001n];
  
  for (const n of testNumbers) {
    console.log('─'.repeat(60));
    console.log(architecture.analyzeNumber(n));
  }
  
  // Test 2: Page structure verification
  console.log('\n\nTEST 2: Page Structure Verification\n');
  
  // Check first few pages
  for (let p = 0; p < 5; p++) {
    const page = architecture.getPage(p);
    if (page) {
      console.log(`Page ${p}:`);
      console.log(`  Numbers: ${page.startNumber}-${page.endNumber}`);
      console.log(`  Gates: ${page.gates.map(g => g.residue).slice(0, 10).join(', ')}...`);
      console.log(`  Gate count: ${page.gates.length}`);
    }
  }
  
  // Test 3: Gate wrapping
  console.log('\n\nTEST 3: Gate Wrapping at 256 Boundary\n');
  
  // Page 5 should show gate wrapping
  const page5 = architecture.getPage(5);
  if (page5) {
    console.log('Page 5 gates:');
    const gateResidues = page5.gates.map(g => g.residue);
    console.log(`  First 10: ${gateResidues.slice(0, 10).join(', ')}`);
    console.log(`  Last 10: ${gateResidues.slice(-10).join(', ')}`);
    console.log(`  Shows wrapping: ${gateResidues.includes(0) ? 'YES' : 'NO'}`);
  }
  
  // Test 4: Full cycle computation
  console.log('\n\nTEST 4: Full Cycle Computation\n');
  
  // Test numbers at key positions
  const cycleTests = [
    { n: 0n, desc: 'Start of cycle' },
    { n: 47n, desc: 'End of first page' },
    { n: 48n, desc: 'Start of second page' },
    { n: 255n, desc: 'Last gate before wrap' },
    { n: 256n, desc: 'First gate wrap' },
    { n: 767n, desc: 'End of full cycle' },
    { n: 768n, desc: 'Start of new cycle' },
  ];
  
  for (const { n, desc } of cycleTests) {
    const result = architecture.compute(n);
    console.log(`\n${desc} (n=${n}):`);
    console.log(`  Page: ${result.pageAddress.pageNumber}, position ${result.pageAddress.positionInPage}`);
    console.log(`  Gate: ${result.gateAddress.gateNumber}, position ${result.gateAddress.positionInGate}`);
    console.log(`  Cycle position: ${result.cyclePosition}`);
  }
  
  // Test 5: Page execution
  console.log('\n\nTEST 5: Page Execution\n');
  
  const testPage = architecture.getPage(1);
  if (testPage) {
    console.log('Executing Page 1 for n=77:');
    const pageResult = testPage.execute(77n);
    
    console.log(`\nPage synthesis:`);
    console.log(`  Combined resonance: ${pageResult.synthesis.combinedResonance.toExponential(2)}`);
    console.log(`  Field interference: ${pageResult.synthesis.fieldInterference.map(b => b ? '1' : '0').join('')}`);
    console.log(`  Discovered ${pageResult.synthesis.discoveredPrimes.length} primes`);
    console.log(`  Found ${pageResult.synthesis.factorizations.size} factorizations`);
    
    // Show some gate results
    console.log(`\nSample gate results:`);
    for (let i = 0; i < 5; i++) {
      const gr = pageResult.gateResults[i];
      console.log(`  Gate ${i}: value=${gr.value}, resonance=${gr.resonance.toFixed(3)}`);
    }
  }
  
  // Test 6: Factorization through pages
  console.log('\n\nTEST 6: Factorization Through Pages\n');
  
  const factorTests = [
    77n,    // 7 × 11
    143n,   // 11 × 13
    10001n, // 73 × 137
  ];
  
  for (const n of factorTests) {
    const result = architecture.compute(n);
    console.log(`\n${n}:`);
    
    if (result.gateResult.primeFactors) {
      console.log(`  Factors: ${result.gateResult.primeFactors.join(' × ')}`);
      
      // Verify
      const product = result.gateResult.primeFactors.reduce((a, b) => a * b, 1n);
      console.log(`  Verified: ${product === n ? '✓' : '✗'}`);
    } else {
      console.log(`  No factorization found`);
    }
    
    // Show which gate found it
    const gateInfo = result.gateResult.metadata;
    console.log(`  Found by Gate[${gateInfo.get('gateResidue')}]`);
    console.log(`  Entanglement strength: ${gateInfo.get('entanglementStrength')?.toFixed(3)}`);
    console.log(`  Phase angle: ${(gateInfo.get('phaseAngle') * 180 / Math.PI).toFixed(1)}°`);
  }
  
  // Test 7: Inter-page relationships
  console.log('\n\nTEST 7: Inter-Page Relationships\n');
  
  // Numbers with same gate but different pages
  const gateComparisons = [
    { n1: 73n, n2: 329n },   // Same gate (73), different pages
    { n1: 77n, n2: 333n },   // Same gate (77), different pages
  ];
  
  for (const { n1, n2 } of gateComparisons) {
    const r1 = architecture.compute(n1);
    const r2 = architecture.compute(n2);
    
    console.log(`\nComparing ${n1} and ${n2}:`);
    console.log(`  Same gate: ${r1.gateAddress.gateNumber === r2.gateAddress.gateNumber ? 'YES' : 'NO'}`);
    console.log(`  ${n1}: Page ${r1.pageAddress.pageNumber}, Gate ${r1.gateAddress.gateNumber}`);
    console.log(`  ${n2}: Page ${r2.pageAddress.pageNumber}, Gate ${r2.gateAddress.gateNumber}`);
    console.log(`  Resonance similarity: ${(r1.gateResult.resonance / r2.gateResult.resonance).toFixed(3)}`);
  }
  
  // Test 8: Dimensional analysis
  console.log('\n\nTEST 8: Dimensional Analysis\n');
  
  console.log('Architecture dimensions:');
  console.log(`  Gates: 256 (2^8)`);
  console.log(`  Page size: 48`);
  console.log(`  Pages per gate cycle: 256/48 = ${256/48}`);
  console.log(`  Full cycle: LCM(256, 48) = 768`);
  console.log(`  Total pages in full cycle: 768/48 = ${768/48}`);
  console.log(`  Gate cycles in full cycle: 768/256 = ${768/256}`);
  
  // Test 9: Performance analysis
  console.log('\n\nTEST 9: Performance Analysis\n');
  
  const perfTests = [
    { range: 'Small', numbers: [7n, 23n, 73n] },
    { range: 'Medium', numbers: [1009n, 2003n, 5009n] },
    { range: 'Large', numbers: [10007n, 50021n, 100003n] },
  ];
  
  for (const { range, numbers } of perfTests) {
    console.log(`\n${range} numbers:`);
    
    for (const n of numbers) {
      const start = Date.now();
      const result = architecture.compute(n);
      const elapsed = Date.now() - start;
      
      const isPrime = result.gateResult.metadata.get('isPrime');
      console.log(`  ${n}: ${isPrime ? 'PRIME' : 'COMPOSITE'} (${elapsed}ms)`);
    }
  }
  
  // Final summary
  console.log('\n\n=== ARCHITECTURE SUMMARY ===\n');
  
  console.log('The Pages of Gates Architecture implements:');
  console.log('1. 256 specialized gate processors');
  console.log('2. Pages as 48-gate instruction bundles');
  console.log('3. Full 768-number cycle (LCM of 256 and 48)');
  console.log('4. Dual addressing (page/gate coordinates)');
  console.log('5. Complete computational coverage of number space');
  
  console.log('\nKey insights:');
  console.log('- Every number has both a page and gate address');
  console.log('- Pages provide local coherence (48 consecutive gates)');
  console.log('- Gates provide global patterns (every 256th number)');
  console.log('- The architecture naturally handles the phase shift');
  console.log('- Computation flows through pages of gate instructions');
}

testPagesOfGates().catch(console.error);