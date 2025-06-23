// Verify test numbers
const testCases = [
    1030301n, // Expected 1013 × 1019
    314159265n, // Expected 3 × 5 × 53 × 394673
];
console.log('Verifying test case factorizations...\n');
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
for (const n of testCases) {
    const factors = factorize(n);
    console.log(`${n} = ${factors.join(' × ')}`);
    // Verify
    const product = factors.reduce((a, b) => a * b, 1n);
    console.log(`Verification: ${product === n ? '✓' : '✗'}\n`);
}
