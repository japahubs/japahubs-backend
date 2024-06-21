import { ValueObject, Result, IGuardArgument, Guard } from "../../../shared";
import { config } from "../../../shared/config/appConfig.shared";

export interface MailDetailsProps {
  userId: string;
  from?: string;
  firstName: string;
  lastName?: string;
  salutation?: string;
  message?: string;
  cta?: string;
  email: string;
  url?: string;
  token?: string;
  template?: string;
  subject?: string;
  type: string;
}

const Urls: { [key: string]: string } = {
  "user.registered": config.frontend.completeProfile,
  "user.created": config.frontend.homeUrl,
};

const Subjects: { [key: string]: string } = {
  "user.created": "Welcome To Japahub",
  "user.registered": "Verify Your Email Address",
};
const Templates: { [key: string]: string } = {
  "user.created": "welcome-email",
  "user.registered": "verification-email",
  "cta.generic": "cta-generic-email",
  "nocta.generic": "nocta-generic-email",
};

export class Mail extends ValueObject<MailDetailsProps> {
  get userId(){
    return this.props.userId;
  }

  get firstName(){
    return this.props.firstName;
  }

  get lastName(){
    return this.props.lastName;
  }

  get email(){
    return this.props.email;
  }

  get url(){
    return this.props.url;
  }

  get token(){
    return this.props.token;
  }

  get template(){
    return this.props.template;
  }

  get subject(){
    return this.props.subject;
  }
  get from(){
    return this.props.from;
  }
  get salutation(){
    return this.props.salutation;
  }
  get message(){
    return this.props.message;
  }
  get cta(){
    return this.props.cta;
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
    const url = props.url ? props.url : Urls[props.type] ? Urls[props.type] : null;

    return Result.ok<Mail>(
      new Mail({
        ...props,
        url: token ? appendToUrl(url!, token) : url!,
        subject: props.subject ? props.subject : Subjects[props.type],
        template: Templates[props.type],
      })
    );
  }
}
function appendToUrl(url: string, token: string){
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}token=${token}`;
}
