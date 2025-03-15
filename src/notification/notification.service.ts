import { Injectable } from '@nestjs/common';

interface AlertPayload {
  competitorId: string;
  changes: any[];
  severity: string;
}

@Injectable()
export class NotificationService {

  sendAlert(alert: AlertPayload) {
  }

}
