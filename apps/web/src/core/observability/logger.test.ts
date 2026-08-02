import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  logger,
} from "./logger";

describe(
  "CreatorOS logger",
  () => {
    it(
      "records structured log entries",
      () => {
        logger.clear();

        logger.info(
          "test",
          "operation completed",
          {
            value: 42,
          },
        );

        expect(
          logger.getEntries()[0],
        ).toMatchObject({
          level: "info",
          scope: "test",
          message:
            "operation completed",
          metadata: {
            value: 42,
          },
        });
      },
    );

    it(
      "notifies subscribers",
      () => {
        logger.clear();

        const subscriber =
          vi.fn();

        const unsubscribe =
          logger.subscribe(
            subscriber,
          );

        logger.warn(
          "api",
          "request delayed",
        );

        expect(
          subscriber,
        ).toHaveBeenCalled();

        unsubscribe();
      },
    );
  },
);
