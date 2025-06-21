// Debug Gödel encoding/decoding

// Simulate the encoding function
function godelEncode(text) {
  if (text.length === 0) return 1n;
  
  if (text.length <= 3) {
    let encoded = 1n;
    const primes = [2n, 3n, 5n];
    
    for (let i = 0; i < text.length; i++) {
      const charCode = BigInt(text.charCodeAt(i));
      encoded *= primes[i] ** charCode;
    }
    
    return encoded;
  }
  
  return 999999n; // Dummy for long strings
}

// Test encoding
const testCases = ['A', 'B', '1'];

for (const test of testCases) {
  const encoded = godelEncode(test);
  console.log(`"${test}" encodes to: ${encoded}`);
  console.log(`  Character code: ${test.charCodeAt(0)}`);
  console.log(`  Prime used: 2`);
  console.log(`  Calculation: 2^${test.charCodeAt(0)} = ${2n ** BigInt(test.charCodeAt(0))}`);
}

// Example: 'A' has char code 65
// So it encodes to 2^65 = 36893488147419103232