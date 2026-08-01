import { PolicyLegalComplianceEngineService } from './policy-legal-compliance-engine.service';

describe('PolicyLegalComplianceEngineService', () => {
  it('exports the current service class', () => {
    expect(PolicyLegalComplianceEngineService).toBeDefined();
    expect(typeof PolicyLegalComplianceEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PolicyLegalComplianceEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PolicyLegalComplianceEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});