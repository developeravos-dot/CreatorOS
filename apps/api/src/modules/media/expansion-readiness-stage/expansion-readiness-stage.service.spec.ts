import { ExpansionReadinessStageService } from './expansion-readiness-stage.service';

describe('ExpansionReadinessStageService', () => {
  it('exports the current service class', () => {
    expect(ExpansionReadinessStageService).toBeDefined();
    expect(typeof ExpansionReadinessStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ExpansionReadinessStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ExpansionReadinessStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});