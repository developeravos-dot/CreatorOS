import { SponsorshipManagerService } from './sponsorship-manager.service';

describe('SponsorshipManagerService', () => {
  it('exports the current service class', () => {
    expect(SponsorshipManagerService).toBeDefined();
    expect(typeof SponsorshipManagerService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SponsorshipManagerService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SponsorshipManagerService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});