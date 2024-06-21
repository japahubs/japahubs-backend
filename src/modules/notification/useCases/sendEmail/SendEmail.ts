import { Result, left, UseCase } from "../../../../shared";
import { Mail, MailDetailsProps } from "../../domain/mail";
import { IEmailService } from "../../services/mailer/emailService";
import { authService } from "../../../users/services";

interface Message {
  type: string;
  timestamp: string;
  data: any;
}

export class SendEmail implements UseCase<Message, Promise<void>> {
  private emailService: IEmailService;

  constructor(emailService: IEmailService) {
    this.emailService = emailService;
  }

  async execute(msg: Message): Promise<void> {
    const mailProps: MailDetailsProps = {
      userId: msg.data.userId,
      firstName: msg.data.firstName,
      lastName: msg.data.lastName || "",
      email: msg.data.email,
      type: msg.type,
    };
   
    if( msg.data.from) mailProps.from = msg.data.from;
    if( msg.data.subject) mailProps.subject = msg.data.subject;
    if( msg.data.salutation) mailProps.salutation = msg.data.salutation;
    if( msg.data.message) mailProps.message = msg.data.message;
    if( msg.data.cta) mailProps.cta = msg.data.cta;
    if( msg.data.url) mailProps.url = msg.data.url;
    
    if (msg.type === "user.registered" || msg.type === "user.forgotpassword") {
      mailProps.token = authService.signJWT({
        userId: msg.data.userId,
        email: msg.data.email,
        username: "",
        role: "",
      });
    }

    const mailOrError = Mail.create(mailProps);

    if (mailOrError.isFailure) {
      left(Result.fail<Mail>(mailOrError.getErrorValue().toString()));
    }

    const mail: Mail = mailOrError.getValue();

    await this.emailService.sendEmail(mail);
  }
}
