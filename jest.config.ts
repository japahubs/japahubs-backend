import type { Config } from 'jest'

const config: Config = {
  testMatch: ['**/@(src|tests)/**/*.@(test|spec).*'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  roots: ['<rootDir>'],
}

export default config
