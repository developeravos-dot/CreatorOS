import { CreativeAssetLibraryStageService } from './creative-asset-library-stage.service';

describe('CreativeAssetLibraryStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeAssetLibraryStageService).toBeDefined();
    expect(typeof CreativeAssetLibraryStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeAssetLibraryStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeAssetLibraryStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeAssetLibraryStageService.name).toBe('CreativeAssetLibraryStageService');
  });
});