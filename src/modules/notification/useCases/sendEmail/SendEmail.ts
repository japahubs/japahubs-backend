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
    mail.token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Ijc1ODJkMjU5OTJlZmZmNTcwMzYzMmUwMjliNzlmNGIyIn0.e30.eM2Is6Q_O4g4YDZwpVEZqWs0p2NBS4rLQQZOPGeI36GHutIr3kjjPFHgDP-jmtnHBTZC-rnbtzYg5aL5wljlFg";

    await this.emailService.sendMessage(mail);
  }
}
