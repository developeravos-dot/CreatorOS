import { Injectable } from "@nestjs/common";

export interface WorkflowStage {
  id: string;
  name: string;
  capability: string;
  order: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
}

@Injectable()
export class WorkflowDefinitionEntity {

  create(
    input: WorkflowDefinition,
  ): WorkflowDefinition {

    return {
      id: input.id,
      name: input.name,
      description: input.description,
      stages: input.stages,
    };

  }

}
