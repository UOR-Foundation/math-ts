// Verify the factorizations for hard semiprimes
const testCases = [
    { n: 12403n, expected: [109n, 113n] },
    { n: 99400891n, expected: [9967n, 9973n] },
    { n: 1000000021n, expected: [31607n, 31643n] },
    { n: 10000000207n, expected: [99991n, 100019n] },
];
console.log('Verifying hard semiprime factorizations...\n');
for (const { n, expected } of testCases) {
    const product = expected[0] * expected[1];
    const correct = product === n;
    console.log(`${n}:`);
    console.log(`  Expected: ${expected.join(' × ')} = ${product}`);
    console.log(`  Correct: ${correct}`);
    if (!correct) {
        console.log(`  ERROR: Expected ${n}, got ${product}, diff = ${n - product}`);
        // Try to find correct factors
        console.log('  Finding correct factorization...');
        const factors = [];
        let remaining = n;
        // Check if it's prime
        let isPrime = true;
        for (let i = 2n; i * i <= remaining && isPrime; i++) {
            if (remaining % i === 0n) {
                factors.push(i);
                factors.push(remaining / i);
                isPrime = false;
            }
        }
        if (isPrime) {
            console.log(`  ${n} is prime!`);
        }
        else {
            console.log(`  Actual: ${factors.join(' × ')}`);
        }
    }
    console.log();
}
