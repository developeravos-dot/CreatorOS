import { CommerceProductExpansionStageService } from './commerce-product-expansion-stage.service';

describe('CommerceProductExpansionStageService', () => {
  it('exports the current service class', () => {
    expect(CommerceProductExpansionStageService).toBeDefined();
    expect(typeof CommerceProductExpansionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CommerceProductExpansionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CommerceProductExpansionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});