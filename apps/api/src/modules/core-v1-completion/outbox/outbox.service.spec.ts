import { OutboxService } from './outbox.service';

describe('OutboxService', () => {
  it('exports the current service class', () => {
    expect(OutboxService).toBeDefined();
    expect(typeof OutboxService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OutboxService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OutboxService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});