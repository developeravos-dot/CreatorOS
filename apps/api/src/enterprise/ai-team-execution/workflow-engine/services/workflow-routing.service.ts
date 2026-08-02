import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowRoutingService {

  route(capability: string) {

    const routes: Record<string, string> = {

      research: "ResearchAgent",
      strategy: "StrategyAgent",
      production: "ProductionAgent",
      quality: "QualityAgent",

    };

    return {
      capability,
      assignedAgent:
        routes[capability] ?? "DefaultAgent",
    };

  }

}
