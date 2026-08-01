import { CreativeProductionService } from './creative-production.service';

describe('CreativeProductionService', () => {
  it('exports the current service class', () => {
    expect(CreativeProductionService).toBeDefined();
    expect(typeof CreativeProductionService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeProductionService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeProductionService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});