import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace LoginUseCaseErrors {
  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Account does not exist`,
      } as UseCaseError);
    }
  }

  export class IncorrectPasswordError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Incorrect password`,
      } as UseCaseError);
    }
  }
}
