import { Injectable } from '@nestjs/common';

import type {
  CapabilityManifestContract,
  CapabilityValidationIssueContract,
  CapabilityValidationResultContract,
} from '../contracts';
import type {
  CapabilityValidationRule,
  CapabilityValidator,
} from '../interfaces';
import { CapabilityManifestValidatorService } from './capability-manifest-validator.service';

@Injectable()
export class CapabilityValidationPipelineService
  implements CapabilityValidator
{
  private readonly rules: CapabilityValidationRule[] = [];

  constructor(
    private readonly manifestValidator =
      new CapabilityManifestValidatorService(),
  ) {}

  registerRule(rule: CapabilityValidationRule): void {
    const existingIndex = this.rules.findIndex(
      (item) => item.code === rule.code,
    );

    if (existingIndex >= 0) {
      this.rules[existingIndex] = rule;
      return;
    }

    this.rules.push(rule);
  }

  unregisterRule(code: string): boolean {
    const index = this.rules.findIndex(
      (rule) => rule.code === code,
    );

    if (index < 0) {
      return false;
    }

    this.rules.splice(index, 1);

    return true;
  }

  listRules(): readonly CapabilityValidationRule[] {
    return [...this.rules];
  }

  async validateManifest(
    manifest: CapabilityManifestContract,
  ): Promise<CapabilityValidationResultContract> {
    const baseResult =
      await this.manifestValidator.validateManifest(manifest);

    const issues: CapabilityValidationIssueContract[] = [
      ...baseResult.issues,
    ];

    for (const rule of this.rules) {
      const ruleResult = await rule.validate(manifest);
      issues.push(...ruleResult.issues);
    }

    return {
      capabilityId: manifest.id,
      valid: !issues.some(
        (issue) => issue.severity === 'error',
      ),
      issues,
      validatedAt: new Date().toISOString(),
    };
  }
}