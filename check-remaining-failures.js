// Check remaining failures
const testCases = [
    { n: 1061783n, expected: '1021 × 1039' },
    { n: 161803398n, expected: '2 × 7 × 11 × 71 × 14741' },
];
function factorize(n) {
    const factors = [];
    let remaining = n;
    for (let i = 2n; i * i <= remaining; i++) {
        while (remaining % i === 0n) {
            factors.push(i);
            remaining = remaining / i;
        }
    }
    if (remaining > 1n) {
        factors.push(remaining);
    }
    return factors;
}
console.log('Checking remaining failures...\n');
for (const { n, expected } of testCases) {
    const factors = factorize(n);
    console.log(`${n}:`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${factors.join(' × ')}`);
    const product = factors.reduce((a, b) => a * b, 1n);
    console.log(`  Verification: ${product === n ? '✓' : '✗'}`);
    console.log();
}
