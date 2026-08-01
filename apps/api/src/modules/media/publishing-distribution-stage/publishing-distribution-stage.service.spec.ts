import { PublishingDistributionStageService } from './publishing-distribution-stage.service';

describe('PublishingDistributionStageService', () => {
  it('exports the current service class', () => {
    expect(PublishingDistributionStageService).toBeDefined();
    expect(typeof PublishingDistributionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PublishingDistributionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PublishingDistributionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});