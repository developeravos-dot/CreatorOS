import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CommandCenterBrief,
  SystemHealthRecord,
} from '../media-command-center.types';

@Injectable()
export class SystemHealthMonitorService {
  buildBaseline(
    brief: CommandCenterBrief,
  ): SystemHealthRecord[] {
    const systems =
      brief.connectedSystems ??
      [
        'Creative Intelligence',
        'Audience & Distribution',
        'IP & Brand Growth',
        'Intelligence Core',
        'Organization & Automation',
      ];

    return systems.map((system) => ({
      id: randomUUID(),
      system,
      status: 'healthy',
      score: 95,
      checkedAt: new Date().toISOString(),
      metrics: {
        availability: 100,
        quality: 95,
        readiness: 95,
      },
      issues: [],
    }));
  }

  update(
    record: SystemHealthRecord,
    metrics: Record<string, number>,
  ) {
    const values = Object.values(metrics).map((value) =>
      Math.max(0, Math.min(100, value)),
    );

    const score =
      values.length === 0
        ? record.score
        : Math.round(
            values.reduce((sum, value) => sum + value, 0) /
              values.length,
          );

    record.metrics = {
      ...record.metrics,
      ...metrics,
    };
    record.score = score;
    record.checkedAt = new Date().toISOString();
    record.status =
      score >= 85
        ? 'healthy'
        : score >= 65
          ? 'warning'
          : score > 0
            ? 'critical'
            : 'offline';
    record.issues =
      record.status === 'healthy'
        ? []
        : [`${record.system}-health-below-target`];

    return record;
  }

  overall(records: SystemHealthRecord[]) {
    if (records.length === 0) {
      return 0;
    }

    return Math.round(
      records.reduce((sum, item) => sum + item.score, 0) /
        records.length,
    );
  }
}