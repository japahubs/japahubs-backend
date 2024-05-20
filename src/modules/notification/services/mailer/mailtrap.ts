import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from "../../../../config";

const smtpConfig: SMTPTransport.Options = {
  host: config.nodeMailerHost,
  port: parseInt(config.nodeMailerPort, 10),
  auth: {
    user: config.nodeMailerUsername,
    pass: config.nodeMailerPassword,
  },
};

const mailTrap = (): Mail => {
  const smtpTransport: Mail = nodemailer.createTransport(smtpConfig);

  return smtpTransport;
};

export { mailTrap };
