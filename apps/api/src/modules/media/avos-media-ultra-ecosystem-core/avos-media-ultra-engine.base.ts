import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type UltraStageStatus =
  | 'draft'
  | 'planned'
  | 'running'
  | 'human-review'
  | 'approved'
  | 'blocked'
  | 'completed';

export interface UltraStageRecord {
  id: string;
  stage: string;
  status: UltraStageStatus;
  score: number;
  confidence: number;
  outputs: Record<string, unknown>;
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UltraProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  currentStage: string;
  status: UltraStageStatus;
  stages: UltraStageRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUltraProjectInput {
  name: string;
  description?: string;
  owner: string;
}

export interface ExecuteUltraStageInput {
  score?: number;
  confidence?: number;
  outputs?: Record<string, unknown>;
}

export abstract class AvosMediaUltraEngineBase {
  private readonly projects = new Map<string, UltraProject>();
  private readonly stageSequence: readonly string[];

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: string,
    orderedStages: readonly string[],
  ) {
    const normalizedStages = orderedStages
      .map((stage) => stage.trim())
      .filter((stage) => stage.length > 0);

    if (normalizedStages.length === 0) {
      throw new Error(
        `Engine '${engineName}' requires at least one ordered stage`,
      );
    }

    const duplicateStages = normalizedStages.filter(
      (stage, index) => normalizedStages.indexOf(stage) !== index,
    );

    if (duplicateStages.length > 0) {
      throw new Error(
        `Engine '${engineName}' contains duplicate stages: ${[
          ...new Set(duplicateStages),
        ].join(', ')}`,
      );
    }

    if (!normalizedStages.includes(managedStage)) {
      throw new Error(
        `Managed stage '${managedStage}' is not registered in engine '${engineName}'`,
      );
    }

    this.stageSequence = Object.freeze([...normalizedStages]);
  }

  private firstStageName(): string {
    const firstStage = this.stageSequence.at(0);

    if (!firstStage) {
      throw new Error(
        `Engine '${this.engineName}' has no first stage`,
      );
    }

    return firstStage;
  }

  private stageAt(
    project: UltraProject,
    index: number,
  ): UltraStageRecord {
    const stage = project.stages.at(index);

    if (!stage) {
      throw new Error(
        `Project '${project.id}' is missing stage at index ${index}`,
      );
    }

    return stage;
  }

  private managedStageRecord(
    project: UltraProject,
  ): UltraStageRecord {
    const stage = project.stages.find(
      (item) => item.stage === this.managedStage,
    );

    if (!stage) {
      throw new NotFoundException(
        `Stage '${this.managedStage}' was not found`,
      );
    }

    return stage;
  }

  private clampPercentage(value: number | undefined): number {
    if (value === undefined || Number.isNaN(value)) {
      return 0;
    }

    return Math.max(0, Math.min(100, value));
  }

  getDashboard() {
    const projects = [...this.projects.values()];

    return {
      engine: this.engineName,
      managedStage: this.managedStage,
      status: 'operational' as const,
      totalStages: this.stageSequence.length,
      totalProjects: projects.length,
      runningProjects: projects.filter(
        (project) => project.status === 'running',
      ).length,
      completedProjects: projects.filter(
        (project) => project.status === 'completed',
      ).length,
      humanFinalAuthority: true,
      updatedAt: new Date().toISOString(),
    };
  }

  getBlueprint() {
    return {
      engine: this.engineName,
      stages: this.stageSequence.map((stage, index) => ({
        sequence: index + 1,
        stage,
        previousStage:
          index > 0
            ? (this.stageSequence.at(index - 1) ?? null)
            : null,
        nextStage:
          index < this.stageSequence.length - 1
            ? (this.stageSequence.at(index + 1) ?? null)
            : null,
      })),
      humanFinalAuthority: true,
    };
  }

  createProject(input: CreateUltraProjectInput): UltraProject {
    const name = input.name?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Project name is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Project owner is required',
      );
    }

    const now = new Date().toISOString();
    const firstStage = this.firstStageName();

    const project: UltraProject = {
      id: randomUUID(),
      name,
      description: input.description?.trim() ?? '',
      owner,
      currentStage: firstStage,
      status: 'draft',
      stages: this.stageSequence.map((stage, index) => ({
        id: randomUUID(),
        stage,
        status: index === 0 ? 'planned' : 'draft',
        score: 0,
        confidence: 0,
        outputs: {},
        humanApprovalRequired:
          stage === 'human-final-authority-stage' ||
          stage.includes('licensing') ||
          stage.includes('sponsorship') ||
          stage.includes('commerce'),
        humanApproved: false,
        createdAt: now,
        updatedAt: now,
      })),
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);
    return project;
  }

  listProjects(): UltraProject[] {
    return [...this.projects.values()];
  }

  getProject(id: string): UltraProject {
    const project = this.projects.get(id);

    if (!project) {
      throw new NotFoundException(
        `Project '${id}' was not found`,
      );
    }

    return project;
  }

  startProject(id: string): UltraProject {
    const project = this.getProject(id);
    const firstStageName = this.firstStageName();
    const firstStageRecord = this.stageAt(project, 0);

    project.status = 'running';
    project.currentStage = firstStageName;
    firstStageRecord.status = 'running';
    firstStageRecord.updatedAt = new Date().toISOString();
    project.updatedAt = firstStageRecord.updatedAt;

    return project;
  }

  executeManagedStage(
    id: string,
    input: ExecuteUltraStageInput = {},
  ): UltraProject {
    const project = this.getProject(id);
    const stage = this.managedStageRecord(project);

    if (stage.humanApprovalRequired && !stage.humanApproved) {
      stage.status = 'human-review';
      stage.updatedAt = new Date().toISOString();
      project.status = 'human-review';
      project.currentStage = stage.stage;
      project.updatedAt = stage.updatedAt;
      return project;
    }

    const now = new Date().toISOString();

    stage.status = 'completed';
    stage.score = this.clampPercentage(input.score);
    stage.confidence = this.clampPercentage(
      input.confidence,
    );
    stage.outputs = input.outputs ?? {};
    stage.updatedAt = now;

    const managedIndex = this.stageSequence.indexOf(
      this.managedStage,
    );

    if (managedIndex < 0) {
      throw new Error(
        `Managed stage '${this.managedStage}' disappeared from the blueprint`,
      );
    }

    const nextStageName =
      this.stageSequence.at(managedIndex + 1);

    if (nextStageName) {
      const nextStageRecord = this.stageAt(
        project,
        managedIndex + 1,
      );

      nextStageRecord.status = 'planned';
      nextStageRecord.updatedAt = now;
      project.currentStage = nextStageName;
      project.status = 'running';
    } else {
      project.currentStage = stage.stage;
      project.status = 'completed';
    }

    project.updatedAt = now;
    return project;
  }

  approveStage(id: string): UltraProject {
    const project = this.getProject(id);
    const stage = this.managedStageRecord(project);
    const now = new Date().toISOString();

    stage.humanApproved = true;
    stage.status = 'approved';
    stage.updatedAt = now;
    project.currentStage = stage.stage;
    project.status = 'running';
    project.updatedAt = now;

    return project;
  }

  removeProject(id: string) {
    this.getProject(id);
    this.projects.delete(id);

    return {
      success: true,
      id,
    };
  }
}
