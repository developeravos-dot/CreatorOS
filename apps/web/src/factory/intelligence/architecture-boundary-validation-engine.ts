import {
  LayerDetectionEngine,
  type LayerViolation,
} from "./layer-detection-engine";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface ArchitectureBoundaryRule {

  readonly id: string;

  readonly name: string;

  readonly description: string;

}

export interface ArchitectureBoundaryViolation {

  readonly ruleId: string;

  readonly source: string;

  readonly target: string;

  readonly message: string;

}

export interface ArchitectureBoundaryValidationReport {

  readonly rules:
    readonly ArchitectureBoundaryRule[];

  readonly violations:
    readonly ArchitectureBoundaryViolation[];

  readonly valid:
    boolean;

}

export class ArchitectureBoundaryValidationEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  validate():
    ArchitectureBoundaryValidationReport {

    const layerEngine =
      new LayerDetectionEngine(
        this.graph,
      );

    const report =
      layerEngine.analyze();

    const rules =
      this.defaultRules();

    const violations =
      report.violations.map(
        violation =>
          this.mapViolation(
            violation,
          ),
      );

    return {

      rules,

      violations,

      valid:
        violations.length ===
        0,

    };

  }

  private defaultRules():
    readonly ArchitectureBoundaryRule[] {

    return [

      {

        id:
          "ARCH-001",

        name:
          "Domain Isolation",

        description:
          "Domain layer must not depend on Presentation or Application.",

      },

    ];

  }

  private mapViolation(
    violation:
      LayerViolation,
  ):
    ArchitectureBoundaryViolation {

    return {

      ruleId:
        "ARCH-001",

      source:
        violation.source,

      target:
        violation.target,

      message:
        `${violation.sourceLayer} -> ${violation.targetLayer}`,

    };

  }

}
