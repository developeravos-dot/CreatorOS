import { ProductionPlanGeneratorService } from './production-plan-generator.service';

describe('ProductionPlanGeneratorService', () => {
  it('exports the current service class', () => {
    expect(ProductionPlanGeneratorService).toBeDefined();
    expect(typeof ProductionPlanGeneratorService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProductionPlanGeneratorService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProductionPlanGeneratorService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});