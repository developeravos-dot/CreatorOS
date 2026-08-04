import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseAuditEvent {
  readonly auditId: string;
  readonly actor: string;
  readonly action: string;
  readonly resource: string;
  readonly outcome:
    | 'success'
    | 'failure';
  readonly occurredAt: Date;
}

@Injectable()
export class EnterpriseAuditIntelligenceService {
  analyze(
    events:
      readonly EnterpriseAuditEvent[],
  ) {
    if (events.length === 0) {
      return {
        anomalyScore: 0,
        suspiciousActors:
          [] as readonly string[],
        failureRate: 0,
      };
    }

    const failureRate =
      events.filter(
        (event) =>
          event.outcome === 'failure',
      ).length / events.length;

    const actorFailures =
      new Map<string, number>();

    for (const event of events) {
      if (event.outcome === 'failure') {
        actorFailures.set(
          event.actor,
          (
            actorFailures.get(
              event.actor,
            ) ?? 0
          ) + 1,
        );
      }
    }

    const suspiciousActors =
      [...actorFailures.entries()]
        .filter(
          ([, count]) =>
            count >= 3,
        )
        .map(([actor]) => actor);

    return {
      anomalyScore:
        Math.min(
          1,
          failureRate +
            suspiciousActors.length *
              0.1,
        ),
      suspiciousActors,
      failureRate,
    };
  }
}
