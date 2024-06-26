import * as express from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared";
import { EditUserProfileErrors } from "./EditUserProfileErrors";
import { EditUserProfile } from "./EditUserProfile";

export interface EditUserProfileDTO {
    bio?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    links?: string[];
  }

export class EditUserProfileController extends BaseController {
  private useCase: EditUserProfile;

  constructor(useCase: EditUserProfile) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {

    const { userId } = req.decoded;
    let dto: EditUserProfileDTO = req.body as EditUserProfileDTO;

    try {
      const result = await this.useCase.execute({userId, ...dto});
    
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case EditUserProfileErrors.UserNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            console.log(error);
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
