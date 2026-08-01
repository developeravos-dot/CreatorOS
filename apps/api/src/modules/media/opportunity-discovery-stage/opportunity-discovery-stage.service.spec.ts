import { OpportunityDiscoveryStageService } from './opportunity-discovery-stage.service';

describe('OpportunityDiscoveryStageService', () => {
  it('exports the current service class', () => {
    expect(OpportunityDiscoveryStageService).toBeDefined();
    expect(typeof OpportunityDiscoveryStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OpportunityDiscoveryStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OpportunityDiscoveryStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});