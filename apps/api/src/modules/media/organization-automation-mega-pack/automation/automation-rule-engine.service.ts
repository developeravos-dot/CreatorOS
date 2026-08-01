import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AutomationRule,
  OrganizationBrief,
} from '../organization-automation.types';

@Injectable()
export class AutomationRuleEngineService {
  build(brief: OrganizationBrief): AutomationRule[] {
    const goals =
      brief.automationGoals ??
      [
        'route-new-work',
        'detect-blockers',
        'request-human-approval',
        'record-operational-events',
      ];

    return goals.map((goal, index) => ({
      id: randomUUID(),
      name: `Automation Rule ${index + 1}: ${goal}`,
      trigger: this.triggerFor(goal),
      conditions: [
        'program-is-active',
        'required-data-is-present',
        'risk-is-within-approved-boundary',
      ],
      actions: this.actionsFor(goal),
      riskLevel:
        goal.includes('approval')
          ? 'high'
          : goal.includes('execute')
            ? 'critical'
            : 'medium',
      requiresHumanApproval:
        goal.includes('approval') ||
        goal.includes('execute') ||
        goal.includes('publish'),
      enabled: false,
    }));
  }

  enable(rule: AutomationRule, humanApproved: boolean) {
    if (rule.requiresHumanApproval && !humanApproved) {
      throw new Error(
        'Human approval is required before enabling this automation rule.',
      );
    }

    rule.enabled = true;
    return rule;
  }

  evaluate(
    rule: AutomationRule,
    context: Record<string, unknown>,
  ) {
    if (!rule.enabled) {
      return {
        matched: false,
        actions: [],
        reason: 'rule-disabled',
      };
    }

    const programActive = context.programActive === true;
    const dataPresent = context.requiredDataPresent === true;
    const riskApproved = context.riskApproved === true;

    const matched =
      programActive &&
      dataPresent &&
      riskApproved;

    return {
      matched,
      actions: matched ? rule.actions : [],
      reason: matched
        ? 'conditions-satisfied'
        : 'conditions-not-satisfied',
    };
  }

  private triggerFor(goal: string) {
    if (goal.includes('blocker')) {
      return 'workflow-blocked';
    }

    if (goal.includes('approval')) {
      return 'approval-required';
    }

    if (goal.includes('record')) {
      return 'operational-event-created';
    }

    return 'new-work-received';
  }

  private actionsFor(goal: string) {
    if (goal.includes('blocker')) {
      return ['classify-blocker', 'route-escalation'];
    }

    if (goal.includes('approval')) {
      return ['create-approval-request', 'pause-dependent-work'];
    }

    if (goal.includes('record')) {
      return ['append-audit-event', 'update-dashboard'];
    }

    return ['classify-work', 'assign-team', 'create-workflow'];
  }
}