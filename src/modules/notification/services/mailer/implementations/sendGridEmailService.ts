import * as nodemailer from "nodemailer";
import * as pug from "pug";
import { convert } from "html-to-text";
import path from "path";

import { Mail } from "src/modules/notification/domain/mail";
import { IEmailService } from "../emailService";
import { config } from "../../../../../config";

const options = {
  wordwrap: 130,
};

export class SendGridEmailService implements IEmailService {
  constructor() {}

  transport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: config.sendGridUsername,
        pass: config.sendGridPassword,
      },
    });
  }

  async sendEmail(mail: Mail): Promise<void> {
    // 1) Render HTML based on a pug template
    const filePath = path.join(
      __dirname,
      `../../../../../../public/email-templates/${mail.template}.pug`
    );
    const html = pug.renderFile(filePath, {
      firstName: mail.firstName,
      lastName: mail.lastName,
      url: mail.url,
      email: mail.email,
      subject: mail.subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: "support@japahub.com",
      to: mail.email,
      subject: mail.subject,
      html,
      text: convert(html, options),
    };

    // 3) Create a transport and send email
    await this.transport().sendMail(mailOptions);
  }
}
