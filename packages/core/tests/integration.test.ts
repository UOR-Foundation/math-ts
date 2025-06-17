import { MathematicalUniverse } from '../src';

describe('Mathematical Universe Integration', () => {
  test('should create universe and analyze numbers', () => {
    const universe = new MathematicalUniverse();
    const result = universe.number(7n);
    
    expect(result).toBeDefined();
    expect(result.value).toBe(7n);
  });
});