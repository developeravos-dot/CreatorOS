import {
  ArchitectureBoundaryValidationEngine,
} from "./architecture-boundary-validation-engine";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface ArchitectureRule {

  readonly id: string;

  readonly name: string;

  readonly severity:
    "info" |
    "warning" |
    "error";

  readonly enabled:
    boolean;

}

export interface ArchitectureRuleResult {

  readonly rule:
    ArchitectureRule;

  readonly passed:
    boolean;

  readonly violations:
    number;

}

export interface ArchitectureRulesReport {

  readonly results:
    readonly ArchitectureRuleResult[];

  readonly totalRules:
    number;

  readonly passedRules:
    number;

  readonly failedRules:
    number;

}

export class ArchitectureRulesEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  evaluate():
    ArchitectureRulesReport {

    const validator =
      new ArchitectureBoundaryValidationEngine(
        this.graph,
      );

    const validation =
      validator.validate();

    const rules =
      this.rules();

    const results =
      rules.map(
        rule => ({

          rule,

          passed:
            validation.valid,

          violations:
            validation
              .violations
              .length,

        }),
      );

    return {

      results,

      totalRules:
        results.length,

      passedRules:
        results.filter(
          result =>
            result.passed,
        ).length,

      failedRules:
        results.filter(
          result =>
            !result.passed,
        ).length,

    };

  }

  private rules():
    readonly ArchitectureRule[] {

    return [

      {

        id:
          "ARCH-001",

        name:
          "Layer Boundary Rule",

        severity:
          "error",

        enabled:
          true,

      },

      {

        id:
          "ARCH-002",

        name:
          "Circular Dependency Rule",

        severity:
          "warning",

        enabled:
          true,

      },

      {

        id:
          "ARCH-003",

        name:
          "Workspace Isolation Rule",

        severity:
          "warning",

        enabled:
          true,

      },

    ];

  }

}
