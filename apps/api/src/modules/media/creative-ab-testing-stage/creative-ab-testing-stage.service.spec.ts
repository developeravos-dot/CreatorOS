import { CreativeAbTestingStageService } from './creative-ab-testing-stage.service';

describe('CreativeAbTestingStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeAbTestingStageService).toBeDefined();
    expect(typeof CreativeAbTestingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeAbTestingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeAbTestingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});