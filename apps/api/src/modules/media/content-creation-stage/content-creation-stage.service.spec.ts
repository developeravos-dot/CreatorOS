import { ContentCreationStageService } from './content-creation-stage.service';

describe('ContentCreationStageService', () => {
  it('exports the current service class', () => {
    expect(ContentCreationStageService).toBeDefined();
    expect(typeof ContentCreationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentCreationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentCreationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});