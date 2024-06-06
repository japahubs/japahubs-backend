import * as express from "express";
import { ContinueWithGoogle } from "./ContinueWithGoogle";
import { ContinueWithGoogleErrors } from "./ContinueWithGoogleErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import { ContinueWithGoogleRequestDTO, ContinueWithGoogleResponseDTO } from "./ContinueWithGoogleDTO";


export class ContinueWithGoogleController extends BaseController {
  private useCase: ContinueWithGoogle;

  constructor(useCase: ContinueWithGoogle) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: ContinueWithGoogleRequestDTO = req.body as ContinueWithGoogleRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ContinueWithGoogleErrors.GoogleTokenNotGenuine:
            return this.unauthorized(res, error.getErrorValue().message);
          case ContinueWithGoogleErrors.FetchAccountDetailsError:
            return this.unauthorized(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const dto: ContinueWithGoogleResponseDTO =
          result.value.getValue() as ContinueWithGoogleResponseDTO;

          if (!dto.isNew){
            res.cookie("jwt", dto.refreshToken, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
          }

        return this.ok<ContinueWithGoogleResponseDTO>(res, dto);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
