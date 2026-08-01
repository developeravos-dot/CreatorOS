import { TrademarkManagementStageService } from './trademark-management-stage.service';

describe('TrademarkManagementStageService', () => {
  it('exports the current service class', () => {
    expect(TrademarkManagementStageService).toBeDefined();
    expect(typeof TrademarkManagementStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TrademarkManagementStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TrademarkManagementStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});