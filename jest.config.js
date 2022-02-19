/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  mapCoverage: true,
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transform: {
    '^.+\\.(t)s$': 'ts-jest',
    '^.+\\.(j)s$': 'babel-jest',
  },
  resolver: '<rootDir>/resolver.cjs',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!snarkyjs/node_modules/tslib)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
};
