import { Result, UseCaseError } from "../../../../shared"

export namespace EditUserProfileErrors {

  export class UserNotFoundError extends Result<UseCaseError> {
    constructor (id: string) {
      super(false, {
        message: `Couldn't find a user by id {${id}}.`
      } as UseCaseError)
    }
  }

}