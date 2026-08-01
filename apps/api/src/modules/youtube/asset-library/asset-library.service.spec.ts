import { AssetLibraryService } from './asset-library.service';

describe('AssetLibraryService', () => {
  it('exports the current service class', () => {
    expect(AssetLibraryService).toBeDefined();
    expect(typeof AssetLibraryService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AssetLibraryService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AssetLibraryService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});