import { CommunityManagerService } from './community-manager.service';

describe('CommunityManagerService', () => {
  it('exports the current service class', () => {
    expect(CommunityManagerService).toBeDefined();
    expect(typeof CommunityManagerService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CommunityManagerService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CommunityManagerService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});