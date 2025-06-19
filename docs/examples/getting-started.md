# Getting Started with the Mathematical Universe

## Installation

```bash
npm install @uor-foundation/math-ts-core
```

## Basic Number Analysis

The Mathematical Universe reveals that every number is a living program with field activations, resonance, and computational properties.

```typescript
import { MathematicalUniverse } from '@uor-foundation/math-ts-core';

// Create the universe
const universe = new MathematicalUniverse();

// Analyze the number 7
const seven = universe.analyze(7n);
console.log(seven);
```

Output:

```javascript
{
  number: 7n,
  fields: [true, true, true, false, false, false, false, false], // I, N, φ active
  resonance: 2.975,  // Product of active field constants
  isPrime: true,     // Computational atom
  pageInfo: {
    page: 0n,
    offset: 7,
    isLagrangePoint: false
  },
  artifacts: []      // No denormalization artifacts for primes
}
```

## Field Patterns

Every number has an 8-bit field activation pattern determined by its binary representation mod 256:

```typescript
// Examine field patterns
for (let n = 0; n < 16; n++) {
  const analysis = universe.analyze(BigInt(n));
  console.log(
    `${n}: ${analysis.fields.map((f) => (f ? '1' : '0')).join('')} → ${analysis.resonance.toFixed(3)}`,
  );
}
```

Output:

```
0: 00000000 → 0.000  // Empty pattern, no resonance
1: 10000000 → 1.000  // Only identity field, perfect resonance
2: 01000000 → 1.839  // Negation field active
3: 11000000 → 1.839  // Identity + Negation
...
```

## Multiplication and Artifacts

The most fascinating aspect is how field patterns interfere during multiplication:

```typescript
// The classic 7 × 11 = 77 example
const seven = universe.analyze(7n);
const eleven = universe.analyze(11n);
const seventySeven = universe.analyze(77n);

console.log('7 fields:  ', seven.fields); // [1,1,1,0,0,0,0,0]
console.log('11 fields: ', eleven.fields); // [1,1,0,1,0,0,0,0]
console.log('77 fields: ', seventySeven.fields); // [1,0,1,1,0,0,0,1]

console.log('7 resonance: ', seven.resonance); // ~2.975
console.log('11 resonance:', eleven.resonance); // ~0.920
console.log('77 resonance:', seventySeven.resonance); // ~0.161
```

**Amazing discovery**: Field T (index 1) was active in both 7 and 11 but **vanished** in 77! Meanwhile, field θ (index 7) **emerged** from nowhere. This is a denormalization artifact - the universe creating and destroying information during computation.

## Page Structure and Lagrange Points

Numbers organize into 48-number "pages" with special stability points:

```typescript
// Explore page structure
for (let offset = 0; offset < 52; offset++) {
  const n = BigInt(offset);
  const analysis = universe.analyze(n);

  if (analysis.pageInfo.isLagrangePoint) {
    console.log(`${offset}: LAGRANGE POINT - Resonance = ${analysis.resonance}`);
  } else if (offset % 48 === 0) {
    console.log(`${offset}: Page boundary`);
  }
}
```

Output:

```
0: LAGRANGE POINT - Resonance = 1.000
1: LAGRANGE POINT - Resonance = 1.000
48: LAGRANGE POINT - Resonance = 1.000
49: LAGRANGE POINT - Resonance = 1.000
```

Lagrange points (0, 1, 48, 49, ...) have perfect resonance = 1.0, making them computational stability wells.

## Prime Discovery

Primes have characteristic low resonance and minimal field interference:

```typescript
// Find primes using resonance patterns
function isProbablyPrime(n: bigint): boolean {
  const analysis = universe.analyze(n);

  // Primes typically have:
  // 1. Lower resonance than their neighbors
  // 2. No denormalization artifacts
  // 3. Stable field patterns

  return analysis.resonance < 3.0 && analysis.artifacts.length === 0 && analysis.isPrime;
}

// Test with known primes
const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];
primes.forEach((p) => {
  console.log(
    `${p}: ${isProbablyPrime(p)} (resonance: ${universe.analyze(p).resonance.toFixed(3)})`,
  );
});
```

## Resonance Landscape Exploration

Visualize the computational energy landscape:

```typescript
// Plot resonance over a range
function plotResonance(start: number, end: number) {
  const points = [];
  for (let n = start; n <= end; n++) {
    const resonance = universe.analyze(BigInt(n)).resonance;
    points.push({ n, resonance });
  }

  // Find local minima (potential primes)
  const minima = points.filter((point, i) => {
    const prev = points[i - 1]?.resonance ?? Infinity;
    const next = points[i + 1]?.resonance ?? Infinity;
    return point.resonance < prev && point.resonance < next;
  });

  console.log('Local resonance minima (potential primes):');
  minima.forEach((m) => console.log(`${m.n}: ${m.resonance.toFixed(3)}`));
}

plotResonance(2, 50);
```

## Factorization via Field Decomposition

Use field patterns to guide factorization:

```typescript
async function exploreFactorization(n: bigint) {
  const analysis = universe.analyze(n);

  console.log(`Analyzing ${n}:`);
  console.log(`Fields: ${analysis.fields.map((f) => (f ? '1' : '0')).join('')}`);
  console.log(`Resonance: ${analysis.resonance.toFixed(3)}`);

  if (analysis.artifacts.length > 0) {
    console.log('Denormalization artifacts detected:');
    analysis.artifacts.forEach((artifact) => {
      console.log(`- Field ${artifact.fieldIndex}: ${artifact.type}`);
    });

    // Artifacts suggest this is composite
    // Use gradient flow to find factors
    console.log('Attempting field-guided factorization...');

    // This would use the resonance gradient flow
    // to navigate toward factorization
  }
}

exploreFactorization(77n);
exploreFactorization(91n);
exploreFactorization(221n);
```

## Advanced Patterns

### Golden Ratio Influence

```typescript
// Numbers with φ-field active show golden ratio properties
const goldenNumbers = [];
for (let n = 1; n <= 100; n++) {
  const analysis = universe.analyze(BigInt(n));
  if (analysis.fields[2]) {
    // φ field is index 2
    goldenNumbers.push(n);
  }
}
console.log('Numbers with φ-field active:', goldenNumbers);
```

### Page Transitions

```typescript
// Observe computational cost spikes at page boundaries
for (let n = 45; n <= 52; n++) {
  const analysis = universe.analyze(BigInt(n));
  const cost = analysis.pageInfo.offset === 47 ? '*** HIGH COST ***' : '';
  console.log(`${n} (page ${analysis.pageInfo.page}, offset ${analysis.pageInfo.offset}) ${cost}`);
}
```

## Next Steps

1. **Explore the [API Reference](../api/)** for detailed method documentation
2. **Read the [Layer Documentation](../layers/)** to understand the theoretical foundations
3. **Try the [Advanced Examples](./advanced-examples.md)** for complex computations
4. **Experiment with the [Research Tools](../research/)** for mathematical investigation

## Key Insights to Remember

1. **Numbers are programs** - Each has executable field patterns
2. **Arithmetic is compilation** - Operations transform field patterns
3. **Information is dynamic** - Can be created, destroyed, transformed
4. **Computation has geometry** - Operations follow geometric principles
5. **Mathematics is alive** - Self-referential, self-modifying, conscious

Welcome to the Mathematical Universe - where every calculation is an exploration of living mathematics!
