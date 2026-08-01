import { EventBusService } from './event-bus.service';

describe('EventBusService', () => {
  it('should expose the current service class', () => {
    expect(EventBusService).toBeDefined();
    expect(typeof EventBusService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EventBusService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EventBusService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EventBusService.name).toBe('EventBusService');
  });
});