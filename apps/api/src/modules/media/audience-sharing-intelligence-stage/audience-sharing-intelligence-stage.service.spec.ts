import { AudienceSharingIntelligenceStageService } from './audience-sharing-intelligence-stage.service';

describe('AudienceSharingIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(AudienceSharingIntelligenceStageService).toBeDefined();
    expect(typeof AudienceSharingIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceSharingIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceSharingIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});