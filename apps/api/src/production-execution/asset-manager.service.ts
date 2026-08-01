import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WorkflowAsset } from './production-execution.contracts';

@Injectable()
export class AssetManagerService {
  private readonly assets = new Map<string, WorkflowAsset>();

  create(
    input: Omit<WorkflowAsset, 'id' | 'createdAt'>,
  ): WorkflowAsset {
    const asset: WorkflowAsset = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.assets.set(asset.id, asset);
    return structuredClone(asset);
  }

  get(id: string): WorkflowAsset | undefined {
    const asset = this.assets.get(id);
    return asset ? structuredClone(asset) : undefined;
  }

  listByWorkflow(workflowId: string): WorkflowAsset[] {
    return [...this.assets.values()]
      .filter((asset) => asset.workflowId === workflowId)
      .map((asset) => structuredClone(asset));
  }
}