
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { DeleteUserDTO } from "./DeleteUserDTO";
import { DeleteUserErrors } from "./DeleteUserErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import * as express from 'express'
import { DecodedExpressRequest } from "../../../../shared";

export class DeleteUserController extends BaseController {
  private useCase: DeleteUserUseCase;

  constructor (useCase: DeleteUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl (req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const userId: string  = req.params.userId ? req.params.userId as string : req.decoded.userId;
    
    const dto: DeleteUserDTO = {userId, currentUserId: req.decoded.userId};
    
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
  
        switch (error.constructor) {
          case DeleteUserErrors.UserNotFoundError:
            return this.notFound(res, error.getErrorValue().message)
          case DeleteUserErrors.NotCurrentUserOrAdmin:
            return this.forbidden(res, error.getErrorValue().message)
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } 
      
      else {
        return this.ok(res);
      }

    } catch (err) {
      return this.fail(res, err)
    }
  }
}