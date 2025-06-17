#!/bin/bash

# Mathematical Universe MCP Server Installation Script

echo "Installing Mathematical Universe MCP Server..."

# Build the TypeScript code
echo "Building TypeScript..."
npm run build

# Install globally
echo "Installing globally..."
npm link

echo ""
echo "✓ Installation complete!"
echo ""
echo "The math-universe-mcp server is now available globally."
echo ""
echo "To use with Claude Desktop, add this to your config:"
echo '  ~/Library/Application Support/Claude/claude_desktop_config.json'
echo ""
echo '  {
    "mcpServers": {
      "math-universe": {
        "command": "math-universe-mcp"
      }
    }
  }'
echo ""
echo "To use with npm/npx, run:"
echo "  npx math-universe-mcp"
echo ""
echo "To verify installation, run:"
echo "  node verify-mcp-server.js"