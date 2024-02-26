import { CreateUserDTO } from 'src/modules/users/useCases/createUser/CreateUserDTO'
import { CompositionRoot } from '../../../src/shared/composition/compositionRoot'
import { RESTfulAPIDriver } from '../../../src/shared/infra/http/restfulAPIDriver'
import { UserBuilder } from '../../../src/shared/tests/users/builders/userBuilder'

describe('Registration End-to-End Test', () => {
  let createUserInput: CreateUserDTO
  let restfulAPIDriver: RESTfulAPIDriver
  let server: any
  let response: any

  beforeAll(async () => {
    const compositionRoot: CompositionRoot = new CompositionRoot()
    server = compositionRoot.getWebServer()
    await server.start()
    restfulAPIDriver = new RESTfulAPIDriver(server.getHttp())
  })

  beforeEach(() => {
    createUserInput = new UserBuilder()
      .withFirstName('Aliko')
      .withLastName('Dangote')
      .withPassword('QWerty78')
      .withPasswordConfirm('QWerty78')
      .withRandomEmail()
      .build()
  })

  test('Successful registration', async () => {
    response = await restfulAPIDriver.post('/users/new', createUserInput)
    expect(response.status).toBe(200)
  })

  afterAll(async () => {
    await server.stop()
  })
})
