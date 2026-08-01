import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import {
  CreatorChannel,
  CreatorContent,
  CreatorDashboardState,
  CreatorPlatform,
} from "./creator-dashboard.types";

@Injectable()
export class CreatorDashboardService {
  private readonly databasePath = join(
    process.cwd(),
    "data",
    "creator-dashboard.json",
  );

  private createInitialState(): CreatorDashboardState {
    return {
      channels: [],
      content: [],
      system: {
        api: "operational",
        scriptEngine: "ready",
        analysisEngine: "ready",
        productionEngine: "ready",
      },
    };
  }

  private async ensureDatabase(): Promise<void> {
    try {
      await fs.access(this.databasePath);
    } catch {
      await fs.mkdir(dirname(this.databasePath), { recursive: true });
      await fs.writeFile(
        this.databasePath,
        JSON.stringify(this.createInitialState(), null, 2),
        "utf8",
      );
    }
  }

  private async readState(): Promise<CreatorDashboardState> {
    await this.ensureDatabase();

    try {
      const content = await fs.readFile(this.databasePath, "utf8");
      return JSON.parse(content) as CreatorDashboardState;
    } catch {
      const initialState = this.createInitialState();
      await this.writeState(initialState);
      return initialState;
    }
  }

  private async writeState(state: CreatorDashboardState): Promise<void> {
    await fs.mkdir(dirname(this.databasePath), { recursive: true });
    await fs.writeFile(
      this.databasePath,
      JSON.stringify(state, null, 2),
      "utf8",
    );
  }

  async getDashboard(): Promise<CreatorDashboardState> {
    return this.readState();
  }

  async addChannel(input: {
    name?: string;
    platform?: CreatorPlatform;
    category?: string;
  }): Promise<CreatorChannel> {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException("Channel name is required.");
    }

    if (input.platform !== "YouTube" && input.platform !== "TikTok") {
      throw new BadRequestException("Invalid platform.");
    }

    const state = await this.readState();

    const channel: CreatorChannel = {
      id: crypto.randomUUID(),
      name,
      platform: input.platform,
      category: input.category?.trim() || "General",
      status: "setup",
      createdAt: new Date().toISOString(),
    };

    state.channels.unshift(channel);
    await this.writeState(state);

    return channel;
  }

  async removeChannel(id: string): Promise<{ success: true }> {
    const state = await this.readState();
    const originalLength = state.channels.length;

    state.channels = state.channels.filter((channel) => channel.id !== id);

    if (state.channels.length === originalLength) {
      throw new NotFoundException("Channel not found.");
    }

    await this.writeState(state);

    return { success: true };
  }

  async addContent(input: {
    title?: string;
    platform?: CreatorPlatform | "Both";
    format?: string;
  }): Promise<CreatorContent> {
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException("Content title is required.");
    }

    const validPlatforms = ["YouTube", "TikTok", "Both"];

    if (!input.platform || !validPlatforms.includes(input.platform)) {
      throw new BadRequestException("Invalid content platform.");
    }

    const state = await this.readState();

    const item: CreatorContent = {
      id: crypto.randomUUID(),
      title,
      platform: input.platform,
      format: input.format?.trim() || "Long Video",
      status: "idea",
      progress: 10,
      createdAt: new Date().toISOString(),
    };

    state.content.unshift(item);
    await this.writeState(state);

    return item;
  }

  async advanceContent(id: string): Promise<CreatorContent> {
    const state = await this.readState();
    const item = state.content.find((content) => content.id === id);

    if (!item) {
      throw new NotFoundException("Content item not found.");
    }

    const stages: CreatorContent["status"][] = [
      "idea",
      "research",
      "script",
      "voice",
      "video",
      "thumbnail",
      "scheduled",
      "published",
    ];

    const currentIndex = stages.indexOf(item.status);
    const nextIndex = Math.min(currentIndex + 1, stages.length - 1);
    const nextStatus = stages[nextIndex];

    if (!nextStatus) {
      throw new BadRequestException("Invalid content stage.");
    }

    item.status = nextStatus;
    item.progress = Math.round(((nextIndex + 1) / stages.length) * 100);

    await this.writeState(state);

    return item;
  }

  async removeContent(id: string): Promise<{ success: true }> {
    const state = await this.readState();
    const originalLength = state.content.length;

    state.content = state.content.filter((item) => item.id !== id);

    if (state.content.length === originalLength) {
      throw new NotFoundException("Content item not found.");
    }

    await this.writeState(state);

    return { success: true };
  }
}