import { EventMessagingService } from './event-messaging.service';

describe('EventMessagingService', () => {
  it('exports the current service class', () => {
    expect(EventMessagingService).toBeDefined();
    expect(typeof EventMessagingService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EventMessagingService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EventMessagingService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});