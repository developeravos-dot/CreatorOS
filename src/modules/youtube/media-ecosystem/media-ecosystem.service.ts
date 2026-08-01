import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type EcosystemEntityType =
  | 'channel'
  | 'project'
  | 'team'
  | 'asset';

export type EcosystemEntityStatus =
  | 'active'
  | 'paused'
  | 'archived';

export interface EcosystemEntity {
  id: string;
  type: EcosystemEntityType;
  name: string;
  description?: string;
  status: EcosystemEntityStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEcosystemEntityInput {
  type: EcosystemEntityType;
  name: string;
  description?: string;
  status?: EcosystemEntityStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateEcosystemEntityInput {
  name?: string;
  description?: string;
  status?: EcosystemEntityStatus;
  metadata?: Record<string, unknown>;
}

export interface EcosystemOverview {
  name: string;
  version: string;
  status: 'operational';
  totalEntities: number;
  totalsByType: Record<EcosystemEntityType, number>;
  totalsByStatus: Record<EcosystemEntityStatus, number>;
  updatedAt: string;
}

@Injectable()
export class MediaEcosystemService {
  private readonly entities = new Map<string, EcosystemEntity>();

  getStatus(): EcosystemOverview {
    const all = [...this.entities.values()];

    return {
      name: 'CreatorOS Media Ecosystem Engine',
      version: '1.0.0',
      status: 'operational',
      totalEntities: all.length,
      totalsByType: {
        channel: all.filter((item) => item.type === 'channel').length,
        project: all.filter((item) => item.type === 'project').length,
        team: all.filter((item) => item.type === 'team').length,
        asset: all.filter((item) => item.type === 'asset').length,
      },
      totalsByStatus: {
        active: all.filter((item) => item.status === 'active').length,
        paused: all.filter((item) => item.status === 'paused').length,
        archived: all.filter((item) => item.status === 'archived').length,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  createEntity(input: CreateEcosystemEntityInput): EcosystemEntity {
    const now = new Date().toISOString();

    const entity: EcosystemEntity = {
      id: randomUUID(),
      type: input.type,
      name: input.name.trim(),
      description: input.description?.trim(),
      status: input.status ?? 'active',
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.entities.set(entity.id, entity);

    return entity;
  }

  listEntities(filters?: {
    type?: EcosystemEntityType;
    status?: EcosystemEntityStatus;
    search?: string;
  }): EcosystemEntity[] {
    const search = filters?.search?.trim().toLowerCase();

    return [...this.entities.values()].filter((entity) => {
      if (filters?.type && entity.type !== filters.type) {
        return false;
      }

      if (filters?.status && entity.status !== filters.status) {
        return false;
      }

      if (search) {
        const text =
          `${entity.name} ${entity.description ?? ''}`.toLowerCase();

        if (!text.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }

  getEntity(id: string): EcosystemEntity {
    const entity = this.entities.get(id);

    if (!entity) {
      throw new NotFoundException(
        `Media ecosystem entity '${id}' was not found`,
      );
    }

    return entity;
  }

  updateEntity(
    id: string,
    input: UpdateEcosystemEntityInput,
  ): EcosystemEntity {
    const current = this.getEntity(id);

    const updated: EcosystemEntity = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ?? current.description,
      metadata: input.metadata ?? current.metadata,
      updatedAt: new Date().toISOString(),
    };

    this.entities.set(id, updated);

    return updated;
  }

  removeEntity(id: string): {
    success: true;
    id: string;
  } {
    this.getEntity(id);
    this.entities.delete(id);

    return {
      success: true,
      id,
    };
  }

  buildRelationshipMap(): {
    nodes: Array<
      Pick<
        EcosystemEntity,
        'id' | 'name' | 'type' | 'status'
      >
    >;
    edges: Array<{
      from: string;
      to: string;
      relation: string;
    }>;
  } {
    const all = [...this.entities.values()];

    const projects = all.filter(
      (item) => item.type === 'project',
    );

    const channels = all.filter(
      (item) => item.type === 'channel',
    );

    return {
      nodes: all.map(
        ({ id, name, type, status }) => ({
          id,
          name,
          type,
          status,
        }),
      ),
      edges: projects.flatMap((project) =>
        channels.map((channel) => ({
          from: project.id,
          to: channel.id,
          relation: 'can-publish-to',
        })),
      ),
    };
  }
}
