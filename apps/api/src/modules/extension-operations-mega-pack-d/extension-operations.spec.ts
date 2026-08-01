import { PluginMarketplaceService } from './plugins/plugin-marketplace.service';
import { DeploymentOperationsService } from './operations/deployment-operations.service';
import { EnterpriseDashboardService } from './dashboard/enterprise-dashboard.service';
import { ExtensionOperationsOrchestratorService } from './extension-operations-orchestrator.service';

describe(
  'CreatorOS Extension & Operations Mega Pack D',
  () => {
    function setup() {
      const plugins =
        new PluginMarketplaceService();
      const operations =
        new DeploymentOperationsService();
      const dashboard =
        new EnterpriseDashboardService(
          plugins,
          operations,
        );
      const orchestrator =
        new ExtensionOperationsOrchestratorService(
          plugins,
          operations,
          dashboard,
        );

      return {
        plugins,
        operations,
        dashboard,
        orchestrator,
      };
    }

    it(
      'bootstraps all extension systems',
      () => {
        const { orchestrator } =
          setup();

        const status =
          orchestrator.bootstrap();

        expect(status.status).toBe(
          'operational',
        );
        expect(
          status.metrics.plugins.total,
        ).toBe(3);
        expect(
          status.metrics.plugins.enabled,
        ).toBe(3);
      },
    );

    it(
      'installs and enables plugins',
      () => {
        const {
          orchestrator,
          plugins,
        } = setup();

        orchestrator.bootstrap();

        expect(
          plugins
            .list()
            .every(
              (plugin) =>
                plugin.status === 'enabled',
            ),
        ).toBe(true);
      },
    );

    it(
      'creates operational runbooks',
      () => {
        const {
          orchestrator,
          operations,
        } = setup();

        orchestrator.bootstrap();

        expect(
          operations.listRunbooks(),
        ).toHaveLength(2);
      },
    );

    it(
      'completes a deployment',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const deployment =
          orchestrator.deploy({
            environment: 'production',
            version: '1.0.0',
            services: [
              'api',
              'worker',
            ],
          });

        expect(
          deployment.status,
        ).toBe('successful');
      },
    );

    it(
      'rolls back a deployment',
      () => {
        const {
          orchestrator,
          operations,
        } = setup();

        orchestrator.bootstrap();

        const deployment =
          orchestrator.deploy({
            environment: 'staging',
            version: '1.0.0',
            services: ['api'],
          });

        const rollback =
          operations.rollback(
            deployment.id,
          );

        expect(
          rollback.status,
        ).toBe('rolled-back');
        expect(
          rollback.rollbackOf,
        ).toBe(deployment.id);
      },
    );

    it(
      'builds the enterprise dashboard',
      () => {
        const {
          orchestrator,
          dashboard,
        } = setup();

        orchestrator.bootstrap();

        const snapshot =
          dashboard.refresh();

        expect(snapshot.status).toBe(
          'healthy',
        );
        expect(
          snapshot.totals.widgets,
        ).toBe(5);
      },
    );

    it(
      'reports all three operations systems',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const status =
          orchestrator.status();

        expect(
          status.systems.pluginMarketplace,
        ).toBe(true);
        expect(
          status.systems.deploymentOperations,
        ).toBe(true);
        expect(
          status.systems.enterpriseDashboard,
        ).toBe(true);
      },
    );
  },
);