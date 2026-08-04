import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseComplianceControl {
  readonly controlId: string;
  readonly framework: string;
  readonly description: string;
  readonly required: boolean;
}

export interface EnterpriseComplianceEvidence {
  readonly evidenceId: string;
  readonly controlId: string;
  readonly valid: boolean;
  readonly recordedAt: Date;
}

@Injectable()
export class EnterpriseComplianceEngineService {
  assess(input: {
    readonly controls:
      readonly EnterpriseComplianceControl[];
    readonly evidence:
      readonly EnterpriseComplianceEvidence[];
  }) {
    const results =
      input.controls.map((control) => {
        const evidence =
          input.evidence.filter(
            (item) =>
              item.controlId ===
              control.controlId,
          );

        const satisfied =
          evidence.some(
            (item) => item.valid,
          );

        return {
          controlId:
            control.controlId,
          framework:
            control.framework,
          required:
            control.required,
          satisfied,
        };
      });

    const required =
      results.filter(
        (result) =>
          result.required,
      );

    const satisfiedRequired =
      required.filter(
        (result) =>
          result.satisfied,
      );

    return {
      compliant:
        required.length ===
          satisfiedRequired.length,
      coverage:
        required.length === 0
          ? 1
          : satisfiedRequired.length /
            required.length,
      results,
    };
  }
}
