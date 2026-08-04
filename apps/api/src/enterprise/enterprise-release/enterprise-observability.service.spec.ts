import {
  EnterpriseAlertEngineService,
  EnterpriseMetricsRegistryService,
  EnterpriseNotificationRouterService,
  EnterpriseObservabilityOrchestratorService,
  EnterpriseOpenApiRegistryService,
  EnterprisePluginRegistryService,
} from './services';

describe(
  'Enterprise observability and extensions',
  () => {
    it(
      'records metrics, opens alerts and routes notifications',
      () => {
        const alerts =
          new EnterpriseAlertEngineService();

        alerts.registerRule({
          ruleId:
            'latency-critical',
          metric:
            'runtime.latency',
          operator: 'gte',
          threshold: 500,
          severity: 'critical',
          enabled: true,
        });

        const orchestrator =
          new EnterpriseObservabilityOrchestratorService(
            new EnterpriseMetricsRegistryService(),
            alerts,
            new EnterpriseNotificationRouterService(),
          );

        const result =
          orchestrator.record({
            metric:
              'runtime.latency',
            value: 700,
          });

        expect(result.alerts)
          .toHaveLength(1);

        expect(
          result.notifications,
        ).toHaveLength(1);

        expect(
          orchestrator.snapshot()
            .alerts[0]?.status,
        ).toBe('open');
      },
    );

    it(
      'registers and resolves enterprise plugins',
      () => {
        const plugins =
          new EnterprisePluginRegistryService();

        plugins.register({
          pluginId:
            'analytics-plugin',
          version: '1.0.0',
          displayName:
            'Analytics Plugin',
          permissions: [
            'metrics.read',
          ],
          entrypoint:
            './analytics',
          enabled: true,
        });

        plugins.register({
          pluginId:
            'analytics-plugin',
          version: '2.0.0',
          displayName:
            'Analytics Plugin v2',
          permissions: [
            'metrics.read',
          ],
          entrypoint:
            './analytics-v2',
          enabled: true,
        });

        expect(
          plugins.resolve(
            'analytics-plugin',
          ).version,
        ).toBe('2.0.0');
      },
    );

    it(
      'builds an OpenAPI operation registry',
      () => {
        const registry =
          new EnterpriseOpenApiRegistryService();

        registry.register({
          operationId:
            'getEnterpriseHealth',
          method: 'GET',
          path:
            '/enterprise/health',
          summary:
            'Read enterprise health',
          tags: [
            'enterprise',
            'health',
          ],
        });

        expect(
          registry.document()
            .operations,
        ).toHaveLength(1);
      },
    );
  },
);
