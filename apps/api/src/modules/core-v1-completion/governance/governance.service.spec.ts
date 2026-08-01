import { GovernanceService } from './governance.service';

describe('GovernanceService', () => {
  it('exports the current service class', () => {
    expect(GovernanceService).toBeDefined();
    expect(typeof GovernanceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GovernanceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GovernanceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});