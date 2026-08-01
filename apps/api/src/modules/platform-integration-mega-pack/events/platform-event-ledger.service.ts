import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlatformEvent } from '../platform-integration.types';

@Injectable()
export class PlatformEventLedgerService {
  record(
    actor: string,
    type: string,
    subjectId?: string,
    details?: Record<string, unknown>,
  ): PlatformEvent {
    return {
      id: randomUUID(),
      at: new Date().toISOString(),
      actor,
      type,
      subjectId,
      details,
    };
  }
}