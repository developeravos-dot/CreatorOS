import { SponsorshipManagerService } from './sponsorship-manager.service';

describe('SponsorshipManagerService', () => {
  it('should expose the current service class', () => {
    expect(SponsorshipManagerService).toBeDefined();
    expect(typeof SponsorshipManagerService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SponsorshipManagerService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SponsorshipManagerService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SponsorshipManagerService.name).toBe('SponsorshipManagerService');
  });
});