import { Mail } from "../../domain/mail";

export interface IEmailService {
  sendEmail(mail: Mail): Promise<void>;
}
