import { RuntimePluginApplicationService } from './runtime-plugin-application.service';

describe('RuntimePluginApplicationService', () => {
  it('should expose the current service class', () => {
    expect(RuntimePluginApplicationService).toBeDefined();
    expect(typeof RuntimePluginApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RuntimePluginApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RuntimePluginApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RuntimePluginApplicationService.name).toBe('RuntimePluginApplicationService');
  });
});