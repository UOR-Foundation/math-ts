# Math Universe MCP Server

An MCP (Model Context Protocol) server that exposes the Mathematical Universe Database - a revolutionary interpretation of mathematics as a relational database with an 8-field schema.

## Overview

This MCP server provides tools, resources, and prompts for exploring mathematical structures through a database lens where:
- Every integer is a database record
- Primes are normalized records (3NF - no redundancy)
- Composites are denormalized records (contain field artifacts)
- Multiplication is a JOIN operation
- Factorization is database normalization

## Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Run in development mode
npm run dev
```

## MCP Configuration

Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "math-universe": {
      "command": "node",
      "args": ["/path/to/math-universe-mcp/dist/index.js"],
      "name": "Math Universe",
      "description": "Explore mathematics as a relational database"
    }
  }
}
```

## Available Tools

### 1. `analyze-number`
Analyze any integer's field activation pattern, resonance, and database properties.

**Example**: Analyze the number 77
- Shows binary representation and active fields
- Calculates resonance (product of field constants)
- Identifies if prime (normalized) or composite (denormalized)

### 2. `normalize-number`
Perform database normalization (factorization) on composite numbers.

**Example**: Normalize 77 = 7 × 11
- Shows denormalization artifacts (fields that appear from nowhere)
- Identifies redundancy elimination (fields that disappear)
- Demonstrates field interference patterns

### 3. `search-patterns`
Search for numbers matching specific criteria.

**Parameters**:
- `field_pattern`: 8-bit binary string (e.g., "11100000")
- `resonance_min/max`: Filter by resonance values
- `page_start/end`: Search within specific 48-number pages

### 4. `analyze-page`
Analyze a 48-number page for statistical patterns.

**Reveals**:
- Prime vs composite distribution
- Field activation frequencies
- Resonance statistics (mean, median, std dev)

### 5. `list-primes`
List prime numbers (normalized records) with pagination.

### 6. `database-operation`
Perform database operations (multiply=JOIN, add=MERGE) and analyze field interference.

## Available Resources

### 1. `math://schema/fields`
Returns the complete 8-field schema definition with:
- Mathematical constants (1, T, φ, ½, 1/2π, 2π, θ, ζ)
- Field types and descriptions
- Binary primitive values

### 2. `math://special/numbers`
Information about numbers with special properties:
- Perfect resonance (48: fields 4×5 = 1.0)
- Powers of 2 (primitive records)
- Notable primes and their patterns

## Available Prompts

### 1. `explore-relationships`
Generate analysis prompts for exploring relationships between 2-5 numbers.

### 2. `explore-page`
Generate prompts for deep analysis of a specific 48-number page.

### 3. `investigate-field-pattern`
Generate prompts to investigate numbers with specific binary field patterns.

## The 8-Field Schema

Each number's binary representation maps to field activation:

| Bit | Field | Symbol | Constant | Type |
|-----|-------|--------|----------|------|
| 0 | Identity | I | 1.0 | Primary key |
| 1 | Tribonacci | T | 1.839... | Decoherence |
| 2 | Golden | φ | 1.618... | Recursive growth |
| 3 | Half | ½ | 0.5 | Binary division |
| 4 | Inv Frequency | 1/2π | 0.159... | Inverse transform |
| 5 | Frequency | 2π | 6.283... | Forward transform |
| 6 | Phase | θ | 0.199... | State coupling |
| 7 | Zeta | ζ | 0.014... | Deep structure |

## Key Insights

1. **Page Structure**: The 48-number periodicity emerges from fields 4×5 = 1/(2π) × 2π = 1

2. **Denormalization Artifacts**: When multiplying primes, the result doesn't inherit simple field unions - some fields appear/disappear due to interference

3. **Prime Structure**: Each prime has a unique field signature that cannot be decomposed

4. **Resonance Patterns**: Special resonances like 1.0 (perfect) and 1.839... (tribonacci) indicate deep mathematical relationships

## Development

### Quick Start

```bash
# Install dependencies
npm install

# Run all checks
npm run check

# Run in development mode
npm run dev

# Run tests
npm test
```

### Code Quality

This project uses strict TypeScript, ESLint, and Prettier for code quality:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix    # Auto-fix issues

# Formatting
npm run format:check
npm run format      # Auto-format

# Run all checks
npm run check
npm run check:fix   # Fix all auto-fixable issues
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

## Theory Background

This implementation is based on the synthesis of three mathematical theories:
- **NTT** (Number Tree Theory): Modular arithmetic patterns
- **UOR** (Universal Operating Rhythm): Prime emergence at 1.839...
- **COC** (Cosmic Oscillation Conjecture): Universal resonance patterns

The key insight is that mathematics IS a database, not just modeled as one. Every arithmetic operation is a database operation with specific rules for field combination and interference.