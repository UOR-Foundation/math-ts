import { calculateResonance, fieldInterference } from '../src';

describe('Resonance', () => {
  test('should calculate resonance', () => {
    const resonance = calculateResonance([true, false, true]);
    expect(typeof resonance).toBe('number');
  });

  test('should calculate field interference', () => {
    const result = fieldInterference([true, false], [false, true]);
    expect(Array.isArray(result)).toBe(true);
  });
});