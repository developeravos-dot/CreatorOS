import { StrategicPlanningStageService } from './strategic-planning-stage.service';

describe('StrategicPlanningStageService', () => {
  it('exports the current service class', () => {
    expect(StrategicPlanningStageService).toBeDefined();
    expect(typeof StrategicPlanningStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = StrategicPlanningStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(StrategicPlanningStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});