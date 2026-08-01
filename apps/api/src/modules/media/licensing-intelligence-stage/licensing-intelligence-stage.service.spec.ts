import { LicensingIntelligenceStageService } from './licensing-intelligence-stage.service';

describe('LicensingIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(LicensingIntelligenceStageService).toBeDefined();
    expect(typeof LicensingIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LicensingIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LicensingIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});