import {
  FailureAnalysisEngine,
} from "./failure-analysis.engine";

describe(
  "FailureAnalysisEngine",
  () => {
    const engine =
      new FailureAnalysisEngine();

    it(
      "detects runtime failures",
      () => {
        const result =
          engine.analyze({
            executionId: "execution-runtime",
            stepId: "step-1",
            errorMessage:
              "Runtime exception occurred",
          });

        expect(
          result.category,
        ).toBe(
          "RUNTIME",
        );

        expect(
          result.severity,
        ).toBe(
          "HIGH",
        );
      },
    );

    it(
      "detects agent failures",
      () => {
        const result =
          engine.analyze({
            executionId: "execution-agent",
            stepId: "step-2",
            errorMessage:
              "AI agent model failed",
          });

        expect(
          result.category,
        ).toBe(
          "AGENT",
        );

        expect(
          result.recommendation,
        ).toContain(
          "agent",
        );
      },
    );

    it(
      "detects timeout failures",
      () => {
        const result =
          engine.analyze({
            executionId: "execution-timeout",
            errorMessage:
              "Execution timeout reached",
          });

        expect(
          result.category,
        ).toBe(
          "TIMEOUT",
        );

        expect(
          result.severity,
        ).toBe(
          "MEDIUM",
        );
      },
    );

    it(
      "detects validation failures",
      () => {
        const result =
          engine.analyze({
            executionId: "execution-validation",
            errorMessage:
              "Invalid validation input",
          });

        expect(
          result.category,
        ).toBe(
          "VALIDATION",
        );

        expect(
          result.severity,
        ).toBe(
          "LOW",
        );
      },
    );

    it(
      "falls back to unknown failures",
      () => {
        const result =
          engine.analyze({
            executionId: "execution-unknown",
            errorMessage:
              "Something unexpected happened",
          });

        expect(
          result.category,
        ).toBe(
          "UNKNOWN",
        );

        expect(
          result.severity,
        ).toBe(
          "CRITICAL",
        );
      },
    );
  },
);
