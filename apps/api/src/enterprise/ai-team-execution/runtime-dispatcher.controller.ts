import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";

import {
  RuntimeDispatcherService,
} from "./runtime-dispatcher.service";

@Controller(
  "enterprise/ai-team-execution/runtime",
)
export class RuntimeDispatcherController {
  constructor(
    private readonly dispatcher:
      RuntimeDispatcherService,
  ) {}

  @Get("providers")
  listProviders(
    @Query("capability")
    capability?: string,
  ) {
    return this.dispatcher.listProviders(
      capability?.trim() || undefined,
    );
  }

  @Get("overview")
  getOverview() {
    return this.dispatcher.getOverview();
  }
}