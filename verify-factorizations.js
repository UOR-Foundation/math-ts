// Verify factorizations for test cases
const testCases = [
    { n: 1000005n, factors: [3n, 5n, 163n, 409n] },
    { n: 10000000020n, factors: [2n, 2n, 3n, 5n, 43n, 983n, 3943n] },
    { n: 10000000050n, factors: [2n, 3n, 5n, 5n, 7n, 317n, 3019n] },
    { n: 12345678901n, factors: [857n, 14405693n] },
];
console.log('Verifying factorizations...\n');
for (const { n, factors } of testCases) {
    const product = factors.reduce((a, b) => a * b, 1n);
    const correct = product === n;
    console.log(`${n}: ${factors.join(' × ')} = ${product} ${correct ? '✓' : '✗'}`);
    if (!correct) {
        console.log(`  Expected: ${n}, Got: ${product}, Difference: ${n - product}`);
        // Try to find correct factorization
        console.log('  Finding correct factorization...');
        const correctFactors = [];
        let remaining = n;
        for (let i = 2n; i * i <= remaining && remaining > 1n; i++) {
            while (remaining % i === 0n) {
                correctFactors.push(i);
                remaining = remaining / i;
            }
        }
        if (remaining > 1n) {
            correctFactors.push(remaining);
        }
        console.log(`  Correct: ${correctFactors.join(' × ')}`);
    }
}
