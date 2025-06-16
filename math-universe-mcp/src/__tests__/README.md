# Mathematical Universe Test Suite

Comprehensive test coverage for the Mathematical Universe MCP server implementation.

## Test Structure

### 1. `math-universe.test.ts`
Core functionality tests for the Mathematical Universe Database:
- Field activation patterns
- Resonance calculations
- Page system
- Primality testing
- Normalization (factorization)
- Database operations
- Pattern searching
- Schema validation

### 2. `math-universe-large.test.ts`
Tests for large number support (up to 2048-bit):
- Field harmonics analysis
- Probabilistic primality testing
- Field collapse factorization
- Resonance-based factorization
- Integration with field theory

### 3. `mcp-server.test.ts`
MCP server integration tests:
- Tool registration and validation
- Input schema validation
- Resource endpoints
- Prompt generation
- Large number support in tools

### 4. `integration.test.ts`
End-to-end integration tests demonstrating:
- Field interference in multiplication (77 = 7 × 11)
- Perfect resonance at 48
- Page structure properties
- Prime distribution patterns
- Database operations (JOIN/MERGE)
- Mathematical universe principles

### 5. `edge-cases.test.ts`
Edge cases and error handling:
- Boundary values (0, 1, MAX_SAFE_INTEGER, 255)
- Special mathematical constants
- Powers of 2 and Fibonacci numbers
- Empty search results
- Performance considerations
- Type safety validation

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test math-universe.test.ts

# Run tests in watch mode
npm test -- --watch

# Run with verbose output
npm test -- --verbose
```

## Test Coverage Goals

The test suite aims for:
- **100% coverage** of core mathematical operations
- **95%+ coverage** of field analysis and resonance calculations
- **90%+ coverage** of large number support
- **Full coverage** of all edge cases and error conditions

## Key Test Scenarios

### 1. Field Interference
Tests demonstrate that multiplication creates denormalization artifacts:
```
77 = 7 × 11
- 7 has fields {I, T, φ}
- 11 has fields {I, T, ½}
- 77 has fields {I, φ, ½, θ}
- Field T disappeared, field θ appeared!
```

### 2. Perfect Resonance
Number 48 demonstrates perfect field resonance:
```
48 has fields 4 and 5 active
1/(2π) × 2π = 1.0 exactly
This creates the 48-number page structure
```

### 3. Large Number Primality
Tests probabilistic primality without trial division:
- Field harmonic analysis
- Resonance signature uniqueness
- Decoherence pattern detection

### 4. Database Normalization
Every factorization is a database normalization:
- Composites are denormalized records
- Primes are normalized (3NF)
- Field reconciliation shows artifacts

## Performance Benchmarks

Expected performance targets:
- Create number: < 1ms
- Normalize small number: < 5ms
- Page analysis: < 50ms
- Large number primality: < 100ms
- Pattern search (100 pages): < 200ms

## Contributing Tests

When adding new features:
1. Add unit tests to the appropriate test file
2. Add integration tests showing feature interaction
3. Include edge cases and error scenarios
4. Update this README with new test scenarios
5. Ensure tests are deterministic and fast