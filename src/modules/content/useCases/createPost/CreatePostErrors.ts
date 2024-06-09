import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace CreatePostErrors {
  export class NonExistentUserError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User doesn't exist`,
      } as UseCaseError);
    }
  }
}
