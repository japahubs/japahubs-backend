import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared";
import { GetUserByUsername } from "../getUserByUsername/GetUserByUsername";
import { UserMap } from "../../mappers/userMap";
import * as express from "express";

export class GetUserProfileController extends BaseController {
  private useCase: GetUserByUsername;

  constructor(useCase: GetUserByUsername) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    
    const username: string  = req.params.username ? req.params.username as string : req.decoded.username;

    try {
      const result = await this.useCase.execute({ username });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      } else {
        const user = result.value.getValue();
        return this.ok(res, {
          user: UserMap.toDTO(user),
        });
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}
