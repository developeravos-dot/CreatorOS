import { AiOrganizationService } from './ai-organization.service';

describe('AiOrganizationService', () => {
  it('should expose the current service class', () => {
    expect(AiOrganizationService).toBeDefined();
    expect(typeof AiOrganizationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AiOrganizationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AiOrganizationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AiOrganizationService.name).toBe('AiOrganizationService');
  });
});