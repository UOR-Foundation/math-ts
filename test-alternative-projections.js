"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
/**
 * Test alternative projection strategies for factorization
 */
async function testAlternativeProjections() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const constants = substrate.getFieldConstants();
    console.log('=== Alternative Projection Strategies ===\n');
    // Test different ways to project 8D to lower dimensions
    const testSemiprimes = [
        { n: 77n, factors: [7n, 11n] },
        { n: 10001n, factors: [73n, 137n] },
        { n: 99400891n, factors: [9967n, 9973n] },
    ];
    for (const { n, factors } of testSemiprimes) {
        console.log(`\n=== Analyzing ${n} = ${factors.join(' × ')} ===\n`);
        const pattern = substrate.getFieldPattern(n);
        const activeIndices = pattern.map((b, i) => b ? i : -1).filter(i => i >= 0);
        // Standard projections
        console.log('Standard Projections:');
        console.log(`  8D Pattern: ${pattern.map(b => b ? '1' : '0').join('')}`);
        console.log(`  Active dimensions: {${activeIndices.join(', ')}}`);
        console.log(`  Resonance (multiplicative): ${(0, resonance_1.calculateResonance)(substrate, n).toFixed(6)}`);
        // Alternative Projection 1: Additive resonance
        const additiveResonance = pattern.reduce((sum, active, i) => sum + (active ? constants[i] : 0), 0);
        console.log(`  Additive resonance: ${additiveResonance.toFixed(6)}`);
        // Alternative Projection 2: Weighted by prime index
        const primeWeighted = pattern.reduce((sum, active, i) => sum + (active ? constants[i] * (i + 1) : 0), 0);
        console.log(`  Prime-weighted sum: ${primeWeighted.toFixed(6)}`);
        // Alternative Projection 3: Field interference score
        const interferenceScore = pattern.reduce((score, active, i) => {
            if (active) {
                // Penalize rare fields (6, 7), reward common fields (0, 1, 2)
                const rarity = i < 4 ? 1.0 : i < 6 ? 0.5 : 0.25;
                return score + constants[i] * rarity;
            }
            return score;
        }, 0);
        console.log(`  Interference score: ${interferenceScore.toFixed(6)}`);
        // Alternative Projection 4: Complex phase
        const complexPhase = pattern.reduce((phase, active, i) => {
            if (active) {
                // Treat each dimension as contributing a phase
                return phase + Math.PI * constants[i] / 4;
            }
            return phase;
        }, 0);
        console.log(`  Complex phase: ${complexPhase.toFixed(6)} radians`);
        // Alternative Projection 5: Information entropy
        const activeCount = activeIndices.length;
        const entropy = activeCount === 0 ? 0 :
            -activeCount * Math.log2(activeCount / 8) / 8;
        console.log(`  Information entropy: ${entropy.toFixed(6)}`);
        // Alternative Projection 6: Distance from origin
        const euclideanNorm = Math.sqrt(pattern.reduce((sum, active, i) => sum + (active ? constants[i] ** 2 : 0), 0));
        console.log(`  Euclidean norm: ${euclideanNorm.toFixed(6)}`);
        // Alternative Projection 7: Harmonic mean of active constants
        const activeConstants = pattern.map((active, i) => active ? constants[i] : null)
            .filter(c => c !== null);
        const harmonicMean = activeConstants.length === 0 ? 0 :
            activeConstants.length / activeConstants.reduce((sum, c) => sum + 1 / c, 0);
        console.log(`  Harmonic mean: ${harmonicMean.toFixed(6)}`);
        // Test how these projections distinguish factors
        console.log('\nFactor Analysis:');
        for (const factor of factors) {
            const fPattern = substrate.getFieldPattern(factor);
            const fResonance = (0, resonance_1.calculateResonance)(substrate, factor);
            const fAdditive = fPattern.reduce((sum, active, i) => sum + (active ? constants[i] : 0), 0);
            console.log(`  ${factor}: resonance=${fResonance.toFixed(3)}, additive=${fAdditive.toFixed(3)}`);
        }
    }
    // Test higher-order projections
    console.log('\n\n=== Higher-Order Projections ===\n');
    // Matrix projection: treat consecutive pairs as 2D coordinates
    console.log('Matrix Projections (pairs of dimensions):');
    const n = 10001n;
    const pattern = substrate.getFieldPattern(n);
    for (let i = 0; i < 8; i += 2) {
        const x = pattern[i] ? constants[i] : 0;
        const y = pattern[i + 1] ? constants[i + 1] : 0;
        const magnitude = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);
        console.log(`  Dims ${i},${i + 1}: magnitude=${magnitude.toFixed(3)}, angle=${angle.toFixed(3)}`);
    }
    // Tensor projections
    console.log('\nTensor Projections (triplets):');
    for (let i = 0; i < 6; i += 3) {
        const tensor = [
            pattern[i] ? constants[i] : 0,
            pattern[i + 1] ? constants[i + 1] : 0,
            pattern[i + 2] ? constants[i + 2] : 0,
        ];
        const volume = tensor[0] * tensor[1] * tensor[2];
        console.log(`  Dims ${i}-${i + 2}: volume=${volume.toFixed(6)}`);
    }
    // Fourier-like projection
    console.log('\nFourier-like Projection:');
    const fourierCoeffs = [];
    for (let k = 0; k < 4; k++) {
        let real = 0, imag = 0;
        pattern.forEach((active, i) => {
            if (active) {
                const angle = 2 * Math.PI * k * i / 8;
                real += constants[i] * Math.cos(angle);
                imag += constants[i] * Math.sin(angle);
            }
        });
        const magnitude = Math.sqrt(real * real + imag * imag);
        fourierCoeffs.push(magnitude);
        console.log(`  Frequency ${k}: ${magnitude.toFixed(6)}`);
    }
    // Self-referential projection
    console.log('\n\n=== Self-Referential Projections ===\n');
    // Project using the number itself
    const selfProjection = Number(n % 256n) / 256;
    console.log(`Self-projection of ${n}: ${selfProjection.toFixed(6)}`);
    // Project using resonance of resonance
    const resonance = (0, resonance_1.calculateResonance)(substrate, n);
    const resonanceAsInt = BigInt(Math.floor(resonance * 1000000));
    const metaResonance = (0, resonance_1.calculateResonance)(substrate, resonanceAsInt);
    console.log(`Resonance of resonance: ${metaResonance.toFixed(6)}`);
    // Project using field pattern as number
    const patternAsNumber = BigInt('0b' + pattern.map(b => b ? '1' : '0').join(''));
    const patternResonance = (0, resonance_1.calculateResonance)(substrate, patternAsNumber);
    console.log(`Pattern as number: ${patternAsNumber}, resonance: ${patternResonance.toFixed(6)}`);
    console.log('\n\n=== Implications for Factorization ===\n');
    console.log('Different projections reveal different aspects:');
    console.log('  - Multiplicative (resonance): Best for prime detection');
    console.log('  - Additive: Shows total field "mass"');
    console.log('  - Interference score: Weights common vs rare fields');
    console.log('  - Complex phase: Could reveal cyclic relationships');
    console.log('  - Information entropy: Measures pattern complexity');
    console.log('  - Harmonic mean: Balances field contributions');
    console.log('\nOptimal factorization might use multiple projections:');
    console.log('  1. Use resonance for initial prime test');
    console.log('  2. Use interference score to identify likely artifacts');
    console.log('  3. Use phase relationships to find factor pairs');
    console.log('  4. Validate with multiple projections');
}
testAlternativeProjections().catch(console.error);
