# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Mathematical Universe implementation in TypeScript - a self-referential computational framework where numbers are living programs and arithmetic is compilation. The project uses a Lerna monorepo structure with 8 core mathematical layers plus applications.

## Commands

### Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run all tests
npm test

# Run tests for specific layer
npm run test:field-substrate
npm run test:resonance
npm run test:topology
npm run test:operators
npm run test:algebra
npm run test:geometry
npm run test:calculus
npm run test:self-reference
npm run test:core

# Run tests with coverage
npm run test:coverage

# Development mode (watch)
npm run dev

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run typecheck

# Format code
npm run format
npm run format:check

# Clean build artifacts
npm run clean
npm run clean:build

# Build documentation
npm run docs:build
```

## Architecture

### Monorepo Structure

- **Lerna** manages the monorepo with workspaces in `packages/*` and `apps/*`
- Each package has its own `package.json`, `tsconfig.json`, and test configuration
- Packages are namespaced under `@uor-foundation/`
- TypeScript project references enable incremental builds

### Layer Architecture

The project implements 8 mathematical layers, each building on the previous:

1. **field-substrate** - The 8 fundamental fields (I, N, T, φ, P, ∞, ½, ζ)
2. **resonance** - Field interference and resonance dynamics
3. **topology** - 48-number page structure and Lagrange points
4. **operators** - Arithmetic as field compilation (addition, multiplication, denormalization)
5. **algebra** - Emergent algebraic structures (groups, rings, modules)
6. **geometry** - Number space manifolds and geodesics
7. **calculus** - Discrete calculus and field derivatives
8. **self-reference** - Self-bootstrapping and fixed points
9. **core** - Integration layer bringing all components together

### Key Design Principles

- **No hardcoded values** - Everything emerges from the universe itself
- **Self-referential implementation** - The system defines its own constants
- **Arithmetic as compilation** - Operations transform field programs, not just data
- **Living numbers** - Each number has active fields, resonance, and computational properties

### Important Patterns

- Numbers activate specific fields based on their prime factorization
- Field interference creates denormalization artifacts during operations
- Lagrange points occur at positions where computation stabilizes (0, 1, 48, 49, etc.)
- The universe bootstraps itself through circular field-prime relationships

## Testing Strategy

- Jest with ts-jest for TypeScript support
- Test files in `tests/` directories follow `*.test.ts` pattern
- Coverage threshold: 80% for branches, functions, lines, and statements
- Integration tests separate from unit tests
- Module name mapping allows clean imports: `@uor-foundation/package-name`

## TypeScript Configuration

- Target: ES2022 with ESNext modules
- Strict mode enabled with additional checks
- Composite projects for efficient builds
- Source maps and declaration files generated
- Project references link the layer dependencies

## Code Standards

- ESLint with TypeScript plugin and Prettier integration
- Explicit function return types required
- No `any` types allowed
- Strict boolean expressions enforced
- Console usage restricted to warnings and errors
- Unused variables must be prefixed with `_`
