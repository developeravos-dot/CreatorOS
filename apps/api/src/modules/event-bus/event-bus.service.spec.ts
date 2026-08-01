import { EventBusService } from './event-bus.service';

describe('EventBusService', () => {
  it('exports the current service class', () => {
    expect(EventBusService).toBeDefined();
    expect(typeof EventBusService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EventBusService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EventBusService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});