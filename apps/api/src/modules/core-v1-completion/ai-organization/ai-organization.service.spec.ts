import { AiOrganizationService } from './ai-organization.service';

describe('AiOrganizationService', () => {
  it('exports the current service class', () => {
    expect(AiOrganizationService).toBeDefined();
    expect(typeof AiOrganizationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AiOrganizationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AiOrganizationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});