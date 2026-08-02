import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import {
  Prisma,
} from '../../generated/prisma/client';

import {
  PrismaService,
} from '../../modules/persistence/prisma.service';

import type {
  AiOrganizationWorkspaceStateInput,
} from './ai-organization-persistence.contracts';

@Injectable()
export class AiOrganizationPersistenceRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByWorkspaceKey(
    workspaceKey: string,
  ) {
    return this.prisma.aiOrganizationWorkspaceState.findUnique({
      where: {
        workspaceKey,
      },
    });
  }

  async list() {
    return this.prisma.aiOrganizationWorkspaceState.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async save(
    input: AiOrganizationWorkspaceStateInput,
  ) {
    return this.prisma.$transaction(
      async (transaction) => {
        const current =
          await transaction.aiOrganizationWorkspaceState.findUnique({
            where: {
              workspaceKey: input.workspaceKey,
            },
          });

        if (
          current &&
          input.expectedVersion !== undefined &&
          current.version !== input.expectedVersion
        ) {
          throw new ConflictException({
            message:
              'AI Organization workspace version conflict.',
            expectedVersion: input.expectedVersion,
            currentVersion: current.version,
          });
        }

        const state =
          input.state as Prisma.InputJsonValue;

        if (!current) {
          return transaction.aiOrganizationWorkspaceState.create({
            data: {
              workspaceKey: input.workspaceKey,
              projectId: input.projectId ?? null,
              state,
              version: 1,
            },
          });
        }

        return transaction.aiOrganizationWorkspaceState.update({
          where: {
            workspaceKey: input.workspaceKey,
          },
          data: {
            projectId:
              input.projectId === undefined
                ? current.projectId
                : input.projectId,
            state,
            version: {
              increment: 1,
            },
          },
        });
      },
    );
  }

  async deleteByWorkspaceKey(
    workspaceKey: string,
  ) {
    return this.prisma.aiOrganizationWorkspaceState.delete({
      where: {
        workspaceKey,
      },
    });
  }
}
