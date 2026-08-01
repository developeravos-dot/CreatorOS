import { CampaignCreativeStageService } from './campaign-creative-stage.service';

describe('CampaignCreativeStageService', () => {
  it('should expose the current service class', () => {
    expect(CampaignCreativeStageService).toBeDefined();
    expect(typeof CampaignCreativeStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CampaignCreativeStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CampaignCreativeStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CampaignCreativeStageService.name).toBe('CampaignCreativeStageService');
  });
});