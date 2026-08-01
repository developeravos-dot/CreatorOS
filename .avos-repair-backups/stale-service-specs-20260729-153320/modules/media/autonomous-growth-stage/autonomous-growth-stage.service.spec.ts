import { AutonomousGrowthStageService } from './autonomous-growth-stage.service';

describe('AutonomousGrowthStageService', () => {
  it('should expose the current service class', () => {
    expect(AutonomousGrowthStageService).toBeDefined();
    expect(typeof AutonomousGrowthStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AutonomousGrowthStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AutonomousGrowthStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AutonomousGrowthStageService.name).toBe('AutonomousGrowthStageService');
  });
});