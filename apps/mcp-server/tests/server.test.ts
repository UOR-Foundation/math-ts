import { describe, test, expect } from '@jest/globals';

describe('MCP Server', () => {
  test('should have correct configuration', () => {
    // Test that the package.json is properly configured
    const pkg = require('../package.json');
    expect(pkg.name).toBe('@uor-foundation/mcp-server');
    expect(pkg.dependencies['@modelcontextprotocol/sdk']).toBeDefined();
    expect(pkg.dependencies['@uor-foundation/math-ts-core']).toBeDefined();
  });

  test('should have MCP server entry point', () => {
    // Test that the main entry point exists
    const fs = require('fs');
    const path = require('path');
    const entryPoint = path.join(__dirname, '../dist/index.js');

    // After build, the file should exist
    if (fs.existsSync(entryPoint)) {
      expect(fs.existsSync(entryPoint)).toBe(true);
    } else {
      // Before build, at least the source should exist
      const sourceFile = path.join(__dirname, '../src/index.ts');
      expect(fs.existsSync(sourceFile)).toBe(true);
    }
  });
});
