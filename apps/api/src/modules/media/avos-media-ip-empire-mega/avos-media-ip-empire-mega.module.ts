import { Module } from '@nestjs/common';

import {
  IpAssetDiscoveryStageModule,
} from '../ip-asset-discovery-stage/ip-asset-discovery-stage.module';
import {
  ProtectableIdeaExtractionStageModule,
} from '../protectable-idea-extraction-stage/protectable-idea-extraction-stage.module';
import {
  IpClassificationStageModule,
} from '../ip-classification-stage/ip-classification-stage.module';
import {
  IpDigitalDnaStageModule,
} from '../ip-digital-dna-stage/ip-digital-dna-stage.module';
import {
  OriginalitySimilarityAnalysisStageModule,
} from '../originality-similarity-analysis-stage/originality-similarity-analysis-stage.module';
import {
  ProtectabilityAnalysisStageModule,
} from '../protectability-analysis-stage/protectability-analysis-stage.module';
import {
  EvidenceTimestampRegistrationStageModule,
} from '../evidence-timestamp-registration-stage/evidence-timestamp-registration-stage.module';
import {
  IpFamilyTreeStageModule,
} from '../ip-family-tree-stage/ip-family-tree-stage.module';
import {
  RightsOwnershipManagementStageModule,
} from '../rights-ownership-management-stage/rights-ownership-management-stage.module';
import {
  StrategicValueAssessmentStageModule,
} from '../strategic-value-assessment-stage/strategic-value-assessment-stage.module';
import {
  FinancialValuationStageModule,
} from '../financial-valuation-stage/financial-valuation-stage.module';
import {
  MarketOpportunityAnalysisStageModule,
} from '../market-opportunity-analysis-stage/market-opportunity-analysis-stage.module';
import {
  ProtectionStrategyStageModule,
} from '../protection-strategy-stage/protection-strategy-stage.module';
import {
  TrademarkManagementStageModule,
} from '../trademark-management-stage/trademark-management-stage.module';
import {
  CopyrightManagementStageModule,
} from '../copyright-management-stage/copyright-management-stage.module';
import {
  PatentManagementStageModule,
} from '../patent-management-stage/patent-management-stage.module';
import {
  LicensingManagementStageModule,
} from '../licensing-management-stage/licensing-management-stage.module';
import {
  FranchiseManagementStageModule,
} from '../franchise-management-stage/franchise-management-stage.module';
import {
  IpProductizationStageModule,
} from '../ip-productization-stage/ip-productization-stage.module';
import {
  IpCommercializationDistributionStageModule,
} from '../ip-commercialization-distribution-stage/ip-commercialization-distribution-stage.module';
import {
  InfringementMonitoringStageModule,
} from '../infringement-monitoring-stage/infringement-monitoring-stage.module';
import {
  EnforcementDisputeResolutionStageModule,
} from '../enforcement-dispute-resolution-stage/enforcement-dispute-resolution-stage.module';
import {
  PortfolioOptimizationStageModule,
} from '../portfolio-optimization-stage/portfolio-optimization-stage.module';
import {
  LearningReinvestmentStageModule,
} from '../learning-reinvestment-stage/learning-reinvestment-stage.module';

const IpEmpireModules = [
  IpAssetDiscoveryStageModule,
  ProtectableIdeaExtractionStageModule,
  IpClassificationStageModule,
  IpDigitalDnaStageModule,
  OriginalitySimilarityAnalysisStageModule,
  ProtectabilityAnalysisStageModule,
  EvidenceTimestampRegistrationStageModule,
  IpFamilyTreeStageModule,
  RightsOwnershipManagementStageModule,
  StrategicValueAssessmentStageModule,
  FinancialValuationStageModule,
  MarketOpportunityAnalysisStageModule,
  ProtectionStrategyStageModule,
  TrademarkManagementStageModule,
  CopyrightManagementStageModule,
  PatentManagementStageModule,
  LicensingManagementStageModule,
  FranchiseManagementStageModule,
  IpProductizationStageModule,
  IpCommercializationDistributionStageModule,
  InfringementMonitoringStageModule,
  EnforcementDisputeResolutionStageModule,
  PortfolioOptimizationStageModule,
  LearningReinvestmentStageModule,
];

@Module({
  imports: IpEmpireModules,
  exports: IpEmpireModules,
})
export class AvosMediaIpEmpireMegaModule {}
