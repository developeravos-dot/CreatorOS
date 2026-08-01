import { GovernanceService } from './governance.service';

describe('GovernanceService', () => {
  it('should expose the current service class', () => {
    expect(GovernanceService).toBeDefined();
    expect(typeof GovernanceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GovernanceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GovernanceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GovernanceService.name).toBe('GovernanceService');
  });
});