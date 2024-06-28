
import { DeleteUserDTO } from "./DeleteUserDTO";
import { DeleteUserErrors } from "./DeleteUserErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { IUserRepo } from "../../repos/userRepo";
import { UseCase } from "../../../../shared/core/UseCase";

type Response = Either<
  AppError.UnexpectedError |
  DeleteUserErrors.UserNotFoundError,
  Result<void>
>

export class DeleteUserUseCase implements UseCase<DeleteUserDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor (userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute (request: DeleteUserDTO): Promise<any> {
    try {
      try {
        const user = await this.userRepo.getUserByUserId(request.userId);

        if (request.currentUserId !== request.userId ) { /* Todo: check for admin status */
          return left(
            new DeleteUserErrors.NotCurrentUserOrAdmin()
          )
        }
  
        await this.userRepo.delete(user.userId.getStringValue());
      } catch (error) {
        return left(
          new DeleteUserErrors.UserNotFoundError()
        )
      }

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}