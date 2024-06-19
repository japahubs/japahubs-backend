
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";

interface ContentTextProps {
  value: string;
}

export class ContentText extends ValueObject<ContentTextProps> {
  public static minLength: number = 2;
  public static maxLength: number = 10000;

  get value (): string {
    return this.props.value;
  }

  private constructor (props: ContentTextProps) {
    super(props);
  }

  public static create (props: ContentTextProps): Result<ContentText> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'ContentText');

    if (nullGuardResult.isFailure) {
      return Result.fail<ContentText>(nullGuardResult.getErrorValue());
    }

    const minGuardResult = Guard.againstAtLeast(this.minLength, props.value);
    const maxGuardResult = Guard.againstAtMost(this.maxLength, props.value);

    if (minGuardResult.isFailure) {
      return Result.fail<ContentText>(minGuardResult.getErrorValue());
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<ContentText>(maxGuardResult.getErrorValue());
    }

    return Result.ok<ContentText>(new ContentText(props));
  }
}