import { Injectable } from '@nestjs/common';

export interface EnterprisePolicy {
  readonly policyId: string;
  readonly subject: string;
  readonly action: string;
  readonly resource: string;
  readonly effect: 'allow' | 'deny';
  readonly priority: number;
  readonly enabled: boolean;
}

@Injectable()
export class EnterprisePolicyEngineService {
  private readonly policies = new Map<string, EnterprisePolicy>();

  register(policy: EnterprisePolicy): EnterprisePolicy {
    const policyId = policy.policyId.trim();
    if (!policyId || !policy.subject.trim() || !policy.action.trim() || !policy.resource.trim() || this.policies.has(policyId)) throw new Error('Valid unique enterprise policy is required.');
    const normalized = { ...policy, policyId, subject: policy.subject.trim(), action: policy.action.trim(), resource: policy.resource.trim() };
    this.policies.set(policyId, normalized);
    return { ...normalized };
  }

  evaluate(input: { readonly subject: string; readonly action: string; readonly resource: string }): { readonly allowed: boolean; readonly matchedPolicyIds: readonly string[] } {
    const matched = [...this.policies.values()]
      .filter((policy) => policy.enabled && policy.subject === input.subject.trim() && policy.action === input.action.trim() && policy.resource === input.resource.trim())
      .sort((left, right) => right.priority - left.priority);
    return { allowed: matched[0]?.effect === 'allow', matchedPolicyIds: matched.map((policy) => policy.policyId) };
  }

  list(): readonly EnterprisePolicy[] {
    return [...this.policies.values()].sort((left, right) => right.priority - left.priority).map((policy) => ({ ...policy }));
  }
}
