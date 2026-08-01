import { AudienceIntelligenceStageService } from './audience-intelligence-stage.service';

describe('AudienceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(AudienceIntelligenceStageService).toBeDefined();
    expect(typeof AudienceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});