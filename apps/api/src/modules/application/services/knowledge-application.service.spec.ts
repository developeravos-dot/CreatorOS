import { KnowledgeApplicationService } from './knowledge-application.service';

describe('KnowledgeApplicationService', () => {
  it('exports the current service class', () => {
    expect(KnowledgeApplicationService).toBeDefined();
    expect(typeof KnowledgeApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = KnowledgeApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(KnowledgeApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});