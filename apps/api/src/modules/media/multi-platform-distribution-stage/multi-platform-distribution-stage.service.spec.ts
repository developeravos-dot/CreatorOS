import { MultiPlatformDistributionStageService } from './multi-platform-distribution-stage.service';

describe('MultiPlatformDistributionStageService', () => {
  it('exports the current service class', () => {
    expect(MultiPlatformDistributionStageService).toBeDefined();
    expect(typeof MultiPlatformDistributionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MultiPlatformDistributionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MultiPlatformDistributionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});