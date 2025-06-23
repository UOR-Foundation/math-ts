import { createFieldSubstrate } from '@uor-foundation/field-substrate';

// Debug field patterns and interference
const substrate = createFieldSubstrate();

console.log('=== Field Pattern Analysis ===\n');

// Analyze 73 × 137 = 10001
const p73 = substrate.getFieldPattern(73n);
const p137 = substrate.getFieldPattern(137n);
const p10001 = substrate.getFieldPattern(10001n);

console.log('73 field pattern:');
p73.forEach((active, i) => {
  if (active) console.log(`  Field ${i} active`);
});

console.log('\n137 field pattern:');
p137.forEach((active, i) => {
  if (active) console.log(`  Field ${i} active`);
});

console.log('\n10001 field pattern:');
p10001.forEach((active, i) => {
  if (active) console.log(`  Field ${i} active`);
});

console.log('\n=== Field Interference Analysis ===');

// Check each field
for (let i = 0; i < 8; i++) {
  const in73 = p73[i];
  const in137 = p137[i];
  const in10001 = p10001[i];
  
  if (in73 && in137 && !in10001) {
    console.log(`Field ${i}: VANISHED (both factors had it)`);
  } else if (!in73 && !in137 && in10001) {
    console.log(`Field ${i}: EMERGED (neither factor had it)`);
  } else if (in73 && !in137 && in10001) {
    console.log(`Field ${i}: From 73 only`);
  } else if (!in73 && in137 && in10001) {
    console.log(`Field ${i}: From 137 only`);
  }
}

// Test more examples
console.log('\n\n=== More Examples ===');

const testCases = [
  { a: 7n, b: 11n },
  { a: 13n, b: 17n },
  { a: 23n, b: 31n }
];

for (const { a, b } of testCases) {
  const product = a * b;
  const pa = substrate.getFieldPattern(a);
  const pb = substrate.getFieldPattern(b);
  const pp = substrate.getFieldPattern(product);
  
  console.log(`\n${a} × ${b} = ${product}:`);
  
  for (let i = 0; i < 8; i++) {
    if (pa[i] && pb[i] && !pp[i]) {
      console.log(`  Field ${i}: VANISHED`);
    } else if (!pa[i] && !pb[i] && pp[i]) {
      console.log(`  Field ${i}: EMERGED`);
    }
  }
}