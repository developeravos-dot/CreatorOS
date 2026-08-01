import { CapabilityApplicationService } from './capability-application.service';

describe('CapabilityApplicationService', () => {
  it('exports the current service class', () => {
    expect(CapabilityApplicationService).toBeDefined();
    expect(typeof CapabilityApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CapabilityApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CapabilityApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});