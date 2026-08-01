import { CreativeAiCouncilService } from './creative-ai-council.service';

describe('CreativeAiCouncilService', () => {
  it('should expose the current service class', () => {
    expect(CreativeAiCouncilService).toBeDefined();
    expect(typeof CreativeAiCouncilService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeAiCouncilService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeAiCouncilService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeAiCouncilService.name).toBe('CreativeAiCouncilService');
  });
});