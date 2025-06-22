const { MathematicalUniverse } = require('@uor-foundation/math-ts-core');

console.log('Testing MCP Server startup...');

try {
  const universe = new MathematicalUniverse();
  const analysis = universe.analyze(77n);

  console.log('✅ Universe created successfully');
  console.log('✅ Analysis of 77:', {
    isPrime: analysis.isPrime,
    resonance: analysis.resonance.toFixed(4),
    fields: analysis.fields.filter(Boolean).length + ' active',
  });

  console.log('\nMCP Server dependencies are working correctly!');
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
