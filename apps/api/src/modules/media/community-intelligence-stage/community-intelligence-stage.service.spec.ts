import { CommunityIntelligenceStageService } from './community-intelligence-stage.service';

describe('CommunityIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(CommunityIntelligenceStageService).toBeDefined();
    expect(typeof CommunityIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CommunityIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CommunityIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});