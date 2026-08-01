import { BadRequestException, NotFoundException } from '@nestjs/common';
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

export abstract class AvosMediaUltraEngineBase {
  private readonly projects = new Map<string, UltraProject>();

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: string,
    private readonly orderedStages: readonly string[],
  ) {}

  getDashboard() {
    const projects = [...this.projects.values()];

    return {
      engine: this.engineName,
      managedStage: this.managedStage,
      status: 'operational',
      totalStages: this.orderedStages.length,
      totalProjects: projects.length,
      runningProjects: projects.filter((x) => x.status === 'running').length,
      completedProjects: projects.filter((x) => x.status === 'completed').length,
      humanFinalAuthority: true,
      updatedAt: new Date().toISOString(),
    };
  }

  getBlueprint() {
    return {
      engine: this.engineName,
      stages: this.orderedStages.map((stage, index) => ({
        sequence: index + 1,
        stage,
        previousStage: index > 0 ? this.orderedStages[index - 1] : null,
        nextStage:
          index < this.orderedStages.length - 1
            ? this.orderedStages[index + 1]
            : null,
      })),
      humanFinalAuthority: true,
    };
  }

  createProject(input: {
    name: string;
    description?: string;
    owner: string;
  }) {
    if (!input.name?.trim()) {
      throw new BadRequestException('Project name is required');
    }

    if (!input.owner?.trim()) {
      throw new BadRequestException('Project owner is required');
    }

    const now = new Date().toISOString();

    const project: UltraProject = {
      id: randomUUID(),
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      owner: input.owner.trim(),
      currentStage: this.orderedStages[0],
      status: 'draft',
      stages: this.orderedStages.map((stage, index) => ({
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

  listProjects() {
    return [...this.projects.values()];
  }

  getProject(id: string) {
    const project = this.projects.get(id);

    if (!project) {
      throw new NotFoundException(`Project '${id}' was not found`);
    }

    return project;
  }

  startProject(id: string) {
    const project = this.getProject(id);

    project.status = 'running';
    project.currentStage = this.orderedStages[0];
    project.stages[0].status = 'running';
    project.updatedAt = new Date().toISOString();

    return project;
  }

  executeManagedStage(
    id: string,
    input?: {
      score?: number;
      confidence?: number;
      outputs?: Record<string, unknown>;
    },
  ) {
    const project = this.getProject(id);
    const stage = project.stages.find(
      (item) => item.stage === this.managedStage,
    );

    if (!stage) {
      throw new NotFoundException(
        `Stage '${this.managedStage}' was not found`,
      );
    }

    if (stage.humanApprovalRequired && !stage.humanApproved) {
      stage.status = 'human-review';
      project.status = 'human-review';
      project.updatedAt = new Date().toISOString();
      return project;
    }

    stage.status = 'completed';
    stage.score = Math.max(0, Math.min(100, input?.score ?? 0));
    stage.confidence = Math.max(
      0,
      Math.min(100, input?.confidence ?? 0),
    );
    stage.outputs = input?.outputs ?? {};
    stage.updatedAt = new Date().toISOString();

    const index = this.orderedStages.indexOf(this.managedStage);
    const nextStage = this.orderedStages[index + 1];

    if (nextStage) {
      project.currentStage = nextStage;
      const next = project.stages[index + 1];
      next.status = 'planned';
      project.status = 'running';
    } else {
      project.status = 'completed';
    }

    project.updatedAt = new Date().toISOString();
    return project;
  }

  approveStage(id: string) {
    const project = this.getProject(id);
    const stage = project.stages.find(
      (item) => item.stage === this.managedStage,
    );

    if (!stage) {
      throw new NotFoundException(
        `Stage '${this.managedStage}' was not found`,
      );
    }

    stage.humanApproved = true;
    stage.status = 'approved';
    project.status = 'running';
    project.updatedAt = new Date().toISOString();

    return project;
  }

  removeProject(id: string) {
    this.getProject(id);
    this.projects.delete(id);

    return { success: true, id };
  }
}

