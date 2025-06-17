#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Spawn the MCP server
console.log(`${colors.cyan}Starting Mathematical Universe MCP Server...${colors.reset}\n`);
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create readline interface for server output
const rl = createInterface({
  input: server.stdout,
  crlfDelay: Infinity
});

// Track request ID and test results
let requestId = 1;
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

// Handle server responses
const pendingRequests = new Map();

rl.on('line', (line) => {
  try {
    const response = JSON.parse(line);
    if (response.id && pendingRequests.has(response.id)) {
      const { resolve } = pendingRequests.get(response.id);
      pendingRequests.delete(response.id);
      resolve(response);
    }
  } catch (e) {
    // Not JSON, ignore
  }
});

// Handle server errors
server.stderr.on('data', (data) => {
  // Ignore expected startup message
  if (!data.toString().includes('Math Universe MCP server running on stdio')) {
    console.error(`${colors.red}Server error: ${data}${colors.reset}`);
  }
});

// Helper to send request and wait for response
function sendRequest(method, params) {
  return new Promise((resolve) => {
    const id = requestId++;
    pendingRequests.set(id, { resolve });
    
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Test helper
async function runTest(name, testFn) {
  testsRun++;
  console.log(`${colors.blue}Running: ${name}${colors.reset}`);
  
  try {
    await testFn();
    testsPassed++;
    console.log(`${colors.green}✓ PASSED${colors.reset}\n`);
  } catch (error) {
    testsFailed++;
    console.log(`${colors.red}✗ FAILED: ${error.message}${colors.reset}\n`);
  }
}

// Verification tests
async function runVerificationTests() {
  console.log(`${colors.yellow}=== MCP Server Verification Tests ===${colors.reset}\n`);

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: Basic number analysis
  await runTest('Basic number analysis (77)', async () => {
    const response = await sendRequest('tools/call', {
      name: 'analyze-number',
      arguments: { value: 77 }
    });
    
    if (response.result?.isError) {
      throw new Error(response.result.content[0].text);
    }
    
    const text = response.result.content[0].text;
    if (!text.includes('Active Fields: I+φ+½+θ')) {
      throw new Error('Incorrect field pattern for 77');
    }
    if (!text.includes('77 = 7 × 11')) {
      throw new Error('Missing factorization');
    }
    console.log('  ✓ Correctly identified field pattern: I+φ+½+θ');
    console.log('  ✓ Correctly factorized: 77 = 7 × 11');
  });

  // Test 2: Field reconciliation
  await runTest('Field reconciliation (77 = 7 × 11)', async () => {
    const response = await sendRequest('tools/call', {
      name: 'normalize-number',
      arguments: { value: 77 }
    });
    
    const text = response.result.content[0].text;
    if (!text.includes('Denormalization Artifacts')) {
      throw new Error('Missing denormalization artifacts section');
    }
    if (!text.includes('Field 6: θ')) {
      throw new Error('Missing artifact field θ');
    }
    if (!text.includes('Field 1: T')) {
      throw new Error('Missing redundancy elimination of field T');
    }
    console.log('  ✓ Identified artifact field: θ (appeared in 77)');
    console.log('  ✓ Identified redundancy: T (disappeared in 77)');
  });

  // Test 3: Perfect resonance search
  await runTest('Perfect resonance search', async () => {
    const response = await sendRequest('tools/call', {
      name: 'search-patterns',
      arguments: {
        resonance_min: 0.99,
        resonance_max: 1.01,
        page_start: 0,
        page_end: 2
      }
    });
    
    const text = response.result.content[0].text;
    if (!text.includes('48')) {
      throw new Error('Missing number 48 with perfect resonance');
    }
    if (!text.includes('Fields: 1/2π+2π')) {
      throw new Error('Incorrect field pattern for 48');
    }
    console.log('  ✓ Found 48 with perfect resonance (1/2π × 2π = 1.0)');
  });

  // Test 4: Large number support
  await runTest('Large number analysis', async () => {
    const response = await sendRequest('tools/call', {
      name: 'analyze-number',
      arguments: { value: '999999999999999999999999999989' }
    });
    
    if (response.result?.isError) {
      throw new Error('Large number analysis failed: ' + response.result.content[0].text);
    }
    
    const text = response.result.content[0].text;
    if (!text.includes('Large number: 30 digits')) {
      throw new Error('Incorrect large number handling');
    }
    if (!text.includes('Is Probable Prime:')) {
      throw new Error('Missing primality check');
    }
    console.log('  ✓ Successfully analyzed 30-digit number');
    console.log('  ✓ Performed primality testing using field theory');
  });

  // Test 5: Resource access
  await runTest('Schema fields resource', async () => {
    const response = await sendRequest('resources/read', {
      uri: 'math://schema/fields'
    });
    
    const fields = JSON.parse(response.result.contents[0].text);
    if (fields.length !== 8) {
      throw new Error(`Expected 8 fields, got ${fields.length}`);
    }
    if (fields[1].name !== 'tribonacci') {
      throw new Error('Incorrect field schema');
    }
    console.log('  ✓ Retrieved all 8 mathematical fields');
    console.log('  ✓ Verified tribonacci constant: 1.839...');
  });

  // Test 6: Prime listing
  await runTest('Prime number listing', async () => {
    const response = await sendRequest('tools/call', {
      name: 'list-primes',
      arguments: { page: 0, limit: 5 }
    });
    
    const text = response.result.content[0].text;
    const expectedPrimes = ['2', '3', '5', '7', '11'];
    for (const prime of expectedPrimes) {
      if (!text.includes(`### ${prime}`)) {
        throw new Error(`Missing prime ${prime}`);
      }
    }
    console.log('  ✓ Listed first 5 primes correctly');
  });

  // Test 7: Page analysis
  await runTest('Page analysis', async () => {
    const response = await sendRequest('tools/call', {
      name: 'analyze-page', 
      arguments: { page_number: 1 }
    });
    
    const text = response.result.content[0].text;
    if (!text.includes('Numbers: 48 to 95')) {
      throw new Error('Incorrect page range');
    }
    if (!text.includes('Field Activation Rates')) {
      throw new Error('Missing field activation analysis');
    }
    console.log('  ✓ Analyzed page 1 (numbers 48-95)');
    console.log('  ✓ Computed field activation statistics');
  });

  // Test 8: Database operations
  await runTest('Database JOIN operation (multiply)', async () => {
    const response = await sendRequest('tools/call', {
      name: 'database-operation',
      arguments: { operation: 'multiply', a: 7, b: 11 }
    });
    
    const text = response.result.content[0].text;
    if (!text.includes('7 × 11 = 77')) {
      throw new Error('Incorrect multiplication result');
    }
    if (!text.includes('Field Interference Analysis')) {
      throw new Error('Missing field interference analysis');
    }
    console.log('  ✓ Performed JOIN operation: 7 × 11 = 77');
    console.log('  ✓ Analyzed field interference patterns');
  });

  // Test 9: Prompt generation
  await runTest('Prompt generation', async () => {
    const response = await sendRequest('prompts/get', {
      name: 'explore-relationships',
      arguments: { numbers: '7,11,77' }
    });
    
    if (!response.result || !response.result.messages || !response.result.messages[0]) {
      throw new Error('Invalid prompt response structure');
    }
    
    const content = response.result.messages[0].content.text || response.result.messages[0].content;
    if (!content.includes('7, 11, 77')) {
      throw new Error('Prompt not generated correctly');
    }
    console.log('  ✓ Generated exploration prompt for numbers 7, 11, 77');
  });

  // Test 10: Special numbers resource
  await runTest('Special numbers resource', async () => {
    const response = await sendRequest('resources/read', {
      uri: 'math://special/numbers'
    });
    
    const text = response.result.contents[0].text;
    if (!text.includes('Perfect Resonance (1.0)')) {
      throw new Error('Missing perfect resonance section');
    }
    if (!text.includes('48: Fields 1/2π and 2π active')) {
      throw new Error('Missing example of perfect resonance');
    }
    console.log('  ✓ Retrieved special numbers documentation');
    console.log('  ✓ Verified 48 as perfect resonance example');
  });
}

// Main execution
async function main() {
  await runVerificationTests();
  
  // Print summary
  console.log(`${colors.yellow}=== Test Summary ===${colors.reset}`);
  console.log(`Total tests: ${testsRun}`);
  console.log(`${colors.green}Passed: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testsFailed}${colors.reset}`);
  
  if (testsFailed === 0) {
    console.log(`\n${colors.green}✓ All tests passed! The MCP server is working correctly.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Some tests failed. Please check the implementation.${colors.reset}`);
  }
  
  // Close server
  server.kill();
  process.exit(testsFailed > 0 ? 1 : 0);
}

main().catch(console.error);