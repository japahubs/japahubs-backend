import { ValueObject } from "../../../shared/domain/ValueObject";
import { Result } from "../../../shared/core/Result";
import { IGuardArgument, Guard } from "../../../shared/core/Guard";

interface MailDetailsProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  url?: string;
  token?: string;
  template?: string;
  subject?: string;
}

const Urls: { [key: string]: string } = {
  "user-created": "https://japahubs.com/complete-profile",
};

const Subjects: { [key: string]: string } = {
  "user-created": "Confirm your email to continue",
  "profile-completed": "Welcome to Japahubs",
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

  set token(token: string) {
    this.props.token = token;
    if (this.props.url) {
      const separator = this.props.url.includes("?") ? "&" : "?";
      this.props.url = `${this.props.url}${separator}token=${token}`;
    }
  }

  set template(template: string) {
    this.props.template = template;
    // set url and subject based on template
    this.props.url = Urls[template] ? Urls[template] : null;
    this.props.subject = Subjects[template];
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
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<Mail>(guardResult.getErrorValue());
    }

    return Result.ok<Mail>(
      new Mail({
        ...props,
      })
    );
  }
}
