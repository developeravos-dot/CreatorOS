import {
  LogsExplorerEngineService,
} from './logs-explorer-engine.service';
import {
  LogsExplorerExportService,
} from './logs-explorer-export.service';
import {
  LogsExplorerQueryService,
} from './logs-explorer-query.service';

describe(
  'LogsExplorerExportService',
  () => {
    function setup() {
      const engine =
        new LogsExplorerEngineService();

      engine.record({
        id: 'log-json',
        level: 'info',
        source: 'runtime',
        context:
          'RuntimeEngine',
        message:
          'Runtime started.',
        timestamp:
          '2026-08-01T00:00:00.000Z',
        metadata: {
          safe:
            'visible-value',
        },
      });

      engine.record({
        id: 'log-csv',
        level: 'error',
        source: 'plugin',
        context:
          'PluginHost',
        message:
          'Plugin failed, "unexpectedly".',
        timestamp:
          '2026-08-02T00:00:00.000Z',
      });

      return new LogsExplorerExportService(
        new LogsExplorerQueryService(
          engine,
        ),
      );
    }

    it(
      'exports filtered JSON logs',
      () => {
        const service =
          setup();

        const result =
          service.export({
            format: 'json',
            query: {
              sources: [
                'runtime',
              ],
            },
          });

        expect(result.format).toBe(
          'json',
        );

        expect(
          result.contentType,
        ).toContain(
          'application/json',
        );

        expect(
          result.entryCount,
        ).toBe(1);

        const parsed =
          JSON.parse(
            result.content,
          ) as {
            entryCount: number;
            entries:
              {
                id: string;
              }[];
          };

        expect(
          parsed.entryCount,
        ).toBe(1);

        expect(
          parsed.entries[0]?.id,
        ).toBe('log-json');
      },
    );

    it(
      'exports CSV logs with escaped values',
      () => {
        const service =
          setup();

        const result =
          service.export({
            format: 'csv',
          });

        expect(result.format).toBe(
          'csv',
        );

        expect(
          result.contentType,
        ).toContain(
          'text/csv',
        );

        expect(
          result.entryCount,
        ).toBe(2);

        expect(result.content).toContain(
          'id,timestamp,recordedAt,level,source',
        );

        expect(result.content).toContain(
          '"Plugin failed, ""unexpectedly""."',
        );
      },
    );

    it(
      'does not reintroduce secrets during export',
      () => {
        const engine =
          new LogsExplorerEngineService();

        engine.record({
          level: 'error',
          source: 'database',
          context:
            'PersistenceService',
          message:
            'TOKEN=secret-token',
          metadata: {
            password:
              'secret-password',
          },
        });

        const service =
          new LogsExplorerExportService(
            new LogsExplorerQueryService(
              engine,
            ),
          );

        const json =
          service.export({
            format: 'json',
          });

        const csv =
          service.export({
            format: 'csv',
          });

        expect(json.content).not
          .toContain(
            'secret-token',
          );

        expect(json.content).not
          .toContain(
            'secret-password',
          );

        expect(csv.content).not
          .toContain(
            'secret-token',
          );

        expect(csv.content).not
          .toContain(
            'secret-password',
          );
      },
    );
  },
);