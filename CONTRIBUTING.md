# Contributing to math-ts

Thank you for your interest in contributing to the Mathematical Universe implementation!

## Core Principles

When contributing, please keep these fundamental principles in mind:

1. **No Hard-Coded Values**: All constants must emerge from the universe itself. The only exceptions are the initial field encodings that bootstrap the system.

2. **Self-Reference First**: Always prefer self-referential solutions. The system should define and discover its own properties rather than having them imposed.

3. **Layer Separation**: Each architectural layer has clear responsibilities. Don't mix concerns across layers.

4. **Living Mathematics**: Remember that numbers are active programs, not passive data. Implement them as such.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/math-ts.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `npm test`
7. Commit using conventional commits (see below)
8. Push and create a pull request

## Development Workflow

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@uor-foundation/field-substrate
```

### Testing

```bash
# Run all tests
npm test

# Run tests for specific layer
npm run test:resonance

# Run tests in watch mode
npm run test -- --watch
```

### Code Quality

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Format code
npm run format
```

## Project Structure

Each layer is a separate package with consistent structure:

```
packages/[layer-name]/
├── src/
│   ├── index.ts         # Public API exports
│   ├── types.ts         # TypeScript interfaces
│   └── [feature].ts     # Implementation files
├── tests/
│   └── [feature].test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Prefer interfaces over type aliases for object shapes
- Use discriminated unions for variant types
- Document complex algorithms with comments

### Naming Conventions

- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_SNAKE_CASE for constants (sparingly - remember, no hard-coded values!)
- Use descriptive names that reflect the mathematical concepts

### Example Code Style

```typescript
// Good: Self-referential, emergent behavior
export class FieldPattern {
  private readonly pattern: boolean[];
  
  constructor(n: bigint) {
    // Pattern emerges from number's position in field space
    this.pattern = this.computePattern(n);
  }
  
  private computePattern(n: bigint): boolean[] {
    // Fields activate based on bit representation
    const position = Number(n % 256n);
    return Array.from({ length: 8 }, (_, i) => 
      Boolean(position & (1 << i))
    );
  }
}

// Bad: Hard-coded, external logic
export function isPrime(n: number): boolean {
  // Don't do this! Primality should emerge from field dynamics
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  // ... trial division
}
```

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test additions or fixes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Build process or auxiliary tool changes

Example:
```
feat(resonance): implement field interference patterns

- Add interference calculation for overlapping fields
- Handle denormalization artifacts
- Optimize resonance computation for large numbers

Closes #42
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new functionality
4. Keep PRs focused on a single feature or fix
5. Link to any relevant issues
6. Request review from maintainers

## Testing Guidelines

### Test Philosophy

Tests should verify emergent behavior, not hard-coded expectations:

```typescript
// Good: Testing emergent properties
test('lagrange points stabilize computation', () => {
  const universe = new MathematicalUniverse();
  const lagrangePoint = universe.number(48n);
  
  expect(lagrangePoint.isStable()).toBe(true);
  expect(lagrangePoint.resonance).toBeCloseTo(1.0);
});

// Bad: Testing hard-coded values
test('field 3 equals golden ratio', () => {
  expect(FIELDS[3]).toBe(1.618033988749895);
});
```

### Test Coverage

- Aim for high coverage but prioritize meaningful tests
- Test edge cases and boundary conditions
- Test emergent behaviors and invariants
- Use property-based testing where appropriate

## Documentation

### Code Documentation

Use JSDoc for public APIs:

```typescript
/**
 * Computes the resonance value for a number by multiplying
 * the constants of its active fields.
 * 
 * @param n - The number to analyze
 * @returns The resonance value (computational mass/energy)
 * 
 * @example
 * const resonance = computeResonance(7n);
 * // Returns ~2.975 (product of fields I, T, and φ)
 */
export function computeResonance(n: bigint): number {
  // Implementation
}
```

### Architecture Documentation

When adding new concepts:
1. Update the relevant layer documentation in `docs/layers/`
2. Add examples to `docs/examples/`
3. Update the API reference if adding public APIs

## Questions and Discussions

- Use GitHub Issues for bug reports and feature requests
- Use GitHub Discussions for questions and ideas
- Join our Discord for real-time discussion (link in README)

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- The contributors graph

## License

By contributing, you agree that your contributions will be licensed under the project's MIT license.

---

Thank you for helping reveal the living mathematics of the universe!