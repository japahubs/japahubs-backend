

import { UseCase } from "../../../../../shared/core/UseCase"; 
import { IPostRepo } from "../../../repos/postRepo";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { GetPostBySlugErrors } from "./GetPostBySlugErrors";
import { GetPostBySlugDTO } from "./GetPostBySlugDTO";
import { Post } from "src/modules/content/domain/post";

type Response = Either<
  GetPostBySlugErrors.PostNotFoundByPostIdError | GetPostBySlugErrors.PostNotFoundBySlugError |
  AppError.UnexpectedError,
  Result<Post>
>

export class GetPostBySlug implements UseCase<any, Promise<Response>> {
  private postRepo: IPostRepo;

  constructor (postRepo: IPostRepo) {
    this.postRepo = postRepo;
  }

  public async execute (req: GetPostBySlugDTO): Promise<Response> {
    let post: Post;
    const { slug } = req;
    const isPostId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    try {
      if (isPostId){

        try {
          post = await this.postRepo.getPostByPostId(slug);
        } catch (err) {
          return left(new GetPostBySlugErrors.PostNotFoundByPostIdError(slug));
        }
        return right(Result.ok<Post>(post));

      } else {

        try {
          post = await this.postRepo.getPostBySlug(slug);
        } catch (err) {
          return left(new GetPostBySlugErrors.PostNotFoundBySlugError(slug));
        }
        return right(Result.ok<Post>(post));

      }
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }

}