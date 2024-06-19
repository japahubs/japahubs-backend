import express from "express";
import { DecodedExpressRequest, TextUtils } from "../../../../../shared";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { CreatePostUseCase } from "./CreatePostUseCase";
import { CreatePostDTO } from "./CreatePostDTO";
import { CreatePostErrors } from "./CreatePostErrors";

export class CreatePostController extends BaseController {
  constructor(private readonly useCase:CreatePostUseCase) {
    super();
  }

  protected async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    let dto = req.body as CreatePostDTO;

    const { userId } = req.decoded;

    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto);
    
      if (result.isRight()) {
          return this.ok(res);
      } else {
        const error = result.value;
    
        switch (error.constructor) {
          case CreatePostErrors.NonExistentUserError:
            return this.notFound(res, error.getErrorValue().message)
          case CreatePostErrors.EmptyPostError:
            return this.fail(res, error.getErrorValue().message);
          default:
            console.log(error);
            return this.fail(res, error.getErrorValue().message);
        }
      }
    } catch (err) {
      return this.fail(res, err as Error);
    }
  }
}