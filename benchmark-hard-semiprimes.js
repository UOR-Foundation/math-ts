"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
// Generate hard semiprimes (products of two similar-sized primes)
function generateHardSemiprimes() {
    const primes = [
        // Small primes for testing
        97n, 101n, 103n, 107n, 109n, 113n,
        // Medium primes
        997n, 1009n, 1013n, 1019n, 1021n, 1031n,
        // Larger primes
        9967n, 9973n, 10007n, 10009n, 10037n,
        // Very large primes (these make hard semiprimes)
        99991n, 100003n, 100019n, 100043n,
    ];
    const semiprimes = [];
    // Generate semiprimes from similar-sized primes
    for (let i = 0; i < primes.length - 1; i++) {
        for (let j = i; j < Math.min(i + 3, primes.length); j++) {
            semiprimes.push({
                n: primes[i] * primes[j],
                p1: primes[i],
                p2: primes[j]
            });
        }
    }
    return semiprimes;
}
async function benchmarkHardSemiprimes() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const factorizer = new resonance_1.MultiModalFactorization(substrate);
    console.log('=== Hard Semiprime Factorization Benchmark ===\n');
    console.log('Testing factorization of products of two similar-sized primes...\n');
    const semiprimes = generateHardSemiprimes();
    // Group by size
    const small = semiprimes.filter(s => s.n < 100000n);
    const medium = semiprimes.filter(s => s.n >= 100000n && s.n < 10000000n);
    const large = semiprimes.filter(s => s.n >= 10000000n);
    console.log(`Total semiprimes: ${semiprimes.length}`);
    console.log(`Small (<100K): ${small.length}`);
    console.log(`Medium (100K-10M): ${medium.length}`);
    console.log(`Large (>10M): ${large.length}`);
    console.log();
    // Test each group
    for (const [name, group] of [['Small', small], ['Medium', medium], ['Large', large]]) {
        console.log(`\n--- ${name} Semiprimes ---`);
        let totalTime = 0;
        let successes = 0;
        let failures = 0;
        for (const { n, p1, p2 } of group.slice(0, 10)) { // Test first 10 of each group
            const start = Date.now();
            const result = await factorizer.factorize(n);
            const time = Date.now() - start;
            totalTime += time;
            const correct = (result.length === 2 &&
                ((result[0] === p1 && result[1] === p2) ||
                    (result[0] === p2 && result[1] === p1))) ||
                (p1 === p2 && result.length === 2 && result[0] === p1 && result[1] === p2);
            if (correct) {
                successes++;
                console.log(`  ${n} = ${p1} × ${p2}: ✓ (${time}ms)`);
            }
            else {
                failures++;
                console.log(`  ${n} = ${p1} × ${p2}: ✗ got ${result.join(' × ')} (${time}ms)`);
            }
        }
        console.log(`\n  Success rate: ${successes}/${successes + failures} (${(successes / (successes + failures) * 100).toFixed(1)}%)`);
        console.log(`  Average time: ${(totalTime / (successes + failures)).toFixed(1)}ms`);
    }
    // Test field pattern effectiveness
    console.log('\n\n--- Field Pattern Analysis ---');
    const testCase = { n: 10403n, p1: 101n, p2: 103n }; // 101 × 103
    console.log(`\nAnalyzing ${testCase.n} = ${testCase.p1} × ${testCase.p2}`);
    const pattern10403 = substrate.getFieldPattern(testCase.n);
    const pattern101 = substrate.getFieldPattern(testCase.p1);
    const pattern103 = substrate.getFieldPattern(testCase.p2);
    console.log(`\nField patterns:`);
    console.log(`  ${testCase.p1}: ${pattern101.map(b => b ? '1' : '0').join('')}`);
    console.log(`  ${testCase.p2}: ${pattern103.map(b => b ? '1' : '0').join('')}`);
    console.log(`  ${testCase.n}: ${pattern10403.map(b => b ? '1' : '0').join('')}`);
    console.log('\nDenormalization artifacts:');
    for (let i = 0; i < 8; i++) {
        if (pattern101[i] && pattern103[i] && !pattern10403[i]) {
            console.log(`  Field ${i}: VANISHED`);
        }
        else if (!pattern101[i] && !pattern103[i] && pattern10403[i]) {
            console.log(`  Field ${i}: EMERGED`);
        }
    }
    // Test with debug enabled
    console.log('\n\nFactorizing with debug enabled:');
    await factorizer.factorize(testCase.n, true);
}
benchmarkHardSemiprimes().catch(console.error);
