import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import type { FieldSubstrate } from '@uor-foundation/field-substrate';
import { createResonanceDynamics } from '@uor-foundation/resonance';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import { createPageTopology } from '@uor-foundation/topology';
import type { PageTopology } from '@uor-foundation/topology';
import { createArithmeticOperators } from '@uor-foundation/operators';
import type { ArithmeticOperators } from '@uor-foundation/operators';
import { GroupDetector } from '../src';

describe('GroupDetector', () => {
  let substrate: FieldSubstrate;
  let resonance: ResonanceDynamics;
  let topology: PageTopology;
  let operators: ArithmeticOperators;
  let groupDetector: GroupDetector;

  beforeEach(() => {
    substrate = createFieldSubstrate();
    resonance = createResonanceDynamics(substrate);
    topology = createPageTopology(substrate, resonance);
    operators = createArithmeticOperators(substrate, resonance, topology);
    groupDetector = new GroupDetector(substrate, resonance, topology, operators);
  });

  test('should detect additive group of integers', () => {
    const numbers = [0n, 1n, -1n, 2n, -2n];
    const groups = groupDetector.detectGroups(numbers);

    expect(groups.length).toBeGreaterThan(0);

    // Find the additive group
    const additiveGroup = groups.find((g) => g.identity === 0n && g.operation(1n, 2n) === 3n);
    expect(additiveGroup).toBeDefined();
    expect(additiveGroup!.isAbelian).toBe(true);
    expect(additiveGroup!.elements.has(0n)).toBe(true);
  });

  test('should detect multiplicative group of units', () => {
    const numbers = [1n, -1n];
    const groups = groupDetector.detectGroups(numbers);

    const multiplicativeGroup = groups.find((g) => g.identity === 1n);
    expect(multiplicativeGroup).toBeDefined();
    expect(multiplicativeGroup!.isClosed).toBe(true);
    expect(multiplicativeGroup!.hasInverses).toBe(true);
  });

  test('should detect page-based groups', () => {
    // Numbers from the same page
    const numbers = [48n, 49n, 50n, 51n];
    const groups = groupDetector.detectGroups(numbers);

    expect(groups.length).toBeGreaterThan(0);
  });

  test('should analyze symmetries', () => {
    const symmetry = groupDetector.analyzeSymmetries(255n); // All fields active

    expect(symmetry.generators.length).toBeGreaterThan(0);
    expect(symmetry.isFinite).toBe(true);
    expect(symmetry.symmetryType).toBeDefined();
  });

  test('should detect subgroups', () => {
    const numbers = [0n, 2n, 4n, -2n, -4n];
    const groups = groupDetector.detectGroups(numbers);
    const group = groups[0];

    const subgroups = groupDetector.detectSubgroups(group);

    expect(subgroups.length).toBeGreaterThanOrEqual(1); // At least trivial subgroup

    // Should include the trivial subgroup {0}
    const trivialSubgroup = subgroups.find((s) => s.elements.size === 1 && s.elements.has(0n));
    expect(trivialSubgroup).toBeDefined();
  });

  test('should handle empty input', () => {
    const groups = groupDetector.detectGroups([]);
    expect(groups).toEqual([]);
  });

  test('should detect resonance groups with small sets', () => {
    // Use fewer numbers to speed up test
    const numbers = [7n, 11n, 13n];
    const groups = groupDetector.detectGroups(numbers);
    expect(groups.length).toBeGreaterThan(0);
  });

  test('should detect field groups', () => {
    // Numbers with similar field patterns
    const numbers = [15n, 31n, 47n, 63n]; // All have multiple fields active (pattern 00001111, 00011111, 00101111, 00111111)
    const groups = groupDetector.detectGroups(numbers);
    expect(groups.length).toBeGreaterThan(0);
  });
});
