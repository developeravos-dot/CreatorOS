import { ShotPlanningStageService } from './shot-planning-stage.service';

describe('ShotPlanningStageService', () => {
  it('should expose the current service class', () => {
    expect(ShotPlanningStageService).toBeDefined();
    expect(typeof ShotPlanningStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ShotPlanningStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ShotPlanningStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ShotPlanningStageService.name).toBe('ShotPlanningStageService');
  });
});