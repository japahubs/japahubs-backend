
import { JWTToken, RefreshToken } from "../../../../shared/domain/jwt";

export interface RefreshAccessTokenDTO {
  refreshToken: RefreshToken;
}