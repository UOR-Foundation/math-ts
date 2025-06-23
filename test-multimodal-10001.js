"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
async function debug10001() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const factorizer = new resonance_1.MultiModalFactorization(substrate);
    console.log('=== Debugging 10001 = 73 × 137 ===\n');
    const n = 10001n;
    // First, let's understand the number
    console.log('Number analysis:');
    console.log(`10001 = ${n}`);
    const pattern = substrate.getFieldPattern(n);
    console.log(`Field pattern: ${pattern.map(b => b ? '1' : '0').join('')}`);
    console.log(`Active fields: ${pattern.map((b, i) => b ? i : -1).filter(i => i >= 0).join(', ')}`);
    // Analyze the factors
    console.log('\nFactor analysis:');
    const factors = [73n, 137n];
    for (const factor of factors) {
        const fPattern = substrate.getFieldPattern(factor);
        console.log(`\n${factor}:`);
        console.log(`  Pattern: ${fPattern.map(b => b ? '1' : '0').join('')}`);
        console.log(`  Active fields: ${fPattern.map((b, i) => b ? i : -1).filter(i => i >= 0).join(', ')}`);
    }
    // Show field interference
    console.log('\nField interference:');
    const p73 = substrate.getFieldPattern(73n);
    const p137 = substrate.getFieldPattern(137n);
    const p10001 = substrate.getFieldPattern(10001n);
    for (let i = 0; i < 8; i++) {
        if (p73[i] && p137[i] && !p10001[i]) {
            console.log(`Field ${i}: VANISHED (both factors had it)`);
        }
        else if (!p73[i] && !p137[i] && p10001[i]) {
            console.log(`Field ${i}: EMERGED (neither factor had it)`);
        }
    }
    // Now run factorization with debug
    console.log('\n\nRunning factorization with debug enabled...');
    const result = await factorizer.factorize(n, true);
    console.log(`\nFinal result: ${result.join(' × ')}`);
    // Let's also check why it might be failing
    console.log('\n\nManual checks:');
    // Check if our algebraic strategy would catch it
    console.log('\nModular properties:');
    for (const mod of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 48n, 73n, 137n]) {
        const rem = n % mod;
        if (rem === 0n) {
            console.log(`  ${n} ≡ 0 (mod ${mod}) - Factor found!`);
        }
    }
    // Check resonance similarity
    console.log('\nResonance analysis:');
    const res10001 = calculateResonance(substrate, 10001n);
    const res73 = calculateResonance(substrate, 73n);
    const res137 = calculateResonance(substrate, 137n);
    console.log(`  10001: ${res10001.toFixed(4)}`);
    console.log(`  73: ${res73.toFixed(4)}`);
    console.log(`  137: ${res137.toFixed(4)}`);
    console.log(`  Product of factor resonances: ${(res73 * res137).toFixed(4)}`);
    // Check page relationships
    console.log('\nPage analysis:');
    console.log(`  10001: page ${Math.floor(Number(10001n) / 48)}, offset ${Number(10001n) % 48}`);
    console.log(`  73: page ${Math.floor(73 / 48)}, offset ${73 % 48}`);
    console.log(`  137: page ${Math.floor(137 / 48)}, offset ${137 % 48}`);
}
function calculateResonance(substrate, n) {
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
debug10001().catch(console.error);
