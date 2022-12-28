import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
console.log(process.env.NODE_ENV);

@Injectable()
export class SendgridService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mail: SendGrid.MailDataRequired) {
    const mailTo =
      process.env.NODE_ENV !== 'production' ? process.env.SENDGRID_RECEIVER_EMAIL : mail.to;

    const transport = await SendGrid.send({
      ...mail,
      to: mailTo,
    });

    if (process.env.NODE_ENV !== 'production') console.log(`E-Mail sent to ${mailTo}`);
    return transport;
  }
}
