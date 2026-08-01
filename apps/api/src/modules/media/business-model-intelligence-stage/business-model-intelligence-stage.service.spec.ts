import { BusinessModelIntelligenceStageService } from './business-model-intelligence-stage.service';

describe('BusinessModelIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(BusinessModelIntelligenceStageService).toBeDefined();
    expect(typeof BusinessModelIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BusinessModelIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BusinessModelIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});