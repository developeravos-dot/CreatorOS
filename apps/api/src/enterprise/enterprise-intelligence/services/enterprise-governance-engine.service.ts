import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseGovernanceRule {
  readonly ruleId: string;
  readonly category:
    | 'security'
    | 'compliance'
    | 'financial'
    | 'operational';
  readonly condition: string;
  readonly effect:
    | 'allow'
    | 'deny'
    | 'require-approval';
  readonly priority: number;
  readonly enabled: boolean;
}

@Injectable()
export class EnterpriseGovernanceEngineService {
  private readonly rules =
    new Map<
      string,
      EnterpriseGovernanceRule
    >();

  register(
    rule: EnterpriseGovernanceRule,
  ): EnterpriseGovernanceRule {
    if (
      !rule.ruleId.trim() ||
      !rule.condition.trim() ||
      this.rules.has(
        rule.ruleId.trim(),
      )
    ) {
      throw new Error(
        'Valid unique governance rule is required.',
      );
    }

    const normalized = {
      ...rule,
      ruleId:
        rule.ruleId.trim(),
      condition:
        rule.condition.trim(),
    };

    this.rules.set(
      normalized.ruleId,
      normalized,
    );

    return { ...normalized };
  }

  evaluate(
    condition: string,
  ): {
    readonly outcome:
      | 'allow'
      | 'deny'
      | 'require-approval';
    readonly matchedRuleIds:
      readonly string[];
  } {
    const matched =
      [...this.rules.values()]
        .filter(
          (rule) =>
            rule.enabled &&
            rule.condition ===
              condition.trim(),
        )
        .sort(
          (left, right) =>
            right.priority -
            left.priority,
        );

    return {
      outcome:
        matched[0]?.effect ??
        'deny',
      matchedRuleIds:
        matched.map(
          (rule) => rule.ruleId,
        ),
    };
  }

  list():
    readonly EnterpriseGovernanceRule[] {
    return [...this.rules.values()]
      .map((rule) => ({ ...rule }));
  }
}
