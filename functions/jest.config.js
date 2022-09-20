/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };

module.exports = {
  "roots": [
    "src"
  ],
  "testMatch": [
    // "**/__tests__/**/*.+(ts|tsx|js)",
    "**/__tests__/**/*.+(spec|test).+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
