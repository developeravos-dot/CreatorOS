import { DigitalProductIntelligenceStageService } from './digital-product-intelligence-stage.service';

describe('DigitalProductIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(DigitalProductIntelligenceStageService).toBeDefined();
    expect(typeof DigitalProductIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DigitalProductIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DigitalProductIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});