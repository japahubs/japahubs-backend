import { RedisClient } from "redis";
import * as jwt from "jsonwebtoken";
import randtoken from "rand-token";
import { authConfig } from "../../../../config";
import { AbstractRedisClient } from "./abstractRedisClient";
import { IAuthService, RegUser } from "../authService";
import { RefreshToken, JWTToken, JWTClaims } from "../../../../shared/domain/jwt";
import { User } from "../../domain/user";
import { dispatchEventsCallback } from "../../../../shared/infra/persistence/hooks";

export class RedisAuthService
  extends AbstractRedisClient
  implements IAuthService
{
  public jwtHashName: string = "activeJwtClients";

  constructor(redisClient: RedisClient) {
    super(redisClient);
  }

  public async refreshTokenExists(
    refreshToken: RefreshToken
  ): Promise<boolean> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getEmailFromRefreshToken(
    refreshToken: RefreshToken
  ): Promise<string> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error("Email not found for refresh token.");

    const key = keys[0];

    return key.substring(
      key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1
    );
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.email.value,
        user.refreshToken,
        user.accessToken
      );
    }
  }

  public async deAuthenticateUser(email: string): Promise<void> {
    await this.clearAllSessions(email);
  }

  public createRefreshToken(): RefreshToken {
    return randtoken.uid(256) as RefreshToken;
  }

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      userId: props.userId,
      email: props.email,
      username: props.username,
      role: props.role,
    };

    return jwt.sign(claims, authConfig.secret, {
      expiresIn: authConfig.tokenExpiryTime,
    });
  }

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded);
      });
    });
  }

  private constructKey(email: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${email}`;
  }

  public addToken(
    email: string,
    refreshToken: RefreshToken,
    token: JWTToken
  ): Promise<any> {
    return this.set(this.constructKey(email, refreshToken), token);
  }

  public async clearAllTokens(): Promise<any> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashName}*`);
    return Promise.all(allKeys.map((key) => this.deleteOne(key)));
  }

  public countSessions(email: string): Promise<number> {
    return this.count(`*${this.jwtHashName}.${email}`);
  }

  public countTokens(): Promise<number> {
    return this.count(`*${this.jwtHashName}*`);
  }

  public async getTokens(email: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    return keyValues.map((kv) => kv.value);
  }

  public async getToken(email: string, refreshToken: string): Promise<string> {
    return this.getOne(this.constructKey(email, refreshToken));
  }

  public async clearToken(email: string, refreshToken: string): Promise<any> {
    return this.deleteOne(this.constructKey(email, refreshToken));
  }

  public async clearAllSessions(email: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(keys.map((key) => this.deleteOne(key)));
  }

  public async sessionExists(
    email: string,
    refreshToken: string
  ): Promise<boolean> {
    const token = await this.getToken(email, refreshToken);
    if (!!token) {
      return true;
    } else {
      return false;
    }
  }

  public async saveRegisteredUser(user: RegUser): Promise<void> {
    const userData = JSON.stringify(user);
    await this.set(user.email, userData);
    dispatchEventsCallback(user.userId);
  }

  public async getRegisteredUser(
    email: string
  ): Promise<RegUser | null> {
    const userDataString = await this.getOne(email);
    if (!userDataString) return null;
    const userData:RegUser = JSON.parse(userDataString as string);
    return userData;
  }
}
