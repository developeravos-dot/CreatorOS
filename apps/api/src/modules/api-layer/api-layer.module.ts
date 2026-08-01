import { Module } from '@nestjs/common';
import { ApplicationServicesModule } from '../application/application-services.module';
import {
  AgentController,
  ApprovalController,
  AuditController,
  BlueprintController,
  CapabilityController,
  ExecutionPlanController,
  IntegrationController,
  KnowledgeController,
  OrganizationController,
  RuntimePluginController,
} from './controllers';

@Module({
  imports: [
    ApplicationServicesModule,
  ],
  controllers: [
    AgentController,
    ApprovalController,
    AuditController,
    BlueprintController,
    CapabilityController,
    ExecutionPlanController,
    IntegrationController,
    KnowledgeController,
    OrganizationController,
    RuntimePluginController,
  ],
})
export class ApiLayerModule {}