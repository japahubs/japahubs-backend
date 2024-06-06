
import { UseCase } from "../../../../shared/core/UseCase";
import { IAuthService } from "../../services/authService";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { JWTToken, RefreshToken } from "../../domain/jwt";
import { RefreshAccessTokenErrors } from "./RefreshAccessTokenErrors";
import { IUserRepo } from "../../repos/userRepo";
import { User } from "../../domain/user";
import { RefreshAccessTokenDTO } from "./RefreshAccessTokenDTO";

type Response = Either<
  RefreshAccessTokenErrors.RefreshTokenNotFound |
  AppError.UnexpectedError,
  Result<JWTToken>
>

export class RefreshAccessToken implements UseCase<RefreshAccessTokenDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor (userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute (req: RefreshAccessTokenDTO): Promise<Response> {
    const { refreshToken } = req;
    let user: User;
    let email: string;

    try {

      // Get the username for the user that owns the refresh token
      try {
        email = await this.authService.getEmailFromRefreshToken(refreshToken);
      } catch (err) {
        return left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
      }
    

      try {
        // get the user by username
        user = await this.userRepo.getUserByUserEmail(email);
      } catch (err) {
        return left(new RefreshAccessTokenErrors.UserNotFoundOrDeletedError());
      }
      
      const accessToken: JWTToken = this.authService.signJWT({
        userId: user.userId.getStringValue(),
        email: user.email.value,
        username: user.username.value,
        role: user.role,
      });

      // sign a new jwt for that user
      user.setAccessToken(accessToken, refreshToken);
        
      // save it
      await this.authService.saveAuthenticatedUser(user); 

      // return the new access token
      return right(Result.ok<JWTToken>(accessToken))

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}