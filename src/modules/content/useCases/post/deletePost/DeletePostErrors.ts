
import { UseCaseError, Result } from "../../../../../shared";

export namespace DeletePostErrors {

  export class PostNotFoundError extends Result<UseCaseError> {    
    constructor () {
      super(false, {
        message: `Post not found`
      } as UseCaseError)
    }
  } 

}