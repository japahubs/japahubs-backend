import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace CreateUserErrors {
  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} associated for this account already exists`,
      } as UseCaseError);
    }
  }

  export class PasswordMismatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Passwords do not match",
      } as UseCaseError);
    }
  }
}
