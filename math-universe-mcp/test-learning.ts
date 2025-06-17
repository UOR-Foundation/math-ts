import { learnFromMathematicalUniverse } from './dist/universe-learning-system.js';

console.log('🌌 Starting Mathematical Universe Learning System...\n');

learnFromMathematicalUniverse()
  .then(() => console.log('\n✨ Learning complete!'))
  .catch(console.error);