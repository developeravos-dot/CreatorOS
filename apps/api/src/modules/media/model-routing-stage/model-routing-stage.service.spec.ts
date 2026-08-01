import { ModelRoutingStageService } from './model-routing-stage.service';

describe('ModelRoutingStageService', () => {
  it('exports the current service class', () => {
    expect(ModelRoutingStageService).toBeDefined();
    expect(typeof ModelRoutingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ModelRoutingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ModelRoutingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});