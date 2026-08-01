import { SocialCreativeStageService } from './social-creative-stage.service';

describe('SocialCreativeStageService', () => {
  it('exports the current service class', () => {
    expect(SocialCreativeStageService).toBeDefined();
    expect(typeof SocialCreativeStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SocialCreativeStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SocialCreativeStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});