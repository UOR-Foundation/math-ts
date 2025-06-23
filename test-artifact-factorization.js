"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_substrate_1 = require("@uor-foundation/field-substrate");
const resonance_1 = require("@uor-foundation/resonance");
const resonance_2 = require("@uor-foundation/resonance");
async function testArtifactFactorization() {
    const substrate = (0, field_substrate_1.createFieldSubstrate)();
    const artifactFactorizer = new resonance_1.ArtifactBasedFactorization(substrate);
    const multiModalFactorizer = new resonance_2.MultiModalFactorization(substrate);
    console.log('=== Artifact-Based Factorization Test ===\n');
    const testCases = [
        { n: 77n, expected: '7 × 11', desc: 'Classic example from docs' },
        { n: 143n, expected: '11 × 13', desc: 'Product of consecutive primes' },
        { n: 1001n, expected: '7 × 11 × 13', desc: 'Multiple factors' },
        { n: 10001n, expected: '73 × 137', desc: 'Larger semiprime' },
        { n: 323n, expected: '17 × 19', desc: 'Small semiprime' },
    ];
    for (const { n, expected, desc } of testCases) {
        console.log(`\nTesting ${n} (${desc})`);
        console.log(`Expected: ${expected}`);
        // Analyze the molecule
        const pattern = substrate.getFieldPattern(n);
        console.log(`Field pattern: ${pattern.map(b => b ? '1' : '0').join('')}`);
        console.log(`Active fields: ${pattern.map((b, i) => b ? i : -1).filter(i => i >= 0).join(', ')}`);
        // Test artifact-based factorization
        console.log('\nArtifact-based approach:');
        const start1 = Date.now();
        const result1 = await artifactFactorizer.factorize(n);
        const time1 = Date.now() - start1;
        console.log(`  Result: ${result1.join(' × ')}`);
        console.log(`  Time: ${time1}ms`);
        // Test current multimodal approach
        console.log('\nMultimodal approach:');
        const start2 = Date.now();
        const result2 = await multiModalFactorizer.factorize(n);
        const time2 = Date.now() - start2;
        console.log(`  Result: ${result2.join(' × ')}`);
        console.log(`  Time: ${time2}ms`);
        // Analyze the factors for artifacts
        if (result1.length > 1) {
            console.log('\nArtifact analysis:');
            const factors = result1;
            for (let i = 0; i < factors.length - 1; i++) {
                const f1 = factors[i];
                const f2 = factors[i + 1];
                const product = f1 * f2;
                const p1 = substrate.getFieldPattern(f1);
                const p2 = substrate.getFieldPattern(f2);
                const pProduct = substrate.getFieldPattern(product);
                console.log(`  ${f1} × ${f2} = ${product}:`);
                // Check for vanished fields
                for (let field = 0; field < 8; field++) {
                    if (p1[field] && p2[field] && !pProduct[field]) {
                        console.log(`    Field ${field} VANISHED (both factors had it)`);
                    }
                    else if (!p1[field] && !p2[field] && pProduct[field]) {
                        console.log(`    Field ${field} EMERGED (neither factor had it)`);
                    }
                }
            }
        }
    }
    console.log('\n\n=== Detailed Example: 77 = 7 × 11 ===\n');
    const n = 77n;
    const p7 = substrate.getFieldPattern(7n);
    const p11 = substrate.getFieldPattern(11n);
    const p77 = substrate.getFieldPattern(77n);
    console.log('Field patterns:');
    console.log(`  7:  ${p7.map(b => b ? '1' : '0').join('')} (fields: ${p7.map((b, i) => b ? i : -1).filter(i => i >= 0).join(',')})`);
    console.log(`  11: ${p11.map(b => b ? '1' : '0').join('')} (fields: ${p11.map((b, i) => b ? i : -1).filter(i => i >= 0).join(',')})`);
    console.log(`  77: ${p77.map(b => b ? '1' : '0').join('')} (fields: ${p77.map((b, i) => b ? i : -1).filter(i => i >= 0).join(',')})`);
    console.log('\nDenormalization artifacts:');
    for (let i = 0; i < 8; i++) {
        if (p7[i] && p11[i] && !p77[i]) {
            console.log(`  Field ${i} (${getFieldName(i)}): VANISHED`);
        }
        else if (!p7[i] && !p11[i] && p77[i]) {
            console.log(`  Field ${i} (${getFieldName(i)}): EMERGED`);
        }
    }
}
function getFieldName(index) {
    const names = ['I', 'T', 'φ', '½', 'P', '∞', 'θ', 'ζ'];
    return names[index] || `Field${index}`;
}
testArtifactFactorization().catch(console.error);
