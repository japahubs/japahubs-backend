import { RegisterUserDTO } from "./RegisterUserDTO";
import { RegisterUserErrors } from "./RegisterUserErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { IUserRepo } from "../../repos/userRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import { UserEmail } from "../../domain/userEmail";
import { UserPassword } from "../../domain/userPassword";
import { User } from "../../domain/user";
import { Language } from "../../domain/language";
import { Name } from "../../domain/name";
import { Role } from "../../domain/role";
import { IAuthService } from "../../services/authService";

type Response = Either<
  | RegisterUserErrors.EmailAlreadyExistsError
  | RegisterUserErrors.PasswordMismatchError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class RegisterUserUseCase
  implements UseCase<RegisterUserDTO, Promise<Response>>
{
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.authService = authService;
    this.userRepo = userRepo;
  }

  async execute(request: RegisterUserDTO): Promise<Response> {
    if (request.password !== request.passwordConfirm) {
      return left(new RegisterUserErrors.PasswordMismatchError()) as Response;
    }
    const firstNameOrError = Name.create({ value: request.firstName });
    const lastNameOrError = Name.create({ value: request.lastName });
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });

    const dtoResult = Result.combine([
      firstNameOrError,
      lastNameOrError,
      emailOrError,
      passwordOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const firstName: Name = firstNameOrError.getValue();
    const lastName: Name = lastNameOrError.getValue();
    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const language: Language = Language.create({ value: "English" }).getValue();
    const role: Role = "USER";
    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const userAlreadyExists = await this.userRepo.exists(email);

      if (userAlreadyExists) {
        return left(
          new RegisterUserErrors.EmailAlreadyExistsError(email.value)
        ) as Response;
      }

      const userOrError: Result<User> = User.create(
        {
          firstName,
          lastName,
          email,
          password,
          language,
          role,
          createdAt,
          updatedAt,
        },
        true
      );

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();

      await this.authService.saveRegisteredUser({
        userId: user.userId.getStringValue(),
        firstName: user.firstName.value,
        lastName: user.lastName.value,
        email: user.email.value,
        password: user.password.value,
      });

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
