import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createFactoryRegistry,
  createFactoryRegistryEntryId,
  findFactoryRegistryEntry,
  getFactoryRegistryExecutionOrder,
  queryFactoryRegistry,
  registerFactoryEntry,
  setFactoryRegistryEntryStatus,
  summarizeFactoryRegistry,
  unregisterFactoryEntry,
  updateFactoryRegistryEntry,
  validateFactoryRegistry,
} from ".";

describe(
  "factory registries",
  () => {
    it(
      "creates an empty registry",
      () => {
        const registry =
          createFactoryRegistry(
            "2026-08-03T12:00:00+04:00",
          );

        expect(registry)
          .toEqual({
            entries: [],
            version: 1,
            updatedAt:
              "2026-08-03T08:00:00.000Z",
          });
      },
    );

    it(
      "registers and orders entries",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "validator.typescript",
              registryType:
                "validator",
              name:
                "TypeScript Validator",
              priority: 20,
              capabilities: [
                "validation",
              ],
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
              priority: 10,
              capabilities: [
                "domain",
                "types",
              ],
            },
          );

        expect(
          registry.entries.map(
            (entry) =>
              entry.id,
          ),
        ).toEqual([
          "generator.domain",
          "validator.typescript",
        ]);
      },
    );

    it(
      "rejects duplicate entries",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
            },
          );

        expect(
          () =>
            registerFactoryEntry(
              registry,
              {
                id:
                  "generator.domain",
                registryType:
                  "generator",
                name:
                  "Duplicate Generator",
              },
            ),
        ).toThrow(
          "Factory registry entry already exists: generator.domain.",
        );
      },
    );

    it(
      "updates registry entries",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
              version:
                "1.0.0",
            },
          );

        registry =
          updateFactoryRegistryEntry(
            registry,
            createFactoryRegistryEntryId(
              "generator.domain",
            ),
            {
              version:
                "2.0.0",
              capabilities: [
                "domain",
                "types",
                "tests",
              ],
            },
          );

        expect(
          findFactoryRegistryEntry(
            registry,
            createFactoryRegistryEntryId(
              "generator.domain",
            ),
          ),
        ).toEqual(
          expect.objectContaining({
            version:
              "2.0.0",
            capabilities: [
              "domain",
              "types",
              "tests",
            ],
          }),
        );
      },
    );

    it(
      "enables and disables entries",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "runtime.factory",
              registryType:
                "runtime",
              name:
                "Factory Runtime",
            },
          );

        registry =
          setFactoryRegistryEntryStatus(
            registry,
            createFactoryRegistryEntryId(
              "runtime.factory",
            ),
            "disabled",
          );

        expect(
          registry.entries[0]
            ?.status,
        ).toBe("disabled");
      },
    );

    it(
      "queries entries by type capability and search",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
              description:
                "Generates domain models.",
              capabilities: [
                "domain",
                "types",
              ],
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "validator.build",
              registryType:
                "validator",
              name:
                "Build Validator",
              capabilities: [
                "validation",
              ],
            },
          );

        expect(
          queryFactoryRegistry(
            registry,
            {
              registryType:
                "generator",
              capability:
                "domain",
              search:
                "models",
            },
          ),
        ).toHaveLength(1);
      },
    );

    it(
      "detects missing dependencies",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "runtime.factory",
              registryType:
                "runtime",
              name:
                "Factory Runtime",
              dependencies: [
                {
                  id:
                    createFactoryRegistryEntryId(
                      "generator.domain",
                    ),
                  required: true,
                  minimumVersion:
                    "1.0.0",
                },
              ],
            },
          );

        expect(
          validateFactoryRegistry(
            registry,
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
      "detects disabled and outdated dependencies",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
              version:
                "1.0.0",
              status:
                "disabled",
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "runtime.factory",
              registryType:
                "runtime",
              name:
                "Factory Runtime",
              dependencies: [
                {
                  id:
                    createFactoryRegistryEntryId(
                      "generator.domain",
                    ),
                  required: true,
                  minimumVersion:
                    "2.0.0",
                },
              ],
            },
          );

        const issues =
          validateFactoryRegistry(
            registry,
          ).issues;

        expect(
          issues.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual([
          "DISABLED_DEPENDENCY",
          "VERSION_MISMATCH",
        ]);
      },
    );

    it(
      "orders dependencies before dependents",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "runtime.factory",
              registryType:
                "runtime",
              name:
                "Factory Runtime",
              dependencies: [
                {
                  id:
                    createFactoryRegistryEntryId(
                      "generator.domain",
                    ),
                  required: true,
                  minimumVersion:
                    null,
                },
              ],
            },
          );

        expect(
          getFactoryRegistryExecutionOrder(
            registry,
          ).map(
            (entry) =>
              entry.id,
          ),
        ).toEqual([
          "generator.domain",
          "runtime.factory",
        ]);
      },
    );

    it(
      "detects circular dependencies",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id: "entry.a",
              registryType:
                "runtime",
              name: "Entry A",
              dependencies: [
                {
                  id:
                    createFactoryRegistryEntryId(
                      "entry.b",
                    ),
                  required: true,
                  minimumVersion:
                    null,
                },
              ],
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id: "entry.b",
              registryType:
                "runtime",
              name: "Entry B",
              dependencies: [
                {
                  id:
                    createFactoryRegistryEntryId(
                      "entry.a",
                    ),
                  required: true,
                  minimumVersion:
                    null,
                },
              ],
            },
          );

        expect(
          () =>
            getFactoryRegistryExecutionOrder(
              registry,
            ),
        ).toThrow(
          "Circular Factory registry dependency detected",
        );
      },
    );

    it(
      "removes entries",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "template.workspace",
              registryType:
                "template",
              name:
                "Workspace Template",
            },
          );

        registry =
          unregisterFactoryEntry(
            registry,
            createFactoryRegistryEntryId(
              "template.workspace",
            ),
          );

        expect(
          registry.entries,
        ).toEqual([]);
      },
    );

    it(
      "summarizes registry entries",
      () => {
        let registry =
          createFactoryRegistry();

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "generator.domain",
              registryType:
                "generator",
              name:
                "Domain Generator",
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "validator.typescript",
              registryType:
                "validator",
              name:
                "TypeScript Validator",
              status:
                "disabled",
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "template.workspace",
              registryType:
                "template",
              name:
                "Workspace Template",
              status:
                "deprecated",
            },
          );

        registry =
          registerFactoryEntry(
            registry,
            {
              id:
                "runtime.factory",
              registryType:
                "runtime",
              name:
                "Factory Runtime",
            },
          );

        expect(
          summarizeFactoryRegistry(
            registry,
          ),
        ).toEqual({
          total: 4,
          active: 2,
          disabled: 1,
          deprecated: 1,
          generators: 1,
          validators: 1,
          templates: 1,
          runtimes: 1,
        });
      },
    );
  },
);
