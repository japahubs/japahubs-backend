import { NextFunction, Request, Response } from "express";
import { config } from "../../../shared/config/appConfig.shared";

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;
  if (config.api.allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};