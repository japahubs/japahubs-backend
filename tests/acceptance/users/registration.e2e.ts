import { CompositionRoot } from "../../../src/shared/composition/compositionRoot";
import { RESTfulAPIDriver } from "../../../src/shared/http/restfulAPIDriver";
import { UserBuilder } from "../../../src/shared/tests/users/builders/userBuilder";
import { CreateUserInput } from "../../../src/modules/users/dtos/usersDTO";

describe("Registration End-to-End Test", () => {
  let createUserInput: CreateUserInput;
  let restfulAPIDriver: RESTfulAPIDriver;
  let server: any; // Adjust the type of server if needed
  let response: any;

  beforeAll(async () => {
    const compositionRoot: CompositionRoot = new CompositionRoot();
    server = compositionRoot.getWebServer();
    await server.start();
    restfulAPIDriver = new RESTfulAPIDriver(server.getHttp());
  });

  beforeEach(() => {
    createUserInput = new UserBuilder()
      .withFirstName("Aliko")
      .withLastName("Dangote")
      .withPassword("QWerty78")
      .withRandomEmail()
      .build();
  });

  test("Successful registration", async () => {
    response = await restfulAPIDriver.post("/users/new", createUserInput);
    expect(response.body.success).toBeTruthy();
    expect(response.body.error).toBeFalsy();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(createUserInput.email);
    expect(response.body.data.firstName).toEqual(createUserInput.firstName);
    expect(response.body.data.lastName).toEqual(createUserInput.lastName);
    expect(response.body.data.password).toEqual(createUserInput.password);
  });

  afterAll(async () => {
    await server.stop();
  });
});
