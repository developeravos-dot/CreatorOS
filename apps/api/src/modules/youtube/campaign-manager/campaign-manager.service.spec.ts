import { CampaignManagerService } from './campaign-manager.service';

describe('CampaignManagerService', () => {
  it('exports the current service class', () => {
    expect(CampaignManagerService).toBeDefined();
    expect(typeof CampaignManagerService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CampaignManagerService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CampaignManagerService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});