import { LicensingFranchiseExpansionStageService } from './licensing-franchise-expansion-stage.service';

describe('LicensingFranchiseExpansionStageService', () => {
  it('exports the current service class', () => {
    expect(LicensingFranchiseExpansionStageService).toBeDefined();
    expect(typeof LicensingFranchiseExpansionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LicensingFranchiseExpansionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LicensingFranchiseExpansionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});