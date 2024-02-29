import * as express from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { RegisterUserDTO } from "./RegisterUserDTO";
import { RegisterUserErrors } from "./RegisterUserErrors";

export class RegisterUserController extends BaseController {
  private useCase: RegisterUserUseCase;

  constructor(useCase: RegisterUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    let dto: RegisterUserDTO = req.body as RegisterUserDTO;

    dto = {
      firstName: TextUtils.sanitize(dto.firstName),
      lastName: TextUtils.sanitize(dto.lastName),
      email: TextUtils.sanitize(dto.email),
      password: dto.password,
      passwordConfirm: dto.passwordConfirm,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RegisterUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.getErrorValue().message);
          case RegisterUserErrors.PasswordMismatchError:
            return this.conflict(res, error.getErrorValue().message);
          default:
            console.log(error);
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
