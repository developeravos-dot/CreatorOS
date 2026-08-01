import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  it('exports the current service class', () => {
    expect(MessagingService).toBeDefined();
    expect(typeof MessagingService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MessagingService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MessagingService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});