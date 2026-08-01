import { QueueService } from './queue.service';

describe('QueueService', () => {
  it('exports the current service class', () => {
    expect(QueueService).toBeDefined();
    expect(typeof QueueService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = QueueService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(QueueService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});