import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence.module';
import {
  AgentRepository,
  ApprovalGateRepository,
  AuditLogRepository,
  BlueprintRepository,
  BlueprintVersionRepository,
  CapabilityRepository,
  ExecutionPlanRepository,
  IntegrationRepository,
  KnowledgeEdgeRepository,
  KnowledgeNodeRepository,
  OrganizationUnitRepository,
  RuntimePluginRepository,
} from './repositories';

const repositories = [
  AgentRepository,
  ApprovalGateRepository,
  AuditLogRepository,
  BlueprintRepository,
  BlueprintVersionRepository,
  CapabilityRepository,
  ExecutionPlanRepository,
  IntegrationRepository,
  KnowledgeEdgeRepository,
  KnowledgeNodeRepository,
  OrganizationUnitRepository,
  RuntimePluginRepository,
];

@Module({
  imports: [
    PersistenceModule,
  ],
  providers: [
    ...repositories,
  ],
  exports: [
    ...repositories,
  ],
})
export class PersistenceRepositoriesModule {}
