import { ExtendedFieldSubstrate, ExtendedFieldPattern } from './extended-field-substrate';
import { createFieldSubstrate } from '@uor-foundation/field-substrate';

/**
 * Visualize numbers in higher-dimensional space
 */

export class DimensionalVisualization {
  private extendedSubstrate: ExtendedFieldSubstrate;
  
  constructor() {
    const substrate = createFieldSubstrate();
    this.extendedSubstrate = new ExtendedFieldSubstrate(substrate);
  }
  
  /**
   * Create ASCII visualization of extended pattern
   */
  visualizeExtendedPattern(n: bigint): string {
    const pattern = this.extendedSubstrate.getExtendedPattern(n);
    let viz = `\n=== Extended Pattern for ${n} ===\n\n`;
    
    // Base pattern
    viz += '1. Base Fields (8D binary):\n';
    viz += '   ';
    pattern.base.forEach((active, i) => {
      viz += active ? `[${i}]` : ' . ';
    });
    viz += '\n\n';
    
    // Composite resonance
    viz += '2. Composite Resonance (8D continuous):\n';
    viz += '   ';
    pattern.composite.forEach((value, i) => {
      if (value > 0) {
        viz += `${i}:${value.toFixed(2)} `;
      }
    });
    viz += '\n\n';
    
    // Phase angles
    viz += '3. Phase Configuration (8D angular):\n';
    viz += '   ';
    pattern.phase.forEach((angle, i) => {
      if (angle > 0) {
        const degrees = Math.round(angle * 180 / Math.PI);
        viz += `${i}:${degrees}° `;
      }
    });
    viz += '\n\n';
    
    // Topological charges
    viz += '4. Topological Charges (8D discrete):\n';
    viz += '   ';
    pattern.topology.forEach((charge, i) => {
      if (pattern.base[i]) {
        const symbol = charge < 0 ? '−' : charge > 0 ? '+' : '0';
        viz += `${i}:${symbol} `;
      }
    });
    viz += '\n\n';
    
    // Entanglement visualization (show strongest connections)
    viz += '5. Field Entanglement (strongest pairs):\n';
    const entanglements: Array<{i: number, j: number, strength: number}> = [];
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const strength = pattern.entanglement[i * 8 + j];
        if (strength > 0) {
          entanglements.push({ i, j, strength });
        }
      }
    }
    entanglements.sort((a, b) => b.strength - a.strength);
    entanglements.slice(0, 5).forEach(e => {
      viz += `   ${e.i}↔${e.j}: ${e.strength.toFixed(3)}\n`;
    });
    viz += '\n';
    
    // Dimensional projections
    viz += '6. Lower-Dimensional Projections:\n';
    viz += `   1D (resonance): ${this.extendedSubstrate.projectToLowerDimension(pattern, 1)[0].toFixed(6)}\n`;
    const proj2D = this.extendedSubstrate.projectToLowerDimension(pattern, 2);
    viz += `   2D (complex): ${proj2D[0].toFixed(3)} ∠ ${(proj2D[1] * 180 / Math.PI).toFixed(0)}°\n`;
    const proj3D = this.extendedSubstrate.projectToLowerDimension(pattern, 3);
    viz += `   3D (R,φ,T): (${proj3D[0].toFixed(2)}, ${(proj3D[1] * 180 / Math.PI).toFixed(0)}°, ${proj3D[2]})\n`;
    
    viz += `\nTotal Dimensionality: ${this.extendedSubstrate.getDimensionality()}\n`;
    
    return viz;
  }
  
  /**
   * Compare two numbers in extended space
   */
  compareNumbers(n1: bigint, n2: bigint): string {
    const p1 = this.extendedSubstrate.getExtendedPattern(n1);
    const p2 = this.extendedSubstrate.getExtendedPattern(n2);
    const similarity = this.extendedSubstrate.computeSimilarity(p1, p2);
    
    let comparison = `\n=== Comparing ${n1} and ${n2} ===\n\n`;
    
    // Base pattern comparison
    comparison += 'Base Pattern Alignment:\n';
    for (let i = 0; i < 8; i++) {
      const match = p1.base[i] === p2.base[i];
      comparison += match ? ' ✓ ' : ' ✗ ';
    }
    comparison += '\n\n';
    
    // Phase difference
    comparison += 'Phase Differences:\n';
    for (let i = 0; i < 8; i++) {
      if (p1.phase[i] > 0 && p2.phase[i] > 0) {
        const diff = Math.abs(p1.phase[i] - p2.phase[i]) * 180 / Math.PI;
        comparison += `  Field ${i}: Δφ = ${diff.toFixed(0)}°\n`;
      }
    }
    comparison += '\n';
    
    // Topological comparison
    comparison += 'Topological Alignment:\n';
    let topMatch = 0;
    for (let i = 0; i < 8; i++) {
      if (p1.base[i] && p2.base[i]) {
        if (p1.topology[i] === p2.topology[i]) {
          comparison += `  Field ${i}: ${p1.topology[i]} = ${p2.topology[i]} ✓\n`;
          topMatch++;
        } else {
          comparison += `  Field ${i}: ${p1.topology[i]} ≠ ${p2.topology[i]} ✗\n`;
        }
      }
    }
    comparison += '\n';
    
    comparison += `Overall Similarity: ${(similarity * 100).toFixed(1)}%\n`;
    
    return comparison;
  }
  
  /**
   * Show factorization in extended space
   */
  visualizeFactorization(n: bigint, factors: bigint[]): string {
    let viz = `\n=== Factorization of ${n} = ${factors.join(' × ')} in Extended Space ===\n`;
    
    const nPattern = this.extendedSubstrate.getExtendedPattern(n);
    const factorPatterns = factors.map(f => this.extendedSubstrate.getExtendedPattern(f));
    
    // Show how fields combine
    viz += '\nField Combination:\n';
    for (let i = 0; i < 8; i++) {
      const nActive = nPattern.base[i];
      const factorActive = factorPatterns.map(p => p.base[i]);
      
      viz += `  Field ${i}: `;
      if (nActive) {
        viz += `${n}[active] ← `;
        factorActive.forEach((active, j) => {
          viz += active ? `${factors[j]}[active] ` : `${factors[j]}[inactive] `;
        });
      } else {
        viz += `${n}[inactive]`;
      }
      viz += '\n';
    }
    
    // Show phase relationships
    viz += '\nPhase Relationships:\n';
    for (let i = 0; i < 8; i++) {
      if (nPattern.phase[i] > 0) {
        viz += `  Field ${i}: `;
        viz += `${n}[${(nPattern.phase[i] * 180 / Math.PI).toFixed(0)}°] = `;
        
        let phaseSum = 0;
        factorPatterns.forEach((p, j) => {
          if (p.phase[i] > 0) {
            phaseSum += p.phase[i];
            viz += `${factors[j]}[${(p.phase[i] * 180 / Math.PI).toFixed(0)}°] + `;
          }
        });
        viz = viz.slice(0, -3); // Remove trailing ' + '
        viz += ` (sum: ${(phaseSum * 180 / Math.PI).toFixed(0)}°)\n`;
      }
    }
    
    // Show entanglement inheritance
    viz += '\nEntanglement Inheritance:\n';
    const strongEntanglements = [];
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const nEnt = nPattern.entanglement[i * 8 + j];
        if (nEnt > 0.5) {
          strongEntanglements.push({ i, j, strength: nEnt });
        }
      }
    }
    
    strongEntanglements.forEach(e => {
      viz += `  ${n}[${e.i}↔${e.j}]: ${e.strength.toFixed(2)} inherited from factors\n`;
    });
    
    return viz;
  }
  
  /**
   * Explore dimensional neighborhood
   */
  exploreNeighborhood(n: bigint, radius: number = 5): string {
    let exploration = `\n=== Dimensional Neighborhood of ${n} ===\n\n`;
    
    const center = this.extendedSubstrate.getExtendedPattern(n);
    const neighbors: Array<{n: bigint, similarity: number}> = [];
    
    // Check numbers within radius
    for (let offset = -radius; offset <= radius; offset++) {
      if (offset === 0) continue;
      const neighbor = n + BigInt(offset);
      if (neighbor > 0n) {
        const pattern = this.extendedSubstrate.getExtendedPattern(neighbor);
        const similarity = this.extendedSubstrate.computeSimilarity(center, pattern);
        neighbors.push({ n: neighbor, similarity });
      }
    }
    
    // Sort by similarity
    neighbors.sort((a, b) => b.similarity - a.similarity);
    
    exploration += 'Nearest Neighbors (by pattern similarity):\n';
    neighbors.slice(0, 10).forEach((nb, i) => {
      exploration += `  ${i + 1}. ${nb.n} (similarity: ${(nb.similarity * 100).toFixed(1)}%)\n`;
    });
    
    // Find dimensional twins (same base pattern)
    exploration += '\nDimensional Twins (same base pattern):\n';
    const basePattern = center.base;
    let twinCount = 0;
    
    for (let candidate = n - 256n; candidate <= n + 256n && twinCount < 5; candidate += 256n) {
      if (candidate > 0n && candidate !== n) {
        const candidatePattern = this.extendedSubstrate.getExtendedPattern(candidate);
        const sameBase = candidatePattern.base.every((v, i) => v === basePattern[i]);
        if (sameBase) {
          exploration += `  ${candidate} (offset: ${candidate - n})\n`;
          twinCount++;
        }
      }
    }
    
    return exploration;
  }
}