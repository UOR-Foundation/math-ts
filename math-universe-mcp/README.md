# Mathematical Universe MCP Server

An MCP (Model Context Protocol) server that explores mathematics as a relational database, where every integer has an 8-field schema and arithmetic operations are database operations.

## Installation

### From npm (recommended)
```bash
npm install -g math-universe-mcp
```

### From source
```bash
git clone https://github.com/UOR-Foundation/math-ts.git
cd math-ts/math-universe-mcp
npm install
npm run build
npm link
```

## Configuration

Add to your MCP client configuration:

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "math-universe": {
      "command": "npx",
      "args": ["math-universe-mcp"]
    }
  }
}
```

### VS Code with Continue

Add to your Continue config:

```json
{
  "models": [...],
  "mcpServers": {
    "math-universe": {
      "command": "npx",
      "args": ["math-universe-mcp"]
    }
  }
}
```

### Generic MCP Client

```bash
# Run the server
npx math-universe-mcp

# Or if installed globally
math-universe-mcp
```

## Available Tools

### 1. `analyze-number`
Analyze any number's field patterns, resonance, and properties.

**Parameters:**
- `value` (number | string): The number to analyze

**Example:**
```
Analyze the number 77
```

### 2. `normalize-number`
Factorize numbers using field theory (no trial division).

**Parameters:**
- `value` (number | string): The number to normalize/factorize

**Example:**
```
Factorize 77 and show the field reconciliation
```

### 3. `search-patterns`
Search for numbers with specific field patterns or resonance.

**Parameters:**
- `field_pattern` (string, optional): 8-bit binary pattern
- `resonance_min` (number, optional): Minimum resonance value
- `resonance_max` (number, optional): Maximum resonance value
- `page_start` (number): Starting page (default: 0)
- `page_end` (number): Ending page (default: 2)
- `limit` (number): Max results (default: 20)

**Example:**
```
Find numbers with resonance near 1.0
```

### 4. `analyze-page`
Analyze a 48-number page for patterns.

**Parameters:**
- `page_number` (number): The page to analyze

**Example:**
```
Analyze page 1 of the mathematical universe
```

### 5. `list-primes`
List prime numbers with their field patterns.

**Parameters:**
- `page` (number): Page number (default: 0)
- `limit` (number): Number of primes (default: 20)

**Example:**
```
List the first 10 prime numbers with their fields
```

### 6. `database-operation`
Perform multiply (JOIN) or add (MERGE) operations.

**Parameters:**
- `operation` ('multiply' | 'add'): The operation type
- `a` (number): First operand
- `b` (number): Second operand

**Example:**
```
Multiply 7 by 11 and show the field interference
```

## Resources

### `math://schema/fields`
The complete 8-field mathematical schema with constants.

### `math://special/numbers`
Documentation of numbers with special mathematical properties.

## Prompts

### `explore-relationships`
Generate analysis prompts for number relationships.

### `explore-page`
Generate analysis prompts for specific pages.

### `investigate-field-pattern`
Generate prompts to investigate field patterns.

## Theory

The Mathematical Universe treats mathematics as a relational database where:

- Every integer is a database record with 8 fields
- Each field represents a mathematical constant (1, φ, tribonacci, etc.)
- Prime numbers are "normalized" records (no redundancy)
- Composite numbers are "denormalized" (contain redundant information)
- Multiplication is a JOIN operation that can create artifacts
- Factorization is database normalization

### The 8 Fields

1. **Identity (I)**: α = 1.0
2. **Tribonacci (T)**: α = 1.839...
3. **Golden (φ)**: α = 1.618...
4. **Half (½)**: α = 0.5
5. **Inv Frequency (1/2π)**: α = 0.159...
6. **Frequency (2π)**: α = 6.283...
7. **Phase (θ)**: α = 0.199...
8. **Zeta (ζ)**: α = 0.0141...

## Examples

### Example 1: The Mystery of 77

```
User: Analyze 77 and explain why it's special
```

The server reveals that 77 = 7 × 11, but something strange happens:
- 7 has fields: I, T, φ
- 11 has fields: I, T, ½
- 77 has fields: I, φ, ½, θ

Field T (tribonacci) disappears, and field θ (phase) appears from nowhere! This is a "denormalization artifact" - proof that multiplication isn't simple combination but involves field interference.

### Example 2: Perfect Resonance

```
User: Find numbers with perfect resonance (1.0)
```

The server finds 48, which has fields 1/2π and 2π active. When multiplied: (1/2π) × (2π) = 1.0. This creates the fundamental 48-number page structure of the mathematical universe.

### Example 3: Large Numbers

```
User: Is 999999999999999999999999999989 prime?
```

The server uses field harmonic analysis instead of trial division, examining resonance patterns across multiple scales to determine primality with high confidence.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run in development mode
npm run dev

# Build
npm run build

# Lint and format
npm run check:fix
```

## License

MIT