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
      lastName: msg.data.lastName,
      email: msg.data.email,
      type: msg.type,
    };

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
