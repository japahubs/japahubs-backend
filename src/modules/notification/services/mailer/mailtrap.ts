import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { config } from "src/config";

const mailTrap = (): Mail => {
  const smtpTransport: Mail = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    auth: {
      user: config.MAIL_USERNAME,
      pass: config.MAIL_PASSWORD,
    },
  });

  return smtpTransport;
};

export { mailTrap };
