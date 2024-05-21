import { SendEmail } from "./SendEmail";
import { sendGridEmailService } from "../../services/mailer";
import { mailTrapEmailService } from "../../services/mailer";

const sendEmail = new SendEmail(mailTrapEmailService);

export { sendEmail };
