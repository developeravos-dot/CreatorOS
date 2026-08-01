import { Module } from '@nestjs/common';
import { SpecialistAgentRegistryService } from './agents/specialist-agent-registry.service';
import { HumanApprovalService } from './approval/human-approval.service';
import { AutomationRuleEngineService } from './automation/automation-rule-engine.service';
import { OrganizationAutomationController } from './organization-automation.controller';
import { OrganizationAutomationOrchestratorService } from './organization-automation-orchestrator.service';
import { OperationalLedgerService } from './operations/operational-ledger.service';
import { OrganizationAutomationQualityService } from './quality/organization-automation-quality.service';
import { DigitalTeamBuilderService } from './teams/digital-team-builder.service';
import { WorkflowOrchestrationService } from './workflow/workflow-orchestration.service';

@Module({
  controllers: [OrganizationAutomationController],
  providers: [
    SpecialistAgentRegistryService,
    DigitalTeamBuilderService,
    WorkflowOrchestrationService,
    AutomationRuleEngineService,
    HumanApprovalService,
    OperationalLedgerService,
    OrganizationAutomationQualityService,
    OrganizationAutomationOrchestratorService,
  ],
  exports: [OrganizationAutomationOrchestratorService],
})
export class OrganizationAutomationModule {}