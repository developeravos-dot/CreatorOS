import { Controller, Get } from "@nestjs/common";

import { SponsorCrmService } from "../services/sponsor-crm.service";
import { SponsorshipDashboardSummaryService } from "../services/sponsorship-dashboard-summary.service";

@Controller({
  path: "enterprise/sponsorship-business-intelligence",
  version: "1",
})
export class SponsorshipBusinessIntelligenceController {

  constructor(
    private readonly crmService: SponsorCrmService,
    private readonly dashboardService: SponsorshipDashboardSummaryService,
  ) {}

  @Get("health")
  health() {

    return {
      success: true,
      module: "Sponsorship Business Intelligence",
      status: "operational",
    };

  }


  @Get("status")
  status() {

    return {
      success: true,
      module: "Sponsorship Business Intelligence",
      version: "1.0.0",
      status: "ready",
    };

  }


  @Get("dashboard")
  async dashboard() {

    return {
      success: true,
      data: await this.dashboardService.summary(),
    };

  }

}
