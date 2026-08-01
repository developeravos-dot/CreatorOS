import { Module } from '@nestjs/common';
import { CommandCenterAlertService } from './alerts/command-center-alert.service';
import { CommandExecutionService } from './commands/command-execution.service';
import { MediaCommandDashboardService } from './dashboard/media-command-dashboard.service';
import { DecisionIntelligenceService } from './decisions/decision-intelligence.service';
import { CommandCenterEventLedgerService } from './events/command-center-event-ledger.service';
import { SystemHealthMonitorService } from './health/system-health-monitor.service';
import { MediaCommandCenterController } from './media-command-center.controller';
import { MediaCommandCenterOrchestratorService } from './media-command-center-orchestrator.service';

@Module({
  controllers: [MediaCommandCenterController],
  providers: [
    SystemHealthMonitorService,
    CommandExecutionService,
    CommandCenterAlertService,
    DecisionIntelligenceService,
    CommandCenterEventLedgerService,
    MediaCommandDashboardService,
    MediaCommandCenterOrchestratorService,
  ],
  exports: [MediaCommandCenterOrchestratorService],
})
export class MediaCommandCenterModule {}