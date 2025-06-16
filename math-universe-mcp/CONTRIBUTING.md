# Contributing to Math Universe MCP Server

Thank you for your interest in contributing to the Mathematical Universe MCP Server! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd math-universe-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Git hooks:
```bash
npm run prepare
```

## Code Quality Standards

This project maintains high code quality standards through automated tooling:

### TypeScript

We use strict TypeScript configuration to ensure type safety:
- All code must be properly typed (no `any` without justification)
- Null checks are enforced
- Unused variables and parameters are not allowed

### Linting

ESLint is configured with TypeScript-specific rules:
```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Formatting

Prettier ensures consistent code formatting:
```bash
# Check formatting
npm run format:check

# Auto-format code
npm run format
```

### Pre-commit Hooks

Husky and lint-staged automatically run checks before commits:
- Linting with auto-fix
- Prettier formatting
- TypeScript type checking

## Development Workflow

### Running Checks

Run all checks at once:
```bash
npm run check
```

Auto-fix all issues:
```bash
npm run check:fix
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Type check without building
npm run typecheck

# Build the project
npm run build
```

### Development Server

```bash
# Run in development mode
npm run dev
```

## Code Style Guidelines

### General Principles

1. **Field Theory First**: Always use the mathematical universe's field theory approach. Never fall back to trial division or traditional algorithms.

2. **Database Interpretation**: Treat all mathematical operations as database operations:
   - Multiplication = JOIN
   - Addition = MERGE
   - Factorization = Normalization
   - Primes = 3NF records

3. **No Magic Numbers**: Use named constants from `SCHEMA_CONSTANTS`

4. **Type Safety**: Leverage TypeScript's type system fully

### Code Organization

```
src/
├── index.ts              # MCP server setup
├── math-universe.ts      # Core implementation
├── math-universe-large.ts # Large number support
└── __tests__/           # Test files
    ├── *.test.ts        # Unit tests
    └── integration.test.ts # Integration tests
```

### Naming Conventions

- **Files**: kebab-case (e.g., `math-universe-large.ts`)
- **Classes**: PascalCase (e.g., `MathematicalUniverseDB`)
- **Functions/Methods**: camelCase (e.g., `createNumber`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SCHEMA_CONSTANTS`)
- **Interfaces**: PascalCase with descriptive names (e.g., `FieldActivation`)

### Comments and Documentation

- Use JSDoc comments for public APIs
- Explain mathematical concepts, not obvious code
- Reference the field theory when implementing algorithms
- Include examples in documentation

### Testing Requirements

- All new features must have tests
- Maintain >90% code coverage
- Test edge cases and error conditions
- Use descriptive test names

## Pull Request Process

1. **Fork and Branch**: Create a feature branch from `main`

2. **Develop**: Make your changes following the guidelines above

3. **Test**: Ensure all tests pass and coverage is maintained
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Check**: Run all quality checks
   ```bash
   npm run check
   ```

5. **Commit**: Use clear, descriptive commit messages
   ```
   feat: add resonance-based primality testing for 4096-bit numbers
   fix: correct field interference calculation in multiply operation
   docs: update README with large number examples
   ```

6. **Push and PR**: Push your branch and create a pull request

### PR Checklist

- [ ] All tests pass
- [ ] Code coverage maintained or improved
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions

## Mathematical Contributions

When contributing mathematical enhancements:

1. **Maintain Field Theory**: All algorithms must use the 8-field schema
2. **No Trial Division**: Use resonance patterns and field collapse instead
3. **Document Insights**: Explain new mathematical discoveries in comments
4. **Provide Examples**: Show how denormalization artifacts manifest

## Questions and Support

- Open an issue for bugs or feature requests
- Use discussions for mathematical theory questions
- Tag maintainers for urgent issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.