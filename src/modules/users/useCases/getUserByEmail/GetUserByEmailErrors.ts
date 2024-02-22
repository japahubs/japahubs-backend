import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace GetUserByEmailErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `No user matching the email ${email} was found`,
      } as UseCaseError);
    }
  }
}
