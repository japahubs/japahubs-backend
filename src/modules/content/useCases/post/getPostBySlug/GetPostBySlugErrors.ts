import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace GetPostBySlugErrors {

  export class PostNotFoundBySlugError extends Result<UseCaseError> {
    constructor (slug: string) {
      super(false, {
        message: `Couldn't find a post by the id or slug: ${slug}.`
      } as UseCaseError)
    }
  }

  export class PostNotFoundByPostIdError extends Result<UseCaseError> {
    constructor (postId: string) {
      super(false, {
        message: `Couldn't find a post by postId: ${postId}.`
      } as UseCaseError)
    }
  }
  
}