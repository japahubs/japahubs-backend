import { JWTToken, RefreshToken } from "../../../../shared/domain/jwt";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}
