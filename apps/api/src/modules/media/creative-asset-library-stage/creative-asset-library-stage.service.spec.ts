import { CreativeAssetLibraryStageService } from './creative-asset-library-stage.service';

describe('CreativeAssetLibraryStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeAssetLibraryStageService).toBeDefined();
    expect(typeof CreativeAssetLibraryStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeAssetLibraryStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeAssetLibraryStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});