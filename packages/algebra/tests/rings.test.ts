import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import type { PageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import { RingDetector } from '../src';

describe('RingDetector', () => {
  let substrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;
  let ringDetector: RingDetector;

  beforeEach(() => {
    substrate = createFieldSubstrate();
    resonance = createResonanceDynamics(substrate);
    topology = createPageTopology(substrate, resonance);
    operators = createArithmeticOperators(substrate, resonance, topology);
    ringDetector = new RingDetector(substrate, resonance, topology, operators);
  });

  test('should detect ring structure of integers', () => {
    // In the Mathematical Universe, we work with finite subsets
    // Test a small subset that forms a ring under modular arithmetic
    const numbers = [0n, 1n, 2n, 3n, 4n, 5n];
    const ring = ringDetector.detectRingStructure(numbers);

    expect(ring).not.toBeNull();
    expect(ring!.additiveIdentity).toBe(0n);
    expect(ring!.multiplicativeIdentity).toBe(1n);
    expect(ring!.isCommutative).toBe(true);
    expect(ring!.hasUnity).toBe(true);
    // Z/6Z has zero divisors (2*3=0), so not an integral domain
    expect(ring!.isIntegralDomain).toBe(false);
    expect(ring!.isField).toBe(false);
  });

  test('should detect ideals', () => {
    // Use a proper ring Z/8Z
    const numbers = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n];
    const ring = ringDetector.detectRingStructure(numbers);

    expect(ring).not.toBeNull();
    const ideals = ring!.ideals;

    expect(ideals.length).toBeGreaterThan(0);

    // Should have zero ideal
    const zeroIdeal = ideals.find((i) => i.elements.size === 1 && i.elements.has(0n));
    expect(zeroIdeal).toBeDefined();

    // Should have the whole ring as an ideal
    const wholeIdeal = ideals.find((i) => i.elements.size === ring!.elements.size);
    expect(wholeIdeal).toBeDefined();
  });

  test('should detect artifact-based ideals', () => {
    // Use a finite ring where we can test denormalization
    const numbers = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n];
    const ring = ringDetector.detectRingStructure(numbers);

    expect(ring).not.toBeNull();

    // In Z/12Z, we have various ideals
    const ideals = ring!.ideals;
    expect(ideals.length).toBeGreaterThan(2); // More than just {0} and the whole ring

    // Should have principal ideals like (2), (3), (4), (6)
    const principalIdeals = ideals.filter(
      (i) => i.isPrincipal && i.elements.size > 1 && i.elements.size < ring!.elements.size,
    );
    expect(principalIdeals.length).toBeGreaterThan(0);
  });

  test('should analyze ring homomorphisms', () => {
    const domain = ringDetector.detectRingStructure([0n, 1n, 2n, 3n]);
    const codomain = ringDetector.detectRingStructure([0n, 1n]);

    expect(domain).not.toBeNull();
    expect(codomain).not.toBeNull();

    if (domain && codomain) {
      // Map that sends even to 0, odd to 1
      const map = (n: bigint): bigint => n % 2n;

      const homomorphism = ringDetector.analyzeRingHomomorphism(domain, codomain, map);

      expect(homomorphism.kernel.elements.has(0n)).toBe(true);
      expect(homomorphism.kernel.elements.has(2n)).toBe(true);
      expect(homomorphism.image.has(0n)).toBe(true);
      expect(homomorphism.image.has(1n)).toBe(true);
      expect(homomorphism.isInjective).toBe(false);
      expect(homomorphism.isSurjective).toBe(true);
    }
  });

  test('should detect quotient rings', () => {
    const ring = ringDetector.detectRingStructure([0n, 1n, 2n, 3n, 4n, 5n]);

    expect(ring).not.toBeNull();

    if (ring) {
      const ideal = ring.ideals.find((i) => i.generators.includes(2n));

      if (ideal) {
        const quotient = ringDetector.detectQuotientRing(ring, ideal);
        expect(quotient).not.toBeNull();
        expect(quotient!.elements.size).toBeLessThan(ring.elements.size);
      }
    }
  });

  test('should handle empty input', () => {
    const ring = ringDetector.detectRingStructure([]);
    expect(ring).toBeNull();
  });

  test('should detect field property correctly', () => {
    // Z/2Z forms a field
    const numbers1 = [0n, 1n];
    const ring1 = ringDetector.detectRingStructure(numbers1);
    expect(ring1).not.toBeNull();
    expect(ring1!.isField).toBe(true);

    // Z/3Z also forms a field
    const numbers2 = [0n, 1n, 2n];
    const ring2 = ringDetector.detectRingStructure(numbers2);
    expect(ring2).not.toBeNull();
    expect(ring2!.isField).toBe(true);

    // Z/4Z is not a field (2 has no multiplicative inverse)
    const numbers3 = [0n, 1n, 2n, 3n];
    const ring3 = ringDetector.detectRingStructure(numbers3);
    expect(ring3).not.toBeNull();
    expect(ring3!.isField).toBe(false);

    // Z/5Z is a field (prime)
    const numbers4 = [0n, 1n, 2n, 3n, 4n];
    const ring4 = ringDetector.detectRingStructure(numbers4);
    expect(ring4).not.toBeNull();
    expect(ring4!.isField).toBe(true);
  });
});
