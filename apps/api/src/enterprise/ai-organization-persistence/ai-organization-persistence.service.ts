import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  AiOrganizationPersistenceHealth,
  AiOrganizationWorkspaceStateInput,
  AiOrganizationWorkspaceStateRecord,
} from './ai-organization-persistence.contracts';

import {
  AiOrganizationPersistenceRepository,
} from './ai-organization-persistence.repository';

@Injectable()
export class AiOrganizationPersistenceService {
  constructor(
    private readonly repository:
      AiOrganizationPersistenceRepository,
  ) {}

  getHealth(): AiOrganizationPersistenceHealth {
    return {
      status: 'operational',
      storage: 'postgresql',
      orm: 'prisma',
      humanFinalAuthority: true,
      persistent: true,
    };
  }

  async list(): Promise<
    AiOrganizationWorkspaceStateRecord[]
  > {
    const records = await this.repository.list();

    return records.map((record) =>
      this.toRecord(record),
    );
  }

  async get(
    workspaceKey: string,
  ): Promise<AiOrganizationWorkspaceStateRecord> {
    const record =
      await this.repository.findByWorkspaceKey(
        workspaceKey,
      );

    if (!record) {
      throw new NotFoundException(
        `AI Organization workspace was not found: ${workspaceKey}`,
      );
    }

    return this.toRecord(record);
  }

  async getOptional(
    workspaceKey: string,
  ): Promise<AiOrganizationWorkspaceStateRecord | null> {
    const record =
      await this.repository.findByWorkspaceKey(
        workspaceKey,
      );

    return record ? this.toRecord(record) : null;
  }

  async save(
    workspaceKey: string,
    input: Omit<
      AiOrganizationWorkspaceStateInput,
      'workspaceKey'
    >,
  ): Promise<AiOrganizationWorkspaceStateRecord> {
    const record = await this.repository.save({
      ...input,
      workspaceKey,
    });

    return this.toRecord(record);
  }

  async delete(
    workspaceKey: string,
  ): Promise<{
    deleted: true;
    workspaceKey: string;
  }> {
    const current =
      await this.repository.findByWorkspaceKey(
        workspaceKey,
      );

    if (!current) {
      throw new NotFoundException(
        `AI Organization workspace was not found: ${workspaceKey}`,
      );
    }

    await this.repository.deleteByWorkspaceKey(
      workspaceKey,
    );

    return {
      deleted: true,
      workspaceKey,
    };
  }

  private toRecord(
    record: {
      id: string;
      workspaceKey: string;
      projectId: string | null;
      version: number;
      state: unknown;
      createdAt: Date;
      updatedAt: Date;
    },
  ): AiOrganizationWorkspaceStateRecord {
    return {
      id: record.id,
      workspaceKey: record.workspaceKey,
      projectId: record.projectId,
      version: record.version,
      state: record.state as Record<string, unknown>,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}
