# MCP Server Usage

The Mathematical Universe MCP Server has been successfully built!

## Running the Server

```bash
node dist/index.js
```

## Integration with Claude

Add this configuration to your Claude MCP settings:

```json
{
  "mcpServers": {
    "math-universe": {
      "command": "node",
      "args": ["/workspaces/math-ts/apps/mcp-server/dist/index.js"]
    }
  }
}
```

## Available Tools

The server provides these tools for Claude:

### Core Tools

- `analyze_number` - Complete mathematical universe analysis
- `find_primes` - Discover prime numbers using field patterns
- `factorize` - Decompose numbers with field analysis
- `explore_patterns` - Explore patterns in number sequences

### Advanced Tools

- `resonance_landscape` - Multi-dimensional resonance analysis
- `lagrange_navigation` - Navigate via stability points
- `field_archaeology` - Deep field pattern excavation
- `universe_health` - System consistency checks

## Example Usage in Claude

Once configured, you can ask Claude questions like:

- "What makes the number 77 special in the Mathematical Universe?"
- "Find prime numbers between 100 and 200"
- "Explore the resonance landscape around 48"
- "What are the field patterns of number 1000?"
