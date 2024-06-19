
import { DeletePostUseCase } from "./DeletePostUseCase";
import { DeletePostDTO } from "./DeletePostDTO";
import { DeletePostErrors } from "./DeletePostErrors";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import * as express from 'express'
import { DecodedExpressRequest } from "../../../../../shared";

export class DeletePostController extends BaseController {
  private useCase: DeletePostUseCase;

  constructor (useCase: DeletePostUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl (req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const postId = req.params.postId as string
    if (!postId){
      return this.fail(res, new Error("Kindly provide a postId"))
    }
    const dto: DeletePostDTO = {postId}

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
  
        switch (error.constructor) {
          case DeletePostErrors.PostNotFoundError:
            return this.notFound(res, error.getErrorValue().message)
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