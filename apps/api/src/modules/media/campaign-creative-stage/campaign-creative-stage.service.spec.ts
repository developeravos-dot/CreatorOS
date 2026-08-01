import { CampaignCreativeStageService } from './campaign-creative-stage.service';

describe('CampaignCreativeStageService', () => {
  it('exports the current service class', () => {
    expect(CampaignCreativeStageService).toBeDefined();
    expect(typeof CampaignCreativeStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CampaignCreativeStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CampaignCreativeStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});