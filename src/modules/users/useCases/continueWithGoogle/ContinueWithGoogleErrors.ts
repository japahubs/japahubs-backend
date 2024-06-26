
import { Result, UseCaseError } from "../../../../shared";

export namespace ContinueWithGoogleErrors {

  export class GoogleTokenNotGenuine extends Result<UseCaseError> {
    constructor (token: string) {
      super(false, { 
        message: `Google token invalid= ${token}`
      } as UseCaseError)
    }
  }

  export class FetchAccountDetailsError extends Result<UseCaseError> {
    constructor () {
      super(false, { 
        message: "Failed to fetch Google account details"
      } as UseCaseError)
    }
  }

}