import { CreateUserDTO } from "src/modules/users/useCases/createUser/CreateUserDTO";

function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export class UserBuilder {
  private props: CreateUserDTO;

  constructor() {
    this.props = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirm: "",
    };
  }

  public withFirstName(value: string) {
    this.props.firstName = value;
    return this;
  }
  withLastName(value: string) {
    this.props.lastName = value;
    return this;
  }
  withPassword(value: string) {
    this.props.password = value;
    return this;
  }
  withPasswordConfirm(value: string) {
    this.props.passwordConfirm = value;
    return this;
  }
  withRandomEmail() {
    const randomSequence = generateRandomInteger(1000, 100000);
    this.props.email = `testEmail-${randomSequence}@gmail.com`;
    return this;
  }
  withEmail(email: string) {
    this.props.email = email;
    return this;
  }

  build() {
    return this.props;
  }
}
