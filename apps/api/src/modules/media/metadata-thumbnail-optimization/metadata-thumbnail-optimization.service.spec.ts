import { MetadataThumbnailOptimizationService } from './metadata-thumbnail-optimization.service';

describe('MetadataThumbnailOptimizationService', () => {
  it('exports the current service class', () => {
    expect(MetadataThumbnailOptimizationService).toBeDefined();
    expect(typeof MetadataThumbnailOptimizationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MetadataThumbnailOptimizationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MetadataThumbnailOptimizationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});