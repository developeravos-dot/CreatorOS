import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Public } from "../modules/core-v1/auth/public.decorator";
import { CreatorDashboardService } from "./creator-dashboard.service";
import { CreatorPlatform } from "./creator-dashboard.types";

@Public()
@Controller("creator")
export class CreatorDashboardController {
  constructor(
    private readonly creatorDashboardService: CreatorDashboardService,
  ) {}

  @Public()
  @Get("health")
  getHealth() {
    return {
      success: true,
      system: "CreatorOS",
      service: "Creator Dashboard API",
      status: "operational",
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get("dashboard")
  getDashboard() {
    return this.creatorDashboardService.getDashboard();
  }

  @Public()
  @Post("channels")
  addChannel(
    @Body()
    body: {
      name?: string;
      platform?: CreatorPlatform;
      category?: string;
    },
  ) {
    return this.creatorDashboardService.addChannel(body);
  }

  @Public()
  @Delete("channels/:id")
  removeChannel(@Param("id") id: string) {
    return this.creatorDashboardService.removeChannel(id);
  }

  @Public()
  @Post("content")
  addContent(
    @Body()
    body: {
      title?: string;
      platform?: CreatorPlatform | "Both";
      format?: string;
    },
  ) {
    return this.creatorDashboardService.addContent(body);
  }

  @Public()
  @Patch("content/:id/advance")
  advanceContent(@Param("id") id: string) {
    return this.creatorDashboardService.advanceContent(id);
  }

  @Public()
  @Delete("content/:id")
  removeContent(@Param("id") id: string) {
    return this.creatorDashboardService.removeContent(id);
  }
}