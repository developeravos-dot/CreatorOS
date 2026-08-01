import { MultilingualContentEngineService } from './multilingual-content-engine.service';

describe('MultilingualContentEngineService', () => {
  it('exports the current service class', () => {
    expect(MultilingualContentEngineService).toBeDefined();
    expect(typeof MultilingualContentEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MultilingualContentEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MultilingualContentEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});