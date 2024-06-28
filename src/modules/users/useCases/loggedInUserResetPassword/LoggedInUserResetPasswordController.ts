import { ResetPasswordErrors } from "./ResetPasswordErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import * as express from "express";
import { DecodedExpressRequest } from "../../../../shared";
import { LoggedInUserResetPassword } from "./LoggedInUserResetPassword";

interface ResetPasswordDTO {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

export class LoggedInUserResetPasswordController extends BaseController {
  private useCase: LoggedInUserResetPassword;

  constructor(useCase: LoggedInUserResetPassword) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: ResetPasswordDTO = req.body as ResetPasswordDTO;
    const email = req.decoded.email

    try {
      const result = await this.useCase.execute({email, ...dto});

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ResetPasswordErrors.EmailDoesntExistError:
            return this.notFound(res, error.getErrorValue().message);
          case ResetPasswordErrors.InvalidPasswordError:
            return this.clientError(res, error.getErrorValue().message);
          case ResetPasswordErrors.PasswordMismatchError:
            return this.clientError(res, error.getErrorValue().message);
          case ResetPasswordErrors.IncorrectPassword:
            return this.clientError(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}
