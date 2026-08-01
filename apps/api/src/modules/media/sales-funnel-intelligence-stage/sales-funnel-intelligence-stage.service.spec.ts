import { SalesFunnelIntelligenceStageService } from './sales-funnel-intelligence-stage.service';

describe('SalesFunnelIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(SalesFunnelIntelligenceStageService).toBeDefined();
    expect(typeof SalesFunnelIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SalesFunnelIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SalesFunnelIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});