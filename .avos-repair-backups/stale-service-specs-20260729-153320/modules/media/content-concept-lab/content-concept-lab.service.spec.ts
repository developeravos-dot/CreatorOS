import { ContentConceptLabService } from './content-concept-lab.service';

describe('ContentConceptLabService', () => {
  it('should expose the current service class', () => {
    expect(ContentConceptLabService).toBeDefined();
    expect(typeof ContentConceptLabService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentConceptLabService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentConceptLabService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentConceptLabService.name).toBe('ContentConceptLabService');
  });
});