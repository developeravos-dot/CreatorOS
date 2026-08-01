import { MetadataThumbnailOptimizationService } from './metadata-thumbnail-optimization.service';

describe('MetadataThumbnailOptimizationService', () => {
  it('should expose the current service class', () => {
    expect(MetadataThumbnailOptimizationService).toBeDefined();
    expect(typeof MetadataThumbnailOptimizationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MetadataThumbnailOptimizationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MetadataThumbnailOptimizationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MetadataThumbnailOptimizationService.name).toBe('MetadataThumbnailOptimizationService');
  });
});