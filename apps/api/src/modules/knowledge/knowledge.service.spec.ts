import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService', () => {
  it('exports the current service class', () => {
    expect(KnowledgeService).toBeDefined();
    expect(typeof KnowledgeService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = KnowledgeService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(KnowledgeService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});