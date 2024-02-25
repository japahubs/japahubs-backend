import { Mail } from "../../domain/mail";

export interface IEmailService {
  sendMessage(mail: Mail): Promise<void>;
}
