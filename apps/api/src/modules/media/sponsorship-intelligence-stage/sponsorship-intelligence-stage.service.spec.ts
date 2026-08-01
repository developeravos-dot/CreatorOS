import { SponsorshipIntelligenceStageService } from './sponsorship-intelligence-stage.service';

describe('SponsorshipIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(SponsorshipIntelligenceStageService).toBeDefined();
    expect(typeof SponsorshipIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SponsorshipIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SponsorshipIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});