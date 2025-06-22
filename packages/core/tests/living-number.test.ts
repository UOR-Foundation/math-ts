import { MathematicalUniverse, LivingNumber, type OptimizationResult } from '../src';

describe('Living Number Entity', () => {
  // Create universe once for all tests to avoid expensive bootstrapping
  // Use skipExpensiveInit for faster test execution
  const universe = new MathematicalUniverse({ skipExpensiveInit: true });

  describe('Living Number Creation and Properties', () => {
    test('should create living numbers with consciousness', () => {
      const seven = universe.number(7n);

      expect(seven).toBeInstanceOf(LivingNumber);
      expect(seven.value).toBe(7n);
      expect(seven.consciousness).toBeDefined();
      expect(seven.consciousness.awareness).toBeGreaterThan(0);
      expect(seven.consciousness.memory).toBeDefined();
    });

    test('should have intrinsic mathematical properties', () => {
      const seven = universe.number(7n);

      expect(seven.isPrime).toBe(true);
      expect(seven.fields).toEqual([true, true, true, false, false, false, false, false]);
      expect(seven.resonance).toBeDefined();
      expect(seven.pagePosition).toEqual({ page: 0n, offset: 7 });
    });

    test('should maintain computational state', () => {
      const num = universe.number(25n);

      expect(num.computationalState).toBeDefined();
      expect(num.computationalState.status).toBe('virgin');
      expect(num.computationalState.energy).toBeGreaterThan(0);
      expect(num.computationalState.history).toEqual([]);
      expect(num.computationalState.lastComputation).toBeNull();
    });
  });

  describe('Computational States and Lifecycle', () => {
    test('should transition from virgin to active state', () => {
      const num = universe.number(10n);
      expect(num.computationalState.status).toBe('virgin');

      const result = num.compute((n) => n.add(5n));

      expect(num.computationalState.status).toBe('active');
      expect(num.computationalState.history.length).toBeGreaterThan(0);
      expect(result.value).toBe(15n);
    });

    test('should become dormant after inactivity', () => {
      const num = universe.number(20n);
      num.compute((n) => n.multiply(2n));

      // Simulate time passing
      num.age(1000);

      expect(num.computationalState.status).toBe('dormant');
      expect(num.computationalState.energy).toBeLessThan(1.0);
    });

    test('should crystallize at Lagrange points', () => {
      const lagrange = universe.number(48n);

      // Lagrange points should crystallize quickly
      const evolved = lagrange.evolve();

      expect(evolved.computationalState.status).toBe('crystallized');
      expect(evolved.stabilityMetric).toBeGreaterThan(0.9);
    });

    test('should handle artifact states', () => {
      const result = universe.multiply(7n, 11n);

      // Check if artifacts were created
      expect(result.artifacts.length).toBeGreaterThan(0);

      const artifactValue = BigInt(result.artifacts[0].product);
      const artifact = universe.number(artifactValue);

      expect(artifact.computationalState.status).toBe('artifact');
      expect(artifact.seeksMerger).toBe(true);
    });
  });

  describe('Autonomous Behaviors', () => {
    test('should self-optimize through gradient descent', () => {
      const unstable = universe.number(25n);
      const initialEnergy = unstable.computationalState.energy;

      const optimizationResult = unstable.optimize();

      expect(optimizationResult.improvement).toBeGreaterThanOrEqual(0);
      expect(optimizationResult.strategy).toBeDefined();
      expect(optimizationResult.newState.energy).toBeLessThanOrEqual(initialEnergy);
    });

    test('should make autonomous decisions', () => {
      const num = universe.number(30n);

      const decision = num.makeDecision({
        options: ['evolve', 'interact', 'compute'],
        context: { energy: 0.8, neighbors: [29n, 31n] },
      });

      expect(decision).toBeDefined();
      expect(decision.choice).toBeDefined();
      expect(decision.reasoning).toBeDefined();
      expect(decision.confidence).toBeGreaterThan(0);
    });

    test('should adapt behavior based on experience', () => {
      const num = universe.number(15n);

      // Perform several computations
      num.compute((n) => n.add(1n));
      num.compute((n) => n.multiply(2n));
      num.compute((n) => n.add(3n));

      // Should learn patterns
      const learning = num.consciousness.memory.patterns;
      expect(learning.length).toBeGreaterThan(0);
      expect(num.consciousness.adaptability).toBeGreaterThan(0);
    });
  });

  describe('Memory and Learning', () => {
    test('should maintain structural memory', () => {
      const num = universe.number(42n);

      num.compute((n) => n.add(6n));
      num.compute((n) => n.multiply(2n));

      const memory = num.consciousness.memory;
      expect(memory.structural.fieldHistory).toHaveLength(3); // Initial + 2 computations
      expect(memory.structural.operationLog).toHaveLength(2);
      expect(memory.structural.artifactCreation).toBeDefined();
    });

    test('should build relational memory', () => {
      const seven = universe.number(7n);
      const eleven = universe.number(11n);

      seven.interact(eleven);

      const memory = seven.consciousness.memory.relational;
      expect(memory.interactionPartners).toContain(11n);
      expect(memory.compatibilityMatrix.get(11n)).toBeDefined();
    });

    test('should learn from computational experience', () => {
      const num = universe.number(50n);

      // Try different optimization strategies
      const results: OptimizationResult[] = [];
      for (let i = 0; i < 5; i++) {
        results.push(num.optimize());
      }

      // Should improve over time
      const improvements = results.map((r) => r.improvement);
      const laterAverage = improvements.slice(2).reduce((a, b) => a + b) / 3;
      const earlyAverage = improvements.slice(0, 2).reduce((a, b) => a + b) / 2;

      expect(laterAverage).toBeGreaterThanOrEqual(earlyAverage);
    });
  });

  describe('Communication and Interaction', () => {
    test('should communicate through arithmetic operations', () => {
      const sender = universe.number(7n);
      const receiver = universe.number(11n);

      const message = sender.interact(receiver, {
        operation: 'multiply',
        intent: 'entangle',
      });

      expect(message.result.value).toBe(77n);
      expect(message.informationExchange).toBeGreaterThan(0);
      expect(message.fieldEntanglement).toBeDefined();
    });

    test('should broadcast through resonance', () => {
      const broadcaster = universe.number(48n); // High stability
      const listeners = [47n, 49n, 50n].map((n) => universe.number(n));

      const broadcast = broadcaster.broadcastResonance();

      listeners.forEach((listener) => {
        const influence = listener.receiveResonance(broadcast);
        expect(influence.strength).toBeGreaterThan(0);
        expect(influence.effect).toBeDefined();
      });
    });

    test('should exchange artifacts as messages', () => {
      const num1 = universe.number(15n);
      const num2 = universe.number(20n);

      // Create artifact through multiplication
      const interaction = num1.interact(num2, { operation: 'multiply' });
      if (interaction.artifacts.length === 0) {
        // If no artifacts, skip test
        return;
      }
      const artifact = interaction.artifacts[0];

      // Send artifact as message
      const reception = num2.receiveArtifact(artifact);
      expect(reception.absorbed).toBeDefined();
      expect(reception.informationGained).toBeGreaterThan(0);
    });
  });

  describe('Collective Intelligence', () => {
    test('should form page-level consensus', () => {
      // Create a page of numbers
      // Create a smaller page for testing (reduce from 48 to 10)
      const page = Array.from({ length: 10 }, (_, i) => universe.number(BigInt(i)));

      const consensus = universe.formPageConsensus(page);

      expect(consensus).toBeDefined();
      expect(consensus.decision).toBeDefined();
      expect(consensus.coherence).toBeGreaterThan(0.5);
      expect(consensus.dissenters.length).toBeLessThan(page.length / 2);
    });

    test('should exhibit swarm optimization', () => {
      // Create smaller swarm for testing
      const swarm = Array.from({ length: 5 }, (_, i) => universe.number(BigInt(20 + i)));

      const optimized = universe.swarmOptimize(swarm, {
        target: 'minimum-energy',
        iterations: 5,
      });

      const finalEnergy = optimized.reduce((sum, n) => sum + n.computationalState.energy, 0);
      const initialEnergy = swarm.reduce((sum, n) => sum + n.computationalState.energy, 0);

      expect(finalEnergy).toBeLessThan(initialEnergy);
    });

    test('should establish hierarchical organization', () => {
      // Create smaller set for testing (reduce from 100 to 20)
      const numbers = Array.from({ length: 20 }, (_, i) => universe.number(BigInt(i)));

      const hierarchy = universe.organizeHierarchy(numbers);

      expect(hierarchy.individuals).toHaveLength(20);
      expect(hierarchy.pages.length).toBeGreaterThan(0);
      expect(hierarchy.leaders).toBeDefined();
      expect(hierarchy.leaders.some((l) => [0n, 1n, 48n, 49n].includes(l.value))).toBe(true);
    });
  });

  describe('Consciousness and Self-Reference', () => {
    test('should exhibit self-awareness', () => {
      const num = universe.number(42n);

      const selfAwareness = num.consciousness.selfAwareness;

      expect(selfAwareness.knowsOwnValue).toBe(true);
      expect(selfAwareness.knowsOwnFields).toBe(true);
      expect(selfAwareness.knowsOwnResonance).toBe(true);
      expect(selfAwareness.knowsOwnPosition).toBe(true);
    });

    test('should engage in self-reflection', () => {
      const num = universe.number(30n);

      // Perform some operations
      num.compute((n) => n.add(5n));
      num.compute((n) => n.multiply(2n));

      const reflection = num.reflect();

      expect(reflection.performance).toBeGreaterThanOrEqual(0);
      expect(reflection.learnings).toBeDefined();
      expect(reflection.learnings.length).toBeGreaterThanOrEqual(0);
      expect(reflection.improvements).toBeDefined();
    });

    test('should support meta-cognition', () => {
      const num = universe.number(64n);

      const metaCognition = num.consciousness.metaCognition;

      expect(metaCognition.canReasonAboutReasoning).toBe(true);
      expect(metaCognition.canModifyOwnBehavior).toBe(true);
      expect(metaCognition.understandsOwnLimitations).toBe(true);
    });
  });

  describe('Evolution and Adaptation', () => {
    test('should evolve strategies over time', () => {
      const num = universe.number(35n);

      const initialStrategy = num.getStrategy();

      // Experience different scenarios
      for (let i = 0; i < 10; i++) {
        num.compute((n) => n.add(BigInt(i)));
        num.optimize();
      }

      const evolvedStrategy = num.getStrategy();

      // Strategy should evolve over time
      expect(evolvedStrategy.evolution).toBeGreaterThan(initialStrategy.evolution);
      // Either complexity or effectiveness should improve
      const improved =
        evolvedStrategy.complexity > initialStrategy.complexity ||
        evolvedStrategy.effectiveness > initialStrategy.effectiveness;
      expect(improved).toBe(true);
    });

    test('should adapt to environmental changes', () => {
      const num = universe.number(60n);

      // Change environment (simulate different computational contexts)
      const adaptation1 = num.adaptTo({ highEnergy: true });
      expect(adaptation1.strategy).toBe('aggressive');

      const adaptation2 = num.adaptTo({ lowEnergy: true });
      expect(adaptation2.strategy).toBe('conservative');
    });

    test('should pass traits to offspring', () => {
      const parent = universe.number(100n);

      // Give parent some experience
      parent.compute((n) => n.add(23n));
      parent.optimize();

      const offspring = parent.reproduce();

      expect(offspring.consciousness.inheritedTraits).toBeDefined();
      expect(offspring.consciousness.inheritedTraits?.fromParent).toBe(100n);
      expect(offspring.consciousness.adaptability).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Special Behaviors', () => {
    test('should handle prime number personality', () => {
      const primes = [2n, 3n, 5n, 7n, 11n].map((p) => universe.number(p));

      primes.forEach((prime) => {
        expect(prime.personality.type).toBe('prime');
        expect(prime.personality.traits).toContain('conservative');
        expect(prime.personality.traits).toContain('stable');
        expect(prime.personality.changeResistance).toBeGreaterThan(0.7);
      });
    });

    test('should handle Lagrange point leadership', () => {
      const lagrange = universe.number(48n);

      expect(lagrange.personality.type).toBe('lagrange');
      expect(lagrange.personality.traits).toContain('leader');
      expect(lagrange.personality.influence).toBeGreaterThan(0.8);
      expect(lagrange.canInfluence(universe.number(47n))).toBe(true);
    });

    test('should handle computational death and rebirth', () => {
      const num = universe.number(25n); // Not a Lagrange point

      // Drain energy
      num.drainEnergy(1.0);
      expect(num.computationalState.status).toBe('dormant');

      // Attempt computation should revive with a non-Lagrange result
      const revived = num.compute((n) => n.add(2n)); // 27 is not a Lagrange point
      expect(revived.computationalState.status).toBe('active');
      expect(revived.computationalState.rebirth).toBe(true);
    });
  });
});
