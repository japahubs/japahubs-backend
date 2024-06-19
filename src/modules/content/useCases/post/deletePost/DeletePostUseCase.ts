
import { DeletePostDTO } from "./DeletePostDTO";
import { DeletePostErrors } from "./DeletePostErrors";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IPostRepo } from "../../../repos/postRepo";
import { UseCase } from "../../../../../shared/core/UseCase";

type Response = Either<
  AppError.UnexpectedError |
  DeletePostErrors.PostNotFoundError,
  Result<void>
>

export class DeletePostUseCase implements UseCase<DeletePostDTO, Promise<Response>> {
  private postRepo: IPostRepo;

  constructor (postRepo: IPostRepo) {
    this.postRepo = postRepo;
  }

  public async execute (request: DeletePostDTO): Promise<any> {
    try {
      const post = await this.postRepo.getPostByPostId(request.postId);
      const postFound = !!post === true;

      if (!postFound) {
        return left(
          new DeletePostErrors.PostNotFoundError()
        )
      }

      await this.postRepo.deletePostByPostId(post.postId);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}