import { ValueObject } from "../../../shared/domain/ValueObject";
import { Result } from "../../../shared/core/Result";
import { IGuardArgument, Guard } from "../../../shared/core/Guard";
import { config } from "../../../shared/config/appConfig.shared";

interface MailDetailsProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  url?: string;
  token: string;
  template: string;
  subject?: string;
}

const Urls: { [key: string]: string } = {
  "user-registered": config.frontend.completeProfile,
};

const Subjects: { [key: string]: string } = {
  "user-created": "Welcome To Japahubs",
  "user-registered": "Verify Your Email Address",
};

export class Mail extends ValueObject<MailDetailsProps> {
  get userId(): string {
    return this.props.userId;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email;
  }

  get url(): string {
    return this.props.url;
  }

  get token(): string {
    return this.props.token;
  }

  get template(): string {
    return this.props.template;
  }

  get subject(): string {
    return this.props.subject;
  }

  private constructor(props: MailDetailsProps) {
    super(props);
  }

  public static create(props: MailDetailsProps): Result<Mail> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.userId, argumentName: "userId" },
      { argument: props.firstName, argumentName: "firstName" },
      { argument: props.lastName, argumentName: "lastName" },
      { argument: props.email, argumentName: "email" },
      { argument: props.token, argumentName: "token" },
      { argument: props.template, argumentName: "template" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<Mail>(guardResult.getErrorValue());
    }

    return Result.ok<Mail>(
      new Mail({
        ...props,
        url: Urls[props.template]
          ? `${Urls[props.template]}?token=${props.token}`
          : null,
        subject: Subjects[props.template],
      })
    );
  }
}
