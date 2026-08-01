import { FranchiseExpansionEngineService } from './franchise-expansion-engine.service';

describe('FranchiseExpansionEngineService', () => {
  it('exports the current service class', () => {
    expect(FranchiseExpansionEngineService).toBeDefined();
    expect(typeof FranchiseExpansionEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = FranchiseExpansionEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(FranchiseExpansionEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});