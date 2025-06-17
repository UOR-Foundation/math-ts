#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Spawn the MCP server
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create readline interface for server output
const rl = createInterface({
  input: server.stdout,
  crlfDelay: Infinity
});

// Track request ID
let requestId = 1;

// Handle server responses
rl.on('line', (line) => {
  try {
    const response = JSON.parse(line);
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (e) {
    // Not JSON, might be a log message
    console.log('Server output:', line);
  }
});

// Handle server errors
server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

// Helper to send request
function sendRequest(method, params) {
  const request = {
    jsonrpc: '2.0',
    id: requestId++,
    method,
    params
  };
  console.log('\nSending request:', JSON.stringify(request, null, 2));
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Test sequence
async function runTests() {
  console.log('Starting MCP server tests...\n');

  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: Analyze number 77 (the famous example)
  console.log('\n=== Test 1: Analyze number 77 ===');
  sendRequest('tools/call', {
    name: 'analyze-number',
    arguments: { value: 77 }
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: Normalize (factorize) 77
  console.log('\n=== Test 2: Normalize number 77 ===');
  sendRequest('tools/call', {
    name: 'normalize-number',
    arguments: { value: 77 }
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 3: Search for numbers with perfect resonance
  console.log('\n=== Test 3: Search for perfect resonance (near 1.0) ===');
  sendRequest('tools/call', {
    name: 'search-patterns',
    arguments: {
      resonance_min: 0.99,
      resonance_max: 1.01,
      page_start: 0,
      page_end: 2
    }
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 4: Analyze large number
  console.log('\n=== Test 4: Analyze large number ===');
  sendRequest('tools/call', {
    name: 'analyze-number',
    arguments: { value: '999999999999999999999999999989' }
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 5: Get schema fields resource
  console.log('\n=== Test 5: Get schema fields ===');
  sendRequest('resources/read', {
    uri: 'math://schema/fields'
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 6: List primes
  console.log('\n=== Test 6: List primes ===');
  sendRequest('tools/call', {
    name: 'list-primes',
    arguments: { page: 0, limit: 10 }
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Close the server
  console.log('\n\nTests completed. Closing server...');
  server.kill();
  process.exit(0);
}

// Run tests
runTests().catch(console.error);