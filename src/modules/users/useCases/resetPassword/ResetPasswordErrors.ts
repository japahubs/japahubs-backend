import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace ResetPasswordErrors {
  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Account does not exist or has been deleted`,
      } as UseCaseError);
    }
  }
  export class InvalidPasswordError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Password doesnt meet criteria`,
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

  export class TokenExpiredError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Password reset link expired, start afresh",
      } as UseCaseError);
    }
  }

}
