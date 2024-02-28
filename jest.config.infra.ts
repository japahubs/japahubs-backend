import config from './jest.config'
config.testMatch = ['**/@(src|tests)/**/*.@(infra).*']
config.displayName = 'tests (infra)'
config.globalSetup = './tests/globalDevEnvTestsSetup.ts'
export default config
