import { CreativeAiCouncilService } from './creative-ai-council.service';

describe('CreativeAiCouncilService', () => {
  it('exports the current service class', () => {
    expect(CreativeAiCouncilService).toBeDefined();
    expect(typeof CreativeAiCouncilService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeAiCouncilService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeAiCouncilService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});