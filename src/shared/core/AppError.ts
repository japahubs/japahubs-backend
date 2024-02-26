import { Result } from './Result'
import { UseCaseError } from './UseCaseError'

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: unknown) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err,
      } as UseCaseError)
      console.log(`[AppError]: An unexpected error occurred`)
      console.error(err)
    }

    public static create(err: unknown): UnexpectedError {
      return new UnexpectedError(err)
    }
  }
}
