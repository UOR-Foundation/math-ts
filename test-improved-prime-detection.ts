import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import { isPrimeViaFieldDynamics, analyzeFieldDynamics } from '@uor-foundation/resonance/src/field-prime-detection';

const substrate = createFieldSubstrate();
const resonance = createResonanceDynamics(substrate);

console.log('Testing improved prime detection via field dynamics:\n');

// Test with known primes and composites
const testNumbers = [2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n, 15n, 16n, 17n, 18n, 19n, 20n];
const knownPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n];

// First, show the problem with the current approach
console.log('Current approach (resonance local minimum):');
for (const n of testNumbers) {
  const isPrime = resonance.isPrimeViaResonance(n);
  const res = resonance.calculateResonance(n);
  const analysis = resonance.isResonanceMinimum(n);
  const correct = knownPrimes.includes(n);
  const status = isPrime === correct ? '✓' : '✗';
  
  console.log(`${n}: isPrime=${isPrime} ${status}, resonance=${res.toFixed(4)}, isLocalMin=${analysis.isLocalMinimum}`);
}

console.log('\n' + '='.repeat(60) + '\n');

// Now test the improved approach
console.log('Improved approach (field dynamics):');
for (const n of testNumbers) {
  const analysis = analyzeFieldDynamics(substrate, n);
  const correct = knownPrimes.includes(n);
  const status = analysis.isPrime === correct ? '✓' : '✗';
  
  console.log(`${n}: isPrime=${analysis.isPrime} ${status}, confidence=${(analysis.confidence * 100).toFixed(0)}%`);
  console.log(`   resonance=${analysis.resonance.toFixed(4)}, interference=${analysis.interference.toFixed(4)}, stability=${analysis.stability.toFixed(4)}`);
  console.log(`   activeFields=${analysis.activeFieldCount}, decompositionResistant=${analysis.decompositionResistant}`);
  console.log('');
}

// Detailed analysis of the 6 vs 7 case
console.log('\n' + '='.repeat(60) + '\n');
console.log('Detailed analysis of 6 vs 7:');

for (const n of [6n, 7n]) {
  const pattern = substrate.getFieldPattern(n);
  const analysis = analyzeFieldDynamics(substrate, n);
  const binaryStr = pattern.map(b => b ? '1' : '0').join('');
  
  console.log(`\nNumber ${n}:`);
  console.log(`  Field pattern: ${binaryStr}`);
  console.log(`  Active fields: ${pattern.map((b, i) => b ? ['I', 'N', 'T', 'φ', 'P', '∞', '½', 'ζ'][i] : null).filter(f => f).join(', ')}`);
  console.log(`  Resonance: ${analysis.resonance.toFixed(6)}`);
  console.log(`  Interference: ${analysis.interference.toFixed(6)}`);
  console.log(`  Stability: ${analysis.stability.toFixed(6)}`);
  console.log(`  Decomposition resistant: ${analysis.decompositionResistant}`);
  console.log(`  Prime detection: ${analysis.isPrime} (confidence: ${(analysis.confidence * 100).toFixed(0)}%)`);
}

// Test accuracy on a larger range
console.log('\n' + '='.repeat(60) + '\n');
console.log('Accuracy test on range 1-50:');

let correctCount = 0;
let totalCount = 0;
const primesUpTo50 = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];

for (let n = 2n; n <= 50n; n++) {
  const isPrime = isPrimeViaFieldDynamics(substrate, n);
  const shouldBePrime = primesUpTo50.includes(n);
  
  if (isPrime === shouldBePrime) {
    correctCount++;
  } else {
    console.log(`  Incorrect: ${n} detected as ${isPrime ? 'prime' : 'composite'}, should be ${shouldBePrime ? 'prime' : 'composite'}`);
  }
  totalCount++;
}

const accuracy = (correctCount / totalCount * 100).toFixed(1);
console.log(`\nAccuracy: ${correctCount}/${totalCount} (${accuracy}%)`);
console.log(`Note: For production use, this would need further refinement and optimization.`);