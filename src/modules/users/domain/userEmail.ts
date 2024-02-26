import { TextUtils } from '../../../shared/utils/TextUtils'
import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'

export interface UserEmailProps {
  value: string
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: UserEmailProps) {
    super(props)
  }

  private static format(email: string): string {
    return email.trim().toLowerCase()
  }

  public static create(email: string): Result<UserEmail> {
    if (!TextUtils.validateEmailAddress(email)) {
      return Result.fail<UserEmail>('Email address not valid')
    } else {
      return Result.ok<UserEmail>(new UserEmail({ value: this.format(email) }))
    }
  }

  public static createFromRaw(props: UserEmailProps): Result<UserEmail> {
    if (!TextUtils.validateEmailAddress(props.value)) {
      return Result.fail<UserEmail>('Email address not valid')
    } else {
      return Result.ok<UserEmail>(
        new UserEmail({ value: this.format(props.value) }),
      )
    }
  }
}
