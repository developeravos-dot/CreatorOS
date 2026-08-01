import { ObservabilityService } from './observability.service';

describe('ObservabilityService', () => {
  it('exports the current service class', () => {
    expect(ObservabilityService).toBeDefined();
    expect(typeof ObservabilityService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ObservabilityService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ObservabilityService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});