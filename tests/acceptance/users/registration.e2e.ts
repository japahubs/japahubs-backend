import { CreateUserDTO } from "src/modules/users/useCases/createUser/CreateUserDTO";
import { CompositionRoot } from "../../../src/shared/composition/compositionRoot";
import { RESTfulAPIDriver } from "../../../src/shared/infra/http/restfulAPIDriver";
import { UserBuilder } from "../../../src/shared/tests/users/builders/userBuilder";
import { LoginDTO } from "src/modules/users/useCases/login/LoginDTO";
import { redisConnection } from "../../../src/modules/users/services/redis/redisConnection";

describe("Auth End-to-End Tests", () => {
  let createUserInput: CreateUserDTO;
  let CreateLoginUserInput: CreateUserDTO;
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

  test("Successful registration", async () => {
    createUserInput = new UserBuilder()
      .withFirstName("Aliko")
      .withLastName("Dangote")
      .withPassword("QWerty78")
      .withPasswordConfirm("QWerty78")
      .withRandomEmail()
      .build();

    response = await restfulAPIDriver.post("/users/new", createUserInput);
    expect(response.status).toBe(200);
  });

  test("Successful login", async () => {
    CreateLoginUserInput = new UserBuilder()
      .withFirstName("Daniel")
      .withLastName("Regha")
      .withPassword("QWerty78")
      .withPasswordConfirm("QWerty78")
      .withEmail("daniel.regha@mail.com")
      .build();

    await restfulAPIDriver.post("/users/new", CreateLoginUserInput);

    loginUserInput = {
      email: "daniel.Regha@mail.com",
      password: "QWerty78",
    };

    response = await restfulAPIDriver.post("/users/login", loginUserInput);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await server.stop();
    await redisConnection.quit();
  });
});
