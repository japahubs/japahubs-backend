import * as express from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../../../shared";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
import { LoginDTOResponse } from "./CreateUserDTO";

export class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    let dto: CreateUserDTO = req.body as CreateUserDTO;

    dto = {
      username: TextUtils.sanitize(dto.username),
      dateOfBirth: dto.dateOfBirth,
      token: dto.token,
    };

    try {
      const result = await this.useCase.execute(dto);
    
      if (result.isRight()) {
        const value: LoginDTOResponse | undefined  = result.value.getValue() as LoginDTOResponse | undefined;

        if (value?.isGoogleUser) {
          // Set cookie and return successful response
          res.cookie("jwt", value.refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          return this.ok<LoginDTOResponse>(res, value);
        } else {
          // No need for cookie, return successful response
          return this.ok(res);
        }
      } else {
        const error = result.value; // Access the error value from Left
    
        switch (error.constructor) {
          case CreateUserErrors.UsernameTakenError:
            return this.conflict(res, error.getErrorValue().message);
          case CreateUserErrors.TokenExpiredError:
            return this.conflict(res, error.getErrorValue().message);
          default:
            console.log(error);
            return this.fail(res, error.getErrorValue().message);
        }
      }
    } catch (err) {
      return this.fail(res, err);
    }
    
  }
}
