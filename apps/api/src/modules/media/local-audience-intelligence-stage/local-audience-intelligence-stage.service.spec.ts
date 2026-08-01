import { LocalAudienceIntelligenceStageService } from './local-audience-intelligence-stage.service';

describe('LocalAudienceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(LocalAudienceIntelligenceStageService).toBeDefined();
    expect(typeof LocalAudienceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LocalAudienceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LocalAudienceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});