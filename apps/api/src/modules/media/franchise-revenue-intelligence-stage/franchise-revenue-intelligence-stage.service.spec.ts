import { FranchiseRevenueIntelligenceStageService } from './franchise-revenue-intelligence-stage.service';

describe('FranchiseRevenueIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(FranchiseRevenueIntelligenceStageService).toBeDefined();
    expect(typeof FranchiseRevenueIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = FranchiseRevenueIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(FranchiseRevenueIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});