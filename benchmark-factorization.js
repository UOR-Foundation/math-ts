"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
async function benchmark() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const factorizer = new resonance_1.MultiModalFactorization(substrate);
    console.log('=== Factorization Performance Benchmark ===\n');
    const testCases = [
        { n: 77n, name: '77 (small composite)' },
        { n: 1001n, name: '1001 (3 factors)' },
        { n: 10001n, name: '10001 (2 large factors)' },
        { n: 100003n, name: '100003 (prime)' },
        { n: 1000007n, name: '1000007 (large composite)' },
        { n: 12345678901n, name: '12345678901 (very large)' },
    ];
    console.log('Warming up...');
    // Warm up the cache
    for (const { n } of testCases) {
        await factorizer.factorize(n);
    }
    // Clear cache for fair benchmark
    factorizer.clearCache();
    console.log('\nRunning benchmarks...\n');
    for (const { n, name } of testCases) {
        const start = process.hrtime.bigint();
        const factors = await factorizer.factorize(n);
        const end = process.hrtime.bigint();
        const timeMs = Number(end - start) / 1000000;
        console.log(`${name}:`);
        console.log(`  Result: ${factors.join(' × ')}`);
        console.log(`  Time: ${timeMs.toFixed(2)}ms`);
        console.log();
    }
    // Memory usage
    const used = process.memoryUsage();
    console.log('Memory usage:');
    console.log(`  RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);
}
benchmark().catch(console.error);
