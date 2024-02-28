import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

export interface UserPhoneProps {
  value: string;
}

export class UserPhone extends ValueObject<UserPhoneProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPhoneProps) {
    super(props);
  }

  private static isValidUserPhone(userPhone: string) {
    const phoneRegex =
      /^\+?\d{1,3}\s?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/;
    return phoneRegex.test(userPhone);
  }

  private static format(userPhone: string) {
    return userPhone.replace(/\D/g, "");
  }

  public static create(props: UserPhoneProps): Result<UserPhone> {
    if (!this.isValidUserPhone(props.value)) {
      return Result.fail<UserPhone>("invalid phone number");
    } else {
      return Result.ok<UserPhone>(
        new UserPhone({ value: this.format(props.value) })
      );
    }
  }
}
