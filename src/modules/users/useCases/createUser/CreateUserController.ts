import { BaseController } from "../../../../shared/http/models/BaseController";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import * as express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CreateUserController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    let dto = req.body;

    dto = {
      firstName: TextUtils.sanitize(dto.firstName),
      lastName: TextUtils.sanitize(dto.lastName),
      email: TextUtils.sanitize(dto.email),
      password: dto.password,
    };

    try {
      const user = await prisma.user.create({ data: dto });

      if (!user) throw new Error();

      const returnDTO = {
        success: true,
        error: null,
        data: user,
      };
      res.status(201).json(returnDTO);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create user." });
    }
  }
}
