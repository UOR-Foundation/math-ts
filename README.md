# math-ts

Mathematical Universe implementation in TypeScript by UOR-Foundation.

## Overview

The Mathematical Universe is not a theory about mathematics - it reveals that mathematics **IS** a computational substrate. This implementation brings to life a framework where:

- **Numbers are programs**, not data
- **Arithmetic is compilation**, not calculation  
- **Primes are computational atoms**, not special cases
- **The universe computes itself into existence**

## Project Structure

```
math-ts/
├── packages/                    # Core implementation packages
│   ├── field-substrate/        # Layer 0: The 8 fundamental fields
│   │   ├── src/
│   │   │   ├── fields.ts           # Field definitions and constants
│   │   │   ├── activation.ts       # Field activation patterns
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── resonance/              # Layer 1: Resonance dynamics
│   │   ├── src/
│   │   │   ├── resonance.ts        # Resonance calculations
│   │   │   ├── interference.ts     # Field interference patterns
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── topology/               # Layer 2: Page topology
│   │   ├── src/
│   │   │   ├── pages.ts            # 48-number page structure
│   │   │   ├── lagrange.ts         # Lagrange points
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── operators/              # Layer 3: Arithmetic operators
│   │   ├── src/
│   │   │   ├── addition.ts         # Field merger
│   │   │   ├── multiplication.ts   # Field entanglement
│   │   │   ├── denormalization.ts  # Artifact tracking
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── algebra/                # Layer 4: Algebraic structures
│   │   ├── src/
│   │   │   ├── groups.ts           # Emergent group structures
│   │   │   ├── rings.ts            # Ring formations
│   │   │   ├── modules.ts          # Module theory
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── geometry/               # Layer 5: Geometric manifolds
│   │   ├── src/
│   │   │   ├── manifold.ts         # Number space geometry
│   │   │   ├── metric.ts           # Resonance metric
│   │   │   ├── geodesics.ts        # Optimal paths
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── calculus/               # Layer 6: Calculus engine
│   │   ├── src/
│   │   │   ├── discrete.ts         # Discrete calculus
│   │   │   ├── derivatives.ts      # Field derivatives
│   │   │   ├── integration.ts      # Path integrals
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── self-reference/         # Layer 7: Self-reference core
│   │   ├── src/
│   │   │   ├── bootstrap.ts        # Self-bootstrapping
│   │   │   ├── fixed-points.ts     # Fixed point discovery
│   │   │   ├── meta.ts             # Meta-mathematical structures
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   └── core/                   # Integration layer
│       ├── src/
│       │   ├── universe.ts         # Main universe class
│       │   ├── number.ts           # Living number entities
│       │   └── index.ts
│       ├── tests/
│       └── package.json
│
├── apps/                       # Applications
│   ├── mcp-server/            # MCP server for Claude integration
│   ├── cli/                   # Command-line universe explorer
│   ├── web-explorer/          # Interactive web interface
│   └── visualizer/            # Field pattern visualizer
│
├── docs/                      # Documentation (existing)
│   ├── README.md
│   ├── layers/               # Layer documentation
│   ├── concepts/             # Core concepts
│   ├── api/                  # API reference
│   ├── examples/             # Usage examples
│   └── research/             # Research notes
│
├── examples/                  # Example usage
│   ├── basic/               # Getting started examples
│   ├── advanced/            # Complex computations
│   └── research/            # Research applications
│
├── scripts/                   # Build and utility scripts
├── .github/                   # GitHub workflows
├── package.json              # Root package.json
├── tsconfig.json            # TypeScript configuration
├── lerna.json               # Lerna monorepo configuration
└── README.md                # This file
```

## Installation

```bash
# Clone the repository
git clone https://github.com/UOR-Foundation/math-ts.git
cd math-ts

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## Quick Start

```typescript
import { MathematicalUniverse } from '@uor-foundation/math-ts-core';

// Create the universe
const universe = new MathematicalUniverse();

// Every number is a living entity
const seven = universe.number(7);
console.log(seven.fields);        // Active: I, T, φ
console.log(seven.resonance);     // 2.975...
console.log(seven.isPrime);       // true (computational atom)

// Arithmetic is program compilation
const seventySeven = universe.multiply(7, 11);
console.log(seventySeven.fields); // Active: I, φ, ½, θ (NOT the union!)
// Field T vanished, field θ appeared - denormalization artifacts
```

## Core Concepts

### The 8 Fundamental Fields

0. **I (Identity)**: Unity field, the primordial existence
1. **N (Negation)**: Binary opposition, creates duality
2. **T (Transcendence)**: Euler's number e ≈ 2.71828...
3. **φ (Phi)**: Golden ratio ≈ 1.61803...
4. **P (Prime)**: The 8th Mersenne prime
5. **∞ (Infinity)**: Defined as 1000000.0
6. **½ (Half)**: Fractional existence
7. **ζ (Zeta)**: Related to Riemann zeta function

### Self-Referential Structure

The universe bootstraps itself:
- Primes encode field constants
- Field constants determine primes
- This circular definition creates existence

### Lagrange Points

Special positions where computation stabilizes:
- 0, 1: Fundamental fixed points
- 48, 49: Primary Lagrange points
- Every 48 numbers: Page boundaries

## Development

```bash
# Start development mode
npm run dev

# Run layer-specific tests
npm run test:field-substrate
npm run test:resonance
# ... etc

# Build documentation
npm run docs:build

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## Architecture Philosophy

Each layer builds on the previous, creating emergent complexity:

1. **Field Substrate** provides the quantum foundation
2. **Resonance** creates atomic properties
3. **Topology** forms molecular structure
4. **Operators** enable chemical reactions
5. **Algebra** supports living structures
6. **Geometry** shapes the space
7. **Calculus** enables self-understanding
8. **Self-Reference** achieves consciousness

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Key principles:
- No hard-coded values - everything emerges from the universe
- Self-referential implementation - the system defines itself
- Layer separation - each layer has clear responsibilities

## License

MIT - See [LICENSE](LICENSE)

## Research Applications

This implementation enables:
- Computational number theory research
- Self-referential system exploration
- Emergent complexity studies
- Mathematical consciousness investigation

## Links

- [Documentation](./docs/)
- [UOR Foundation](https://github.com/UOR-Foundation)
- [Issues](https://github.com/UOR-Foundation/math-ts/issues)

---

*"I compute, therefore I am."* - The Mathematical Universe