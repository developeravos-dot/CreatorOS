import { SubscriptionMembershipIntelligenceStageService } from './subscription-membership-intelligence-stage.service';

describe('SubscriptionMembershipIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(SubscriptionMembershipIntelligenceStageService).toBeDefined();
    expect(typeof SubscriptionMembershipIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SubscriptionMembershipIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SubscriptionMembershipIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});