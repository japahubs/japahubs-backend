import { ForgotPasswordErrors } from "../forgotPassword/ForgotPasswordErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import * as express from "express";
import { DecodedExpressRequest } from "../../../../shared";
import { ForgotPassword } from "../forgotPassword/ForgotPassword";

export class LoggedInUserForgotPasswordController extends BaseController {
  private useCase: ForgotPassword;

  constructor(useCase: ForgotPassword) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    
    const email = req.decoded.email

    try {
      const result = await this.useCase.execute({email});

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ForgotPasswordErrors.EmailDoesntExistError:
            return this.notFound(res, error.getErrorValue().message);
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
