import {
  Injectable,
} from '@nestjs/common';

import type {
  ControlPlaneCommand,
  ControlPlaneComponent,
  ControlPlaneComponentState,
  ControlPlaneSnapshot,
} from '../contracts';

@Injectable()
export class EnterpriseControlPlaneService {
  private readonly components =
    new Map<
      string,
      ControlPlaneComponent
    >();

  private readonly commands:
    ControlPlaneCommand[] = [];

  register(input: {
    readonly componentId: string;
    readonly displayName: string;
    readonly capacity: number;
    readonly state?:
      ControlPlaneComponentState;
    readonly now?: Date;
  }): ControlPlaneComponent {
    const componentId =
      input.componentId.trim();

    const displayName =
      input.displayName.trim();

    if (
      !componentId ||
      !displayName ||
      !Number.isInteger(
        input.capacity,
      ) ||
      input.capacity < 1
    ) {
      throw new Error(
        'Valid component id, display name and positive capacity are required.',
      );
    }

    if (
      this.components.has(componentId)
    ) {
      throw new Error(
        `Control-plane component ${componentId} already exists.`,
      );
    }

    const component:
      ControlPlaneComponent = {
        componentId,
        displayName,
        state:
          input.state ?? 'online',
        activeWorkloads: 0,
        capacity: input.capacity,
        updatedAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.components.set(
      componentId,
      component,
    );

    return this.cloneComponent(
      component,
    );
  }

  updateLoad(
    componentId: string,
    activeWorkloads: number,
    now = new Date(),
  ): ControlPlaneComponent {
    const current =
      this.requireComponent(
        componentId,
      );

    if (
      !Number.isInteger(
        activeWorkloads,
      ) ||
      activeWorkloads < 0 ||
      activeWorkloads >
        current.capacity
    ) {
      throw new Error(
        'activeWorkloads must be within component capacity.',
      );
    }

    const updated:
      ControlPlaneComponent = {
        ...current,
        activeWorkloads,
        updatedAt: new Date(now),
      };

    this.components.set(
      componentId,
      updated,
    );

    return this.cloneComponent(
      updated,
    );
  }

  command(input: {
    readonly commandId: string;
    readonly type:
      ControlPlaneCommand['type'];
    readonly componentId: string;
    readonly requestedBy: string;
    readonly now?: Date;
  }): ControlPlaneComponent {
    const commandId =
      input.commandId.trim();

    const requestedBy =
      input.requestedBy.trim();

    if (
      !commandId ||
      !requestedBy ||
      this.commands.some(
        (command) =>
          command.commandId ===
          commandId,
      )
    ) {
      throw new Error(
        'A unique command id and requester are required.',
      );
    }

    const current =
      this.requireComponent(
        input.componentId,
      );

    const nextState =
      this.resolveState(
        current.state,
        input.type,
      );

    const updated:
      ControlPlaneComponent = {
        ...current,
        state: nextState,
        activeWorkloads:
          input.type === 'drain'
            ? 0
            : current.activeWorkloads,
        updatedAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.components.set(
      current.componentId,
      updated,
    );

    this.commands.push({
      commandId,
      type: input.type,
      componentId:
        current.componentId,
      requestedBy,
      requestedAt: new Date(
        input.now ?? new Date(),
      ),
    });

    return this.cloneComponent(
      updated,
    );
  }

  snapshot(): ControlPlaneSnapshot {
    const components =
      [...this.components.values()]
        .sort(
          (left, right) =>
            left.componentId.localeCompare(
              right.componentId,
            ),
        )
        .map((component) =>
          this.cloneComponent(
            component,
          ),
        );

    const onlineComponents =
      components.filter(
        (component) =>
          component.state === 'online',
      ).length;

    const activeWorkloads =
      components.reduce(
        (total, component) =>
          total +
          component.activeWorkloads,
        0,
      );

    const totalCapacity =
      components.reduce(
        (total, component) =>
          total + component.capacity,
        0,
      );

    const degraded =
      components.some(
        (component) =>
          component.state ===
            'degraded' ||
          component.state ===
            'maintenance',
      );

    const offline =
      components.some(
        (component) =>
          component.state ===
          'offline',
      );

    return {
      status: offline
        ? 'critical'
        : degraded
          ? 'degraded'
          : 'operational',
      totalComponents:
        components.length,
      onlineComponents,
      activeWorkloads,
      totalCapacity,
      utilization:
        totalCapacity === 0
          ? 0
          : activeWorkloads /
            totalCapacity,
      components,
      generatedAt: new Date(),
    };
  }

  listCommands():
    readonly ControlPlaneCommand[] {
    return this.commands.map(
      (command) => ({
        ...command,
        requestedAt: new Date(
          command.requestedAt,
        ),
      }),
    );
  }

  private resolveState(
    current:
      ControlPlaneComponentState,
    command:
      ControlPlaneCommand['type'],
  ): ControlPlaneComponentState {
    switch (command) {
      case 'enable-maintenance':
        return 'maintenance';
      case 'disable-maintenance':
      case 'resume':
      case 'rebalance':
        return 'online';
      case 'drain':
        return current === 'offline'
          ? 'offline'
          : 'maintenance';
    }
  }

  private requireComponent(
    componentId: string,
  ): ControlPlaneComponent {
    const component =
      this.components.get(
        componentId.trim(),
      );

    if (!component) {
      throw new Error(
        `Control-plane component ${componentId} was not found.`,
      );
    }

    return component;
  }

  private cloneComponent(
    component:
      ControlPlaneComponent,
  ): ControlPlaneComponent {
    return {
      ...component,
      updatedAt: new Date(
        component.updatedAt,
      ),
    };
  }
}
