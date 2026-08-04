import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseAuditRecord {
  readonly auditId: string;
  readonly actor: string;
  readonly action: string;
  readonly resource: string;
  readonly metadata:
    Readonly<Record<string, unknown>>;
  readonly recordedAt: Date;
}

@Injectable()
export class EnterpriseAuditLedgerService {
  private readonly records:
    EnterpriseAuditRecord[] = [];

  record(input: {
    readonly auditId: string;
    readonly actor: string;
    readonly action: string;
    readonly resource: string;
    readonly metadata?:
      Readonly<Record<string, unknown>>;
    readonly now?: Date;
  }): EnterpriseAuditRecord {
    const auditId =
      input.auditId.trim();

    if (
      !auditId ||
      !input.actor.trim() ||
      !input.action.trim() ||
      !input.resource.trim() ||
      this.records.some(
        (record) =>
          record.auditId === auditId,
      )
    ) {
      throw new Error(
        'Valid unique audit record is required.',
      );
    }

    const record:
      EnterpriseAuditRecord = {
        auditId,
        actor:
          input.actor.trim(),
        action:
          input.action.trim(),
        resource:
          input.resource.trim(),
        metadata: structuredClone(
          input.metadata ?? {},
        ),
        recordedAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.records.push(record);
    return this.clone(record);
  }

  query(input: {
    readonly actor?: string;
    readonly action?: string;
    readonly resource?: string;
  } = {}):
    readonly EnterpriseAuditRecord[] {
    return this.records
      .filter(
        (record) =>
          !input.actor ||
          record.actor ===
            input.actor.trim(),
      )
      .filter(
        (record) =>
          !input.action ||
          record.action ===
            input.action.trim(),
      )
      .filter(
        (record) =>
          !input.resource ||
          record.resource ===
            input.resource.trim(),
      )
      .map((record) =>
        this.clone(record),
      );
  }

  private clone(
    record: EnterpriseAuditRecord,
  ): EnterpriseAuditRecord {
    return {
      ...record,
      metadata: structuredClone(
        record.metadata,
      ),
      recordedAt: new Date(
        record.recordedAt,
      ),
    };
  }
}
