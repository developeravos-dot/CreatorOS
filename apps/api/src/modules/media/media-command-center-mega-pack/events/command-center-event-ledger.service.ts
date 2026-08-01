import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CommandCenterEvent } from '../media-command-center.types';

@Injectable()
export class CommandCenterEventLedgerService {
  record(
    actor: string,
    type: string,
    subjectId?: string,
    details?: Record<string, unknown>,
  ): CommandCenterEvent {
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