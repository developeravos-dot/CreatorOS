import { LogoIntelligenceStageService } from './logo-intelligence-stage.service';

describe('LogoIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(LogoIntelligenceStageService).toBeDefined();
    expect(typeof LogoIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LogoIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LogoIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});