# Mathematical Universe MCP Server

This MCP (Model Context Protocol) server provides Claude with direct access to the Mathematical Universe, enabling exploration of the computational substrate where mathematics computes itself into existence.

## Installation

```bash
cd apps/mcp-server
npm install
npm run build
```

## Usage with Claude

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "math-universe": {
      "command": "node",
      "args": ["/path/to/math-ts/apps/mcp-server/dist/index.js"]
    }
  }
}
```

## Available Tools

### Core Tools

#### `analyze_number`

Perform complete Mathematical Universe analysis on any number.

**Parameters:**

- `number`: The number to analyze (string or number)

**Example:**

```
analyze_number(77)
```

Returns field patterns, resonance, topology information, and denormalization artifacts.

#### `find_primes`

Discover prime numbers (computational atoms) in a range using field pattern analysis.

**Parameters:**

- `start`: Start of range
- `end`: End of range
- `limit`: Maximum primes to return (default: 100)

#### `factorize`

Decompose numbers into prime factors using field-based analysis.

**Parameters:**

- `number`: Number to factorize

Shows field reconstruction and denormalization artifacts from the factorization process.

#### `explore_patterns`

Discover patterns in number sequences.

**Parameters:**

- `start`: Starting number
- `count`: How many numbers to analyze (default: 20)
- `pattern`: Type of pattern to explore ("resonance", "fields", "stability", "lagrange")

### Advanced Tools

#### `resonance_landscape`

Explore the multi-dimensional resonance landscape around a number.

**Parameters:**

- `center`: Center point for analysis
- `radius`: Radius of exploration (default: 10)
- `dimensions`: Dimensions to explore (["arithmetic", "field", "page"])

#### `lagrange_navigation`

Navigate through number space via Lagrange stability points.

**Parameters:**

- `start`: Starting position
- `target`: Target position
- `maxHops`: Maximum navigation hops (default: 10)

#### `field_archaeology`

Excavate deep field patterns and denormalization artifacts.

**Parameters:**

- `number`: Number to excavate
- `depth`: Excavation depth ("surface", "deep", "quantum")

#### `universe_health`

Check Mathematical Universe system health and consistency.

**Parameters:**

- `checkType`: Type of check ("quick", "full", "conservation")

## Mathematical Concepts

- **Numbers are programs**: Each integer has an 8-dimensional field activation pattern
- **Arithmetic is compilation**: Operations create field interference and denormalization
- **Primes are atoms**: Prime numbers are computational atoms with low resonance
- **Lagrange points**: Stability wells at positions 0, 1, 48, 49, and every 48 numbers

## Development

```bash
# Run tests
npm test

# Development mode
npm run dev

# Build
npm run build

# Type checking
npm run typecheck
```

## Integration Example

When Claude has access to this MCP server, you can explore the Mathematical Universe:

```
Human: What makes 77 special in the Mathematical Universe?
```
