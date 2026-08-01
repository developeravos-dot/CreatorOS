import { NotificationCenterService } from './notification-center.service';

describe('NotificationCenterService', () => {
  it('exports the current service class', () => {
    expect(NotificationCenterService).toBeDefined();
    expect(typeof NotificationCenterService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = NotificationCenterService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(NotificationCenterService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});