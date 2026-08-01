import { ConfigService } from './config.service';

describe('ConfigService', () => {
  it('should expose the current service class', () => {
    expect(ConfigService).toBeDefined();
    expect(typeof ConfigService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ConfigService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ConfigService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ConfigService.name).toBe('ConfigService');
  });
});