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
import { EnterpriseFoundationService } from "./enterprise-foundation.service";
import {
  EnterprisePlatform,
  ProjectStatus,
  ScriptStatus,
} from "./enterprise-foundation.types";

@Public()
@Controller("enterprise")
export class EnterpriseFoundationController {
  constructor(
    private readonly service: EnterpriseFoundationService,
  ) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
  }

  @Post("projects")
  createProject(
    @Body()
    body: {
      name?: string;
      description?: string;
      platform?: EnterprisePlatform;
    },
  ) {
    return this.service.createProject(body);
  }

  @Patch("projects/:id/status")
  updateProjectStatus(
    @Param("id") id: string,
    @Body() body: { status?: ProjectStatus },
  ) {
    return this.service.updateProjectStatus(id, body.status);
  }

  @Delete("projects/:id")
  deleteProject(@Param("id") id: string) {
    return this.service.deleteProject(id);
  }

  @Post("scripts")
  createScript(
    @Body()
    body: {
      projectId?: string;
      title?: string;
      content?: string;
    },
  ) {
    return this.service.createScript(body);
  }

  @Patch("scripts/:id")
  updateScript(
    @Param("id") id: string,
    @Body()
    body: {
      title?: string;
      content?: string;
      status?: ScriptStatus;
    },
  ) {
    return this.service.updateScript(id, body);
  }

  @Post("calendar")
  scheduleContent(
    @Body()
    body: {
      projectId?: string;
      title?: string;
      scheduledAt?: string;
      platform?: EnterprisePlatform;
    },
  ) {
    return this.service.scheduleContent(body);
  }

  @Post("prompts")
  createPrompt(
    @Body()
    body: {
      name?: string;
      purpose?: string;
      prompt?: string;
    },
  ) {
    return this.service.createPrompt(body);
  }
}