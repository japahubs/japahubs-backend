import { JWTToken, JWTClaims, RefreshToken } from "../domain/jwt";
import { User } from "../domain/user";

export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  createRefreshToken(): RefreshToken;
  getTokens(email: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(email: string): Promise<void>;
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
  getEmailFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
  saveRegisteredUser(user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void>;
  getRegisteredUser(
    userId: string
  ): Promise<{ firstName; lastName; email; password } | null>;
}
