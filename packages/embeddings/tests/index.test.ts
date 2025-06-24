import { getAllEmbeddings } from '../src';
import type { FieldPattern } from '../src/types';

describe('getAllEmbeddings', () => {
  it('should return all embedding coordinates', () => {
    const fieldPattern: FieldPattern = [true, false, true, false, false, false, false, false];
    const factors = [2n, 3n, 7n];

    const coords = getAllEmbeddings(42n, fieldPattern, factors);

    expect(coords.constitutional).toHaveLength(8);
    expect(coords.page).toHaveLength(48);
    expect(coords.gate).toHaveLength(256);
    expect(coords.layer).toHaveLength(3);
    expect(coords.relational).toHaveLength(2);
  });

  it('should work without relational embedding', () => {
    const coords = getAllEmbeddings(42n);

    expect(coords.constitutional).toBeDefined();
    expect(coords.page).toBeDefined();
    expect(coords.gate).toBeDefined();
    expect(coords.layer).toBeDefined();
    expect(coords.relational).toBeUndefined();
  });

  it('should handle edge cases', () => {
    // Zero
    const zero = getAllEmbeddings(0n);
    expect(zero.constitutional).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    expect(zero.page[0]).toBe(1); // One-hot at position 0
    expect(zero.layer[0]).toBe(0); // No field complexity

    // Large number
    const large = getAllEmbeddings(1000000n);
    expect(large.constitutional).toBeDefined();
    expect(large.page).toBeDefined();
    expect(large.gate).toBeDefined();
    expect(large.layer).toBeDefined();
  });
});
