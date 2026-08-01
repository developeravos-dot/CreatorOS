import { BusinessClientSolutionsStageService } from './business-client-solutions-stage.service';

describe('BusinessClientSolutionsStageService', () => {
  it('exports the current service class', () => {
    expect(BusinessClientSolutionsStageService).toBeDefined();
    expect(typeof BusinessClientSolutionsStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BusinessClientSolutionsStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BusinessClientSolutionsStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});