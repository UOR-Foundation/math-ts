import { HarmonicEntanglementNetwork } from './dist/harmonic-entanglement-network.js';

const network = new HarmonicEntanglementNetwork();

// Test some numbers
const tests = [10n, 77n, 100n, 97n, 1000n];

console.log('Testing Harmonic Entanglement Network:\n');

for (const n of tests) {
  const result = network.analyzeNumber(n);
  console.log(`n = ${n}`);
  console.log(`  isPrime: ${result.isProbablePrime}`);
  console.log(`  confidence: ${result.confidence.toFixed(3)}`);
  console.log(`  entanglement: ${result.entanglementStrength.toFixed(3)}`);
  console.log(`  coherence: ${result.resonanceCoherence.toFixed(3)}`);
  console.log(`  signature: ${result.harmonicSignature}`);
  console.log('');
}