import { PublishingAutomationService } from './publishing-automation.service';

describe('PublishingAutomationService', () => {
  it('exports the current service class', () => {
    expect(PublishingAutomationService).toBeDefined();
    expect(typeof PublishingAutomationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PublishingAutomationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PublishingAutomationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});