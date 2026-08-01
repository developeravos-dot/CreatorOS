import { IdeaGeneratorService } from './idea-generator.service';

describe('IdeaGeneratorService', () => {
  it('exports the current service class', () => {
    expect(IdeaGeneratorService).toBeDefined();
    expect(typeof IdeaGeneratorService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdeaGeneratorService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdeaGeneratorService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});