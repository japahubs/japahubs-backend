import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace CreateUserErrors {
  export class UsernameTakenError extends Result<UseCaseError> {
    constructor(username: string) {
      super(false, {
        message: `The username ${username} already exists`,
      } as UseCaseError);
    }
  }

  export class TokenExpiredError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Email verification link expired, kindly re-register",
      } as UseCaseError);
    }
  }
}
