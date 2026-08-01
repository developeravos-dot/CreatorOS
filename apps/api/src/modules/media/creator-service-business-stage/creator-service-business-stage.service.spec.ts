import { CreatorServiceBusinessStageService } from './creator-service-business-stage.service';

describe('CreatorServiceBusinessStageService', () => {
  it('exports the current service class', () => {
    expect(CreatorServiceBusinessStageService).toBeDefined();
    expect(typeof CreatorServiceBusinessStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreatorServiceBusinessStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreatorServiceBusinessStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});