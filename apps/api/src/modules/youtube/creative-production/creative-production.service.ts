import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type ProductionType =
  | 'video'
  | 'short'
  | 'live'
  | 'podcast'
  | 'thumbnail';

export type ProductionStatus =
  | 'idea'
  | 'planned'
  | 'in-production'
  | 'review'
  | 'approved'
  | 'published'
  | 'cancelled';

export type ProductionPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface ProductionTask {
  id: string;
  title: string;
  description?: string;
  type: ProductionType;
  status: ProductionStatus;
  priority: ProductionPriority;
  channelId?: string;
  assignedTeam?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  dueDate?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductionTaskInput {
  title: string;
  description?: string;
  type: ProductionType;
  status?: ProductionStatus;
  priority?: ProductionPriority;
  channelId?: string;
  assignedTeam?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  dueDate?: string;
}

export interface UpdateProductionTaskInput {
  title?: string;
  description?: string;
  type?: ProductionType;
  status?: ProductionStatus;
  priority?: ProductionPriority;
  channelId?: string;
  assignedTeam?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  dueDate?: string;
}

export interface ProductionDashboard {
  name: string;
  version: string;
  status: 'operational';
  totalTasks: number;
  totalsByStatus: Record<ProductionStatus, number>;
  totalsByType: Record<ProductionType, number>;
  overdueTasks: number;
  completionRate: number;
  updatedAt: string;
}

@Injectable()
export class CreativeProductionService {
  private readonly tasks = new Map<string, ProductionTask>();

  getDashboard(): ProductionDashboard {
    const tasks = [...this.tasks.values()];
    const now = Date.now();

    const completed = tasks.filter(
      (task) =>
        task.status === 'approved' ||
        task.status === 'published',
    ).length;

    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) {
        return false;
      }

      if (
        task.status === 'published' ||
        task.status === 'cancelled'
      ) {
        return false;
      }

      return new Date(task.dueDate).getTime() < now;
    }).length;

    return {
      name: 'CreatorOS Creative Production Engine',
      version: '1.0.0',
      status: 'operational',
      totalTasks: tasks.length,
      totalsByStatus: {
        idea: tasks.filter((task) => task.status === 'idea').length,
        planned: tasks.filter((task) => task.status === 'planned').length,
        'in-production': tasks.filter(
          (task) => task.status === 'in-production',
        ).length,
        review: tasks.filter((task) => task.status === 'review').length,
        approved: tasks.filter(
          (task) => task.status === 'approved',
        ).length,
        published: tasks.filter(
          (task) => task.status === 'published',
        ).length,
        cancelled: tasks.filter(
          (task) => task.status === 'cancelled',
        ).length,
      },
      totalsByType: {
        video: tasks.filter((task) => task.type === 'video').length,
        short: tasks.filter((task) => task.type === 'short').length,
        live: tasks.filter((task) => task.type === 'live').length,
        podcast: tasks.filter((task) => task.type === 'podcast').length,
        thumbnail: tasks.filter(
          (task) => task.type === 'thumbnail',
        ).length,
      },
      overdueTasks,
      completionRate:
        tasks.length === 0
          ? 0
          : Number(((completed / tasks.length) * 100).toFixed(2)),
      updatedAt: new Date().toISOString(),
    };
  }

  createTask(
    input: CreateProductionTaskInput,
  ): ProductionTask {
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        'Production task title is required',
      );
    }

    const now = new Date().toISOString();

    const task: ProductionTask = {
      id: randomUUID(),
      title,
      description: input.description?.trim(),
      type: input.type,
      status: input.status ?? 'idea',
      priority: input.priority ?? 'medium',
      channelId: input.channelId?.trim(),
      assignedTeam: input.assignedTeam?.trim(),
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      dueDate: this.normalizeDate(input.dueDate),
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);

    return task;
  }

  listTasks(filters?: {
    type?: ProductionType;
    status?: ProductionStatus;
    priority?: ProductionPriority;
    channelId?: string;
    assignedTeam?: string;
    search?: string;
  }): ProductionTask[] {
    const search = filters?.search?.trim().toLowerCase();

    return [...this.tasks.values()]
      .filter((task) => {
        if (filters?.type && task.type !== filters.type) {
          return false;
        }

        if (
          filters?.status &&
          task.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          task.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.channelId &&
          task.channelId !== filters.channelId
        ) {
          return false;
        }

        if (
          filters?.assignedTeam &&
          task.assignedTeam !== filters.assignedTeam
        ) {
          return false;
        }

        if (search) {
          const searchableText = [
            task.title,
            task.description ?? '',
            task.assignedTeam ?? '',
            ...task.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
  }

  getTask(id: string): ProductionTask {
    const task = this.tasks.get(id);

    if (!task) {
      throw new NotFoundException(
        `Creative production task '${id}' was not found`,
      );
    }

    return task;
  }

  updateTask(
    id: string,
    input: UpdateProductionTaskInput,
  ): ProductionTask {
    const current = this.getTask(id);

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new BadRequestException(
        'Production task title cannot be empty',
      );
    }

    const updated: ProductionTask = {
      ...current,
      ...input,
      title: input.title?.trim() ?? current.title,
      description:
        input.description?.trim() ?? current.description,
      channelId:
        input.channelId?.trim() ?? current.channelId,
      assignedTeam:
        input.assignedTeam?.trim() ?? current.assignedTeam,
      tags:
        input.tags !== undefined
          ? this.normalizeTags(input.tags)
          : current.tags,
      metadata: input.metadata ?? current.metadata,
      dueDate:
        input.dueDate !== undefined
          ? this.normalizeDate(input.dueDate)
          : current.dueDate,
      publishedAt:
        input.status === 'published' &&
        current.status !== 'published'
          ? new Date().toISOString()
          : current.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updated);

    return updated;
  }

  advanceTask(id: string): ProductionTask {
    const task = this.getTask(id);

    const workflow: ProductionStatus[] = [
      'idea',
      'planned',
      'in-production',
      'review',
      'approved',
      'published',
    ];

    if (
      task.status === 'cancelled' ||
      task.status === 'published'
    ) {
      return task;
    }

    const currentIndex = workflow.indexOf(task.status);
    const nextStatus = workflow[currentIndex + 1];

    return this.updateTask(id, {
      status: nextStatus,
    });
  }

  cancelTask(id: string): ProductionTask {
    return this.updateTask(id, {
      status: 'cancelled',
    });
  }

  removeTask(id: string): {
    success: true;
    id: string;
  } {
    this.getTask(id);
    this.tasks.delete(id);

    return {
      success: true,
      id,
    };
  }

  getProductionBoard(): Record<
    ProductionStatus,
    ProductionTask[]
  > {
    const tasks = this.listTasks();

    return {
      idea: tasks.filter((task) => task.status === 'idea'),
      planned: tasks.filter(
        (task) => task.status === 'planned',
      ),
      'in-production': tasks.filter(
        (task) => task.status === 'in-production',
      ),
      review: tasks.filter(
        (task) => task.status === 'review',
      ),
      approved: tasks.filter(
        (task) => task.status === 'approved',
      ),
      published: tasks.filter(
        (task) => task.status === 'published',
      ),
      cancelled: tasks.filter(
        (task) => task.status === 'cancelled',
      ),
    };
  }

  private normalizeTags(tags?: string[]): string[] {
    if (!tags) {
      return [];
    }

    return [
      ...new Set(
        tags
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
  }

  private normalizeDate(
    value?: string,
  ): string | undefined {
    if (!value) {
      return undefined;
    }

    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
      throw new BadRequestException(
        `Invalid date value '${value}'`,
      );
    }

    return new Date(timestamp).toISOString();
  }
}
