import { ResetPasswordErrors } from "./ResetPasswordErrors";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { IUserRepo } from "../../repos/userRepo";
import { JWTToken } from "../../../../shared/domain/jwt";
import { UserEmail } from "../../domain/userEmail";
import { IAuthService } from "../../services/authService";
import { User } from "../../domain/user";
import { UserPassword } from "../../domain/userPassword";
import { PasswordReset } from "../../domain/events/passwordReset";

interface ResetPasswordDTO {
  email:string;
  oldPassword:string;
  password: string;
  passwordConfirm: string;
}

type Response = Either<
  | ResetPasswordErrors.EmailDoesntExistError | ResetPasswordErrors.InvalidPasswordError 
  | ResetPasswordErrors.InvalidPasswordError | ResetPasswordErrors.IncorrectPassword
  | AppError.UnexpectedError,
  Result<void>
>;

export class LoggedInUserResetPassword implements UseCase<ResetPasswordDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: ResetPasswordDTO): Promise<Response> {
    if (request.password !== request.passwordConfirm) {
      return left(new ResetPasswordErrors.PasswordMismatchError());
    }

    try {
      const emailOrError = UserEmail.create(request.email);
      const newPasswordOrError = UserPassword.create({ value: request.password });
      const oldPasswordOrError = UserPassword.create({ value: request.oldPassword });

      const dtoResult = Result.combine([
        emailOrError,
        newPasswordOrError,
        oldPasswordOrError,
      ]);
  
      if (dtoResult.isSuccess) {
        const email = emailOrError.getValue();

        let user: User;
        try {
          user = await this.userRepo.getUserByUserEmail(email);
        } catch (error) {
          return left(new ResetPasswordErrors.EmailDoesntExistError());
        }
  
        const oldPassword = oldPasswordOrError.getValue();
        const passwordValid = await user.password.comparePassword(oldPassword.value);
  
        if (!passwordValid) {
            return left(new ResetPasswordErrors.IncorrectPassword());
        }
        const newPassword = newPasswordOrError.getValue();

        user.addDomainEvent(new PasswordReset(user))
        user.updatePassword(newPassword)

        await this.userRepo.save(user);
        
        return right(
          Result.ok<void>()
        );
      } else {
        return left(new ResetPasswordErrors.InvalidPasswordError());
      }
    } catch (err) {
      return left(new AppError.UnexpectedError((err as Error).toString()));
    }
  }
}
