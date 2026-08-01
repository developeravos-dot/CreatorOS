import { OutboxService } from './outbox.service';

describe('OutboxService', () => {
  it('should expose the current service class', () => {
    expect(OutboxService).toBeDefined();
    expect(typeof OutboxService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(OutboxService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (OutboxService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(OutboxService.name).toBe('OutboxService');
  });
});