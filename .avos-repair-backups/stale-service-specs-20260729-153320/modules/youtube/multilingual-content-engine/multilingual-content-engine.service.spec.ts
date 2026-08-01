import { MultilingualContentEngineService } from './multilingual-content-engine.service';

describe('MultilingualContentEngineService', () => {
  it('should expose the current service class', () => {
    expect(MultilingualContentEngineService).toBeDefined();
    expect(typeof MultilingualContentEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MultilingualContentEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MultilingualContentEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MultilingualContentEngineService.name).toBe('MultilingualContentEngineService');
  });
});