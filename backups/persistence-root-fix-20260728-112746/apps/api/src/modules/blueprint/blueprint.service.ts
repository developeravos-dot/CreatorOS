import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  ApproveBlueprintInput,
  CreateBlueprintInput,
  UpdateBlueprintInput,
} from '@creatoros/blueprint';
import { PrismaService } from '../persistence';

type Obj = Record<string, unknown>;

@Injectable()
export class BlueprintService {
  constructor(private readonly prisma: PrismaService) {}

  private async view(item: any) {
    const gates = await this.prisma.approvalGate.findMany({
      where: { blueprintId: item.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      id: item.id,
      key: item.blueprintKey,
      blueprintKey: item.blueprintKey,
      name: item.name,
      description: item.description,
      status: String(item.status).toLowerCase(),
      definition: item.definition,
      metadata: item.metadata,
      approvalGates: gates.map((gate) => ({
        id: gate.id,
        gateType: gate.gateType,
        name: gate.gateType,
        status: gate.status.toLowerCase(),
        approved: gate.status === 'APPROVED',
        approvedBy: gate.approvedBy,
        notes: gate.decisionNote,
        decidedAt: gate.decidedAt,
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async createBlueprint(input: CreateBlueprintInput) {
    const value = input as unknown as Obj;
    const blueprintKey = String(value.blueprintKey ?? value.key ?? '').trim();
    const name = String(value.name ?? '').trim();

    if (!blueprintKey || !name) {
      throw new BadRequestException('blueprintKey and name are required.');
    }

    const existing = await this.prisma.blueprint.findUnique({
      where: { blueprintKey },
    });
    if (existing) return this.view(existing);

    const definition = (value.definition ?? {}) as never;
    const metadata = value.metadata as never;

    const created = await this.prisma.$transaction(async (tx) => {
      const blueprint = await tx.blueprint.create({
        data: {
          blueprintKey,
          name,
          description: value.description === undefined
            ? undefined
            : String(value.description),
          status: 'DRAFT',
          definition,
          metadata,
        },
      });

      await tx.blueprintVersion.create({
        data: {
          blueprintId: blueprint.id,
          version: 1,
          definition,
          changeNote: 'Initial persistent version',
        },
      });

      for (const gateType of [
        'Architecture Approval',
        'Implementation Approval',
      ]) {
        await tx.approvalGate.create({
          data: {
            blueprintId: blueprint.id,
            gateType,
            status: 'PENDING',
          },
        });
      }

      return blueprint;
    });

    return this.view(created);
  }

  async updateBlueprint(id: string, input: UpdateBlueprintInput) {
    const value = input as unknown as Obj;
    const current = await this.prisma.blueprint.findUnique({ where: { id } });
    if (!current) return undefined;

    const latest = await this.prisma.blueprintVersion.findFirst({
      where: { blueprintId: id },
      orderBy: { version: 'desc' },
    });

    const definition = value.definition === undefined
      ? current.definition
      : value.definition;

    const updated = await this.prisma.$transaction(async (tx) => {
      const blueprint = await tx.blueprint.update({
        where: { id },
        data: {
          name: value.name === undefined ? undefined : String(value.name),
          description: value.description === undefined
            ? undefined
            : String(value.description),
          definition: value.definition === undefined
            ? undefined
            : value.definition as never,
          metadata: value.metadata === undefined
            ? undefined
            : value.metadata as never,
        },
      });

      await tx.blueprintVersion.create({
        data: {
          blueprintId: id,
          version: (latest?.version ?? 0) + 1,
          definition: definition as never,
          changeNote: String(value.changeNote ?? 'Blueprint updated'),
        },
      });

      return blueprint;
    });

    return this.view(updated);
  }

  async getBlueprints() {
    const rows = await this.prisma.blueprint.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return {
      registry: 'blueprint-registry',
      status: 'operational',
      count: rows.length,
      blueprints: await Promise.all(rows.map((row) => this.view(row))),
      provider: 'PostgreSQL/Prisma',
    };
  }

  async getBlueprintById(id: string) {
    const row = await this.prisma.blueprint.findUnique({ where: { id } });
    return row ? this.view(row) : undefined;
  }

  async getBlueprintByKey(blueprintKey: string) {
    const row = await this.prisma.blueprint.findUnique({
      where: { blueprintKey },
    });
    return row ? this.view(row) : undefined;
  }

  async validateBlueprint(id: string) {
    const row = await this.prisma.blueprint.findUnique({ where: { id } });
    const issues: string[] = [];
    if (!row) issues.push('Blueprint was not found.');
    if (row && !row.blueprintKey) issues.push('blueprintKey is required.');
    if (row && !row.name) issues.push('name is required.');

    return {
      blueprintId: id,
      valid: issues.length === 0,
      errors: issues.length,
      warnings: 0,
      issues,
      validatedAt: new Date().toISOString(),
    };
  }

  async approveGate(id: string, input: ApproveBlueprintInput) {
    const value = input as unknown as Obj;
    const gateId = String(value.gateId ?? '');
    if (!gateId) throw new BadRequestException('gateId is required.');

    const gate = await this.prisma.approvalGate.findFirst({
      where: { id: gateId, blueprintId: id },
    });
    if (!gate) throw new BadRequestException('Approval gate not found.');

    return this.prisma.approvalGate.update({
      where: { id: gateId },
      data: {
        status: 'APPROVED',
        approvedBy: String(value.approvedBy ?? 'AVOS Owner'),
        decisionNote: value.notes === undefined
          ? undefined
          : String(value.notes),
        decidedAt: new Date(),
      },
    });
  }

  async activateBlueprint(id: string) {
    const validation = await this.validateBlueprint(id);
    if (!validation.valid) {
      throw new BadRequestException('Blueprint validation failed.');
    }

    const pending = await this.prisma.approvalGate.count({
      where: { blueprintId: id, status: { not: 'APPROVED' } },
    });
    if (pending > 0) {
      throw new BadRequestException(
        'All approval gates must be approved before activation.',
      );
    }

    const row = await this.prisma.blueprint.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    return this.view(row);
  }

  async archiveBlueprint(id: string) {
    const row = await this.prisma.blueprint.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
    return this.view(row);
  }

  async generateExecutionPlan(id: string) {
    const row = await this.prisma.blueprint.findUnique({ where: { id } });
    if (!row) throw new BadRequestException('Blueprint not found.');

    return this.prisma.executionPlan.create({
      data: {
        blueprintId: id,
        planKey: `${row.blueprintKey}-${Date.now()}`,
        status: 'PENDING',
        definition: {
          blueprintKey: row.blueprintKey,
          generatedAt: new Date().toISOString(),
          humanFinalAuthority: true,
        },
      },
    });
  }

  async getExecutionPlans(blueprintId?: string) {
    const executionPlans = await this.prisma.executionPlan.findMany({
      where: blueprintId ? { blueprintId } : undefined,
      orderBy: { createdAt: 'asc' },
    });
    return {
      registry: 'blueprint-execution-plans',
      status: 'operational',
      count: executionPlans.length,
      executionPlans,
    };
  }

  async getVersions(blueprintId: string) {
    const versions = await this.prisma.blueprintVersion.findMany({
      where: { blueprintId },
      orderBy: { version: 'asc' },
    });
    return {
      registry: 'blueprint-versions',
      status: 'operational',
      count: versions.length,
      versions,
    };
  }

  async getDiff(blueprintId: string, fromVersion: number, toVersion: number) {
    const versions = await this.prisma.blueprintVersion.findMany({
      where: { blueprintId, version: { in: [fromVersion, toVersion] } },
    });
    const from = versions.find((item) => item.version === fromVersion);
    const to = versions.find((item) => item.version === toVersion);
    if (!from || !to) {
      throw new BadRequestException('Blueprint version not found.');
    }
    return {
      blueprintId,
      fromVersion,
      toVersion,
      changed: JSON.stringify(from.definition) !== JSON.stringify(to.definition),
      from: from.definition,
      to: to.definition,
    };
  }

  async getStatus() {
    const [blueprints, versions, approvals, executionPlans] =
      await Promise.all([
        this.prisma.blueprint.count(),
        this.prisma.blueprintVersion.count(),
        this.prisma.approvalGate.count(),
        this.prisma.executionPlan.count(),
      ]);

    return {
      module: 'blueprint',
      status: 'operational',
      provider: 'PostgreSQL/Prisma',
      persistent: true,
      blueprints,
      versions,
      approvals,
      executionPlans,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    };
  }
}