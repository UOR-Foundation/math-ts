"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
const topology_1 = require("@uor-foundation/topology");
const operators_1 = require("@uor-foundation/operators");
const substrate = (0, field_substrate_1.createFieldSubstrate)();
const resonance = (0, resonance_1.createResonanceDynamics)(substrate);
const topology = (0, topology_1.createPageTopology)(substrate, resonance);
const operators = new operators_1.ArithmeticOperators(substrate, resonance, topology);
console.log('Testing field-based prime detection and factorization with large numbers:\n');
// Test some large known primes
const largePrimes = [
    97n,
    997n,
    9973n,
    99991n,
    999983n,
    10007n,
    100003n,
    1000003n,
    15485863n, // 1 millionth prime
    179424673n, // 10 millionth prime
];
const largeComposites = [
    100n, // 2² × 5²
    1001n, // 7 × 11 × 13
    10001n, // 73 × 137
    100001n, // 100001 = 11 × 9091
    1000001n, // 101 × 3541 × 27961
    123456789n, // 3² × 3607 × 3803
];
console.log('Testing large primes:');
console.time('Prime detection time');
for (const n of largePrimes) {
    const startTime = Date.now();
    const isPrime = resonance.isPrimeViaResonance(n);
    const endTime = Date.now();
    const time = endTime - startTime;
    console.log(`${n}: ${isPrime ? '✓ PRIME' : '✗ COMPOSITE'} (${time}ms)`);
    // Also test factorization
    const factorResult = operators.factorize(n);
    if (!factorResult.isPrime && isPrime) {
        console.log(`  ERROR: Factorization disagrees! Factors: ${factorResult.factors.join(' × ')}`);
    }
}
console.timeEnd('Prime detection time');
console.log('\nTesting large composites:');
console.time('Composite detection time');
for (const n of largeComposites) {
    const startTime = Date.now();
    const isPrime = resonance.isPrimeViaResonance(n);
    const endTime = Date.now();
    const time = endTime - startTime;
    console.log(`${n}: ${isPrime ? '✗ PRIME' : '✓ COMPOSITE'} (${time}ms)`);
    // Test factorization
    const factorResult = operators.factorize(n);
    console.log(`  Factors: ${factorResult.factors.join(' × ')}`);
    // Verify factorization
    const product = factorResult.factors.reduce((a, b) => a * b, 1n);
    if (product !== n) {
        console.log(`  ERROR: Factorization incorrect! Product = ${product}, expected ${n}`);
    }
}
console.timeEnd('Composite detection time');
// Test very large numbers to see performance
console.log('\nTesting scalability with very large numbers:');
const veryLargeNumbers = [
    BigInt('1000000000000000003'), // Large prime
    BigInt('1000000000000000009'), // Composite: 293 × 1709 × 1997006111763
    BigInt('9999999999999999961'), // Large prime
    BigInt('9999999999999999999'), // Composite
];
console.time('Very large number time');
for (const n of veryLargeNumbers) {
    const startTime = Date.now();
    const isPrime = resonance.isPrimeViaResonance(n);
    const endTime = Date.now();
    const time = endTime - startTime;
    console.log(`${n}: ${isPrime ? 'PRIME' : 'COMPOSITE'} (${time}ms)`);
    // For very large numbers, factorization might take longer
    if (!isPrime && n < BigInt('1000000000000')) {
        const factorResult = operators.factorize(n);
        console.log(`  First few factors: ${factorResult.factors.slice(0, 3).join(' × ')}...`);
    }
}
console.timeEnd('Very large number time');
// Test field pattern behavior with large numbers
console.log('\nField patterns for large numbers:');
for (const n of [999983n, 1000000n, BigInt('1000000000000000003')]) {
    const pattern = substrate.getFieldPattern(n);
    const res = resonance.calculateResonance(n);
    const binaryStr = pattern.map(b => b ? '1' : '0').join('');
    const activeFields = pattern.map((b, i) => b ? ['I', 'N', 'T', 'φ', 'P', '∞', '½', 'ζ'][i] : null).filter(f => f).join(', ');
    console.log(`${n}:`);
    console.log(`  Pattern: ${binaryStr} (${parseInt(binaryStr, 2)})`);
    console.log(`  Active fields: ${activeFields}`);
    console.log(`  Resonance: ${res.toFixed(6)}`);
}
