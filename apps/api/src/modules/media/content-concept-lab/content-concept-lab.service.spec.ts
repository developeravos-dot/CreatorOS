import { ContentConceptLabService } from './content-concept-lab.service';

describe('ContentConceptLabService', () => {
  it('exports the current service class', () => {
    expect(ContentConceptLabService).toBeDefined();
    expect(typeof ContentConceptLabService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentConceptLabService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentConceptLabService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});