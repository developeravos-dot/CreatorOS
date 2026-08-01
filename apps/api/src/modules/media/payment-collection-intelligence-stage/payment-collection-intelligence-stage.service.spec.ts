import { PaymentCollectionIntelligenceStageService } from './payment-collection-intelligence-stage.service';

describe('PaymentCollectionIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(PaymentCollectionIntelligenceStageService).toBeDefined();
    expect(typeof PaymentCollectionIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PaymentCollectionIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PaymentCollectionIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});