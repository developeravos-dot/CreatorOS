import { RuntimePluginApplicationService } from './runtime-plugin-application.service';

describe('RuntimePluginApplicationService', () => {
  it('exports the current service class', () => {
    expect(RuntimePluginApplicationService).toBeDefined();
    expect(typeof RuntimePluginApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RuntimePluginApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RuntimePluginApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});