import { FIELD_COUNT, getFieldPattern } from '../src';

describe('Field Substrate', () => {
  test('should have 8 fields', () => {
    expect(FIELD_COUNT).toBe(8);
  });

  test('should get field pattern', () => {
    const pattern = getFieldPattern(7n);
    expect(Array.isArray(pattern)).toBe(true);
  });
});