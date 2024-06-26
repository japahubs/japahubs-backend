import { GetUserByUsernameDTO } from "./GetUserByUsernameDTO";
import { GetUserByUsernameErrors } from "./GetUserByUsernameErrors";
import { left, Result, Either, right } from "../../../../shared/core/Result";
import { UserName } from "../../domain/userName";
import { IUserRepo } from "../../repos/userRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import { AppError } from "../../../../shared/core/AppError";
import { User } from "../../domain/user";

type Response = Either<AppError.UnexpectedError, Result<User>>;

export class GetUserByUsername
  implements UseCase<GetUserByUsernameDTO, Promise<Response>>
{
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: GetUserByUsernameDTO): Promise<Response> {
    try {
      const usernameOrError = UserName.create({value: request.username});

      if (usernameOrError.isFailure) {
        return left(
          Result.fail<any>(usernameOrError.getErrorValue().toString())
        ) as Response;
      }

      const username: UserName = usernameOrError.getValue();

      const user = await this.userRepo.getUserByUserName(username);
      const userFound = !!user === true;

      if (!userFound) {
        return left(
          new GetUserByUsernameErrors.UserNotFoundError(username.value)
        ) as Response;
      }

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
