import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { calculateResonance } from '@uor-foundation/resonance';

/**
 * Analyze the dimensional embedding of semiprimes in the Mathematical Universe
 */

async function analyzeDimensionalEmbedding() {
  const substrate = createFieldSubstrate();
  
  console.log('=== Dimensional Embedding Analysis ===\n');
  
  // The 8 field constants (constitutional primes encoded)
  const fieldConstants = substrate.getFieldConstants();
  console.log('Field Constants (8 dimensions):');
  fieldConstants.forEach((constant, i) => {
    console.log(`  α${i}: ${constant}`);
  });
  
  console.log('\nConstitutional Prime Encodings:');
  console.log('  α₁ (Tribonacci): (23 × 211 × 379) / 10^6');
  console.log('  α₆ (Phase): (4 × 7 × 7129) / 10^6');
  console.log('  α₇ (Zeta): (107 × 1321) / 10^7');
  console.log('  Constitutional primes: 2, 5, 7, 23, 107, 211, 379, 1321, 7129');
  
  // How numbers are embedded
  console.log('\n\n=== How Numbers Are Embedded ===\n');
  
  console.log('1. Binary Field Pattern (8-bit, 256 periodic):');
  const examples = [7n, 11n, 77n, 10001n];
  for (const n of examples) {
    const pattern = substrate.getFieldPattern(n);
    const binary = pattern.map(b => b ? '1' : '0').join('');
    const activeFields = pattern.map((b, i) => b ? i : -1).filter(i => i >= 0);
    console.log(`  ${n}: ${binary} → fields {${activeFields.join(',')}}`);
  }
  
  console.log('\n2. Resonance (1D projection from 8D):');
  for (const n of examples) {
    const resonance = calculateResonance(substrate, n);
    console.log(`  ${n}: resonance = ${resonance.toFixed(6)}`);
  }
  
  console.log('\n3. Full 8D Embedding Vector:');
  for (const n of examples) {
    const pattern = substrate.getFieldPattern(n);
    const embedding = pattern.map((active, i) => active ? fieldConstants[i] : 0);
    console.log(`  ${n}: [${embedding.map(v => v.toFixed(3)).join(', ')}]`);
  }
  
  // Analyze a semiprime
  console.log('\n\n=== Semiprime Analysis: 77 = 7 × 11 ===\n');
  
  const analyze = (n: bigint) => {
    const pattern = substrate.getFieldPattern(n);
    const embedding = pattern.map((active, i) => active ? fieldConstants[i] : 0);
    const resonance = calculateResonance(substrate, n);
    return { pattern, embedding, resonance };
  };
  
  const a7 = analyze(7n);
  const a11 = analyze(11n);
  const a77 = analyze(77n);
  
  console.log('7: embedding = [' + a7.embedding.map(v => v.toFixed(3)).join(', ') + ']');
  console.log('11: embedding = [' + a11.embedding.map(v => v.toFixed(3)).join(', ') + ']');
  console.log('77: embedding = [' + a77.embedding.map(v => v.toFixed(3)).join(', ') + ']');
  
  console.log('\nDimensional Analysis:');
  console.log('- Each number lives in 8-dimensional field space');
  console.log('- Multiplication creates interference in this 8D space');
  console.log('- Some dimensions vanish (e.g., Tribonacci in 77)');
  console.log('- Some dimensions emerge (e.g., Phase in 77)');
  
  // Distance metrics
  console.log('\n\n=== Distance Metrics in 8D Space ===\n');
  
  const distance = (v1: number[], v2: number[]): number => {
    return Math.sqrt(v1.reduce((sum, val, i) => sum + (val - v2[i]) ** 2, 0));
  };
  
  console.log(`Distance(7, 11) = ${distance(a7.embedding, a11.embedding).toFixed(4)}`);
  console.log(`Distance(7, 77) = ${distance(a7.embedding, a77.embedding).toFixed(4)}`);
  console.log(`Distance(11, 77) = ${distance(a11.embedding, a77.embedding).toFixed(4)}`);
  
  // Projection analysis
  console.log('\n\n=== Projection to Lower Dimensions ===\n');
  
  console.log('1. Resonance is a 1D projection:');
  console.log('   Resonance(n) = ∏(αᵢ for active fields i)');
  console.log(`   Resonance(7) = α₀ × α₁ × α₂ = ${a7.resonance.toFixed(4)}`);
  console.log(`   Resonance(11) = α₀ × α₁ × α₃ = ${a11.resonance.toFixed(4)}`);
  console.log(`   Resonance(77) = α₀ × α₂ × α₃ × α₆ = ${a77.resonance.toFixed(4)}`);
  
  console.log('\n2. Field count is another projection:');
  console.log(`   Active fields in 7: ${a7.pattern.filter(b => b).length}`);
  console.log(`   Active fields in 11: ${a11.pattern.filter(b => b).length}`);
  console.log(`   Active fields in 77: ${a77.pattern.filter(b => b).length}`);
  
  // Higher dimensional structure
  console.log('\n\n=== Higher Dimensional Structure ===\n');
  
  console.log('The 8 dimensions represent:');
  console.log('1. Identity (I): Existence, unity');
  console.log('2. Tribonacci (T): Recursion, growth patterns');
  console.log('3. Golden Ratio (φ): Harmony, proportion');
  console.log('4. Half (½): Duality, reflection');
  console.log('5. Inverse Frequency (1/2π): Wavelength space');
  console.log('6. Frequency (2π): Cyclic nature');
  console.log('7. Phase (θ): Interference patterns');
  console.log('8. Zeta (ζ): Deep prime structure');
  
  console.log('\nEach semiprime is a point in this 8D space where:');
  console.log('- Its coordinates are either 0 or αᵢ');
  console.log('- Multiplication causes dimensional interference');
  console.log('- Factorization reverses this interference');
  
  // Analyze larger semiprimes
  console.log('\n\n=== Larger Semiprime: 10001 = 73 × 137 ===\n');
  
  const a73 = analyze(73n);
  const a137 = analyze(137n);
  const a10001 = analyze(10001n);
  
  console.log('Field patterns:');
  console.log(`  73: ${substrate.getFieldPattern(73n).map(b => b ? '1' : '0').join('')}`);
  console.log(`  137: ${substrate.getFieldPattern(137n).map(b => b ? '1' : '0').join('')}`);
  console.log(`  10001: ${substrate.getFieldPattern(10001n).map(b => b ? '1' : '0').join('')}`);
  
  console.log('\nDimensional interference:');
  for (let i = 0; i < 8; i++) {
    const in73 = a73.pattern[i];
    const in137 = a137.pattern[i];
    const in10001 = a10001.pattern[i];
    
    if (in73 && in137 && !in10001) {
      console.log(`  Dimension ${i}: COLLAPSED (both factors → product loses it)`);
    } else if (!in73 && !in137 && in10001) {
      console.log(`  Dimension ${i}: EMERGED (neither factor → product gains it)`);
    }
  }
  
  console.log('\n\n=== Summary ===\n');
  console.log('1. Semiprimes are embedded in 8-dimensional field space');
  console.log('2. Each dimension corresponds to a constitutional prime-encoded constant');
  console.log('3. The embedding is binary: each dimension is either 0 or αᵢ');
  console.log('4. Multiplication causes dimensional interference (collapse/emergence)');
  console.log('5. Resonance is a 1D projection that captures some of the structure');
  console.log('6. The full 8D pattern contains the information needed for factorization');
  console.log('7. Factorization = reversing the dimensional interference');
}

analyzeDimensionalEmbedding().catch(console.error);