import { CommerceIntelligenceStageService } from './commerce-intelligence-stage.service';

describe('CommerceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(CommerceIntelligenceStageService).toBeDefined();
    expect(typeof CommerceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CommerceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CommerceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CommerceIntelligenceStageService.name).toBe('CommerceIntelligenceStageService');
  });
});