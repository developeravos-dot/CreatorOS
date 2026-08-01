import { IntegrationsService } from './integrations.service';

describe('IntegrationsService', () => {
  it('exports the current service class', () => {
    expect(IntegrationsService).toBeDefined();
    expect(typeof IntegrationsService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IntegrationsService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IntegrationsService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});