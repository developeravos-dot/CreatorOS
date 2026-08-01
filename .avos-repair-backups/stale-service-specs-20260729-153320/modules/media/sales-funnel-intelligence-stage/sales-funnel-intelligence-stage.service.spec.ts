import { SalesFunnelIntelligenceStageService } from './sales-funnel-intelligence-stage.service';

describe('SalesFunnelIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(SalesFunnelIntelligenceStageService).toBeDefined();
    expect(typeof SalesFunnelIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SalesFunnelIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SalesFunnelIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SalesFunnelIntelligenceStageService.name).toBe('SalesFunnelIntelligenceStageService');
  });
});