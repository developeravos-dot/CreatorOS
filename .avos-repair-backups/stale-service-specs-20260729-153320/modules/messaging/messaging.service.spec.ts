import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  it('should expose the current service class', () => {
    expect(MessagingService).toBeDefined();
    expect(typeof MessagingService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MessagingService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MessagingService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MessagingService.name).toBe('MessagingService');
  });
});