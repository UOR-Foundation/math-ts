"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
async function debugFactorization() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const factorizer = new resonance_1.MultiModalFactorization(substrate);
    console.log('=== Debugging Large Number Factorization ===\n');
    const testCases = [
        { n: 1000005n, expected: '3 × 5 × 66667', comment: 'Failed in test' },
        { n: 10000000020n, expected: '2 × 2 × 5 × 500000001', comment: 'Failed in test' },
    ];
    for (const { n, expected, comment } of testCases) {
        console.log(`\nTesting ${n} (${comment})`);
        console.log(`Expected: ${expected}`);
        // Verify expected factorization
        const expectedFactors = expected.split(' × ').map(s => BigInt(s));
        const product = expectedFactors.reduce((a, b) => a * b, 1n);
        console.log(`Verification: ${product} === ${n}? ${product === n}`);
        // Run factorization
        const result = await factorizer.factorize(n, true);
        console.log(`Got: ${result.join(' × ')}`);
        // Verify result
        const resultProduct = result.reduce((a, b) => a * b, 1n);
        console.log(`Result verification: ${resultProduct} === ${n}? ${resultProduct === n}`);
    }
    // Let's manually check the correct factorizations
    console.log('\n\n=== Manual factorization checks ===');
    console.log('\n1000005:');
    console.log(`  1000005 / 3 = ${1000005n / 3n} (remainder: ${1000005n % 3n})`);
    console.log(`  333335 / 5 = ${333335n / 5n} (remainder: ${333335n % 5n})`);
    console.log(`  66667 is prime? Let's check...`);
    // Check if 66667 is prime
    const check66667 = (n) => {
        if (n <= 1n)
            return false;
        if (n <= 3n)
            return true;
        if (n % 2n === 0n || n % 3n === 0n)
            return false;
        for (let i = 5n; i * i <= n; i += 6n) {
            if (n % i === 0n || n % (i + 2n) === 0n)
                return false;
        }
        return true;
    };
    console.log(`  66667 is prime: ${check66667(66667n)}`);
    // Actually factor 66667
    for (let i = 2n; i * i <= 66667n; i++) {
        if (66667n % i === 0n) {
            console.log(`  66667 = ${i} × ${66667n / i}`);
            break;
        }
    }
}
debugFactorization().catch(console.error);
