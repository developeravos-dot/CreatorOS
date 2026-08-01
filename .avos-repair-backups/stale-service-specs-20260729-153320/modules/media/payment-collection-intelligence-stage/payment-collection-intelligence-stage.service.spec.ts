import { PaymentCollectionIntelligenceStageService } from './payment-collection-intelligence-stage.service';

describe('PaymentCollectionIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(PaymentCollectionIntelligenceStageService).toBeDefined();
    expect(typeof PaymentCollectionIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PaymentCollectionIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PaymentCollectionIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PaymentCollectionIntelligenceStageService.name).toBe('PaymentCollectionIntelligenceStageService');
  });
});