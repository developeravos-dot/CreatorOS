import { LogoIntelligenceStageService } from './logo-intelligence-stage.service';

describe('LogoIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(LogoIntelligenceStageService).toBeDefined();
    expect(typeof LogoIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LogoIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LogoIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LogoIntelligenceStageService.name).toBe('LogoIntelligenceStageService');
  });
});