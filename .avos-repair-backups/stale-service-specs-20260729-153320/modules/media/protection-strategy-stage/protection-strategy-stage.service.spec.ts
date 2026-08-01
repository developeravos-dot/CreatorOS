import { ProtectionStrategyStageService } from './protection-strategy-stage.service';

describe('ProtectionStrategyStageService', () => {
  it('should expose the current service class', () => {
    expect(ProtectionStrategyStageService).toBeDefined();
    expect(typeof ProtectionStrategyStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProtectionStrategyStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProtectionStrategyStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProtectionStrategyStageService.name).toBe('ProtectionStrategyStageService');
  });
});