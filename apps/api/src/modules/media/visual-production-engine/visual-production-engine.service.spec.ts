import { VisualProductionEngineService } from './visual-production-engine.service';

describe('VisualProductionEngineService', () => {
  it('exports the current service class', () => {
    expect(VisualProductionEngineService).toBeDefined();
    expect(typeof VisualProductionEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VisualProductionEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VisualProductionEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});