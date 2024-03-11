/* eslint-disable */
export default {
  displayName: 'oid4vci',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/utils/oid4vci',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
