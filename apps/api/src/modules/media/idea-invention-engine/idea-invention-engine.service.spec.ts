import { IdeaInventionEngineService } from './idea-invention-engine.service';

describe('IdeaInventionEngineService', () => {
  it('exports the current service class', () => {
    expect(IdeaInventionEngineService).toBeDefined();
    expect(typeof IdeaInventionEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdeaInventionEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdeaInventionEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});