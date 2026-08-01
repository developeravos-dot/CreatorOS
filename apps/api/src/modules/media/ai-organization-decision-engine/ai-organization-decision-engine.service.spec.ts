import { AiOrganizationDecisionEngineService } from './ai-organization-decision-engine.service';

describe('AiOrganizationDecisionEngineService', () => {
  it('exports the current service class', () => {
    expect(AiOrganizationDecisionEngineService).toBeDefined();
    expect(typeof AiOrganizationDecisionEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AiOrganizationDecisionEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AiOrganizationDecisionEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});