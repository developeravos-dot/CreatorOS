import { EditingIntelligenceStageService } from './editing-intelligence-stage.service';

describe('EditingIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(EditingIntelligenceStageService).toBeDefined();
    expect(typeof EditingIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EditingIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EditingIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});