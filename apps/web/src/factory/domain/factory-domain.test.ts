import {
  describe,
  expect,
  it,
} from "vitest";

import {
  FactoryError,
  addFactoryExecutionStep,
  addFactoryValidationGate,
  createFactoryPack,
  createFactoryStepId,
  createFactoryValidationGateId,
  executeFactoryOperation,
  isFactoryPackReadyForCompletion,
  transitionFactoryPack,
  updateFactoryExecutionStepStatus,
  updateFactoryValidationGateStatus,
} from ".";

describe(
  "factory domain",
  () => {
    it(
      "creates a draft factory pack",
      () => {
        const pack =
          createFactoryPack({
            id:
              "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
            createdAt:
              "2026-08-03T12:00:00+04:00",
          });

        expect(pack.status)
          .toBe("draft");

        expect(pack.version)
          .toBe(1);

        expect(pack.steps)
          .toEqual([]);

        expect(pack.createdAt)
          .toBe(
            "2026-08-03T08:00:00.000Z",
          );
      },
    );

    it(
      "rejects empty pack identifiers",
      () => {
        expect(
          () =>
            createFactoryPack({
              id: " ",
              name:
                "Factory Pack",
              type:
                "foundation",
            }),
        ).toThrow(
          "Pack id is required.",
        );
      },
    );

    it(
      "enforces pack status transitions",
      () => {
        const draft =
          createFactoryPack({
            id: "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
          });

        const planned =
          transitionFactoryPack(
            draft,
            "planned",
          );

        const generating =
          transitionFactoryPack(
            planned,
            "generating",
            "2026-08-03T08:10:00.000Z",
          );

        expect(
          generating.status,
        ).toBe("generating");

        expect(
          generating.startedAt,
        ).toBe(
          "2026-08-03T08:10:00.000Z",
        );

        expect(
          () =>
            transitionFactoryPack(
              draft,
              "completed",
            ),
        ).toThrow(
          "Cannot transition factory pack from draft to completed.",
        );
      },
    );

    it(
      "adds ordered execution steps",
      () => {
        let pack =
          createFactoryPack({
            id: "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
          });

        pack =
          addFactoryExecutionStep(
            pack,
            {
              id:
                "validate",
              type:
                "validate",
              name:
                "Validate",
              order: 2,
            },
          );

        pack =
          addFactoryExecutionStep(
            pack,
            {
              id:
                "analyze",
              type:
                "analyze",
              name:
                "Analyze",
              order: 1,
            },
          );

        expect(
          pack.steps.map(
            (step) =>
              step.id,
          ),
        ).toEqual([
          "analyze",
          "validate",
        ]);
      },
    );

    it(
      "rejects duplicate execution steps",
      () => {
        let pack =
          createFactoryPack({
            id: "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
          });

        pack =
          addFactoryExecutionStep(
            pack,
            {
              id:
                "analyze",
              type:
                "analyze",
              name:
                "Analyze",
              order: 1,
            },
          );

        expect(
          () =>
            addFactoryExecutionStep(
              pack,
              {
                id:
                  "analyze",
                type:
                  "analyze",
                name:
                  "Analyze Again",
                order: 2,
              },
            ),
        ).toThrow(
          "Factory step already exists: analyze.",
        );
      },
    );

    it(
      "tracks execution attempts and failures",
      () => {
        let pack =
          createFactoryPack({
            id: "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
          });

        pack =
          addFactoryExecutionStep(
            pack,
            {
              id:
                "generate",
              type:
                "generate",
              name:
                "Generate",
              order: 1,
            },
          );

        pack =
          updateFactoryExecutionStepStatus(
            pack,
            createFactoryStepId(
              "generate",
            ),
            "running",
            {
              updatedAt:
                "2026-08-03T08:00:00.000Z",
            },
          );

        const error =
          new FactoryError(
            "Generation failed.",
            {
              code:
                "EXECUTION_FAILED",
              recoverable:
                true,
            },
          );

        pack =
          updateFactoryExecutionStepStatus(
            pack,
            createFactoryStepId(
              "generate",
            ),
            "failed",
            {
              error,
              updatedAt:
                "2026-08-03T08:01:00.000Z",
            },
          );

        expect(
          pack.steps[0]
            ?.attempts,
        ).toBe(1);

        expect(
          pack.steps[0]
            ?.error?.code,
        ).toBe(
          "EXECUTION_FAILED",
        );

        expect(pack.errors)
          .toHaveLength(1);
      },
    );

    it(
      "adds and updates validation gates",
      () => {
        let pack =
          createFactoryPack({
            id: "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
          });

        pack =
          addFactoryValidationGate(
            pack,
            {
              id:
                "typescript",
              type:
                "typescript",
              name:
                "TypeScript",
              command:
                "pnpm exec tsc --noEmit",
            },
          );

        pack =
          updateFactoryValidationGateStatus(
            pack,
            createFactoryValidationGateId(
              "typescript",
            ),
            "running",
          );

        pack =
          updateFactoryValidationGateStatus(
            pack,
            createFactoryValidationGateId(
              "typescript",
            ),
            "passed",
            {
              output:
                "No errors.",
            },
          );

        expect(
          pack.validationGates[0]
            ?.status,
        ).toBe("passed");

        expect(
          pack.validationGates[0]
            ?.output,
        ).toBe(
          "No errors.",
        );
      },
    );

    it(
      "requires completed steps and passed required gates",
      () => {
        let pack =
          createFactoryPack({
            id: "factory-f0",
            name:
              "Factory Foundation",
            type:
              "foundation",
          });

        pack =
          addFactoryExecutionStep(
            pack,
            {
              id:
                "generate",
              type:
                "generate",
              name:
                "Generate",
              order: 1,
            },
          );

        pack =
          addFactoryValidationGate(
            pack,
            {
              id:
                "vitest",
              type:
                "vitest",
              name:
                "Vitest",
            },
          );

        expect(
          isFactoryPackReadyForCompletion(
            pack,
          ),
        ).toBe(false);

        pack =
          updateFactoryExecutionStepStatus(
            pack,
            createFactoryStepId(
              "generate",
            ),
            "succeeded",
          );

        pack =
          updateFactoryValidationGateStatus(
            pack,
            createFactoryValidationGateId(
              "vitest",
            ),
            "passed",
          );

        expect(
          isFactoryPackReadyForCompletion(
            pack,
          ),
        ).toBe(true);
      },
    );

    it(
      "captures successful operations",
      async () => {
        const timestamps = [
          "2026-08-03T08:00:00.000Z",
          "2026-08-03T08:00:01.250Z",
        ];

        const result =
          await executeFactoryOperation(
            async () => ({
              created: true,
            }),
            () =>
              timestamps.shift()!,
          );

        expect(result)
          .toEqual({
            success: true,
            value: {
              created: true,
            },
            error: null,
            startedAt:
              "2026-08-03T08:00:00.000Z",
            completedAt:
              "2026-08-03T08:00:01.250Z",
            durationMs:
              1250,
          });
      },
    );

    it(
      "captures failed operations",
      async () => {
        const timestamps = [
          "2026-08-03T08:00:00.000Z",
          "2026-08-03T08:00:00.500Z",
        ];

        const result =
          await executeFactoryOperation(
            async () => {
              throw new Error(
                "Operation failed.",
              );
            },
            () =>
              timestamps.shift()!,
          );

        expect(result.success)
          .toBe(false);

        expect(
          result.error?.code,
        ).toBe(
          "EXECUTION_FAILED",
        );

        expect(result.durationMs)
          .toBe(500);
      },
    );
  },
);
