import {
  describe,
  expect,
  it,
} from "vitest";

import {
  addFactoryBlueprintNode,
} from "../blueprint";

import {
  createFactoryFoundation,
  summarizeFactoryFoundation,
  validateFactoryFoundation,
} from ".";

describe(
  "factory foundation integration",
  () => {
    it(
      "creates the complete F0 foundation aggregate",
      () => {
        const foundation =
          createFactoryFoundation({
            id:
              "factory-f0",
            name:
              "CreatorOS Factory Foundation",
            environment:
              "test",
            createdAt:
              "2026-08-03T12:00:00+04:00",
          });

        expect(
          foundation.schema,
        ).toBe(
          "creatoros.factory.foundation",
        );

        expect(
          foundation.version,
        ).toBe("1.0.0");

        expect(
          foundation.pack.id,
        ).toBe("factory-f0");

        expect(
          foundation.configuration
            .environment,
        ).toBe("test");

        expect(
          foundation.validationPipeline
            .gates,
        ).toHaveLength(5);

        expect(
          foundation.createdAt,
        ).toBe(
          "2026-08-03T08:00:00.000Z",
        );
      },
    );

    it(
      "reports incomplete execution plans as invalid",
      () => {
        const foundation =
          createFactoryFoundation({
            id:
              "factory-f0",
            name:
              "CreatorOS Factory Foundation",
          });

        const validation =
          validateFactoryFoundation(
            foundation,
          );

        expect(
          validation.configuration
            .valid,
        ).toBe(true);

        expect(
          validation.manifest
            .valid,
        ).toBe(true);

        expect(
          validation.blueprint
            .valid,
        ).toBe(true);

        expect(
          validation.registry
            .valid,
        ).toBe(true);

        expect(
          validation.executionPlan
            .valid,
        ).toBe(false);

        expect(validation.valid)
          .toBe(false);
      },
    );

    it(
      "summarizes all foundation modules",
      () => {
        const foundation =
          createFactoryFoundation({
            id:
              "factory-f0",
            name:
              "CreatorOS Factory Foundation",
          });

        const summary =
          summarizeFactoryFoundation(
            foundation,
          );

        expect(summary)
          .toEqual(
            expect.objectContaining({
              packId:
                "factory-f0",
              packStatus:
                "draft",
              manifestVersion:
                "1.0.0",
              environment:
                "development",
              valid: false,
            }),
          );

        expect(
          summary.validation.total,
        ).toBe(5);

        expect(
          summary.blueprint.nodes,
        ).toBe(1);
      },
    );

    it(
      "integrates blueprint mutations without changing other modules",
      () => {
        const foundation =
          createFactoryFoundation({
            id:
              "factory-f0",
            name:
              "CreatorOS Factory Foundation",
          });

        const blueprint =
          addFactoryBlueprintNode(
            foundation.blueprint,
            {
              id:
                "factory-domain",
              type:
                "directory",
              name:
                "Factory Domain",
              order: 10,
            },
          );

        const updated = {
          ...foundation,
          blueprint,
        };

        expect(
          updated.blueprint.nodes,
        ).toHaveLength(2);

        expect(
          updated.pack.id,
        ).toBe(
          foundation.pack.id,
        );

        expect(
          updated.validationPipeline
            .gates,
        ).toHaveLength(5);
      },
    );
  },
);
