import { CreativeDirectionStageService } from './creative-direction-stage.service';

describe('CreativeDirectionStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeDirectionStageService).toBeDefined();
    expect(typeof CreativeDirectionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeDirectionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeDirectionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});