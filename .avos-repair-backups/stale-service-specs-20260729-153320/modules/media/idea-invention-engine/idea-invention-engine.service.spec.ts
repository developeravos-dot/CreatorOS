import { IdeaInventionEngineService } from './idea-invention-engine.service';

describe('IdeaInventionEngineService', () => {
  it('should expose the current service class', () => {
    expect(IdeaInventionEngineService).toBeDefined();
    expect(typeof IdeaInventionEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdeaInventionEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdeaInventionEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdeaInventionEngineService.name).toBe('IdeaInventionEngineService');
  });
});