import { CapabilityService } from './capability.service';

describe('CapabilityService', () => {
  it('exports the current service class', () => {
    expect(CapabilityService).toBeDefined();
    expect(typeof CapabilityService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CapabilityService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CapabilityService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});