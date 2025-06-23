"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
const substrate = (0, field_substrate_1.createFieldSubstrate)();
const resonance = (0, resonance_1.createResonanceDynamics)(substrate);
console.log('Testing prime detection via resonance:');
const testNumbers = [2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n];
// First, let's understand the field patterns
console.log('\nField patterns:');
for (const n of testNumbers) {
    const pattern = substrate.getFieldPattern(n);
    const binaryStr = pattern.map(b => b ? '1' : '0').join('');
    console.log(`${n}: ${binaryStr} (${parseInt(binaryStr, 2)})`);
}
console.log('\nResonance analysis:');
for (const n of testNumbers) {
    const isPrime = resonance.isPrimeViaResonance(n);
    const res = resonance.calculateResonance(n);
    const analysis = resonance.isResonanceMinimum(n);
    console.log(`${n}: isPrime=${isPrime}, resonance=${res.toFixed(4)}, isLocalMin=${analysis.isLocalMinimum}`);
    // Show neighbors for debugging
    if (n === 7n) {
        console.log('  Neighbors:', analysis.neighborResonances.map(nr => `${nr.position}:${nr.resonance.toFixed(4)}`).join(', '));
        console.log('  Laplacian:', analysis.discreteLaplacian.toFixed(4));
    }
}
