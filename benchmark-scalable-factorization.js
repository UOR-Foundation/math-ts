"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
async function benchmark() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const factorizer = new resonance_1.MultiModalFactorization(substrate);
    console.log('=== Scalable Factorization Performance Benchmark ===\n');
    const testCases = [
        // Small scale
        { n: 77n, size: 'Small (2 digits)', desc: '7 × 11' },
        { n: 143n, size: 'Small (3 digits)', desc: '11 × 13' },
        { n: 1001n, size: 'Small (4 digits)', desc: '7 × 11 × 13' },
        // Medium scale
        { n: 10001n, size: 'Medium (5 digits)', desc: '73 × 137' },
        { n: 100003n, size: 'Medium (6 digits)', desc: 'prime' },
        { n: 1000007n, size: 'Medium (7 digits)', desc: '29 × 34483' },
        // Large scale
        { n: 10000019n, size: 'Large (8 digits)', desc: 'prime' },
        { n: 100000007n, size: 'Large (9 digits)', desc: 'prime' },
        { n: 1000000007n, size: 'Large (10 digits)', desc: 'prime' },
        // Very large scale
        { n: 10000000019n, size: 'Very Large (11 digits)', desc: 'prime' },
        { n: 100000000003n, size: 'Very Large (12 digits)', desc: 'prime' },
        { n: 1000000000039n, size: 'Very Large (13 digits)', desc: 'prime' },
        // Composite challenges
        { n: 12345678901n, size: 'Challenge (11 digits)', desc: '857 × 14405693' },
        { n: 98765432101n, size: 'Challenge (11 digits)', desc: 'composite' },
        // Powers and special forms
        { n: 1024n, size: 'Power of 2', desc: '2^10' },
        { n: 59049n, size: 'Power of 3', desc: '3^10' },
        { n: 1073741827n, size: 'Mersenne', desc: '2^30 + 3 (prime)' },
    ];
    const results = [];
    console.log('Warming up cache...');
    for (const { n } of testCases.slice(0, 5)) {
        await factorizer.factorize(n);
    }
    factorizer.clearCache();
    console.log('\nRunning benchmarks...\n');
    console.log('Number'.padEnd(15) + 'Size'.padEnd(25) + 'Time (ms)'.padEnd(12) + 'Factors');
    console.log('-'.repeat(70));
    for (const { n, size, desc } of testCases) {
        const start = process.hrtime.bigint();
        const factors = await factorizer.factorize(n);
        const end = process.hrtime.bigint();
        const timeMs = Number(end - start) / 1000000;
        const factorStr = factors.length === 1 && factors[0] === n
            ? 'PRIME'
            : factors.length > 5
                ? `${factors.slice(0, 3).join('×')}...(${factors.length} factors)`
                : factors.join(' × ');
        console.log(n.toString().padEnd(15) +
            size.padEnd(25) +
            timeMs.toFixed(2).padEnd(12) +
            factorStr);
        results.push({ n, size, factors, time: timeMs });
    }
    // Analysis
    console.log('\n\n=== Performance Analysis ===\n');
    // Group by size category
    const categories = new Map();
    results.forEach(r => {
        const category = r.size.split(' ')[0];
        if (!categories.has(category)) {
            categories.set(category, []);
        }
        categories.get(category).push(r);
    });
    console.log('Average time by category:');
    for (const [category, results] of categories) {
        const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
        console.log(`  ${category}: ${avgTime.toFixed(2)}ms`);
    }
    // Scalability check
    console.log('\nScalability (time vs digit count):');
    const digitGroups = new Map();
    results.forEach(r => {
        const digits = r.n.toString().length;
        if (!digitGroups.has(digits)) {
            digitGroups.set(digits, []);
        }
        digitGroups.get(digits).push(r.time);
    });
    const sortedDigits = Array.from(digitGroups.keys()).sort((a, b) => a - b);
    for (const digits of sortedDigits) {
        const times = digitGroups.get(digits);
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        console.log(`  ${digits} digits: ${avgTime.toFixed(2)}ms`);
    }
    // Memory usage
    console.log('\nMemory usage:');
    const used = process.memoryUsage();
    console.log(`  RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);
}
benchmark().catch(console.error);
