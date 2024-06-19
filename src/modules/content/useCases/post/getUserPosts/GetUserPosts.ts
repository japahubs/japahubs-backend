
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetUserPostsRequestDTO } from "./GetUserPostsRequestDTO";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { Post } from "../../../domain/post";
import { IPostRepo } from "../../../repos/postRepo";

type Response = Either<
  AppError.UnexpectedError,
  Result<Post[]>
>

export class GetUserPosts implements UseCase<GetUserPostsRequestDTO, Promise<Response>> {
  private postRepo: IPostRepo;

  constructor (postRepo: IPostRepo) {
    this.postRepo = postRepo;
  }
  
  public async execute (req: GetUserPostsRequestDTO): Promise<Response> {
    try {
      const posts = await this.postRepo.getUserPosts(req.userId,req.page, req.limit);
      return right(Result.ok<Post[]>(posts))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}