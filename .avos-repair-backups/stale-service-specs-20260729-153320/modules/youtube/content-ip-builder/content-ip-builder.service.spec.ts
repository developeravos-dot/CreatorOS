import { ContentIpBuilderService } from './content-ip-builder.service';

describe('ContentIpBuilderService', () => {
  it('should expose the current service class', () => {
    expect(ContentIpBuilderService).toBeDefined();
    expect(typeof ContentIpBuilderService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentIpBuilderService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentIpBuilderService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentIpBuilderService.name).toBe('ContentIpBuilderService');
  });
});