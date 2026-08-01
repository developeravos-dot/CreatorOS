import { Module } from '@nestjs/common';
import { BusinessModelIntelligenceStageModule } from '../business-model-intelligence-stage/business-model-intelligence-stage.module';
import { AudienceEconomicIntelligenceStageModule } from '../audience-economic-intelligence-stage/audience-economic-intelligence-stage.module';
import { MarketDemandIntelligenceStageModule } from '../market-demand-intelligence-stage/market-demand-intelligence-stage.module';
import { OfferArchitectureStageModule } from '../offer-architecture-stage/offer-architecture-stage.module';
import { PricingIntelligenceStageModule } from '../pricing-intelligence-stage/pricing-intelligence-stage.module';
import { RevenueStreamDesignStageModule } from '../revenue-stream-design-stage/revenue-stream-design-stage.module';
import { AdvertisingRevenueIntelligenceStageModule } from '../advertising-revenue-intelligence-stage/advertising-revenue-intelligence-stage.module';
import { SponsorshipIntelligenceStageModule } from '../sponsorship-intelligence-stage/sponsorship-intelligence-stage.module';
import { AffiliateCommerceIntelligenceStageModule } from '../affiliate-commerce-intelligence-stage/affiliate-commerce-intelligence-stage.module';
import { DigitalProductIntelligenceStageModule } from '../digital-product-intelligence-stage/digital-product-intelligence-stage.module';
import { SubscriptionMembershipIntelligenceStageModule } from '../subscription-membership-intelligence-stage/subscription-membership-intelligence-stage.module';
import { PremiumContentIntelligenceStageModule } from '../premium-content-intelligence-stage/premium-content-intelligence-stage.module';
import { LicensingRevenueIntelligenceStageModule } from '../licensing-revenue-intelligence-stage/licensing-revenue-intelligence-stage.module';
import { FranchiseRevenueIntelligenceStageModule } from '../franchise-revenue-intelligence-stage/franchise-revenue-intelligence-stage.module';
import { MerchandiseCommerceIntelligenceStageModule } from '../merchandise-commerce-intelligence-stage/merchandise-commerce-intelligence-stage.module';
import { CreatorServiceBusinessStageModule } from '../creator-service-business-stage/creator-service-business-stage.module';
import { BusinessClientSolutionsStageModule } from '../business-client-solutions-stage/business-client-solutions-stage.module';
import { MarketplaceIntelligenceStageModule } from '../marketplace-intelligence-stage/marketplace-intelligence-stage.module';
import { SalesFunnelIntelligenceStageModule } from '../sales-funnel-intelligence-stage/sales-funnel-intelligence-stage.module';
import { ConversionOptimizationStageModule } from '../conversion-optimization-stage/conversion-optimization-stage.module';
import { CustomerLifetimeValueStageModule } from '../customer-lifetime-value-stage/customer-lifetime-value-stage.module';
import { RevenueAttributionStageModule } from '../revenue-attribution-stage/revenue-attribution-stage.module';
import { RoyaltyAccountingStageModule } from '../royalty-accounting-stage/royalty-accounting-stage.module';
import { PaymentCollectionIntelligenceStageModule } from '../payment-collection-intelligence-stage/payment-collection-intelligence-stage.module';
import { FinancialPlanningStageModule } from '../financial-planning-stage/financial-planning-stage.module';
import { BudgetAllocationStageModule } from '../budget-allocation-stage/budget-allocation-stage.module';
import { CashFlowIntelligenceStageModule } from '../cash-flow-intelligence-stage/cash-flow-intelligence-stage.module';
import { ProfitabilityIntelligenceStageModule } from '../profitability-intelligence-stage/profitability-intelligence-stage.module';
import { UnitEconomicsIntelligenceStageModule } from '../unit-economics-intelligence-stage/unit-economics-intelligence-stage.module';
import { InvestmentOpportunityIntelligenceStageModule } from '../investment-opportunity-intelligence-stage/investment-opportunity-intelligence-stage.module';
import { ContentInvestmentEngineStageModule } from '../content-investment-engine-stage/content-investment-engine-stage.module';
import { PortfolioCapitalAllocationStageModule } from '../portfolio-capital-allocation-stage/portfolio-capital-allocation-stage.module';
import { RiskReturnIntelligenceStageModule } from '../risk-return-intelligence-stage/risk-return-intelligence-stage.module';
import { ProfitReinvestmentStageModule } from '../profit-reinvestment-stage/profit-reinvestment-stage.module';
import { AutonomousGrowthStageModule } from '../autonomous-growth-stage/autonomous-growth-stage.module';
import { BusinessHumanFinalAuthorityStageModule } from '../business-human-final-authority-stage/business-human-final-authority-stage.module';

const MediaBusinessRevenueModules = [
  BusinessModelIntelligenceStageModule,
  AudienceEconomicIntelligenceStageModule,
  MarketDemandIntelligenceStageModule,
  OfferArchitectureStageModule,
  PricingIntelligenceStageModule,
  RevenueStreamDesignStageModule,
  AdvertisingRevenueIntelligenceStageModule,
  SponsorshipIntelligenceStageModule,
  AffiliateCommerceIntelligenceStageModule,
  DigitalProductIntelligenceStageModule,
  SubscriptionMembershipIntelligenceStageModule,
  PremiumContentIntelligenceStageModule,
  LicensingRevenueIntelligenceStageModule,
  FranchiseRevenueIntelligenceStageModule,
  MerchandiseCommerceIntelligenceStageModule,
  CreatorServiceBusinessStageModule,
  BusinessClientSolutionsStageModule,
  MarketplaceIntelligenceStageModule,
  SalesFunnelIntelligenceStageModule,
  ConversionOptimizationStageModule,
  CustomerLifetimeValueStageModule,
  RevenueAttributionStageModule,
  RoyaltyAccountingStageModule,
  PaymentCollectionIntelligenceStageModule,
  FinancialPlanningStageModule,
  BudgetAllocationStageModule,
  CashFlowIntelligenceStageModule,
  ProfitabilityIntelligenceStageModule,
  UnitEconomicsIntelligenceStageModule,
  InvestmentOpportunityIntelligenceStageModule,
  ContentInvestmentEngineStageModule,
  PortfolioCapitalAllocationStageModule,
  RiskReturnIntelligenceStageModule,
  ProfitReinvestmentStageModule,
  AutonomousGrowthStageModule,
  BusinessHumanFinalAuthorityStageModule,
];

@Module({
  imports: MediaBusinessRevenueModules,
  exports: MediaBusinessRevenueModules,
})
export class AvosMediaBusinessRevenueMegaModule {}
