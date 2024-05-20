import { MailTrapEmailService } from "./implementations/mailTrapEmailService";
import { SendGridEmailService } from "./implementations/sendGridEmailService";

const sendGridEmailService = new SendGridEmailService();
const mailTrapEmailService = new MailTrapEmailService();

export { sendGridEmailService, mailTrapEmailService };
