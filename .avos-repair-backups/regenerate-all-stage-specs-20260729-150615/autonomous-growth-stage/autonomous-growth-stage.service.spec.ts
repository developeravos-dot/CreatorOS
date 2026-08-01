import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AutonomousGrowthStageService } from './autonomous-growth-stage.service';

describe('AutonomousGrowthStageService', () => {
  let service: AutonomousGrowthStageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [AutonomousGrowthStageService] }).compile();
    service = module.get<AutonomousGrowthStageService>(AutonomousGrowthStageService);
  });

  it('should be operational', () => {
    const dashboard = service.getDashboard();
    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalStages).toBe(service.getBlueprint().stages.length);
    expect(dashboard.humanFinalAuthority).toBe(true);
  });

  it('should expose the complete blueprint', () => {
    expect(service.getBlueprint().stages.length).toBeGreaterThan(0);
  });

  it('should create a portfolio', () => {
    const portfolio = service.createPortfolio({ name: 'AVOS Media Business', owner: 'AVOS', targetMarkets: ['UAE', 'USA'] });
    expect(portfolio.stages).toHaveLength(service.getBlueprint().stages.length);
  });

  it('should require approval for autonomous execution', () => {
    const portfolio = service.createPortfolio({ name: 'Autonomous Business', owner: 'AVOS', autonomousExecutionEnabled: true });
    expect(() => service.startLifecycle(portfolio.id)).toThrow(BadRequestException);
  });

  it('should add a revenue stream', () => {
    const portfolio = service.createPortfolio({ name: 'Revenue Portfolio', owner: 'AVOS' });
    const updated = service.addRevenueStream(portfolio.id, { name: 'Advertising', type: 'advertising', actualMonthlyRevenue: 10000, directCost: 2000, active: true });
    expect(updated.revenueStreams).toHaveLength(1);
    expect(updated.totalProfit).toBe(8000);
  });

  it('should add a business offer', () => {
    const portfolio = service.createPortfolio({ name: 'Offer Portfolio', owner: 'AVOS' });
    const updated = service.addOffer(portfolio.id, { name: 'Premium Membership', price: 29, currency: 'USD' });
    expect(updated.offers).toHaveLength(1);
  });

  it('should add a sponsorship deal', () => {
    const portfolio = service.createPortfolio({ name: 'Sponsor Portfolio', owner: 'AVOS' });
    const updated = service.addSponsorshipDeal(portfolio.id, { sponsorName: 'Global Sponsor', value: 50000 });
    expect(updated.sponsorshipDeals).toHaveLength(1);
  });

  it('should add an investment', () => {
    const portfolio = service.createPortfolio({ name: 'Investment Portfolio', owner: 'AVOS' });
    const updated = service.addInvestment(portfolio.id, { name: 'New Channel', investedAmount: 100000, currentValue: 150000 });
    expect(updated.investments).toHaveLength(1);
  });

  it('should allocate profit', () => {
    const portfolio = service.createPortfolio({ name: 'Allocation Portfolio', owner: 'AVOS' });
    service.updatePortfolio(portfolio.id, { totalRevenue: 100000, totalCost: 40000 });
    const updated = service.allocateProfit(portfolio.id, 50, 20);
    expect(updated.reinvestmentAmount).toBe(30000);
    expect(updated.reserveAmount).toBe(12000);
  });

  it('should generate financial report', () => {
    const portfolio = service.createPortfolio({ name: 'Report Portfolio', owner: 'AVOS' });
    expect(service.generateFinancialReport(portfolio.id).humanFinalAuthority).toBe(true);
  });

  it('should generate growth plan', () => {
    const portfolio = service.createPortfolio({ name: 'Growth Portfolio', owner: 'AVOS' });
    expect(service.generateGrowthPlan(portfolio.id).recommendedActions.length).toBeGreaterThan(5);
  });
});

