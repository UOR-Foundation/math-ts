// Check if 66666667 is prime
const n = 66666667n;

console.log(`Checking if ${n} is prime...`);

// Check small factors
for (let i = 2n; i * i <= n; i++) {
  if (n % i === 0n) {
    console.log(`${n} = ${i} × ${n / i}`);
    console.log('Not prime!');
    process.exit(0);
  }
  
  if (i % 1000000n === 0n) {
    console.log(`Checked up to ${i}...`);
  }
}

console.log(`${n} is prime!`);