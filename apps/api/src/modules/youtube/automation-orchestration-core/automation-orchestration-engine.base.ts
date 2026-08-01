import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type AutomationStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'blocked';

export type AutomationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type AutomationType =
  | 'workflow'
  | 'publishing'
  | 'agent-task'
  | 'quality-check'
  | 'operation'
  | 'approval'
  | 'notification'
  | 'other';

export type ExecutionMode =
  | 'manual'
  | 'scheduled'
  | 'event-driven'
  | 'autonomous';

export interface AutomationRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: AutomationType;
  status: AutomationStatus;
  priority: AutomationPriority;
  executionMode: ExecutionMode;
  owner: string;
  assignedAgent?: string;
  progress: number;
  qualityScore: number;
  reliabilityScore: number;
  automationScore: number;
  retryCount: number;
  maxRetries: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  lastError?: string;
  dependencies: string[];
  tags: string[];
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutomationRecordInput {
  name: string;
  description?: string;
  category: string;
  type?: AutomationType;
  status?: AutomationStatus;
  priority?: AutomationPriority;
  executionMode?: ExecutionMode;
  owner: string;
  assignedAgent?: string;
  progress?: number;
  qualityScore?: number;
  reliabilityScore?: number;
  automationScore?: number;
  retryCount?: number;
  maxRetries?: number;
  scheduledAt?: string;
  dependencies?: string[];
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateAutomationRecordInput {
  name?: string;
  description?: string;
  category?: string;
  type?: AutomationType;
  status?: AutomationStatus;
  priority?: AutomationPriority;
  executionMode?: ExecutionMode;
  owner?: string;
  assignedAgent?: string;
  progress?: number;
  qualityScore?: number;
  reliabilityScore?: number;
  automationScore?: number;
  retryCount?: number;
  maxRetries?: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  lastError?: string;
  dependencies?: string[];
  tags?: string[];
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export abstract class AutomationOrchestrationEngineBase {
  private readonly records =
    new Map<string, AutomationRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const records = [...this.records.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      totalRecords: records.length,
      queuedRecords: records.filter(
        (record) => record.status === 'queued',
      ).length,
      runningRecords: records.filter(
        (record) => record.status === 'running',
      ).length,
      completedRecords: records.filter(
        (record) => record.status === 'completed',
      ).length,
      failedRecords: records.filter(
        (record) => record.status === 'failed',
      ).length,
      blockedRecords: records.filter(
        (record) => record.status === 'blocked',
      ).length,
      criticalRecords: records.filter(
        (record) => record.priority === 'critical',
      ).length,
      autonomousRecords: records.filter(
        (record) =>
          record.executionMode === 'autonomous',
      ).length,
      averageProgress: this.average(
        records.map((record) => record.progress),
      ),
      averageQualityScore: this.average(
        records.map(
          (record) => record.qualityScore,
        ),
      ),
      averageReliabilityScore: this.average(
        records.map(
          (record) => record.reliabilityScore,
        ),
      ),
      averageAutomationScore: this.average(
        records.map(
          (record) => record.automationScore,
        ),
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateAutomationRecordInput,
  ): AutomationRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Automation name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Automation category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Automation owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: AutomationRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'workflow',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      executionMode:
        input.executionMode ?? 'manual',
      owner,
      assignedAgent:
        input.assignedAgent?.trim(),
      progress: this.percentage(
        input.progress ?? 0,
        'progress',
      ),
      qualityScore: this.percentage(
        input.qualityScore ?? 0,
        'qualityScore',
      ),
      reliabilityScore: this.percentage(
        input.reliabilityScore ?? 0,
        'reliabilityScore',
      ),
      automationScore: this.percentage(
        input.automationScore ?? 0,
        'automationScore',
      ),
      retryCount: this.integer(
        input.retryCount ?? 0,
        'retryCount',
      ),
      maxRetries: this.integer(
        input.maxRetries ?? 3,
        'maxRetries',
      ),
      scheduledAt: this.optionalDate(
        input.scheduledAt,
        'scheduledAt',
      ),
      dependencies: this.normalizeList(
        input.dependencies,
      ),
      tags: this.normalizeList(input.tags),
      payload: input.payload ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: AutomationStatus;
    priority?: AutomationPriority;
    type?: AutomationType;
    executionMode?: ExecutionMode;
    category?: string;
    owner?: string;
    assignedAgent?: string;
    search?: string;
    minimumQualityScore?: number;
  }): AutomationRecord[] {
    const search = filters?.search
      ?.trim()
      .toLowerCase();

    return [...this.records.values()]
      .filter((record) => {
        if (
          filters?.status &&
          record.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          record.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.type &&
          record.type !== filters.type
        ) {
          return false;
        }

        if (
          filters?.executionMode &&
          record.executionMode !==
            filters.executionMode
        ) {
          return false;
        }

        if (
          filters?.category &&
          record.category !== filters.category
        ) {
          return false;
        }

        if (
          filters?.owner &&
          record.owner.toLowerCase() !==
            filters.owner.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.assignedAgent &&
          record.assignedAgent?.toLowerCase() !==
            filters.assignedAgent.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.minimumQualityScore !==
            undefined &&
          record.qualityScore <
            filters.minimumQualityScore
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            record.name,
            record.description ?? '',
            record.category,
            record.type,
            record.owner,
            record.assignedAgent ?? '',
            ...record.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchable.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort((first, second) => {
        if (
          second.priority !== first.priority
        ) {
          return (
            this.priorityWeight(second.priority) -
            this.priorityWeight(first.priority)
          );
        }

        return (
          second.automationScore -
          first.automationScore
        );
      });
  }

  getRecord(id: string): AutomationRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `${this.engineName} record '${id}' was not found`,
      );
    }

    return record;
  }

  updateRecord(
    id: string,
    input: UpdateAutomationRecordInput,
  ): AutomationRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Automation name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Automation owner cannot be empty',
      );
    }

    const updated: AutomationRecord = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ?? current.category,
      owner:
        input.owner?.trim() ?? current.owner,
      assignedAgent:
        input.assignedAgent?.trim() ??
        current.assignedAgent,
      progress:
        input.progress !== undefined
          ? this.percentage(
              input.progress,
              'progress',
            )
          : current.progress,
      qualityScore:
        input.qualityScore !== undefined
          ? this.percentage(
              input.qualityScore,
              'qualityScore',
            )
          : current.qualityScore,
      reliabilityScore:
        input.reliabilityScore !== undefined
          ? this.percentage(
              input.reliabilityScore,
              'reliabilityScore',
            )
          : current.reliabilityScore,
      automationScore:
        input.automationScore !== undefined
          ? this.percentage(
              input.automationScore,
              'automationScore',
            )
          : current.automationScore,
      retryCount:
        input.retryCount !== undefined
          ? this.integer(
              input.retryCount,
              'retryCount',
            )
          : current.retryCount,
      maxRetries:
        input.maxRetries !== undefined
          ? this.integer(
              input.maxRetries,
              'maxRetries',
            )
          : current.maxRetries,
      scheduledAt:
        input.scheduledAt !== undefined
          ? this.optionalDate(
              input.scheduledAt,
              'scheduledAt',
            )
          : current.scheduledAt,
      dependencies:
        input.dependencies !== undefined
          ? this.normalizeList(
              input.dependencies,
            )
          : current.dependencies,
      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,
      payload: input.payload ?? current.payload,
      result: input.result ?? current.result,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  queueRecord(id: string): AutomationRecord {
    return this.updateRecord(id, {
      status: 'queued',
    });
  }

  startRecord(id: string): AutomationRecord {
    const record = this.getRecord(id);

    if (
      record.status === 'completed' ||
      record.status === 'cancelled'
    ) {
      throw new BadRequestException(
        'Completed or cancelled automation cannot start',
      );
    }

    if (
      record.dependencies.some((dependencyId) => {
        const dependency =
          this.records.get(dependencyId);

        return (
          dependency &&
          dependency.status !== 'completed'
        );
      })
    ) {
      return this.updateRecord(id, {
        status: 'blocked',
      });
    }

    return this.updateRecord(id, {
      status: 'running',
      startedAt: new Date().toISOString(),
      lastError: undefined,
    });
  }

  pauseRecord(id: string): AutomationRecord {
    const record = this.getRecord(id);

    if (record.status !== 'running') {
      throw new BadRequestException(
        'Only running automation can be paused',
      );
    }

    return this.updateRecord(id, {
      status: 'paused',
    });
  }

  completeRecord(
    id: string,
    result?: Record<string, unknown>,
  ): AutomationRecord {
    return this.updateRecord(id, {
      status: 'completed',
      progress: 100,
      result: result ?? {},
      completedAt: new Date().toISOString(),
    });
  }

  failRecord(
    id: string,
    error: string,
  ): AutomationRecord {
    const record = this.getRecord(id);
    const message = error?.trim();

    if (!message) {
      throw new BadRequestException(
        'Failure error message is required',
      );
    }

    return this.updateRecord(id, {
      status: 'failed',
      lastError: message,
      retryCount: record.retryCount + 1,
    });
  }

  retryRecord(id: string): AutomationRecord {
    const record = this.getRecord(id);

    if (record.status !== 'failed') {
      throw new BadRequestException(
        'Only failed automation can be retried',
      );
    }

    if (
      record.retryCount >= record.maxRetries
    ) {
      throw new BadRequestException(
        'Maximum retry count reached',
      );
    }

    return this.updateRecord(id, {
      status: 'queued',
      lastError: undefined,
    });
  }

  cancelRecord(id: string): AutomationRecord {
    return this.updateRecord(id, {
      status: 'cancelled',
    });
  }

  assignAgent(
    id: string,
    agent: string,
  ): AutomationRecord {
    const assignedAgent = agent?.trim();

    if (!assignedAgent) {
      throw new BadRequestException(
        'Agent name is required',
      );
    }

    return this.updateRecord(id, {
      assignedAgent,
      type: 'agent-task',
    });
  }

  updateProgress(
    id: string,
    progress: number,
  ): AutomationRecord {
    const normalized = this.percentage(
      progress,
      'progress',
    );

    if (normalized === 100) {
      return this.completeRecord(id);
    }

    return this.updateRecord(id, {
      progress: normalized,
      status:
        normalized > 0
          ? 'running'
          : this.getRecord(id).status,
    });
  }

  runQualityCheck(id: string) {
    const record = this.getRecord(id);

    const issues: string[] = [];

    if (record.qualityScore < 70) {
      issues.push('Quality score is below target');
    }

    if (record.reliabilityScore < 70) {
      issues.push(
        'Reliability score is below target',
      );
    }

    if (!record.owner) {
      issues.push('Automation owner is missing');
    }

    if (
      record.executionMode === 'autonomous' &&
      record.automationScore < 80
    ) {
      issues.push(
        'Autonomous automation score is insufficient',
      );
    }

    return {
      id: record.id,
      passed: issues.length === 0,
      issues,
      qualityScore: record.qualityScore,
      reliabilityScore:
        record.reliabilityScore,
      automationScore: record.automationScore,
      checkedAt: new Date().toISOString(),
    };
  }

  generateExecutionPlan(id: string) {
    const record = this.getRecord(id);

    const steps = [
      'Validate automation configuration',
      'Validate dependencies',
      'Allocate execution resources',
      'Execute automation workflow',
      'Run quality assurance checks',
      'Store execution result',
    ];

    if (record.assignedAgent) {
      steps.splice(
        3,
        0,
        `Coordinate assigned agent: ${record.assignedAgent}`,
      );
    }

    return {
      id: record.id,
      name: record.name,
      executionMode: record.executionMode,
      dependencies: record.dependencies,
      steps,
      estimatedSteps: steps.length,
      generatedAt: new Date().toISOString(),
    };
  }

  getCommandCenter() {
    const dashboard = this.getDashboard();

    const attentionRequired = this.listRecords()
      .filter((record) =>
        [
          'failed',
          'blocked',
        ].includes(record.status),
      )
      .map((record) => ({
        id: record.id,
        name: record.name,
        status: record.status,
        priority: record.priority,
        lastError: record.lastError,
      }));

    return {
      ...dashboard,
      attentionRequired,
      attentionRequiredCount:
        attentionRequired.length,
    };
  }

  getTopRecords(limit = 10) {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(0, safeLimit);
  }

  removeRecord(id: string) {
    this.getRecord(id);
    this.records.delete(id);

    return {
      success: true as const,
      id,
    };
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    return Number(
      (
        values.reduce(
          (total, value) => total + value,
          0,
        ) / values.length
      ).toFixed(2),
    );
  }

  private percentage(
    value: number,
    field: string,
  ): number {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        `${field} must be a valid number`,
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private integer(
    value: number,
    field: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        `${field} must be a non-negative integer`,
      );
    }

    return value;
  }

  private optionalDate(
    value: string | undefined,
    field: string,
  ): string | undefined {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        `${field} must be a valid date`,
      );
    }

    return date.toISOString();
  }

  private normalizeList(
    values?: string[],
  ): string[] {
    if (!values) {
      return [];
    }

    return [
      ...new Set(
        values
          .map((value) =>
            value.trim().toLowerCase(),
          )
          .filter(Boolean),
      ),
    ];
  }

  private priorityWeight(
    priority: AutomationPriority,
  ): number {
    return {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    }[priority];
  }
}
