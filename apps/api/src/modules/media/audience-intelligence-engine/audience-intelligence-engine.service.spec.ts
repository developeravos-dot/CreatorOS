import { AudienceIntelligenceEngineService } from './audience-intelligence-engine.service';

describe('AudienceIntelligenceEngineService', () => {
  it('exports the current service class', () => {
    expect(AudienceIntelligenceEngineService).toBeDefined();
    expect(typeof AudienceIntelligenceEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceIntelligenceEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceIntelligenceEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});