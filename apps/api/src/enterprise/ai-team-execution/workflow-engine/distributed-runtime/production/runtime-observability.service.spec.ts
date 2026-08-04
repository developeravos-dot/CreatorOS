import {
  RuntimeObservabilityService,
} from './runtime-observability.service';

describe(
  'RuntimeObservabilityService',
  () => {
    it(
      'records metrics and traces',
      () => {
        const service =
          new RuntimeObservabilityService();

        service.recordMetric({
          name: 'runtime.queue.depth',
          value: 12,
        });

        service.startSpan({
          spanId: 'span-one',
          traceId: 'trace-one',
          name: 'workflow.execute',
        });

        service.finishSpan('span-one');

        const dashboard =
          service.dashboard();

        expect(
          dashboard.latestMetrics[
            'runtime.queue.depth'
          ],
        ).toBe(12);

        expect(
          dashboard.activeSpans,
        ).toHaveLength(0);
      },
    );

    it(
      'tracks runtime incidents',
      () => {
        const service =
          new RuntimeObservabilityService();

        service.openIncident({
          incidentId:
            'incident-one',
          severity: 'critical',
          title:
            'Runtime unavailable',
          details:
            'All workers are offline.',
        });

        expect(
          service.dashboard()
            .openIncidents,
        ).toHaveLength(1);

        service.resolveIncident(
          'incident-one',
        );

        expect(
          service.dashboard()
            .openIncidents,
        ).toHaveLength(0);
      },
    );
  },
);
