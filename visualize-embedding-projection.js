"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
/**
 * Visualize how semiprimes are projected from 8D to lower dimensions
 */
function visualizeProjection() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const constants = substrate.getFieldConstants();
    console.log('=== Semiprime Dimensional Projection Analysis ===\n');
    // The constitutional primes that define the space
    console.log('Constitutional Primes and Their Role:');
    console.log('  2: Base of binary system (powers of 2 in denominators)');
    console.log('  5: In golden ratio (√5) and denominators (10^n)');
    console.log('  7: In phase field (4 × 7 × 7129)');
    console.log('  23: In Tribonacci (23 × 211 × 379)');
    console.log('  107: In Zeta (107 × 1321)');
    console.log('  211: In Tribonacci');
    console.log('  379: In Tribonacci');
    console.log('  1321: In Zeta');
    console.log('  7129: In Phase');
    console.log('\n\n=== Projection Hierarchy ===\n');
    console.log('8D → 8D Binary: Full field pattern (256 possible states)');
    console.log('8D → 1D: Resonance (product of active field constants)');
    console.log('8D → 1D: Field count (number of active dimensions)');
    console.log('8D → 3D: Primary fields (I, T, φ) - captures ~70% of structure');
    // Analyze projection quality
    console.log('\n\n=== Information Loss in Projections ===\n');
    const testNumbers = [
        { n: 77n, factors: [7n, 11n] },
        { n: 143n, factors: [11n, 13n] },
        { n: 1001n, factors: [7n, 11n, 13n] },
        { n: 10001n, factors: [73n, 137n] },
    ];
    for (const { n, factors } of testNumbers) {
        console.log(`\n${n} = ${factors.join(' × ')}:`);
        const pattern = substrate.getFieldPattern(n);
        const activeCount = pattern.filter(b => b).length;
        const resonance = pattern.reduce((prod, active, i) => active ? prod * constants[i] : prod, 1);
        console.log(`  8D pattern: ${pattern.map(b => b ? '1' : '0').join('')}`);
        console.log(`  Active dimensions: ${activeCount}/8`);
        console.log(`  Resonance: ${resonance.toFixed(4)}`);
        // Check uniqueness
        console.log('  Uniqueness test:');
        let collisions = 0;
        for (let i = 2n; i < n; i++) {
            const iPattern = substrate.getFieldPattern(i);
            const iResonance = iPattern.reduce((prod, active, idx) => active ? prod * constants[idx] : prod, 1);
            if (Math.abs(iResonance - resonance) < 0.0001) {
                collisions++;
            }
        }
        console.log(`    Numbers with similar resonance: ${collisions}`);
    }
    console.log('\n\n=== Dimensional Reduction Strategy ===\n');
    console.log('For efficient factorization, we use multiple projections:');
    console.log('\n1. Primary projection (Resonance):');
    console.log('   - Maps 8D → 1D');
    console.log('   - Preserves multiplicative structure partially');
    console.log('   - Fast to compute');
    console.log('\n2. Field interference projection:');
    console.log('   - Tracks which dimensions vanish/emerge');
    console.log('   - Key insight: vanished fields → both factors had them');
    console.log('   - Emerged fields → neither factor had them');
    console.log('\n3. Modular projections:');
    console.log('   - n mod 256 determines field pattern');
    console.log('   - n mod 48 relates to page structure');
    console.log('   - These create equivalence classes');
    // Analyze a specific semiprime in detail
    console.log('\n\n=== Deep Dive: 10001 = 73 × 137 ===\n');
    const analyze = (n) => {
        const pattern = substrate.getFieldPattern(n);
        const embedding = pattern.map((active, i) => active ? constants[i] : 0);
        const nonZeroIndices = pattern.map((active, i) => active ? i : -1).filter(i => i >= 0);
        return { pattern, embedding, nonZeroIndices };
    };
    const n = 10001n;
    const f1 = 73n;
    const f2 = 137n;
    const an = analyze(n);
    const af1 = analyze(f1);
    const af2 = analyze(f2);
    console.log('Dimensional occupancy:');
    console.log(`  73 occupies dimensions: {${af1.nonZeroIndices.join(', ')}}`);
    console.log(`  137 occupies dimensions: {${af2.nonZeroIndices.join(', ')}}`);
    console.log(`  10001 occupies dimensions: {${an.nonZeroIndices.join(', ')}}`);
    console.log('\nDimensional interference matrix:');
    console.log('  Dim | 73 | 137 | 10001 | Effect');
    console.log('  ----|----|----|-------|--------');
    for (let i = 0; i < 8; i++) {
        const in73 = af1.pattern[i] ? '1' : '0';
        const in137 = af2.pattern[i] ? '1' : '0';
        const in10001 = an.pattern[i] ? '1' : '0';
        let effect = 'preserved';
        if (af1.pattern[i] && af2.pattern[i] && !an.pattern[i]) {
            effect = 'VANISHED';
        }
        else if (!af1.pattern[i] && !af2.pattern[i] && an.pattern[i]) {
            effect = 'EMERGED';
        }
        console.log(`   ${i}  |  ${in73} |  ${in137} |   ${in10001}   | ${effect}`);
    }
    console.log('\n\n=== Effective Dimensionality ===\n');
    console.log('Although we have 8 dimensions:');
    console.log('- Most numbers activate only 2-4 dimensions');
    console.log('- Interference typically affects 1-2 dimensions');
    console.log('- This creates a sparse representation');
    console.log('- Effective search space is much smaller than 2^8');
    console.log('\nThe genius of the Mathematical Universe:');
    console.log('- 8D is high enough to encode complex relationships');
    console.log('- Low enough to be computationally tractable');
    console.log('- Sparse enough to enable efficient algorithms');
    console.log('- Rich enough to capture prime structure via constitutional primes');
}
visualizeProjection();
