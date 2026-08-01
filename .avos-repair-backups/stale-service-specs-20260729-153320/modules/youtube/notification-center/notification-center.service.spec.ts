import { NotificationCenterService } from './notification-center.service';

describe('NotificationCenterService', () => {
  it('should expose the current service class', () => {
    expect(NotificationCenterService).toBeDefined();
    expect(typeof NotificationCenterService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(NotificationCenterService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (NotificationCenterService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(NotificationCenterService.name).toBe('NotificationCenterService');
  });
});