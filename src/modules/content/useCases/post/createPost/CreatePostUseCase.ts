import { CreatePostDTO } from './CreatePostDTO';
import { AppError, Either, Result, UseCase, left, right } from '../../../../../shared';
import { CreatePostErrors } from './CreatePostErrors';
import { IPostRepo } from '../../../repos/postRepo';
import { IUserRepo } from '../../../../users/repos/userRepo'
import { Post } from '../../../domain/post';
import { PostLink } from '../../../domain/postLink';
import { PostProps } from '../../../domain/post';
import { AuthorId } from '../../../domain/authorId';
import { UniqueEntityID } from '../../../../../shared';
import { PostSlug } from '../../../domain/postSlug';
import { ContentText } from '../../../domain/contentText';
import { PostImage } from '../../../domain/postImage';

type Response = Either<
  CreatePostErrors.NonExistentUserError | CreatePostErrors.EmptyPostError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

export class CreatePostUseCase implements UseCase<CreatePostDTO, Response> {
  constructor(private readonly postRepo: IPostRepo, private readonly userRepo: IUserRepo) {}

  async execute(request: CreatePostDTO): Promise<Response> {

  // Check if at least one field (caption, link, or images) has a value
  const hasContent = !!request.caption || !!request.link || !!request.images;

  if (!hasContent) {
    return left(new CreatePostErrors.EmptyPostError) as Response;
  }

  try {
    const userExists = await this.userRepo.getUserByUserId(request.userId);

      if (!userExists) {
        return left(new CreatePostErrors.NonExistentUserError());
      }
  } catch (err) {
    console.log(err)
    return left(new CreatePostErrors.NonExistentUserError());
  }

  const props: PostProps = {
    authorId: AuthorId.create(new UniqueEntityID(request.userId)).getValue(),
    createdAt: new Date(),
  }

  if (request.caption){
    const captionOrError = ContentText.create({ value: request.caption });

      if (captionOrError.isSuccess) {
        props.caption = captionOrError.getValue();

        const slugOrError = PostSlug.create(props.caption.value);
        if (slugOrError.isSuccess) {
          props.slug = slugOrError.getValue();
        }
      } else {
        return left(captionOrError);
      }
  }
  if (request.link){
    const linkOrError = PostLink.create({ url: request.link });

      if (linkOrError.isSuccess) {
        props.link = linkOrError.getValue();
      } else {
        return left(linkOrError);
      }
  }
  if (request.images) {
    let validImages: PostImage[] = []
    request.images.map((image) => {
      const imageOrError =  PostImage.create({ url: image });
      if (imageOrError.isSuccess) {
              validImages.push(imageOrError.getValue())
        }
    });
    props.images = validImages.length > 0 ? validImages : undefined;
  }
  
    try {
      
      const postOrError = Post.create(props);

      if (postOrError.isFailure) {
        return left(postOrError);
      }

      const post = postOrError.getValue();

      await this.postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
