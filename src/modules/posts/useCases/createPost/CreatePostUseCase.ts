import { CreatePostDTO } from './CreatePostDTO';
import { AppError, Either, Result, UseCase, left, right } from '../../../../shared';
import { CreatePostErrors } from './CreatePostErrors';
import { IPostRepo } from '../../repos/postRepo';
import { IUserRepo } from 'src/modules/users/repos/userRepo';
import { UserEmail } from '../../../users/domain/userEmail';
import { Post } from '../../domain/post';
import { PostTitle } from '../../domain/postTitle';
import { PostCaption } from '../../domain/postCaption';

type Response = Either<
  CreatePostErrors.NonExistentUserError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

export class CreatePostUseCase implements UseCase<CreatePostDTO, Response> {
  constructor(private readonly postRepo: IPostRepo, private readonly userRepo: IUserRepo) {}

  async execute(request: CreatePostDTO): Promise<Response> {
    const titleOrError = PostTitle.create({ value: request.title });
    const captionOrError = PostCaption.create({ value: request.caption });
    const userEmailOrError = UserEmail.create(request.userEmail);

    const payloadResult = Result.combine([titleOrError, captionOrError, userEmailOrError]);

    if (payloadResult.isFailure) {
      return left(payloadResult);
    }

    const userEmail = userEmailOrError.getValue();
    const title = titleOrError.getValue();
    const caption = captionOrError.getValue();

    try {
      const userExists = await this.userRepo.exists(userEmail);

      if (!userExists) {
        return left(new CreatePostErrors.NonExistentUserError());
      }

      const post = Post.create({
        title,
        caption,
      });

      await this.postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
