import {
  NotFoundException,
} from '@nestjs/common';

import {
  LogsExplorerController,
} from './logs-explorer.controller';

describe(
  'LogsExplorerController',
  () => {
    function setup() {
      const entry = {
        id: 'log-one',
        level: 'info',
        source: 'application',
        context: 'Application',
        message: 'Application started.',
        timestamp:
          '2026-08-03T10:00:00.000Z',
        recordedAt:
          '2026-08-03T10:00:00.000Z',
        metadata: {},
        tags: [],
      };

      const engine = {
        record:
          jest.fn(() => entry),

        getById:
          jest.fn(() => entry),

        metrics:
          jest.fn(() => ({
            totalEntries: 1,
          })),
      };

      const query = {
        search:
          jest.fn(() => ({
            count: 1,
            total: 1,
            entries: [entry],
          })),

        statistics:
          jest.fn(() => ({
            totalMatched: 1,
          })),

        errorSummary:
          jest.fn(() => ({
            count: 0,
            total: 0,
            entries: [],
          })),

        listCorrelationGroups:
          jest.fn(() => []),

        getCorrelationGroup:
          jest.fn(() => ({
            correlationId:
              'correlation-one',
            entryCount: 1,
          })),

        listTraceGroups:
          jest.fn(() => []),

        getTraceGroup:
          jest.fn(() => ({
            traceId:
              'trace-one',
            entryCount: 1,
          })),
      };

      const exporter = {
        export:
          jest.fn(() => ({
            format: 'json',
            entryCount: 1,
            content: '{}',
          })),
      };

      const controller =
        new LogsExplorerController(
          engine as never,
          query as never,
          exporter as never,
        );

      return {
        controller,
        engine,
        query,
        exporter,
      };
    }

    it(
      'delegates list and search routes',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.list({});
        controller.search({});

        expect(
          query.search,
        ).toHaveBeenCalledTimes(2);
      },
    );

    it(
      'delegates statistics errors and metrics',
      () => {
        const {
          controller,
          query,
          engine,
        } = setup();

        controller.statistics({});
        controller.errors({});
        controller.metrics();

        expect(
          query.statistics,
        ).toHaveBeenCalledTimes(1);

        expect(
          query.errorSummary,
        ).toHaveBeenCalledTimes(1);

        expect(
          engine.metrics,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'delegates correlation routes',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.correlations();

        const result =
          controller.correlation(
            'correlation-one',
          );

        expect(
          query.listCorrelationGroups,
        ).toHaveBeenCalledTimes(1);

        expect(
          query.getCorrelationGroup,
        ).toHaveBeenCalledWith(
          'correlation-one',
        );

        expect(result).toEqual(
          expect.objectContaining({
            correlationId:
              'correlation-one',
          }),
        );
      },
    );

    it(
      'delegates trace routes',
      () => {
        const {
          controller,
          query,
        } = setup();

        controller.traces();

        const result =
          controller.trace(
            'trace-one',
          );

        expect(
          query.listTraceGroups,
        ).toHaveBeenCalledTimes(1);

        expect(
          query.getTraceGroup,
        ).toHaveBeenCalledWith(
          'trace-one',
        );

        expect(result).toEqual(
          expect.objectContaining({
            traceId:
              'trace-one',
          }),
        );
      },
    );

    it(
      'records and retrieves logs',
      () => {
        const {
          controller,
          engine,
        } = setup();

        const recorded =
          controller.record({
            message:
              'Application started.',
          });

        const details =
          controller.details(
            'log-one',
          );

        expect(
          engine.record,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              'Application started.',
          }),
        );

        expect(
          engine.getById,
        ).toHaveBeenCalledWith(
          'log-one',
        );

        expect(recorded.id).toBe(
          'log-one',
        );

        expect(details.id).toBe(
          'log-one',
        );
      },
    );

    it(
      'delegates export operations',
      () => {
        const {
          controller,
          exporter,
        } = setup();

        const result =
          controller.exportLogs({
            format: 'json',
          });

        expect(
          exporter.export,
        ).toHaveBeenCalledTimes(1);

        expect(result.format).toBe(
          'json',
        );
      },
    );

    it(
      'throws for missing log details',
      () => {
        const controller =
          new LogsExplorerController(
            {
              getById:
                jest.fn(
                  () => undefined,
                ),
            } as never,
            {} as never,
            {} as never,
          );

        expect(() =>
          controller.details(
            'missing-log',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );

    it(
      'throws for missing correlation groups',
      () => {
        const controller =
          new LogsExplorerController(
            {} as never,
            {
              getCorrelationGroup:
                jest.fn(
                  () => undefined,
                ),
            } as never,
            {} as never,
          );

        expect(() =>
          controller.correlation(
            'missing-correlation',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );

    it(
      'throws for missing trace groups',
      () => {
        const controller =
          new LogsExplorerController(
            {} as never,
            {
              getTraceGroup:
                jest.fn(
                  () => undefined,
                ),
            } as never,
            {} as never,
          );

        expect(() =>
          controller.trace(
            'missing-trace',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );
  },
);