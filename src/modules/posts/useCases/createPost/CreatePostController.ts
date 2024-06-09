import express from "express";
import { DecodedExpressRequest, TextUtils } from "src/shared";
import { BaseController } from "src/shared/infra/http/models/BaseController";
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

    dto = {

    };

    try {
      const result = await this.useCase.execute(dto);
    
      if (result.isRight()) {
          return this.ok(res);
      } else {
        const error = result.value;
    
        switch (error.constructor) {
          case CreatePostErrors.Error:
            return this.conflict(res, error.getErrorValue().message);
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