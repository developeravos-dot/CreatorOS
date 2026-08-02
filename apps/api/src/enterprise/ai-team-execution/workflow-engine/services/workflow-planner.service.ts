import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowPlannerService {

  plan(projectType: string) {

    return {
      projectType,
      tasks: [
        {
          name: "Research",
          capability: "research",
          order: 1,
        },
        {
          name: "Strategy",
          capability: "strategy",
          order: 2,
        },
        {
          name: "Production",
          capability: "production",
          order: 3,
        },
        {
          name: "Quality Review",
          capability: "quality",
          order: 4,
        },
      ],
    };

  }

}
