import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import * as pug from "pug";
import { convert } from "html-to-text";
import path from "path";

import { Mail } from "src/modules/notification/domain/mail";
import { IEmailService } from "../emailService";
import { config } from "../../../../../config";

const options = {
  wordwrap: 130,
};

const smtpConfig: SMTPTransport.Options = {
  host: config.nodeMailerHost,
  port: parseInt(config.nodeMailerPort!, 10),
  auth: {
    user: config.nodeMailerUsername,
    pass: config.nodeMailerPassword,
  },
};

export class MailTrapEmailService implements IEmailService {
  constructor() {}

  transport() {
    const smtpTransport = nodemailer.createTransport(smtpConfig);

    return smtpTransport;
  }

  async sendEmail(mail: Mail): Promise<void> {
    // 1) Render HTML based on a pug template
    const filePath = path.join(
      __dirname,
      `../../../../../../public/email-templates/${mail.template}.pug`
    );
    const html = pug.renderFile(filePath, {
      from: mail.from,
      subject: mail.subject,
      salutation: mail.salutation,
      message: mail.message,
      cta: mail.cta,
      url: mail.url,
      firstName: mail.firstName,
      lastName: mail.lastName,
      email: mail.email,
    });

    // 2) Define email options
    const mailOptions = {
      from: mail.from || "noreply@japahub.com",
      to: mail.email,
      subject: mail.subject,
      html,
      text: convert(html, options),
    };

    // 3) Create a transport and send email
    await this.transport().sendMail(mailOptions);
  }
}
