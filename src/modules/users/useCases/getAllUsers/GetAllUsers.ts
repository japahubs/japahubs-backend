import { GetAllUsersRequestDTO } from "./GetAllUsersRequestDTO";
import { UserDetails } from "../../domain/userDetails";
import { IUserRepo } from "../../repos/userRepo";
import {
  Either,
  Result,
  left,
  right,
  UseCase,
  AppError,
} from "../../../../shared";


type Response = Either<
  AppError.UnexpectedError,
  Result<UserDetails[]>
>

export class GetAllUsers implements UseCase<GetAllUsersRequestDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor (userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  
  public async execute (req: GetAllUsersRequestDTO): Promise<Response> {
    try {
      const users = await this.userRepo.getGetAllUsers(req.page,req.limit,req.search);
      return right(Result.ok<UserDetails[]>(users))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}