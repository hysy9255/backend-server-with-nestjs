// import { Config } from 'jest';

// const config: Config = {
//   moduleNameMapper: {
//     '^src/(.*)$': '<rootDir>/src/$1',
//   },
//   // 혹시 setupFiles, testEnvironment 같은 거 있으면 그대로 두고 이거만 추가
// };

// export default config;

import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};

export default config;
