import { AssetLibraryService } from './asset-library.service';

describe('AssetLibraryService', () => {
  it('should expose the current service class', () => {
    expect(AssetLibraryService).toBeDefined();
    expect(typeof AssetLibraryService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AssetLibraryService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AssetLibraryService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AssetLibraryService.name).toBe('AssetLibraryService');
  });
});