import { Mail } from "src/modules/notification/domain/mail";
import { IEmailService } from "../emailService";

export class SendGridEmailService implements IEmailService {
  constructor() {}

  sendMessage(mail: Mail): Promise<void> {
    //not yet implemented
    console.log(`{
        userId: ${mail.userId}
        firstName: ${mail.firstName}
        lastName: ${mail.lastName}
        email: ${mail.email}
        url?: ${mail.url}
        template?: ${mail.template}
        subject?: ${mail.subject}
      }`);
    return;
  }
}
