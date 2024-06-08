import * as express from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import { AdminSendMailDTO } from "./AdminSendMailDTO";
import { SendEmail } from "../sendEmail/SendEmail";
import { Guard } from "../../../../shared";

export class AdminSendMailController extends BaseController {
  private useCase: SendEmail;

  constructor(useCase: SendEmail) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    let dto: AdminSendMailDTO = req.body as AdminSendMailDTO;

    dto = {
      from: dto.from,
      to: dto.to,
      subject: dto.subject,
      salutation: dto.salutation,
      message: dto.message,
      cta: dto.cta,
      url: dto.url,
    };

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: dto.from, argumentName: "from" },
      { argument: dto.to, argumentName: "to" },
      { argument: dto.subject, argumentName: "subject" },
      { argument: dto.salutation, argumentName: "salutation" },
      { argument: dto.message, argumentName: "message" },
    ]);

    if (guardResult.isFailure) {
      return this.fail(res, guardResult.getErrorValue());
    }

    const type = dto.cta ? "cta.generic" : "nocta.generic"
    
    const data = {
      userId: "",
      firstName: "",
      lastName: "",
      email: dto.to,
      type,
      ...dto,
    }

    const msg = {
      type,
      timestamp: new Date().toISOString(),
      data,
    }

    try {
      await this.useCase.execute(msg);

      return this.ok(res);
    } catch (err) {
      return this.fail(res, err as Error);
    }

  }
}
