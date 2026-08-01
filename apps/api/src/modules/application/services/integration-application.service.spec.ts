import { IntegrationApplicationService } from './integration-application.service';

describe('IntegrationApplicationService', () => {
  it('exports the current service class', () => {
    expect(IntegrationApplicationService).toBeDefined();
    expect(typeof IntegrationApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IntegrationApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IntegrationApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});