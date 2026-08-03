import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'crypto';

import type {
  CapabilityPlatformAuditRecord,
  RecordCapabilityPlatformAuditInput,
} from '../contracts';

@Injectable()
export class CapabilityPlatformAuditService {
  private readonly records:
    CapabilityPlatformAuditRecord[] = [];

  record(
    input:
      RecordCapabilityPlatformAuditInput,
  ): CapabilityPlatformAuditRecord {
    const record:
      CapabilityPlatformAuditRecord = {
        id: randomUUID(),
        operation: input.operation,
        successful:
          input.successful,
        occurredAt:
          new Date().toISOString(),
        actorId: input.actorId,
        correlationId:
          input.correlationId,
        subjectId:
          input.subjectId,
        message: input.message,
        metadata:
          input.metadata
            ? Object.freeze({
                ...input.metadata,
              })
            : undefined,
      };

    this.records.push(record);

    return record;
  }

  list():
    readonly CapabilityPlatformAuditRecord[] {
    return this.records.map(
      (record) => ({
        ...record,
        metadata:
          record.metadata
            ? Object.freeze({
                ...record.metadata,
              })
            : undefined,
      }),
    );
  }

  count(): number {
    return this.records.length;
  }

  clear(): void {
    this.records.length = 0;
  }
}