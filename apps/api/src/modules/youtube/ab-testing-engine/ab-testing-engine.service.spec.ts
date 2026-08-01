import { AbTestingEngineService } from './ab-testing-engine.service';

describe('AbTestingEngineService', () => {
  it('exports the current service class', () => {
    expect(AbTestingEngineService).toBeDefined();
    expect(typeof AbTestingEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AbTestingEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AbTestingEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});