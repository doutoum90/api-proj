import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
  private slack = new WebClient(process.env.SLACK_TOKEN);

  async sendSlackAlert(message: string) {
    await this.slack.chat.postMessage({
      channel: '#veille',
      text: message,
    });
  }

  async sendEmailAlert(to: string, subject: string, text: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
    await sgMail.send({ to, from: 'alertes@veille.com', subject, text });
  }
}