import { MediaEcosystemService } from './media-ecosystem.service';

describe('MediaEcosystemService', () => {
  it('should expose the current service class', () => {
    expect(MediaEcosystemService).toBeDefined();
    expect(typeof MediaEcosystemService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MediaEcosystemService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MediaEcosystemService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MediaEcosystemService.name).toBe('MediaEcosystemService');
  });
});