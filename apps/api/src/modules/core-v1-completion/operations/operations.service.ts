import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../persistence/prisma.service';
import { OpsDeploymentStatus, OpsIncidentStatus } from '../../../generated/prisma/enums';
import { CreateDeploymentDto, CreateIncidentDto, CreateOpsServiceDto, CreateRunbookDto, CreateSlaDto, TransitionDeploymentDto, UpdateIncidentDto, UpdateOpsServiceDto } from './dto/operations.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private audit(action: string, resourceType: string, resourceId?: string, payload?: object) {
    return this.prisma.auditLog.create({ data: { eventType: `operations.${action}`, actorType: 'SYSTEM', resourceType, resourceId, action, payload: payload ?? undefined } });
  }

  async dashboard() {
    const [services, healthyServices, openIncidents, criticalIncidents, runbooks, slas, deployments, failedDeployments] = await Promise.all([
      this.prisma.opsService.count(),
      this.prisma.opsService.count({ where: { status: 'OPERATIONAL' } }),
      this.prisma.opsIncident.count({ where: { status: { in: ['OPEN', 'INVESTIGATING', 'MITIGATING'] } } }),
      this.prisma.opsIncident.count({ where: { severity: 'SEV1', status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
      this.prisma.opsRunbook.count({ where: { active: true } }),
      this.prisma.opsSla.count({ where: { active: true } }),
      this.prisma.opsDeployment.count(),
      this.prisma.opsDeployment.count({ where: { status: 'FAILED' } }),
    ]);
    return { services, healthyServices, openIncidents, criticalIncidents, activeRunbooks: runbooks, activeSlas: slas, deployments, failedDeployments };
  }

  listServices() { return this.prisma.opsService.findMany({ include: { sla: true, _count: { select: { incidents: true, deployments: true, runbooks: true } } }, orderBy: { serviceKey: 'asc' } }); }
  async createService(input: CreateOpsServiceDto) { try { const row = await this.prisma.opsService.create({ data: input as never }); await this.audit('service.created', 'OpsService', row.id, { serviceKey: row.serviceKey }); return row; } catch (e) { if ((e as {code?:string}).code === 'P2002') throw new ConflictException('Service key already exists.'); throw e; } }
  async updateService(id: string, input: UpdateOpsServiceDto) { const found = await this.prisma.opsService.findUnique({ where: { id } }); if (!found) throw new NotFoundException('Service not found.'); const row = await this.prisma.opsService.update({ where: { id }, data: input as never }); await this.audit('service.updated', 'OpsService', id, { status: row.status }); return row; }

  listIncidents() { return this.prisma.opsIncident.findMany({ include: { service: true }, orderBy: { createdAt: 'desc' } }); }
  async createIncident(input: CreateIncidentDto) { const row = await this.prisma.opsIncident.create({ data: { ...input, status: OpsIncidentStatus.OPEN } }); await this.audit('incident.created', 'OpsIncident', row.id, { severity: row.severity }); return row; }
  async updateIncident(id: string, input: UpdateIncidentDto) { const found = await this.prisma.opsIncident.findUnique({ where: { id } }); if (!found) throw new NotFoundException('Incident not found.'); const now = new Date(); const row = await this.prisma.opsIncident.update({ where: { id }, data: { ...input, resolvedAt: input.status === OpsIncidentStatus.RESOLVED ? now : undefined, closedAt: input.status === OpsIncidentStatus.CLOSED ? now : undefined } }); await this.audit('incident.updated', 'OpsIncident', id, { status: row.status }); return row; }

  listRunbooks() { return this.prisma.opsRunbook.findMany({ include: { service: true }, orderBy: { updatedAt: 'desc' } }); }
  async createRunbook(input: CreateRunbookDto) { try { const row = await this.prisma.opsRunbook.create({ data: input }); await this.audit('runbook.created', 'OpsRunbook', row.id, { runbookKey: row.runbookKey }); return row; } catch (e) { if ((e as {code?:string}).code === 'P2002') throw new ConflictException('Runbook key already exists.'); throw e; } }

  listSlas() { return this.prisma.opsSla.findMany({ include: { service: true }, orderBy: { createdAt: 'desc' } }); }
  async createSla(input: CreateSlaDto) { const service = await this.prisma.opsService.findUnique({ where: { id: input.serviceId } }); if (!service) throw new NotFoundException('Service not found.'); const row = await this.prisma.opsSla.upsert({ where: { serviceId: input.serviceId }, update: input, create: input }); await this.audit('sla.upserted', 'OpsSla', row.id, { serviceId: row.serviceId }); return row; }

  listDeployments() { return this.prisma.opsDeployment.findMany({ include: { service: true }, orderBy: { createdAt: 'desc' } }); }
  async createDeployment(input: CreateDeploymentDto) { const service = await this.prisma.opsService.findUnique({ where: { id: input.serviceId } }); if (!service) throw new NotFoundException('Service not found.'); const row = await this.prisma.opsDeployment.create({ data: { ...input, environment: input.environment ?? 'production' } }); await this.audit('deployment.created', 'OpsDeployment', row.id, { version: row.version }); return row; }
  async transitionDeployment(id: string, input: TransitionDeploymentDto) { const found = await this.prisma.opsDeployment.findUnique({ where: { id } }); if (!found) throw new NotFoundException('Deployment not found.'); const isTerminal =
      input.status === OpsDeploymentStatus.SUCCEEDED ||
      input.status === OpsDeploymentStatus.FAILED ||
      input.status === OpsDeploymentStatus.ROLLED_BACK;

    const row = await this.prisma.opsDeployment.update({
      where: { id },
      data: {
        status: input.status,
        completedAt: input.completedAt
          ? new Date(input.completedAt)
          : isTerminal
            ? new Date()
            : undefined,
        notes: input.notes,
      },
    }); await this.audit('deployment.transitioned', 'OpsDeployment', id, { status: row.status }); return row; }
}
