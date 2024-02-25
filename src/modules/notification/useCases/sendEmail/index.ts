import { SendEmail } from "./SendEmail";
import { emailService } from "../../services/mailer";

const sendEmail = new SendEmail(emailService);

export { sendEmail };
