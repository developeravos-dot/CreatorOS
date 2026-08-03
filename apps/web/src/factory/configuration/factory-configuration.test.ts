import {
  describe,
  expect,
  it,
} from "vitest";

import {
  assertValidFactoryConfiguration,
  createDefaultFactoryConfiguration,
  createFactoryConfigurationForEnvironment,
  getFactoryRetryDelay,
  mergeFactoryConfiguration,
  normalizeFactoryConfiguration,
  shouldRetryFactoryError,
  validateFactoryConfiguration,
} from ".";

describe(
  "factory configuration",
  () => {
    it(
      "creates development defaults",
      () => {
        const configuration =
          createDefaultFactoryConfiguration(
            "development",
          );

        expect(
          configuration.environment,
        ).toBe(
          "development",
        );

        expect(
          configuration.runtime
            .dryRun,
        ).toBe(false);

        expect(
          configuration.runtime
            .allowGitOperations,
        ).toBe(true);

        expect(
          configuration.validation
            .runTypeScript,
        ).toBe(true);
      },
    );

    it(
      "creates safer production defaults",
      () => {
        const configuration =
          createDefaultFactoryConfiguration(
            "production",
          );

        expect(
          configuration.runtime
            .dryRun,
        ).toBe(true);

        expect(
          configuration.runtime
            .allowFileOverwrite,
        ).toBe(false);

        expect(
          configuration.runtime
            .allowGitOperations,
        ).toBe(false);

        expect(
          configuration.release
            .releaseChannel,
        ).toBe("stable");
      },
    );

    it(
      "merges partial overrides",
      () => {
        const base =
          createDefaultFactoryConfiguration();

        const merged =
          mergeFactoryConfiguration(
            base,
            {
              runtime: {
                dryRun: true,
                maxParallelSteps:
                  4,
              },
              validation: {
                runLint: true,
                failFast: false,
              },
              metadata: {
                source:
                  "test",
              },
            },
          );

        expect(
          merged.runtime
            .dryRun,
        ).toBe(true);

        expect(
          merged.runtime
            .maxParallelSteps,
        ).toBe(4);

        expect(
          merged.validation
            .runLint,
        ).toBe(true);

        expect(
          merged.validation
            .runBuild,
        ).toBe(true);

        expect(
          merged.metadata,
        ).toEqual({
          source: "test",
        });
      },
    );

    it(
      "normalizes paths and prefixes",
      () => {
        const configuration =
          createDefaultFactoryConfiguration();

        const normalized =
          normalizeFactoryConfiguration({
            ...configuration,
            paths: {
              ...configuration.paths,
              factoryRoot:
                "apps\\web\\src\\factory\\",
            },
            git: {
              ...configuration.git,
              branchPrefix:
                " feature factory ",
              tagPrefix:
                " factory stable ",
            },
          });

        expect(
          normalized.paths
            .factoryRoot,
        ).toBe(
          "apps/web/src/factory",
        );

        expect(
          normalized.git
            .branchPrefix,
        ).toBe(
          "feature-factory",
        );

        expect(
          normalized.git
            .tagPrefix,
        ).toBe(
          "factory-stable",
        );
      },
    );

    it(
      "calculates retry delays",
      () => {
        const configuration =
          createDefaultFactoryConfiguration();

        expect(
          getFactoryRetryDelay(
            configuration,
            1,
          ),
        ).toBe(500);

        expect(
          getFactoryRetryDelay(
            configuration,
            2,
          ),
        ).toBe(1000);

        expect(
          getFactoryRetryDelay(
            configuration,
            10,
          ),
        ).toBe(10000);
      },
    );

    it(
      "checks retryable errors",
      () => {
        const configuration =
          createDefaultFactoryConfiguration();

        expect(
          shouldRetryFactoryError(
            configuration,
            "VALIDATION_FAILED",
            1,
          ),
        ).toBe(true);

        expect(
          shouldRetryFactoryError(
            configuration,
            "RELEASE_FAILED",
            1,
          ),
        ).toBe(false);

        expect(
          shouldRetryFactoryError(
            configuration,
            "VALIDATION_FAILED",
            3,
          ),
        ).toBe(false);
      },
    );

    it(
      "validates positive limits",
      () => {
        const configuration =
          createDefaultFactoryConfiguration();

        const invalid = {
          ...configuration,
          limits: {
            ...configuration.limits,
            maximumFilesPerPack:
              0,
          },
        };

        expect(
          validateFactoryConfiguration(
            invalid,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "INVALID_LIMIT",
            path:
              "limits.maximumFilesPerPack",
          }),
        );
      },
    );

    it(
      "rejects unsafe production settings",
      () => {
        const configuration =
          createDefaultFactoryConfiguration(
            "production",
          );

        const unsafe = {
          ...configuration,
          runtime: {
            ...configuration.runtime,
            allowFileDelete:
              true,
            requireHumanApproval:
              false,
          },
          git: {
            ...configuration.git,
            pushChanges:
              true,
          },
        };

        expect(
          validateFactoryConfiguration(
            unsafe,
          ).issues.filter(
            (issue) =>
              issue.code ===
              "UNSAFE_PRODUCTION_SETTING",
          ),
        ).toHaveLength(3);
      },
    );

    it(
      "rejects tag creation without commits",
      () => {
        const configuration =
          createDefaultFactoryConfiguration();

        const invalid = {
          ...configuration,
          git: {
            ...configuration.git,
            createCommit:
              false,
            createTag:
              true,
          },
        };

        expect(
          validateFactoryConfiguration(
            invalid,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "INVALID_GIT_SETTING",
          }),
        );
      },
    );

    it(
      "asserts valid configurations",
      () => {
        const configuration =
          assertValidFactoryConfiguration(
            createDefaultFactoryConfiguration(),
          );

        expect(
          configuration.schema,
        ).toBe(
          "creatoros.factory.configuration",
        );
      },
    );

    it(
      "creates environment-specific configurations",
      () => {
        const configuration =
          createFactoryConfigurationForEnvironment(
            "test",
            {
              runtime: {
                dryRun: true,
              },
              validation: {
                runFullTests:
                  false,
              },
            },
          );

        expect(
          configuration.environment,
        ).toBe("test");

        expect(
          configuration.runtime
            .environment,
        ).toBe("test");

        expect(
          configuration.runtime
            .dryRun,
        ).toBe(true);

        expect(
          configuration.validation
            .runFullTests,
        ).toBe(false);
      },
    );
  },
);
