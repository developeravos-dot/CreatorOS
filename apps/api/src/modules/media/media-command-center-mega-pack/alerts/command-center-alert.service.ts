import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CommandCenterAlert } from '../media-command-center.types';

@Injectable()
export class CommandCenterAlertService {
  create(
    severity: CommandCenterAlert['severity'],
    source: string,
    title: string,
    details: string,
  ): CommandCenterAlert {
    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      severity,
      source,
      title,
      details,
      acknowledged: false,
    };
  }

  acknowledge(
    alert: CommandCenterAlert,
    acknowledgedBy: string,
  ) {
    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date().toISOString();
    return alert;
  }
}