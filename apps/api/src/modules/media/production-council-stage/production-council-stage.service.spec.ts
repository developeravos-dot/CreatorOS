import { ProductionCouncilStageService } from './production-council-stage.service';

describe('ProductionCouncilStageService', () => {
  it('exports the current service class', () => {
    expect(ProductionCouncilStageService).toBeDefined();
    expect(typeof ProductionCouncilStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProductionCouncilStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProductionCouncilStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});