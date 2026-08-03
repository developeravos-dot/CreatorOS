import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createFactoryPackId,
  createFactoryStepId,
} from "../domain";

import {
  addFactoryExecutionPlanStep,
  createFactoryExecutionPlan,
  getFactoryExecutionPlanNextStep,
  getFactoryExecutionRollbackSteps,
  getFactoryExecutionValidationSteps,
  isFactoryExecutionPlanComplete,
  summarizeFactoryExecutionPlan,
  transitionFactoryExecutionPlan,
  updateFactoryExecutionPlanStepStatus,
  validateFactoryExecutionPlan,
} from ".";

describe(
  "factory execution plan",
  () => {
    it(
      "creates a draft plan",
      () => {
        const plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Foundation Plan",
            createdAt:
              "2026-08-03T12:00:00+04:00",
          });

        expect(plan.status)
          .toBe("draft");

        expect(plan.steps)
          .toEqual([]);

        expect(plan.createdAt)
          .toBe(
            "2026-08-03T08:00:00.000Z",
          );
      },
    );

    it(
      "adds ordered execution steps",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "validate",
              name: "Validate",
              kind:
                "validation",
              order: 20,
              dependencies: [
                createFactoryStepId(
                  "generate",
                ),
              ],
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "generate",
              name: "Generate",
              kind:
                "generation",
              order: 10,
            },
          );

        expect(
          plan.steps.map(
            (step) =>
              step.id,
          ),
        ).toEqual([
          "generate",
          "validate",
        ]);

        expect(
          plan.steps[0]
            ?.status,
        ).toBe("ready");

        expect(
          plan.steps[1]
            ?.status,
        ).toBe("pending");
      },
    );

    it(
      "rejects duplicate steps",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "generate",
              name: "Generate",
              kind:
                "generation",
              order: 1,
            },
          );

        expect(
          () =>
            addFactoryExecutionPlanStep(
              plan,
              {
                id:
                  "generate",
                name:
                  "Generate Again",
                kind:
                  "generation",
                order: 2,
              },
            ),
        ).toThrow(
          "Execution plan step already exists: generate.",
        );
      },
    );

    it(
      "unlocks dependent steps",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "generate",
              name: "Generate",
              kind:
                "generation",
              order: 1,
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id:
                "integrate",
              name:
                "Integrate",
              kind:
                "integration",
              order: 2,
              dependencies: [
                createFactoryStepId(
                  "generate",
                ),
              ],
            },
          );

        plan =
          updateFactoryExecutionPlanStepStatus(
            plan,
            createFactoryStepId(
              "generate",
            ),
            "running",
          );

        plan =
          updateFactoryExecutionPlanStepStatus(
            plan,
            createFactoryStepId(
              "generate",
            ),
            "succeeded",
          );

        expect(
          plan.steps.find(
            (step) =>
              step.id ===
              "integrate",
          )?.status,
        ).toBe("ready");
      },
    );

    it(
      "blocks dependents after failure",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "generate",
              name: "Generate",
              kind:
                "generation",
              order: 1,
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id:
                "integrate",
              name:
                "Integrate",
              kind:
                "integration",
              order: 2,
              dependencies: [
                createFactoryStepId(
                  "generate",
                ),
              ],
            },
          );

        plan =
          updateFactoryExecutionPlanStepStatus(
            plan,
            createFactoryStepId(
              "generate",
            ),
            "failed",
            {
              error:
                "Generation failed.",
            },
          );

        expect(
          plan.steps.find(
            (step) =>
              step.id ===
              "integrate",
          )?.status,
        ).toBe("blocked");

        expect(plan.failedStepId)
          .toBe("generate");
      },
    );

    it(
      "enforces retry limits",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "generate",
              name: "Generate",
              kind:
                "generation",
              order: 1,
              maxAttempts: 1,
            },
          );

        plan =
          updateFactoryExecutionPlanStepStatus(
            plan,
            createFactoryStepId(
              "generate",
            ),
            "running",
          );

        expect(
          () =>
            updateFactoryExecutionPlanStepStatus(
              plan,
              createFactoryStepId(
                "generate",
              ),
              "running",
            ),
        ).toThrow(
          "Execution plan step exceeded its attempt limit",
        );
      },
    );

    it(
      "validates missing dependencies",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id:
                "integrate",
              name:
                "Integrate",
              kind:
                "integration",
              order: 1,
              dependencies: [
                createFactoryStepId(
                  "missing",
                ),
              ],
            },
          );

        expect(
          validateFactoryExecutionPlan(
            plan,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "MISSING_DEPENDENCY",
          }),
        );
      },
    );

    it(
      "detects circular dependencies",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "step-a",
              name: "Step A",
              kind:
                "generation",
              order: 1,
              dependencies: [
                createFactoryStepId(
                  "step-b",
                ),
              ],
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "step-b",
              name: "Step B",
              kind:
                "integration",
              order: 2,
              dependencies: [
                createFactoryStepId(
                  "step-a",
                ),
              ],
            },
          );

        expect(
          validateFactoryExecutionPlan(
            plan,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "CIRCULAR_DEPENDENCY",
          }),
        );
      },
    );

    it(
      "returns the next ready step",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "second",
              name: "Second",
              kind:
                "generation",
              order: 20,
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "first",
              name: "First",
              kind:
                "analysis",
              order: 10,
            },
          );

        expect(
          getFactoryExecutionPlanNextStep(
            plan,
          ).step?.id,
        ).toBe("first");
      },
    );

    it(
      "returns rollback and validation steps",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id:
                "rollback-files",
              name:
                "Rollback Files",
              kind:
                "rollback",
              order: 30,
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id:
                "validate-build",
              name:
                "Validate Build",
              kind:
                "validation",
              order: 20,
            },
          );

        expect(
          getFactoryExecutionRollbackSteps(
            plan,
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual([
          "rollback-files",
        ]);

        expect(
          getFactoryExecutionValidationSteps(
            plan,
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual([
          "validate-build",
        ]);
      },
    );

    it(
      "summarizes progress and completion",
      () => {
        let plan =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "generate",
              name: "Generate",
              kind:
                "generation",
              order: 1,
            },
          );

        plan =
          addFactoryExecutionPlanStep(
            plan,
            {
              id: "validate",
              name: "Validate",
              kind:
                "validation",
              order: 2,
            },
          );

        plan =
          updateFactoryExecutionPlanStepStatus(
            plan,
            createFactoryStepId(
              "generate",
            ),
            "succeeded",
          );

        plan =
          updateFactoryExecutionPlanStepStatus(
            plan,
            createFactoryStepId(
              "validate",
            ),
            "skipped",
          );

        expect(
          summarizeFactoryExecutionPlan(
            plan,
          ),
        ).toEqual({
          total: 2,
          pending: 0,
          ready: 0,
          running: 0,
          succeeded: 1,
          failed: 0,
          blocked: 0,
          skipped: 1,
          cancelled: 0,
          rolledBack: 0,
          completedPercent: 100,
        });

        expect(
          isFactoryExecutionPlanComplete(
            plan,
          ),
        ).toBe(true);
      },
    );

    it(
      "enforces execution plan transitions",
      () => {
        const draft =
          createFactoryExecutionPlan({
            id:
              "factory-f0-plan",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Plan",
          });

        const ready =
          transitionFactoryExecutionPlan(
            draft,
            "ready",
          );

        const running =
          transitionFactoryExecutionPlan(
            ready,
            "running",
          );

        expect(running.status)
          .toBe("running");

        expect(
          () =>
            transitionFactoryExecutionPlan(
              draft,
              "completed",
            ),
        ).toThrow(
          "Cannot transition execution plan from draft to completed.",
        );
      },
    );
  },
);
