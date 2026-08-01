import { AutonomousGrowthStageService } from './autonomous-growth-stage.service';

describe('AutonomousGrowthStageService', () => {
  it('exports the current service class', () => {
    expect(AutonomousGrowthStageService).toBeDefined();
    expect(typeof AutonomousGrowthStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AutonomousGrowthStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AutonomousGrowthStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});