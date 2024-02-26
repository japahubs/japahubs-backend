import config from './jest.config'
config.testMatch = ['**/@(src|tests)/**/*.@(e2e).*']
config.displayName = 'tests (E2E)'
config.globalSetup = './tests/globalDevEnvTestsSetup.ts'
export default config
