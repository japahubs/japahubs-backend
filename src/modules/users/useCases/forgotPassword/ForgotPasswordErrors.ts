import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace ForgotPasswordErrors {
  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Account does not exist`,
      } as UseCaseError);
    }
  }

}
