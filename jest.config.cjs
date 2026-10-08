module.exports = {
  watchman: false, preset: 'ts-jest', testMatch: ['**/*.test.ts', '**/*.test.tsx'], testEnvironment: 'jsdom', roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'CommonJS', noUnusedLocals: false } }] },
  collectCoverageFrom: ['src/domain/**/*.ts', 'src/application/**/*.ts', 'src/infrastructure/**/*.ts'],
  coverageThreshold: { global: { branches: 70, functions: 80, lines: 80, statements: 80 } },
};
