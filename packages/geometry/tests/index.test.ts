describe('Geometry Package', () => {
  it('should export all required modules', () => {
    const exports = require('../src/index');

    expect(exports.MathematicalManifold).toBeDefined();
    expect(exports.ResonanceMetric).toBeDefined();
    expect(exports.GeodesicCalculator).toBeDefined();
    expect(exports.FieldSpaceGeometry).toBeDefined();
    expect(exports.ResonanceSurfaceAnalyzer).toBeDefined();
    expect(exports.TopologicalInvariants).toBeDefined();
    expect(exports.DifferentialStructure).toBeDefined();
    expect(exports.ContinuousEmbedding).toBeDefined();
  });

  it('should export all required types', () => {
    // The interfaces are TypeScript types, not runtime values
    // We can only check that the module exports the expected classes
    const exports = require('../src/index');

    // Check that we have the main classes
    expect(typeof exports.MathematicalManifold).toBe('function');
    expect(typeof exports.ResonanceMetric).toBe('function');
    expect(typeof exports.GeodesicCalculator).toBe('function');
    expect(typeof exports.FieldSpaceGeometry).toBe('function');
    expect(typeof exports.ResonanceSurfaceAnalyzer).toBe('function');
    expect(typeof exports.TopologicalInvariants).toBe('function');
    expect(typeof exports.DifferentialStructure).toBe('function');
    expect(typeof exports.ContinuousEmbedding).toBe('function');
  });
});
