import { CreateUserDTO } from "../../../src/modules/users/useCases/createUser/CreateUserDTO";
import { LoginDTO } from "../../../src/modules/users/useCases/login/LoginDTO";
import { CompositionRoot } from "../../../src/shared/composition/compositionRoot";
import { RESTfulAPIDriver } from "../../../src/shared/infra/http/restfulAPIDriver";
import { UserBuilder } from "../../../src/shared/tests/users/builders/userBuilder";

describe("Login End-to-End Test", () => {
  let createUserInput: CreateUserDTO;
  let loginUserInput: LoginDTO;
  let restfulAPIDriver: RESTfulAPIDriver;
  let server: any;
  let response: any;

  beforeAll(async () => {
    const compositionRoot: CompositionRoot = new CompositionRoot();
    server = compositionRoot.getWebServer();
    await server.start();
    restfulAPIDriver = new RESTfulAPIDriver(server.getHttp());
  });

  beforeEach(async () => {
    createUserInput = new UserBuilder()
      .withFirstName("Daniel")
      .withLastName("Regha")
      .withPassword("QWerty78")
      .withPasswordConfirm("QWerty78")
      .withEmail("daniel.regha@mail.com")
      .build();

    await restfulAPIDriver.post("/users/new", createUserInput);

    loginUserInput = {
      email: "daniel.Regha@mail.com",
      password: "QWerty78",
    };
  });

  test("Successful login", async () => {
    response = await restfulAPIDriver.post("/login", loginUserInput);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await server.stop();
  });
});
