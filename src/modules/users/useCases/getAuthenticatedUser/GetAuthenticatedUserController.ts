import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import { GetUserByEmail } from "../getUserByEmail/GetUserByEmail";
import { UserMap } from "../../mappers/userMap";
import * as express from "express";

export class GetAuthenticatedUserController extends BaseController {
  private useCase: GetUserByEmail;

  constructor(useCase: GetUserByEmail) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const { email } = req.decoded;

    try {
      const result = await this.useCase.execute({ email });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      } else {
        const user = result.value.getValue();
        return this.ok(res, {
          user: UserMap.toDTO(user),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
