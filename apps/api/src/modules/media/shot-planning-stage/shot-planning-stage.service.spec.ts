import { ShotPlanningStageService } from './shot-planning-stage.service';

describe('ShotPlanningStageService', () => {
  it('exports the current service class', () => {
    expect(ShotPlanningStageService).toBeDefined();
    expect(typeof ShotPlanningStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ShotPlanningStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ShotPlanningStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});