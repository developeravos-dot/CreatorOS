import { PublishingAutomationService } from './publishing-automation.service';

describe('PublishingAutomationService', () => {
  it('should expose the current service class', () => {
    expect(PublishingAutomationService).toBeDefined();
    expect(typeof PublishingAutomationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PublishingAutomationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PublishingAutomationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PublishingAutomationService.name).toBe('PublishingAutomationService');
  });
});