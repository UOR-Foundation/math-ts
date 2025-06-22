/**
 * Self-Reference Core Test Suite - Layer 7
 *
 * This file imports and runs all test suites for the self-reference package.
 * Individual test files focus on specific components:
 * - bootstrap.test.ts: Bootstrap paradox resolution
 * - fixed-points.test.ts: Fixed point discovery and analysis
 * - meta.test.ts: Gödel numbering and meta-reasoning
 * - integration.test.ts: Complete system integration
 */

// Import all test suites
import './bootstrap.test';
import './fixed-points.test';
import './meta.test';
import './integration.test';

describe('Self-Reference Core Test Suite', () => {
  it('should run all test suites', () => {
    // This test ensures all test files are imported and executed
    expect(true).toBe(true);
  });
});
