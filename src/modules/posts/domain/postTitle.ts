import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

type PostTitleProps = {
  value: string;
};

export class PostTitle extends ValueObject<PostTitleProps> {
  public static minLength = 2;
  public static maxLength = 100;

  get value(): string {
    return this.props.value;
  }

  static create(props: PostTitleProps): Result<PostTitle> {
    const lengthGuard = Guard.combine([
      Guard.againstAtLeast(this.minLength, props.value),
      Guard.againstAtMost(this.maxLength, props.value),
    ]);

    if (lengthGuard.isFailure) {
      return Result.fail<PostTitle>(lengthGuard.getErrorValue());
    }

    return Result.ok<PostTitle>(new PostTitle(props));
  }
}
