import * as express from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared";
import { UpdateUserInfoErrors } from "./UpdateUserInfoErrors";
import { UpdateUserInfo } from "./UpdateUserInfo";

export interface UpdateUserInfoDTO {
    email?: string;
    username?: string;
    phone?: string;
    country?: string;
    language?: string;
    gender?: string;
  }

export class UpdateUserInfoController extends BaseController {
  private useCase: UpdateUserInfo;

  constructor(useCase: UpdateUserInfo) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {

    const { userId } = req.decoded;
    let dto: UpdateUserInfoDTO = req.body as UpdateUserInfoDTO;

    try {
      const result = await this.useCase.execute({userId, ...dto});
    
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateUserInfoErrors.UserNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            console.log(error);
            return this.clientError(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
    
  }
}
