import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
import { IUserRepo } from "../../repos/userRepo";
import { UserEmail } from "../../domain/userEmail";
import { UserPassword } from "../../domain/userPassword";
import { User, UserProps } from "../../domain/user";
import { Language } from "../../domain/language";
import { Name } from "../../domain/name";
import { Role } from "../../domain/role";
import { IAuthService } from "../../services/authService";
import { UserName } from "../../domain/userName";
import {
  Either,
  Result,
  left,
  right,
  UseCase,
  AppError,
} from "../../../../shared";
import { UserDP } from "../../domain/userDP";
import { LoginDTOResponse } from "./CreateUserDTO";
import { JWTToken, RefreshToken } from "../../../../shared/domain/jwt";

type Response = Either<
  | CreateUserErrors.UsernameTakenError
  | CreateUserErrors.TokenExpiredError
  | AppError.UnexpectedError
  | Result<any>,
  Result<LoginDTOResponse | void>>;

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
    const claims = await this.authService.decodeJWT(request.token);
    const userData = (await this.authService.getRegisteredUser(claims.email))!;

    const dpUrl = userData.isGoogleUser ? userData.avatar : "https://res.cloudinary.com/dhqv8cxqz/image/upload/v1709890679/Frame_1743_up0e8x.svg"
    const pass = userData.isGoogleUser ? `Qwerty78${userData.googleId}` : userData.password;

    const firstNameOrError = Name.create({ value: userData.firstName });
    const lastNameOrError = Name.create({ value: userData.lastName });
    const emailOrError = UserEmail.create(userData.email);
    const passwordOrError = UserPassword.create({ value: pass });
    const usernameOrError = UserName.create({ value: request.username });
    const avatarOrError = UserDP.create({url: dpUrl});

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
    const active = true;
    const reported = false;
    const deactivated = false;
    const lastActivity = new Date();
    const postCount = 0;
    const journalCount = 0;
    const opportunityCount = 0;
    const avatar: UserDP = avatarOrError.getValue();
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

      const createUserProps: UserProps = {
        firstName,
        lastName,
        email,
        password,
        username,
        dateOfBirth,
        language,
        role,
        active,
        reported,
        deactivated,
        lastActivity,
        postCount,
        journalCount,
        opportunityCount,
        avatar,
        createdAt,
        updatedAt,
      }

      if (userData.isGoogleUser) createUserProps.googleId = userData.googleId;

      const userOrError: Result<User> = User.create(createUserProps);

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();

      await this.userRepo.save(user);

      if (userData.isGoogleUser) {
      
        const accessToken: JWTToken = this.authService.signJWT({
          userId: user.userId.getStringValue(),
          email: user.email.value,
          username: user.username ? user.username.value : "",
          role: user.role,
        });
  
        const refreshToken: RefreshToken = this.authService.createRefreshToken();
  
        user.setAccessToken(accessToken, refreshToken);
        await this.authService.saveAuthenticatedUser(user);
  
        return right(Result.ok<LoginDTOResponse>({isGoogleUser: true, accessToken, refreshToken })) as Response;
      }

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
