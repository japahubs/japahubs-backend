import { Either, Result, left } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Mail, MailDetailsProps } from "../../domain/mail";
import { IEmailService } from "../../services/mailer/emailService";

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
      template: msg.type,
    };

    if (msg.type === "user-registered" || msg.type === "forgot-password") {
      mailProps.token = createToken(msg.data.email, msg.data.userId);
    }

    const mailOrError = Mail.create(mailProps);

    if (mailOrError.isFailure) {
      left(Result.fail<Mail>(mailOrError.getErrorValue().toString()));
    }

    const mail: Mail = mailOrError.getValue();

    await this.emailService.sendMessage(mail);
  }
}

function createToken(email: string, userId: string): string {
  // not implemented yet
  return userId;
}
