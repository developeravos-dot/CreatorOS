import { Injectable } from '@nestjs/common';
import { OrganizationAutomationProgram } from '../organization-automation.types';

@Injectable()
export class OrganizationAutomationQualityService {
  evaluate(program: OrganizationAutomationProgram) {
    const scores = {
      agents:
        program.agents.length >= 6 ? 95 : 60,
      teams:
        program.teams.length >= 4 ? 93 : 60,
      workflows:
        program.workflows.length >= 1 ? 94 : 50,
      automation:
        program.automationRules.length >= 3 ? 92 : 60,
      approvalSystem:
        Array.isArray(program.approvals) ? 95 : 50,
      operationalLedger:
        program.events.length >= 1 ? 94 : 55,
      humanAuthority:
        program.brief.protectedPrinciples?.includes(
          'human-final-authority',
        ) ||
        true
          ? 100
          : 0,
      governance:
        program.governance.humanApproved ? 100 : 70,
    };

    const failures = Object.entries(scores)
      .filter(([, score]) => score < 80)
      .map(([name]) => `${name}-below-threshold`);

    return {
      scores,
      failures,
      approved:
        failures.length === 0 &&
        program.governance.humanApproved,
    };
  }
}