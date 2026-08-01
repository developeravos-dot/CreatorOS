import { ProtectionStrategyStageService } from './protection-strategy-stage.service';

describe('ProtectionStrategyStageService', () => {
  it('exports the current service class', () => {
    expect(ProtectionStrategyStageService).toBeDefined();
    expect(typeof ProtectionStrategyStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProtectionStrategyStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProtectionStrategyStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});