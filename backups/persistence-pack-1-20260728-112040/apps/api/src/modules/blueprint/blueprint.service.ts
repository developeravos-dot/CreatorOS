import { Injectable } from '@nestjs/common';
import {
  ApproveBlueprintInput,
  CreateBlueprintInput,
  InMemoryBlueprintEngine,
  UpdateBlueprintInput,
} from '@creatoros/blueprint';

@Injectable()
export class BlueprintService {
  private readonly engine =
    new InMemoryBlueprintEngine();

  createBlueprint(
    input: CreateBlueprintInput,
  ) {
    return this.engine.createBlueprint(
      input,
    );
  }

  updateBlueprint(
    blueprintId: string,
    input: UpdateBlueprintInput,
  ) {
    return this.engine.updateBlueprint(
      blueprintId,
      input,
    );
  }

  getBlueprints() {
    const blueprints =
      this.engine.getBlueprints();

    return {
      registry:
        'blueprint-registry',
      status: 'operational',
      count: blueprints.length,
      blueprints,
    };
  }

  getBlueprintById(
    blueprintId: string,
  ) {
    return this.engine.getBlueprintById(
      blueprintId,
    );
  }

  getBlueprintByKey(
    blueprintKey: string,
  ) {
    return this.engine.getBlueprintByKey(
      blueprintKey,
    );
  }

  validateBlueprint(
    blueprintId: string,
  ) {
    return this.engine.validateBlueprint(
      blueprintId,
    );
  }

  approveGate(
    blueprintId: string,
    input: ApproveBlueprintInput,
  ) {
    return this.engine.approveGate(
      blueprintId,
      input,
    );
  }

  activateBlueprint(
    blueprintId: string,
  ) {
    return this.engine.activateBlueprint(
      blueprintId,
    );
  }

  archiveBlueprint(
    blueprintId: string,
  ) {
    return this.engine.archiveBlueprint(
      blueprintId,
    );
  }

  generateExecutionPlan(
    blueprintId: string,
  ) {
    return this.engine
      .generateExecutionPlan(
        blueprintId,
      );
  }

  getExecutionPlans(
    blueprintId?: string,
  ) {
    const executionPlans =
      this.engine.getExecutionPlans(
        blueprintId,
      );

    return {
      registry:
        'blueprint-execution-plans',
      status: 'operational',
      count:
        executionPlans.length,
      executionPlans,
    };
  }

  getVersions(
    blueprintId: string,
  ) {
    const versions =
      this.engine.getVersions(
        blueprintId,
      );

    return {
      registry:
        'blueprint-versions',
      status: 'operational',
      count: versions.length,
      versions,
    };
  }

  getDiff(
    blueprintId: string,
    fromVersion: number,
    toVersion: number,
  ) {
    return this.engine.getDiff(
      blueprintId,
      fromVersion,
      toVersion,
    );
  }

  getStatus() {
    return {
      module: 'blueprint',
      ...this.engine.getStatus(),
    };
  }
}
