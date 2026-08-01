import { OpportunityRadarService } from './opportunity-radar.service';

describe('OpportunityRadarService', () => {
  it('exports the current service class', () => {
    expect(OpportunityRadarService).toBeDefined();
    expect(typeof OpportunityRadarService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OpportunityRadarService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OpportunityRadarService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});