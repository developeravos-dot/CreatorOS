import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createFactoryPackId,
} from "../domain";

import {
  addFactoryValidationPipelineGate,
  createDefaultFactoryValidationPipeline,
  createFactoryValidationPipeline,
  isFactoryValidationPipelineReleaseReady,
  runFactoryValidationPipeline,
  summarizeFactoryValidationPipeline,
  transitionFactoryValidationPipeline,
  validateFactoryValidationPipeline,
} from ".";

function createTimestamps(
  count: number,
): () => string {
  const start =
    Date.parse(
      "2026-08-03T08:00:00.000Z",
    );

  let index = 0;

  return () => {
    const value =
      new Date(
        start +
        index * 100,
      ).toISOString();

    index += 1;

    return value;
  };
}

describe(
  "factory validation pipeline",
  () => {
    it(
      "creates a draft pipeline",
      () => {
        const pipeline =
          createFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
            createdAt:
              "2026-08-03T12:00:00+04:00",
          });

        expect(pipeline.status)
          .toBe("draft");

        expect(pipeline.gates)
          .toEqual([]);

        expect(pipeline.createdAt)
          .toBe(
            "2026-08-03T08:00:00.000Z",
          );
      },
    );

    it(
      "creates the default quality gates",
      () => {
        const pipeline =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        expect(
          pipeline.gates.map(
            (gate) =>
              gate.type,
          ),
        ).toEqual([
          "vitest",
          "typescript",
          "build",
          "encoding",
          "git-diff",
        ]);

        expect(
          validateFactoryValidationPipeline(
            pipeline,
          ),
        ).toEqual({
          valid: true,
          issues: [],
        });
      },
    );

    it(
      "rejects duplicate validation gates",
      () => {
        let pipeline =
          createFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        pipeline =
          addFactoryValidationPipelineGate(
            pipeline,
            {
              id: "vitest",
              packId:
                pipeline.packId,
              type: "vitest",
              name: "Vitest",
              command:
                "pnpm exec vitest run",
              order: 1,
            },
          );

        expect(
          () =>
            addFactoryValidationPipelineGate(
              pipeline,
              {
                id:
                  "vitest",
                packId:
                  pipeline.packId,
                type:
                  "vitest",
                name:
                  "Duplicate Vitest",
                command:
                  "pnpm exec vitest run",
                order: 2,
              },
            ),
        ).toThrow(
          "Validation pipeline gate already exists: vitest.",
        );
      },
    );

    it(
      "detects missing required gates",
      () => {
        const pipeline =
          createFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        const validation =
          validateFactoryValidationPipeline(
            pipeline,
          );

        expect(validation.valid)
          .toBe(false);

        expect(
          validation.issues.filter(
            (issue) =>
              issue.code ===
              "MISSING_REQUIRED_GATE",
          ),
        ).toHaveLength(5);
      },
    );

    it(
      "runs all default gates successfully",
      async () => {
        const pipeline =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        const runner =
          vi.fn(
            async () => ({
              exitCode: 0,
              stdout:
                "Validation passed.",
              stderr: "",
            }),
          );

        const completed =
          await runFactoryValidationPipeline(
            pipeline,
            {
              runner,
              now:
                createTimestamps(
                  30,
                ),
            },
          );

        expect(completed.status)
          .toBe("passed");

        expect(completed.results)
          .toHaveLength(5);

        expect(runner)
          .toHaveBeenCalledTimes(5);

        expect(
          isFactoryValidationPipelineReleaseReady(
            completed,
          ),
        ).toBe(true);
      },
    );

    it(
      "stops after the first failure in fail-fast mode",
      async () => {
        const pipeline =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
            mode:
              "fail-fast",
          });

        const runner =
          vi.fn(
            async ({
              gate,
            }) => ({
              exitCode:
                gate.type ===
                "typescript"
                  ? 1
                  : 0,
              stdout: "",
              stderr:
                gate.type ===
                "typescript"
                  ? "Type error."
                  : "",
            }),
          );

        const completed =
          await runFactoryValidationPipeline(
            pipeline,
            {
              runner,
              now:
                createTimestamps(
                  20,
                ),
            },
          );

        expect(completed.status)
          .toBe("failed");

        expect(
          completed.results.map(
            (result) =>
              result.gateType,
          ),
        ).toEqual([
          "vitest",
          "typescript",
        ]);

        expect(
          summarizeFactoryValidationPipeline(
            completed,
          ).requiredFailed,
        ).toBe(1);
      },
    );

    it(
      "continues after failures in continue-on-error mode",
      async () => {
        const pipeline =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
            mode:
              "continue-on-error",
          });

        const completed =
          await runFactoryValidationPipeline(
            pipeline,
            {
              runner:
                async ({
                  gate,
                }) => ({
                  exitCode:
                    gate.type ===
                    "build"
                      ? 1
                      : 0,
                  stdout: "",
                  stderr:
                    gate.type ===
                    "build"
                      ? "Build failed."
                      : "",
                }),
              now:
                createTimestamps(
                  30,
                ),
            },
          );

        expect(completed.results)
          .toHaveLength(5);

        expect(completed.status)
          .toBe("failed");

        expect(
          summarizeFactoryValidationPipeline(
            completed,
          ),
        ).toEqual({
          total: 5,
          enabled: 5,
          required: 5,
          passed: 4,
          failed: 1,
          skipped: 0,
          requiredPassed: 4,
          requiredFailed: 1,
          releaseReady: false,
        });
      },
    );

    it(
      "records runner exceptions as failed gate results",
      async () => {
        const pipeline =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        const completed =
          await runFactoryValidationPipeline(
            pipeline,
            {
              runner:
                async () => {
                  throw new Error(
                    "Runner unavailable.",
                  );
                },
              now:
                createTimestamps(
                  20,
                ),
            },
          );

        expect(completed.status)
          .toBe("failed");

        expect(
          completed.results[0]
            ?.error?.code,
        ).toBe(
          "VALIDATION_FAILED",
        );

        expect(
          completed.results[0]
            ?.stderr,
        ).toBe(
          "Runner unavailable.",
        );
      },
    );

    it(
      "skips disabled optional gates",
      async () => {
        let pipeline =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        pipeline =
          addFactoryValidationPipelineGate(
            pipeline,
            {
              id: "eslint",
              packId:
                pipeline.packId,
              type: "eslint",
              name: "ESLint",
              command:
                "pnpm lint",
              required:
                false,
              enabled:
                false,
              order: 60,
            },
          );

        const completed =
          await runFactoryValidationPipeline(
            pipeline,
            {
              runner:
                async () => ({
                  exitCode: 0,
                  stdout: "",
                  stderr: "",
                }),
              now:
                createTimestamps(
                  30,
                ),
            },
          );

        expect(completed.status)
          .toBe("passed");

        expect(
          completed.results.at(-1)
            ?.status,
        ).toBe("skipped");

        expect(
          summarizeFactoryValidationPipeline(
            completed,
          ).skipped,
        ).toBe(1);
      },
    );

    it(
      "enforces validation pipeline transitions",
      () => {
        const draft =
          createDefaultFactoryValidationPipeline({
            id:
              "factory-f0-validation",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Validation",
          });

        const ready =
          transitionFactoryValidationPipeline(
            draft,
            "ready",
          );

        const running =
          transitionFactoryValidationPipeline(
            ready,
            "running",
          );

        expect(running.status)
          .toBe("running");

        expect(
          () =>
            transitionFactoryValidationPipeline(
              draft,
              "passed",
            ),
        ).toThrow(
          "Cannot transition validation pipeline from draft to passed.",
        );
      },
    );
  },
);
