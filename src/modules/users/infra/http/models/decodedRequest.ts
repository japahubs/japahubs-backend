
import express from 'express';
import { JWTClaims } from "../../../../../shared/domain/jwt";

export interface DecodedExpressRequest extends express.Request {
  decoded: JWTClaims
}