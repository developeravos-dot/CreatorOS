import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OperationalEvent } from '../organization-automation.types';

@Injectable()
export class OperationalLedgerService {
  record(
    actor: string,
    type: string,
    subjectId?: string,
    details?: Record<string, unknown>,
  ): OperationalEvent {
    return {
      id: randomUUID(),
      at: new Date().toISOString(),
      actor,
      type,
      subjectId,
      details,
    };
  }

  query(
    events: OperationalEvent[],
    filters: {
      actor?: string;
      type?: string;
      subjectId?: string;
    },
  ) {
    return events.filter((event) => {
      if (filters.actor && event.actor !== filters.actor) {
        return false;
      }

      if (filters.type && event.type !== filters.type) {
        return false;
      }

      if (
        filters.subjectId &&
        event.subjectId !== filters.subjectId
      ) {
        return false;
      }

      return true;
    });
  }
}