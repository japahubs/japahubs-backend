import { JWTToken, RefreshToken } from "../../domain/jwt";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}
