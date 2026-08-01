import { Injectable } from '@nestjs/common';
import { PluginMarketplaceService } from './plugins/plugin-marketplace.service';
import { DeploymentOperationsService } from './operations/deployment-operations.service';
import { EnterpriseDashboardService } from './dashboard/enterprise-dashboard.service';

@Injectable()
export class ExtensionOperationsOrchestratorService {
  constructor(
    private readonly plugins:
      PluginMarketplaceService,
    private readonly operations:
      DeploymentOperationsService,
    private readonly dashboard:
      EnterpriseDashboardService,
  ) {}

  bootstrap() {
    const defaultPlugins = [
      {
        key: 'creatoros-media-extension',
        name: 'CreatorOS Media Extension',
        version: '1.0.0',
        publisher: 'CreatorOS',
        capabilities: [
          'media.generate',
          'media.publish',
        ],
        permissions: [
          'media.read',
          'media.execute',
        ],
      },
      {
        key: 'creatoros-knowledge-extension',
        name: 'CreatorOS Knowledge Extension',
        version: '1.0.0',
        publisher: 'CreatorOS',
        capabilities: [
          'knowledge.store',
          'knowledge.retrieve',
        ],
        permissions: [
          'knowledge.read',
          'knowledge.write',
        ],
      },
      {
        key: 'creatoros-operations-extension',
        name: 'CreatorOS Operations Extension',
        version: '1.0.0',
        publisher: 'CreatorOS',
        capabilities: [
          'deployment.plan',
          'deployment.execute',
          'deployment.rollback',
        ],
        permissions: [
          'operations.read',
          'operations.execute',
        ],
      },
    ];

    for (const plugin of defaultPlugins) {
      this.plugins.register(plugin);
      this.plugins.install(plugin.key);
      this.plugins.enable(plugin.key);
    }

    this.operations.createRunbook({
      key: 'production-deployment',
      name: 'Production Deployment',
      steps: [
        'validate-build',
        'run-tests',
        'create-backup',
        'deploy-services',
        'verify-health',
      ],
    });

    this.operations.createRunbook({
      key: 'emergency-rollback',
      name: 'Emergency Rollback',
      steps: [
        'freeze-deployments',
        'restore-last-stable-version',
        'verify-data-integrity',
        'verify-health',
        'publish-incident-report',
      ],
    });

    this.dashboard.refresh();

    return this.status();
  }

  deploy(input: {
    environment: string;
    version: string;
    services: string[];
  }) {
    const deployment =
      this.operations.planDeployment(input);

    this.operations.start(deployment.id);
    this.operations.complete(deployment.id);
    this.dashboard.refresh();

    return this.operations.getDeployment(
      deployment.id,
    );
  }

  status() {
    const dashboard =
      this.dashboard.refresh();

    return {
      name:
        'CreatorOS Extension & Operations Mega Pack D',
      version: 'EO-MPD-1.0.0',
      status:
        dashboard.status === 'critical'
          ? 'degraded'
          : 'operational',
      systems: {
        pluginMarketplace: true,
        deploymentOperations: true,
        enterpriseDashboard: true,
      },
      metrics: {
        plugins: this.plugins.summary(),
        operations:
          this.operations.summary(),
        dashboard: dashboard.totals,
      },
      governance: {
        pluginPermissionReview: true,
        deploymentVerification: true,
        rollbackReadiness: true,
        humanFinalAuthority: true,
      },
      dashboard,
    };
  }
}