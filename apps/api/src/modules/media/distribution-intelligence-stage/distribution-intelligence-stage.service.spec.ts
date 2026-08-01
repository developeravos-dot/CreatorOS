import { DistributionIntelligenceStageService } from './distribution-intelligence-stage.service';

describe('DistributionIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(DistributionIntelligenceStageService).toBeDefined();
    expect(typeof DistributionIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DistributionIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DistributionIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});