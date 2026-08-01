import { Module } from '@nestjs/common';
import { PersistenceRepositoriesModule } from '../persistence/persistence-repositories.module';
import {
  AgentApplicationService,
  ApprovalApplicationService,
  AuditApplicationService,
  BlueprintApplicationService,
  CapabilityApplicationService,
  ExecutionPlanApplicationService,
  IntegrationApplicationService,
  KnowledgeApplicationService,
  OrganizationApplicationService,
  RuntimePluginApplicationService,
} from './services';

const applicationServices = [
  AgentApplicationService,
  ApprovalApplicationService,
  AuditApplicationService,
  BlueprintApplicationService,
  CapabilityApplicationService,
  ExecutionPlanApplicationService,
  IntegrationApplicationService,
  KnowledgeApplicationService,
  OrganizationApplicationService,
  RuntimePluginApplicationService,
];

@Module({
  imports: [
    PersistenceRepositoriesModule,
  ],
  providers: [
    ...applicationServices,
  ],
  exports: [
    ...applicationServices,
  ],
})
export class ApplicationServicesModule {}