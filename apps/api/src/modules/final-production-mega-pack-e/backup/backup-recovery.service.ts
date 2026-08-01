import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BackupRecord } from '../final-production.types';

@Injectable()
export class BackupRecoveryService {
  private readonly backups = new Map<
    string,
    BackupRecord
  >();

  createBackup(input: {
    name: string;
    scope: string[];
    metadata?: Record<string, unknown>;
  }) {
    const backup: BackupRecord = {
      id: randomUUID(),
      name: input.name,
      scope: input.scope,
      status: 'created',
      createdAt: new Date().toISOString(),
      metadata: input.metadata ?? {},
    };

    this.backups.set(backup.id, backup);
    return backup;
  }

  verifyBackup(id: string) {
    const backup = this.get(id);
    backup.status = 'verified';
    backup.verifiedAt =
      new Date().toISOString();
    return backup;
  }

  restoreBackup(id: string) {
    const backup = this.get(id);

    if (backup.status !== 'verified') {
      throw new Error(
        'Backup must be verified before restore.',
      );
    }

    backup.status = 'restored';
    backup.restoredAt =
      new Date().toISOString();

    return backup;
  }

  get(id: string) {
    const backup = this.backups.get(id);

    if (!backup) {
      throw new Error(
        `Backup not found: ${id}`,
      );
    }

    return backup;
  }

  list() {
    return [...this.backups.values()];
  }

  summary() {
    const backups = this.list();

    return {
      total: backups.length,
      verified: backups.filter(
        (item) => item.status === 'verified',
      ).length,
      restored: backups.filter(
        (item) => item.status === 'restored',
      ).length,
      failed: backups.filter(
        (item) => item.status === 'failed',
      ).length,
    };
  }
}