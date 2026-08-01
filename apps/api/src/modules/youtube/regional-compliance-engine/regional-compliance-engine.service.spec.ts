import { RegionalComplianceEngineService } from './regional-compliance-engine.service';

describe('RegionalComplianceEngineService', () => {
  it('exports the current service class', () => {
    expect(RegionalComplianceEngineService).toBeDefined();
    expect(typeof RegionalComplianceEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RegionalComplianceEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RegionalComplianceEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});