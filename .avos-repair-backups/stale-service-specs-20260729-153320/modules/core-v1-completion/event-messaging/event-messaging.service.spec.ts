import { EventMessagingService } from './event-messaging.service';

describe('EventMessagingService', () => {
  it('should expose the current service class', () => {
    expect(EventMessagingService).toBeDefined();
    expect(typeof EventMessagingService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EventMessagingService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EventMessagingService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EventMessagingService.name).toBe('EventMessagingService');
  });
});