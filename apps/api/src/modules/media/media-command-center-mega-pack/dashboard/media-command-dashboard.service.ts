import { Injectable } from '@nestjs/common';
import { MediaCommandCenterProgram } from '../media-command-center.types';
import { SystemHealthMonitorService } from '../health/system-health-monitor.service';

@Injectable()
export class MediaCommandDashboardService {
  constructor(
    private readonly health: SystemHealthMonitorService,
  ) {}

  build(program: MediaCommandCenterProgram) {
    return {
      overallHealth: this.health.overall(
        program.systemHealth,
      ),
      healthySystems: program.systemHealth.filter(
        (item) => item.status === 'healthy',
      ).length,
      warningSystems: program.systemHealth.filter(
        (item) => item.status === 'warning',
      ).length,
      criticalSystems: program.systemHealth.filter(
        (item) => item.status === 'critical',
      ).length,
      offlineSystems: program.systemHealth.filter(
        (item) => item.status === 'offline',
      ).length,
      pendingCommands: program.commands.filter(
        (item) =>
          item.status === 'queued' ||
          item.status === 'executing',
      ).length,
      pendingApprovals: program.commands.filter(
        (item) =>
          item.status === 'awaiting-human-approval',
      ).length,
      activeAlerts: program.alerts.filter(
        (item) => !item.acknowledged,
      ).length,
      unresolvedDecisions: program.decisions.filter(
        (item) =>
          item.requiresHumanDecision &&
          !item.decision,
      ).length,
    };
  }
}