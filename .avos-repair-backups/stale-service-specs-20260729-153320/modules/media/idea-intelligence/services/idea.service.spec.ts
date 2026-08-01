import { IdeaService } from './idea.service';

describe('IdeaService', () => {
  it('should expose the current service class', () => {
    expect(IdeaService).toBeDefined();
    expect(typeof IdeaService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdeaService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdeaService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdeaService.name).toBe('IdeaService');
  });
});