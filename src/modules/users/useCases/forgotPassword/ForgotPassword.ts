import { ForgotPasswordErrors } from "./ForgotPasswordErrors";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { IUserRepo } from "../../repos/userRepo";
import { JWTToken } from "../../../../shared/domain/jwt";
import { UserEmail } from "../../domain/userEmail";
import { IAuthService } from "../../services/authService";
import { PasswordForgotten } from "../../domain/events/passwordForgotten";
import { User } from "../../domain/user";

interface ForgotPasswordDTO {
  email: string;
}

type Response = Either<
  | ForgotPasswordErrors.EmailDoesntExistError
  | AppError.UnexpectedError,
  Result<void>
>;

export class ForgotPassword implements UseCase<ForgotPasswordDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: ForgotPasswordDTO): Promise<Response> {
    try {
      const emailOrError = UserEmail.create(request.email);
  
      if (emailOrError.isSuccess) {
        const email = emailOrError.getValue();
        let user: User;
        try {
          user = await this.userRepo.getUserByUserEmail(email);
        } catch (error) {
          return left(new ForgotPasswordErrors.EmailDoesntExistError());
        }

        // const token: JWTToken = this.authService.signJWT({
        //   userId: user.userId.getStringValue(),
        //   email: user.email.value,
        //   username: user.username ? user.username.value : "",
        //   role: user.role,
        // }, 900);
  
        user.setAccessToken("token", "token");
        user.addDomainEvent(new PasswordForgotten(user))
        await this.authService.saveAuthenticatedUser(user);
        
        return right(
          Result.ok<void>()
        );
      } else {
        return left(new ForgotPasswordErrors.EmailDoesntExistError());
      }
    } catch (err) {
      return left(new AppError.UnexpectedError((err as Error).toString()));
    }
  }
}
