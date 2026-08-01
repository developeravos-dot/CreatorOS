import { DigitalProductIntelligenceStageService } from './digital-product-intelligence-stage.service';

describe('DigitalProductIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(DigitalProductIntelligenceStageService).toBeDefined();
    expect(typeof DigitalProductIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DigitalProductIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DigitalProductIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DigitalProductIntelligenceStageService.name).toBe('DigitalProductIntelligenceStageService');
  });
});