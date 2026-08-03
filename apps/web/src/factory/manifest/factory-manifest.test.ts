import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createFactoryPackManifest,
  getFactoryManifestMissingOutputs,
  getFactoryManifestRequiredOutputs,
  isFactoryManifestReleaseReady,
  validateFactoryPackManifest,
} from ".";

const qualityGates = [
  {
    id: "vitest",
    type:
      "vitest" as const,
    name: "Vitest",
    required: true,
    command:
      "pnpm exec vitest run",
  },
  {
    id: "typescript",
    type:
      "typescript" as const,
    name: "TypeScript",
    required: true,
    command:
      "pnpm exec tsc --noEmit",
  },
  {
    id: "build",
    type:
      "build" as const,
    name: "Build",
    required: true,
    command:
      "pnpm build",
  },
  {
    id: "encoding",
    type:
      "encoding" as const,
    name:
      "Encoding",
    required: true,
    command: null,
  },
  {
    id: "git-diff",
    type:
      "git-diff" as const,
    name:
      "Git Diff",
    required: true,
    command:
      "git diff --check",
  },
];

describe(
  "factory manifest system",
  () => {
    it(
      "creates a normalized manifest",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              " Factory Foundation ",
            description:
              " Core Factory models. ",
            packType:
              "foundation",
            capabilities: [
              "manifest",
              "manifest",
              "registry",
            ],
            validationGates:
              qualityGates,
            metadata: {
              author:
                " CreatorOS ",
              tags: [
                "factory",
                "factory",
                "foundation",
              ],
            },
            createdAt:
              "2026-08-03T12:00:00+04:00",
          });

        expect(manifest.name)
          .toBe(
            "Factory Foundation",
          );

        expect(
          manifest.capabilities,
        ).toEqual([
          "manifest",
          "registry",
        ]);

        expect(
          manifest.metadata.tags,
        ).toEqual([
          "factory",
          "foundation",
        ]);

        expect(manifest.createdAt)
          .toBe(
            "2026-08-03T08:00:00.000Z",
          );
      },
    );

    it(
      "rejects duplicate dependency identifiers",
      () => {
        expect(
          () =>
            createFactoryPackManifest({
              packId:
                "factory-f0",
              name:
                "Factory Foundation",
              packType:
                "foundation",
              dependencies: [
                {
                  id: "typescript",
                  type:
                    "package",
                  requirement:
                    "required",
                  version:
                    "5",
                  source: null,
                  description: "",
                },
                {
                  id: "typescript",
                  type:
                    "package",
                  requirement:
                    "required",
                  version:
                    "5",
                  source: null,
                  description: "",
                },
              ],
            }),
        ).toThrow(
          "Duplicate dependency id: typescript.",
        );
      },
    );

    it(
      "detects missing required quality gates",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              "Factory Foundation",
            packType:
              "foundation",
            validationGates: [],
          });

        const validation =
          validateFactoryPackManifest(
            manifest,
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
      "validates dependency contracts",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              "Factory Foundation",
            packType:
              "foundation",
            validationGates:
              qualityGates,
            dependencies: [
              {
                id:
                  "missing-source",
                type:
                  "package",
                requirement:
                  "required",
                version: null,
                source: null,
                description: "",
              },
            ],
          });

        expect(
          validateFactoryPackManifest(
            manifest,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "INVALID_DEPENDENCY",
          }),
        );
      },
    );

    it(
      "validates required output paths",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              "Factory Foundation",
            packType:
              "foundation",
            validationGates:
              qualityGates,
            outputs: [
              {
                id:
                  "domain-file",
                type: "file",
                path: null,
                description:
                  "Generated domain.",
                required: true,
                generated:
                  false,
              },
            ],
          });

        expect(
          validateFactoryPackManifest(
            manifest,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "INVALID_OUTPUT",
          }),
        );
      },
    );

    it(
      "validates enum input options",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              "Factory Foundation",
            packType:
              "foundation",
            validationGates:
              qualityGates,
            inputs: [
              {
                id:
                  "workspace-type",
                type: "enum",
                label:
                  "Workspace Type",
                description: "",
                required: true,
                defaultValue:
                  null,
                options: [],
              },
            ],
          });

        expect(
          validateFactoryPackManifest(
            manifest,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "INVALID_INPUT",
          }),
        );
      },
    );

    it(
      "returns required and missing outputs",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              "Factory Foundation",
            packType:
              "foundation",
            validationGates:
              qualityGates,
            outputs: [
              {
                id:
                  "generated-file",
                type: "file",
                path:
                  "src/generated.ts",
                description: "",
                required: true,
                generated: true,
              },
              {
                id:
                  "missing-file",
                type: "file",
                path:
                  "src/missing.ts",
                description: "",
                required: true,
                generated: false,
              },
              {
                id:
                  "optional-file",
                type: "file",
                path:
                  "src/optional.ts",
                description: "",
                required: false,
                generated: false,
              },
            ],
          });

        expect(
          getFactoryManifestRequiredOutputs(
            manifest,
          ),
        ).toHaveLength(2);

        expect(
          getFactoryManifestMissingOutputs(
            manifest,
          ).map(
            (output) =>
              output.id,
          ),
        ).toEqual([
          "missing-file",
        ]);
      },
    );

    it(
      "recognizes a release-ready manifest",
      () => {
        const manifest =
          createFactoryPackManifest({
            packId:
              "factory-f0",
            name:
              "Factory Foundation",
            packType:
              "foundation",
            validationGates:
              qualityGates,
            dependencies: [
              {
                id:
                  "typescript",
                type:
                  "package",
                requirement:
                  "required",
                version:
                  "5",
                source: null,
                description: "",
              },
            ],
            outputs: [
              {
                id:
                  "factory-domain",
                type: "file",
                path:
                  "src/factory/domain.ts",
                description: "",
                required: true,
                generated: true,
              },
            ],
          });

        expect(
          isFactoryManifestReleaseReady(
            manifest,
          ),
        ).toBe(true);
      },
    );
  },
);
