import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { randomUUID } from "node:crypto";
import {
  EnterpriseCalendarItem,
  EnterpriseDatabase,
  EnterprisePlatform,
  EnterpriseProject,
  EnterprisePrompt,
  EnterpriseScript,
  ProjectStatus,
  ScriptStatus,
} from "./enterprise-foundation.types";

@Injectable()
export class EnterpriseFoundationService implements OnModuleInit {
  private readonly storageDirectory = path.join(
    process.cwd(),
    "storage",
  );

  private readonly storageFile = path.join(
    this.storageDirectory,
    "creatoros-enterprise.json",
  );

  private database: EnterpriseDatabase = this.emptyDatabase();

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  health() {
    return {
      success: true,
      system: "CreatorOS Enterprise",
      module: "Enterprise Foundation",
      version: "1.0.0",
      status: "operational",
      capabilities: {
        projectManagement: true,
        scriptManagement: true,
        contentCalendar: true,
        promptLibrary: true,
        persistentStorage: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      projects: this.database.projects,
      scripts: this.database.scripts,
      calendar: this.database.calendar,
      prompts: this.database.prompts,
      metrics: {
        projects: this.database.projects.length,
        activeProjects: this.database.projects.filter(
          (item) => item.status === "active",
        ).length,
        scripts: this.database.scripts.length,
        scheduledContent: this.database.calendar.filter(
          (item) => item.status === "scheduled",
        ).length,
        prompts: this.database.prompts.length,
      },
      system: {
        projectEngine: "ready",
        scriptEngine: "ready",
        calendarEngine: "ready",
        promptEngine: "ready",
        storage: "persistent",
      },
    };
  }

  async createProject(input: {
    name?: string;
    description?: string;
    platform?: EnterprisePlatform;
  }): Promise<EnterpriseProject> {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException("Project name is required.");
    }

    const now = new Date().toISOString();

    const project: EnterpriseProject = {
      id: randomUUID(),
      name,
      description: input.description?.trim() ?? "",
      platform: this.normalizePlatform(input.platform),
      status: "planning",
      createdAt: now,
      updatedAt: now,
    };

    this.database.projects.unshift(project);
    await this.save();

    return project;
  }

  async updateProjectStatus(
    id: string,
    status?: ProjectStatus,
  ): Promise<EnterpriseProject> {
    const project = this.requireProject(id);

    const allowed: ProjectStatus[] = [
      "planning",
      "active",
      "paused",
      "completed",
    ];

    if (!status || !allowed.includes(status)) {
      throw new BadRequestException("Invalid project status.");
    }

    project.status = status;
    project.updatedAt = new Date().toISOString();

    await this.save();
    return project;
  }

  async deleteProject(id: string) {
    const project = this.requireProject(id);

    this.database.projects = this.database.projects.filter(
      (item) => item.id !== project.id,
    );

    this.database.scripts = this.database.scripts.filter(
      (item) => item.projectId !== project.id,
    );

    this.database.calendar = this.database.calendar.filter(
      (item) => item.projectId !== project.id,
    );

    await this.save();

    return {
      success: true,
      deletedProjectId: project.id,
    };
  }

  async createScript(input: {
    projectId?: string;
    title?: string;
    content?: string;
  }): Promise<EnterpriseScript> {
    const projectId = input.projectId?.trim() ?? "";
    this.requireProject(projectId);

    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException("Script title is required.");
    }

    const now = new Date().toISOString();

    const script: EnterpriseScript = {
      id: randomUUID(),
      projectId,
      title,
      content: input.content ?? "",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    this.database.scripts.unshift(script);
    await this.save();

    return script;
  }

  async updateScript(
    id: string,
    input: {
      title?: string;
      content?: string;
      status?: ScriptStatus;
    },
  ): Promise<EnterpriseScript> {
    const script = this.database.scripts.find(
      (item) => item.id === id,
    );

    if (!script) {
      throw new NotFoundException("Script not found.");
    }

    if (typeof input.title === "string") {
      const title = input.title.trim();

      if (!title) {
        throw new BadRequestException(
          "Script title cannot be empty.",
        );
      }

      script.title = title;
    }

    if (typeof input.content === "string") {
      script.content = input.content;
    }

    if (input.status) {
      const allowed: ScriptStatus[] = [
        "draft",
        "review",
        "approved",
        "production",
      ];

      if (!allowed.includes(input.status)) {
        throw new BadRequestException("Invalid script status.");
      }

      script.status = input.status;
    }

    script.updatedAt = new Date().toISOString();

    await this.save();
    return script;
  }

  async scheduleContent(input: {
    projectId?: string;
    title?: string;
    scheduledAt?: string;
    platform?: EnterprisePlatform;
  }): Promise<EnterpriseCalendarItem> {
    const projectId = input.projectId?.trim() ?? "";
    this.requireProject(projectId);

    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        "Calendar item title is required.",
      );
    }

    if (
      !input.scheduledAt ||
      Number.isNaN(Date.parse(input.scheduledAt))
    ) {
      throw new BadRequestException(
        "Valid scheduledAt is required.",
      );
    }

    const item: EnterpriseCalendarItem = {
      id: randomUUID(),
      projectId,
      title,
      scheduledAt: new Date(input.scheduledAt).toISOString(),
      platform: this.normalizePlatform(input.platform),
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    this.database.calendar.unshift(item);
    await this.save();

    return item;
  }

  async createPrompt(input: {
    name?: string;
    purpose?: string;
    prompt?: string;
  }): Promise<EnterprisePrompt> {
    const name = input.name?.trim();
    const promptText = input.prompt?.trim();

    if (!name) {
      throw new BadRequestException("Prompt name is required.");
    }

    if (!promptText) {
      throw new BadRequestException("Prompt text is required.");
    }

    const now = new Date().toISOString();

    const prompt: EnterprisePrompt = {
      id: randomUUID(),
      name,
      purpose: input.purpose?.trim() ?? "",
      prompt: promptText,
      createdAt: now,
      updatedAt: now,
    };

    this.database.prompts.unshift(prompt);
    await this.save();

    return prompt;
  }

  private requireProject(id: string): EnterpriseProject {
    const project = this.database.projects.find(
      (item) => item.id === id,
    );

    if (!project) {
      throw new NotFoundException("Project not found.");
    }

    return project;
  }

  private normalizePlatform(
    value?: EnterprisePlatform,
  ): EnterprisePlatform {
    if (
      value === "YouTube" ||
      value === "TikTok" ||
      value === "Both"
    ) {
      return value;
    }

    return "Both";
  }

  private emptyDatabase(): EnterpriseDatabase {
    return {
      projects: [],
      scripts: [],
      calendar: [],
      prompts: [],
    };
  }

  private async load(): Promise<void> {
    await fs.mkdir(this.storageDirectory, {
      recursive: true,
    });

    try {
      const raw = await fs.readFile(this.storageFile, "utf8");
      const parsed = JSON.parse(raw) as Partial<EnterpriseDatabase>;

      this.database = {
        projects: Array.isArray(parsed.projects)
          ? parsed.projects
          : [],
        scripts: Array.isArray(parsed.scripts)
          ? parsed.scripts
          : [],
        calendar: Array.isArray(parsed.calendar)
          ? parsed.calendar
          : [],
        prompts: Array.isArray(parsed.prompts)
          ? parsed.prompts
          : [],
      };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;

      if (code !== "ENOENT") {
        throw error;
      }

      this.database = this.emptyDatabase();
      await this.save();
    }
  }

  private async save(): Promise<void> {
    await fs.mkdir(this.storageDirectory, {
      recursive: true,
    });

    const temporaryFile = `${this.storageFile}.tmp`;

    await fs.writeFile(
      temporaryFile,
      JSON.stringify(this.database, null, 2),
      "utf8",
    );

    await fs.rename(temporaryFile, this.storageFile);
  }
}