import { SocialCreativeStageService } from './social-creative-stage.service';

describe('SocialCreativeStageService', () => {
  it('should expose the current service class', () => {
    expect(SocialCreativeStageService).toBeDefined();
    expect(typeof SocialCreativeStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SocialCreativeStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SocialCreativeStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SocialCreativeStageService.name).toBe('SocialCreativeStageService');
  });
});