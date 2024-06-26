import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err,
      } as UseCaseError);
      console.log(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
  export class NewError extends Result<UseCaseError> {
    public constructor(msg: string) {
      super(false, {
        message: msg,
      } as UseCaseError);
      console.error(msg);
    }

    public static create(msg: any): UnexpectedError {
      return new NewError(msg);
    }
  }
}
