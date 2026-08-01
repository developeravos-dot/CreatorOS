import { IpClassificationStageService } from './ip-classification-stage.service';

describe('IpClassificationStageService', () => {
  it('should expose the current service class', () => {
    expect(IpClassificationStageService).toBeDefined();
    expect(typeof IpClassificationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpClassificationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpClassificationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpClassificationStageService.name).toBe('IpClassificationStageService');
  });
});