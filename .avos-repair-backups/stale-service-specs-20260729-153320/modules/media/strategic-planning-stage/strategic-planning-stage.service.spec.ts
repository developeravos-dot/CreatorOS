import { StrategicPlanningStageService } from './strategic-planning-stage.service';

describe('StrategicPlanningStageService', () => {
  it('should expose the current service class', () => {
    expect(StrategicPlanningStageService).toBeDefined();
    expect(typeof StrategicPlanningStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(StrategicPlanningStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (StrategicPlanningStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(StrategicPlanningStageService.name).toBe('StrategicPlanningStageService');
  });
});