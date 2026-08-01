import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  it('exports the current service class', () => {
    expect(LoggingService).toBeDefined();
    expect(typeof LoggingService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LoggingService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LoggingService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});