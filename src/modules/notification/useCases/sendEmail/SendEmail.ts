import { Either, Result, left } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Mail } from "../../domain/mail";
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
    const mailOrError = Mail.create({
      userId: msg.data.userId,
      firstName: msg.data.firstName,
      lastName: msg.data.lastName,
      email: msg.data.email,
    });

    if (mailOrError.isFailure) {
      left(Result.fail<Mail>(mailOrError.getErrorValue().toString()));
    }

    const mail: Mail = mailOrError.getValue();

    mail.template = msg.type;
    mail.token = "test-token";

    await this.emailService.sendMessage(mail);
  }
}
