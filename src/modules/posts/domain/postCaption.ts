import { Guard } from '../../../shared';
import { Result } from '../../../shared';
import { ValueObject } from '../../../shared';

type PostCaptionProps = {
  value: string;
};

export class PostCaption extends ValueObject<PostCaptionProps> {
  public static minLength = 2;
  public static maxLength = 10_000;

  get value(): string {
    return this.props.value;
  }

  static create(props: PostCaptionProps): Result<PostCaption> {
    const lengthGuard = Guard.combine([
      Guard.againstAtLeast(this.minLength, props.value),
      Guard.againstAtMost(this.maxLength, props.value),
    ]);

    if (lengthGuard.isFailure) {
      return Result.fail<PostCaption>(lengthGuard.getErrorValue());
    }

    return Result.ok<PostCaption>(new PostCaption(props));
  }
}
