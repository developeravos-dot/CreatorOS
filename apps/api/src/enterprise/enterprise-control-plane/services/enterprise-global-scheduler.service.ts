import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseScheduledTask {
  readonly taskId: string;
  readonly type: string;
  readonly priority: number;
  readonly dueAt: Date;
  readonly status:
    | 'scheduled'
    | 'running'
    | 'completed'
    | 'cancelled';
}

@Injectable()
export class EnterpriseGlobalSchedulerService {
  private readonly tasks =
    new Map<
      string,
      EnterpriseScheduledTask
    >();

  schedule(input: {
    readonly taskId: string;
    readonly type: string;
    readonly priority: number;
    readonly dueAt: Date;
  }): EnterpriseScheduledTask {
    const taskId =
      input.taskId.trim();

    const type =
      input.type.trim();

    if (
      !taskId ||
      !type ||
      !Number.isInteger(
        input.priority,
      ) ||
      this.tasks.has(taskId)
    ) {
      throw new Error(
        'Valid unique scheduled task is required.',
      );
    }

    const task:
      EnterpriseScheduledTask = {
        taskId,
        type,
        priority: input.priority,
        dueAt: new Date(
          input.dueAt,
        ),
        status: 'scheduled',
      };

    this.tasks.set(taskId, task);
    return this.clone(task);
  }

  due(
    now = new Date(),
  ): readonly EnterpriseScheduledTask[] {
    return [...this.tasks.values()]
      .filter(
        (task) =>
          task.status ===
            'scheduled' &&
          task.dueAt.getTime() <=
            now.getTime(),
      )
      .sort(
        (left, right) =>
          right.priority -
            left.priority ||
          left.dueAt.getTime() -
            right.dueAt.getTime(),
      )
      .map((task) =>
        this.clone(task),
      );
  }

  transition(
    taskId: string,
    status:
      | 'running'
      | 'completed'
      | 'cancelled',
  ): EnterpriseScheduledTask {
    const current =
      this.tasks.get(
        taskId.trim(),
      );

    if (!current) {
      throw new Error(
        'Scheduled task was not found.',
      );
    }

    const updated = {
      ...current,
      status,
    };

    this.tasks.set(
      current.taskId,
      updated,
    );

    return this.clone(updated);
  }

  snapshot() {
    return [...this.tasks.values()]
      .sort(
        (left, right) =>
          left.dueAt.getTime() -
          right.dueAt.getTime(),
      )
      .map((task) =>
        this.clone(task),
      );
  }

  private clone(
    task: EnterpriseScheduledTask,
  ): EnterpriseScheduledTask {
    return {
      ...task,
      dueAt: new Date(
        task.dueAt,
      ),
    };
  }
}
