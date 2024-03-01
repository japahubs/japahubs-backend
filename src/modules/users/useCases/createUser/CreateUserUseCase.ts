import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
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
import { UserName } from "../../domain/userName";

type Response = Either<
  | CreateUserErrors.UsernameTakenError
  | CreateUserErrors.TokenExpiredError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<Response>>
{
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  async execute(request: CreateUserDTO): Promise<Response> {
    if (!!request.token === false) {
      return left(new CreateUserErrors.TokenExpiredError()) as Response;
    }
    const userData = await this.authService.getRegisteredUser(request.token);

    const firstNameOrError = Name.create({ value: userData.firstName });
    const lastNameOrError = Name.create({ value: userData.lastName });
    const emailOrError = UserEmail.create(userData.email);
    const passwordOrError = UserPassword.create({ value: userData.password });
    const usernameOrError = UserName.create({ value: request.username });

    const dtoResult = Result.combine([
      firstNameOrError,
      lastNameOrError,
      emailOrError,
      passwordOrError,
      usernameOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const firstName: Name = firstNameOrError.getValue();
    const lastName: Name = lastNameOrError.getValue();
    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const username: UserName = usernameOrError.getValue();
    const dateOfBirth = new Date(request.dateOfBirth);
    const language: Language = Language.create({ value: "English" }).getValue();
    const role: Role = "USER";
    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const alreadyCreatedUserByUserName =
        await this.userRepo.getUserByUserName(username);

      const userNameTaken = !!alreadyCreatedUserByUserName === true;

      if (userNameTaken) {
        return left(
          new CreateUserErrors.UsernameTakenError(username.value)
        ) as Response;
      }

      const userOrError: Result<User> = User.create({
        firstName,
        lastName,
        email,
        password,
        username,
        dateOfBirth,
        language,
        role,
        createdAt,
        updatedAt,
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();

      await this.userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
