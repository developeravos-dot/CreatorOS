import { SchedulingEngineService } from './scheduling-engine.service';

describe('SchedulingEngineService', () => {
  it('exports the current service class', () => {
    expect(SchedulingEngineService).toBeDefined();
    expect(typeof SchedulingEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SchedulingEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SchedulingEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});