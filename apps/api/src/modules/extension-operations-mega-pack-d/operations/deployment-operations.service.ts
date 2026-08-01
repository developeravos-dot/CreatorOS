import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DeploymentRecord,
  OperationsRunbook,
} from '../extension-operations.types';

@Injectable()
export class DeploymentOperationsService {
  private readonly deployments = new Map<
    string,
    DeploymentRecord
  >();

  private readonly runbooks = new Map<
    string,
    OperationsRunbook
  >();

  createRunbook(input: {
    key: string;
    name: string;
    steps: string[];
  }) {
    const existing = this.runbooks.get(input.key);

    if (existing) {
      return existing;
    }

    const runbook: OperationsRunbook = {
      id: randomUUID(),
      ...input,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    this.runbooks.set(runbook.key, runbook);
    return runbook;
  }

  planDeployment(input: {
    environment: string;
    version: string;
    services: string[];
    metadata?: Record<string, unknown>;
  }) {
    const deployment: DeploymentRecord = {
      id: randomUUID(),
      ...input,
      metadata: input.metadata ?? {},
      status: 'planned',
    };

    this.deployments.set(
      deployment.id,
      deployment,
    );

    return deployment;
  }

  start(deploymentId: string) {
    const deployment = this.getDeployment(
      deploymentId,
    );

    deployment.status = 'running';
    deployment.startedAt =
      new Date().toISOString();

    return deployment;
  }

  complete(deploymentId: string) {
    const deployment = this.getDeployment(
      deploymentId,
    );

    if (deployment.status !== 'running') {
      throw new Error(
        'Deployment must be running before completion.',
      );
    }

    deployment.status = 'successful';
    deployment.completedAt =
      new Date().toISOString();

    return deployment;
  }

  fail(deploymentId: string) {
    const deployment = this.getDeployment(
      deploymentId,
    );

    deployment.status = 'failed';
    deployment.completedAt =
      new Date().toISOString();

    return deployment;
  }

  rollback(deploymentId: string) {
    const original = this.getDeployment(
      deploymentId,
    );

    const rollback: DeploymentRecord = {
      id: randomUUID(),
      environment: original.environment,
      version: original.version,
      services: [...original.services],
      status: 'rolled-back',
      rollbackOf: original.id,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      metadata: {
        reason: 'manual-or-automated-rollback',
      },
    };

    this.deployments.set(rollback.id, rollback);
    return rollback;
  }

  getDeployment(id: string) {
    const deployment =
      this.deployments.get(id);

    if (!deployment) {
      throw new Error(
        `Deployment not found: ${id}`,
      );
    }

    return deployment;
  }

  listDeployments() {
    return [...this.deployments.values()];
  }

  listRunbooks() {
    return [...this.runbooks.values()];
  }

  summary() {
    const deployments =
      this.listDeployments();

    return {
      deployments: deployments.length,
      successful: deployments.filter(
        (item) => item.status === 'successful',
      ).length,
      failed: deployments.filter(
        (item) => item.status === 'failed',
      ).length,
      running: deployments.filter(
        (item) => item.status === 'running',
      ).length,
      runbooks: this.runbooks.size,
    };
  }
}