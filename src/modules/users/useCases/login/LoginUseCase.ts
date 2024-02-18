import { LoginDTO, LoginDTOResponse } from "./LoginDTO";
import { LoginUseCaseErrors } from "./LoginErrors";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { IUserRepo } from "../../repos/userRepo";
import { User } from "../../domain/user";
import { UserPassword } from "../../domain/userPassword";
import { JWTClaims, JWTToken, RefreshToken } from "../../domain/jwt";
import { UserEmail } from "../../domain/userEmail";

export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken;
  createRefreshToken(): RefreshToken;
  saveAuthenticatedUser(user: User): Promise<void>;
}

type Response = Either<
  | LoginUseCaseErrors.IncorrectPasswordError
  | LoginUseCaseErrors.EmailDoesntExistError
  | AppError.UnexpectedError,
  Result<LoginDTOResponse>
>;

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: LoginDTO): Promise<Response> {
    let user: User;
    let email: UserEmail;
    let password: UserPassword;

    try {
      const emailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });
      const payloadResult = Result.combine([emailOrError, passwordOrError]);

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.getErrorValue()));
      }

      email = emailOrError.getValue();
      password = passwordOrError.getValue();

      user = await this.userRepo.getUserByUserEmail(email);
      const userFound = !!user;

      if (!userFound) {
        return left(new LoginUseCaseErrors.EmailDoesntExistError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.IncorrectPasswordError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        userId: user.userId.getStringValue(),
        email: user.email.value,
        username: user.username.value,
        role: user.role,
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken,
        })
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()));
    }
  }
}
