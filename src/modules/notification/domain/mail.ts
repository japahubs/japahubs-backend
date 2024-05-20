import { ValueObject, Result, IGuardArgument, Guard } from "../../../shared";
import { config } from "../../../shared/config/appConfig.shared";

export interface MailDetailsProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  url?: string;
  token?: string;
  template?: string;
  subject?: string;
  type: string;
}

const Urls: { [key: string]: string } = {
  "user.registered": config.frontend.completeProfile,
  "user.created": config.frontend.loginUrl,
};

const Subjects: { [key: string]: string } = {
  "user.created": "Welcome To Japahub",
  "user.registered": "Verify Your Email Address",
};
const Templates: { [key: string]: string } = {
  "user.created": "welcome-email",
  "user.registered": "verification-email",
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
      { argument: props.type, argumentName: "type" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<Mail>(guardResult.getErrorValue());
    }

    const token = props.token ? props.token : null;
    const url = Urls[props.type] ? Urls[props.type] : null;

    return Result.ok<Mail>(
      new Mail({
        ...props,
        url: token ? appendToUrl(url, token) : url,
        subject: Subjects[props.type],
        template: Templates[props.type],
      })
    );
  }
}
function appendToUrl(url: string, token: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}token=${token}`;
}
