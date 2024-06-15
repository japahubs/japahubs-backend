import { ValueObject } from "../../../shared/domain/ValueObject";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";

interface PostImageProps {
  url: string;
}

export class PostImage extends ValueObject<PostImageProps> {
  get url(): string {
    return this.props.url;
  }

  private constructor(props: PostImageProps) {
    super(props);
  }

  public static create(props: PostImageProps): Result<PostImage> {
    const nullGuard = Guard.againstNullOrUndefined(props.url, "url");

    if (nullGuard.isFailure) {
      return Result.fail<PostImage>(nullGuard.getErrorValue());
    }

    // Optional checks for file size or other image properties

    return Result.ok<PostImage>(new PostImage(props));
  }
}
