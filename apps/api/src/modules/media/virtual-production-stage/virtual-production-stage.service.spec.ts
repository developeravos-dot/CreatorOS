import { VirtualProductionStageService } from './virtual-production-stage.service';

describe('VirtualProductionStageService', () => {
  it('exports the current service class', () => {
    expect(VirtualProductionStageService).toBeDefined();
    expect(typeof VirtualProductionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VirtualProductionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VirtualProductionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});