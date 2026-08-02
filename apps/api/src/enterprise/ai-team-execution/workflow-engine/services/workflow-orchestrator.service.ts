import { Injectable } from "@nestjs/common";
import { WorkflowPlannerService } from "./workflow-planner.service";
import { WorkflowRoutingService } from "./workflow-routing.service";

@Injectable()
export class WorkflowOrchestratorService {

  constructor(
    private readonly planner: WorkflowPlannerService,
    private readonly routing: WorkflowRoutingService,
  ) {}

  createWorkflow(
    projectType: string,
  ) {

    const plan =
      this.planner.plan(projectType);

    const executionPlan =
      plan.tasks.map(task => {

        const route =
          this.routing.route(
            task.capability,
          );

        return {
          task: task.name,
          capability: task.capability,
          order: task.order,
          assignedAgent:
            route.assignedAgent,
        };

      });


    return {
      workflow: projectType,
      status: "planned",
      executionPlan,
    };

  }

}
