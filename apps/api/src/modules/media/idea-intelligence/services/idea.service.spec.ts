import { IdeaService } from './idea.service';

describe('IdeaService', () => {
  it('exports the current service class', () => {
    expect(IdeaService).toBeDefined();
    expect(typeof IdeaService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdeaService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdeaService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});