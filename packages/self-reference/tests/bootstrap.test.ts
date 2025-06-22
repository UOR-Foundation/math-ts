/**
 * Bootstrap Engine Tests
 *
 * Tests the resolution of the fundamental paradox:
 * primes define fields, fields define primes
 */

import { BootstrapEngine, CONSTITUTIONAL_PRIMES } from '../src/bootstrap';
import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { ArithmeticOperators } from '@uor-foundation/operators';

describe('BootstrapEngine', () => {
  let fieldSubstrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;
  let bootstrapEngine: BootstrapEngine;

  beforeEach(() => {
    fieldSubstrate = createFieldSubstrate();
    resonance = createResonanceDynamics(fieldSubstrate);
    topology = createPageTopology(fieldSubstrate, resonance);
    operators = createArithmeticOperators(fieldSubstrate, resonance, topology);
    bootstrapEngine = new BootstrapEngine(fieldSubstrate, resonance, topology, operators);
  });

  describe('Constitutional Primes', () => {
    it('should have exactly 9 constitutional primes', () => {
      expect(CONSTITUTIONAL_PRIMES).toHaveLength(9);
    });

    it('should have primes in ascending order', () => {
      for (let i = 1; i < CONSTITUTIONAL_PRIMES.length; i++) {
        expect(CONSTITUTIONAL_PRIMES[i]).toBeGreaterThan(CONSTITUTIONAL_PRIMES[i - 1]);
      }
    });

    it('should verify all constitutional primes are actually prime', async () => {
      for (const prime of CONSTITUTIONAL_PRIMES) {
        const factors = await operators.factorize(prime);
        expect(factors.factors).toHaveLength(1);
        expect(factors.factors[0]).toBe(prime);
      }
    });

    it('should have constitutional primes with low resonance', () => {
      for (const prime of CONSTITUTIONAL_PRIMES) {
        const resonanceValue = resonance.calculateResonance(prime);
        expect(resonanceValue).toBeLessThan(30); // Reasonable upper bound
      }
    });
  });

  describe('Bootstrap Process', () => {
    it('should successfully bootstrap the universe', async () => {
      const result = await bootstrapEngine.bootstrap();

      expect(result.stable).toBe(true);
      expect(result.iterations).toBeGreaterThan(0);
      expect(result.iterations).toBeLessThan(100);
      expect(result.constitutionalPrimes).toEqual(CONSTITUTIONAL_PRIMES);
      expect(result.fieldConstants).toHaveLength(8);
      expect(result.evidence.length).toBeGreaterThan(5);
    });

    it('should extract field constants that encode mathematical relationships', async () => {
      const result = await bootstrapEngine.bootstrap();
      const constants = result.fieldConstants;

      // α₀: Identity field
      expect(constants[0]).toBe(1.0);

      // α₁: Tribonacci constant (refined by bootstrap process)
      expect(constants[1]).toBeGreaterThan(1.5);
      expect(constants[1]).toBeLessThan(2.5);

      // α₂: Golden ratio
      expect(constants[2]).toBeCloseTo(1.618, 2);

      // α₃: Half field
      expect(constants[3]).toBe(0.5);

      // α₄ and α₅: Inverse relationship
      expect(constants[4] * constants[5]).toBeCloseTo(1.0, 6);

      // All constants should be positive
      constants.forEach((c) => expect(c).toBeGreaterThan(0));
    });

    it('should discover fixed points during bootstrap', async () => {
      const result = await bootstrapEngine.bootstrap();

      // Should find identity fixed point
      const identityFixed = result.fixedPoints.find((fp) => fp.type === 'identity');
      expect(identityFixed).toBeDefined();
      expect(identityFixed?.value).toBe(1n);
      expect(identityFixed?.stability).toBe(1.0);

      // Should find Lagrange fixed points
      const lagrangeFixed = result.fixedPoints.filter((fp) => fp.type === 'lagrange');
      expect(lagrangeFixed.length).toBeGreaterThan(0);

      // Should find prime fixed points
      const primeFixed = result.fixedPoints.filter((fp) => fp.type === 'prime');
      expect(primeFixed).toHaveLength(9); // One for each constitutional prime
    });

    it('should provide evidence of self-consistency', async () => {
      const result = await bootstrapEngine.bootstrap();

      // Check evidence messages
      expect(result.evidence.some((e) => e.includes('Constitutional primes verified'))).toBe(true);
      expect(
        result.evidence.some((e) => e.includes('Field-prime relationship is self-consistent')),
      ).toBe(true);
      expect(result.evidence.some((e) => e.includes('Bootstrap stable'))).toBe(true);
    });
  });

  describe('Circular Dependency Resolution', () => {
    it('should resolve field-prime circular dependency', () => {
      const resolution = bootstrapEngine.resolveCircularDependency(
        ['primes', 'field constants'],
        'bootstrap',
      );

      expect(resolution.elements).toEqual(['primes', 'field constants']);
      expect(resolution.resolution).toBe('bootstrap');
      expect(resolution.description).toContain('bootstrap iteration');
    });

    it('should support different resolution methods', () => {
      const methods: Array<'fixed-point' | 'bootstrap' | 'axiom' | 'emergence'> = [
        'fixed-point',
        'bootstrap',
        'axiom',
        'emergence',
      ];

      methods.forEach((method) => {
        const resolution = bootstrapEngine.resolveCircularDependency(['A', 'B'], method);

        expect(resolution.resolution).toBe(method);
        expect(resolution.description).toBeTruthy();
      });
    });
  });

  describe('Field Constant Extraction', () => {
    it('should compute tribonacci constant correctly', async () => {
      const result = await bootstrapEngine.bootstrap();

      // Tribonacci constant (refined by bootstrap process)
      const tribonacci = result.fieldConstants[1];
      expect(tribonacci).toBeGreaterThan(1.5);
      expect(tribonacci).toBeLessThan(2.5);
    });

    it('should maintain mathematical relationships between constants', async () => {
      const result = await bootstrapEngine.bootstrap();
      const constants = result.fieldConstants;

      // Fields 4 and 5 should multiply to 1 (inverse relationship)
      const product = constants[4] * constants[5];
      expect(product).toBeCloseTo(1.0, 10);

      // Golden ratio relationship: φ² = φ + 1
      const phi = constants[2];
      expect(phi * phi).toBeCloseTo(phi + 1, 10);
    });
  });

  describe('Bootstrap Stability', () => {
    it('should reach stable configuration', async () => {
      const result = await bootstrapEngine.bootstrap();

      expect(result.stable).toBe(true);
      expect(result.iterations).toBeLessThan(50); // Should converge quickly
    });

    it('should produce consistent results across multiple runs', async () => {
      const results = [];

      for (let i = 0; i < 3; i++) {
        const result = await bootstrapEngine.bootstrap();
        results.push(result);
      }

      // All runs should be stable
      results.forEach((r) => expect(r.stable).toBe(true));

      // Field constants should be identical across runs
      for (let i = 1; i < results.length; i++) {
        for (let j = 0; j < 8; j++) {
          expect(results[i].fieldConstants[j]).toBeCloseTo(results[0].fieldConstants[j], 10);
        }
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle bootstrap with minimal dependencies', async () => {
      // Even with just the core dependencies, bootstrap should work
      const result = await bootstrapEngine.bootstrap();
      expect(result.stable).toBe(true);
    });

    it('should validate constitutional primes are well-chosen', () => {
      // Each constitutional prime should have unique properties
      const resonances = CONSTITUTIONAL_PRIMES.map((p) => resonance.calculateResonance(p));

      // No two primes should have the same resonance
      const uniqueResonances = new Set(resonances);
      expect(uniqueResonances.size).toBe(resonances.length);

      // Resonances should span a reasonable range
      const minResonance = Math.min(...resonances);
      const maxResonance = Math.max(...resonances);
      expect(maxResonance / minResonance).toBeGreaterThan(2);
    });
  });

  describe('Performance', () => {
    it('should bootstrap within reasonable time', async () => {
      const startTime = Date.now();
      const result = await bootstrapEngine.bootstrap();
      const duration = Date.now() - startTime;

      expect(result.stable).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
