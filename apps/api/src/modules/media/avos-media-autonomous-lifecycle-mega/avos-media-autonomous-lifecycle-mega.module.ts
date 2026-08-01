import { Module } from '@nestjs/common';

import {
  OpportunityDiscoveryStageModule,
} from '../opportunity-discovery-stage/opportunity-discovery-stage.module';

import {
  ConceptDevelopmentStageModule,
} from '../concept-development-stage/concept-development-stage.module';

import {
  ResearchValidationStageModule,
} from '../research-validation-stage/research-validation-stage.module';

import {
  StrategicPlanningStageModule,
} from '../strategic-planning-stage/strategic-planning-stage.module';

import {
  ContentCreationStageModule,
} from '../content-creation-stage/content-creation-stage.module';

import {
  ProductionStageModule,
} from '../production-stage/production-stage.module';

import {
  QualityAssuranceStageModule,
} from '../quality-assurance-stage/quality-assurance-stage.module';

import {
  GovernanceApprovalStageModule,
} from '../governance-approval-stage/governance-approval-stage.module';

import {
  PublishingDistributionStageModule,
} from '../publishing-distribution-stage/publishing-distribution-stage.module';

import {
  GrowthOptimizationStageModule,
} from '../growth-optimization-stage/growth-optimization-stage.module';

import {
  MonetizationIpExpansionStageModule,
} from '../monetization-ip-expansion-stage/monetization-ip-expansion-stage.module';

import {
  ContinuousLearningStageModule,
} from '../continuous-learning-stage/continuous-learning-stage.module';

const LifecycleModules = [
  OpportunityDiscoveryStageModule,
  ConceptDevelopmentStageModule,
  ResearchValidationStageModule,
  StrategicPlanningStageModule,
  ContentCreationStageModule,
  ProductionStageModule,
  QualityAssuranceStageModule,
  GovernanceApprovalStageModule,
  PublishingDistributionStageModule,
  GrowthOptimizationStageModule,
  MonetizationIpExpansionStageModule,
  ContinuousLearningStageModule,
];

@Module({
  imports: LifecycleModules,
  exports: LifecycleModules,
})
export class AvosMediaAutonomousLifecycleMegaModule {}
