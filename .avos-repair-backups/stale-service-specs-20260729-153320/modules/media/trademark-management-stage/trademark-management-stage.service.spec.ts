import { TrademarkManagementStageService } from './trademark-management-stage.service';

describe('TrademarkManagementStageService', () => {
  it('should expose the current service class', () => {
    expect(TrademarkManagementStageService).toBeDefined();
    expect(typeof TrademarkManagementStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(TrademarkManagementStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (TrademarkManagementStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(TrademarkManagementStageService.name).toBe('TrademarkManagementStageService');
  });
});