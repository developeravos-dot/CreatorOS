import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import type {
  UpdateWorkflowContract,
  WorkflowOperationResultContract,
} from '../contracts';
import {
  WorkflowDefinitionModel,
  cloneWorkflowStep,
  cloneWorkflowTransition,
  cloneWorkflowVariable,
  type CreateWorkflowDefinitionInput,
  type WorkflowDefinition,
  type WorkflowState,
} from '../models';
import {
  WorkflowDefinitionValidatorService,
} from './workflow-definition-validator.service';
import {
  WorkflowStateMachineService,
} from './workflow-state-machine.service';
import {
  WorkflowVersioningService,
} from './workflow-versioning.service';

@Injectable()
export class WorkflowEngineService {
  private readonly workflows =
    new Map<
      string,
      WorkflowDefinition
    >();

  constructor(
    private readonly validator:
      WorkflowDefinitionValidatorService =
        new WorkflowDefinitionValidatorService(),

    private readonly stateMachine:
      WorkflowStateMachineService =
        new WorkflowStateMachineService(),

    private readonly versioning:
      WorkflowVersioningService =
        new WorkflowVersioningService(),
  ) {}

  create(
    input:
      CreateWorkflowDefinitionInput,
  ): WorkflowDefinition {
    const id =
      this.normalizeIdentifier(
        input.id,
      ) ?? randomUUID();

    if (
      this.workflows.has(id)
    ) {
      throw new Error(
        `Workflow ${id} already exists.`,
      );
    }

    const now =
      new Date().toISOString();

    const workflow:
      WorkflowDefinition = {
        id,
        name:
          this.requireText(
            input.name,
            'name',
          ),
        description:
          this.normalizeText(
            input.description,
          ),
        type:
          input.type ??
          'sequential',
        state:
          'draft',
        version: 1,
        entryStepId:
          this.requireText(
            input.entryStepId,
            'entryStepId',
          ),
        steps:
          input.steps.map(
            (step) =>
              this.sanitizeStep(
                step,
              ),
          ),
        transitions:
          (
            input.transitions ??
            []
          ).map(
            (transition) =>
              cloneWorkflowTransition(
                transition,
              ),
          ),
        triggers:
          (
            input.triggers ??
            []
          ).map(
            (trigger) => ({
              ...trigger,
              configuration:
                this.sanitizeRecord(
                  trigger.configuration,
                ),
            }),
          ),
        variables:
          (
            input.variables ??
            []
          ).map(
            (variable) =>
              this.sanitizeVariable(
                variable,
              ),
          ),
        ownership: {
          ...input.ownership,
        },
        tags: {
          tags:
            this.normalizeTags(
              input.tags,
            ),
          labels:
            this.normalizeLabels(
              input.labels,
            ),
        },
        createdAt: now,
        updatedAt: now,
      };

    this.validator.assertValid(
      workflow,
    );

    const snapshot =
      this.saveWorkflow(
        workflow,
      );

    this.versioning.createVersion(
      snapshot,
      {
        changeSummary:
          'Initial workflow definition.',
        published: false,
      },
    );

    return snapshot;
  }

  getById(
    workflowId: string,
  ): WorkflowDefinition | undefined {
    const workflow =
      this.workflows.get(
        workflowId,
      );

    return workflow
      ? this.cloneWorkflow(
          workflow,
        )
      : undefined;
  }

  list():
    readonly WorkflowDefinition[] {
    return [
      ...this.workflows.values(),
    ]
      .sort(
        (left, right) =>
          right.updatedAt.localeCompare(
            left.updatedAt,
          ),
      )
      .map(
        (workflow) =>
          this.cloneWorkflow(
            workflow,
          ),
      );
  }

  update(
    workflowId: string,
    input:
      UpdateWorkflowContract,
  ): WorkflowDefinition {
    const existing =
      this.requireWorkflow(
        workflowId,
      );

    if (
      existing.state !==
      'draft'
    ) {
      throw new Error(
        `Workflow ${workflowId} can only be edited while in draft state.`,
      );
    }

    const now =
      new Date().toISOString();

    const updated:
      WorkflowDefinition = {
        ...existing,
        name:
          input.name !== undefined
            ? this.requireText(
                input.name,
                'name',
              )
            : existing.name,
        description:
          input.description !==
          undefined
            ? this.normalizeText(
                input.description,
              )
            : existing.description,
        type:
          input.type ??
          existing.type,
        entryStepId:
          input.entryStepId !==
          undefined
            ? this.requireText(
                input.entryStepId,
                'entryStepId',
              )
            : existing.entryStepId,
        steps:
          input.steps !==
          undefined
            ? input.steps.map(
                (step) =>
                  this.sanitizeStep(
                    step,
                  ),
              )
            : existing.steps.map(
                (step) =>
                  cloneWorkflowStep(
                    step,
                  ),
              ),
        transitions:
          input.transitions !==
          undefined
            ? input.transitions.map(
                (transition) =>
                  cloneWorkflowTransition(
                    transition,
                  ),
              )
            : existing.transitions.map(
                (transition) =>
                  cloneWorkflowTransition(
                    transition,
                  ),
              ),
        triggers:
          input.triggers !==
          undefined
            ? input.triggers.map(
                (trigger) => ({
                  ...trigger,
                  configuration:
                    this.sanitizeRecord(
                      trigger.configuration,
                    ),
                }),
              )
            : existing.triggers.map(
                (trigger) => ({
                  ...trigger,
                  configuration: {
                    ...trigger.configuration,
                  },
                }),
              ),
        variables:
          input.variables !==
          undefined
            ? input.variables.map(
                (variable) =>
                  this.sanitizeVariable(
                    variable,
                  ),
              )
            : existing.variables.map(
                (variable) =>
                  cloneWorkflowVariable(
                    variable,
                  ),
              ),
        tags: {
          tags:
            input.tags !==
            undefined
              ? this.normalizeTags(
                  input.tags,
                )
              : [
                  ...existing.tags.tags,
                ],
          labels:
            input.labels !==
            undefined
              ? this.normalizeLabels(
                  input.labels,
                )
              : {
                  ...existing.tags.labels,
                },
        },
        updatedAt: now,
      };

    this.validator.assertValid(
      updated,
    );

    return this.saveWorkflow(
      updated,
    );
  }

  transition(
    workflowId: string,
    targetState:
      WorkflowState,
  ): WorkflowDefinition {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    this.stateMachine
      .assertWorkflowTransition(
        workflow.state,
        targetState,
      );

    const now =
      new Date().toISOString();

    return this.saveWorkflow({
      ...workflow,
      state:
        targetState,
      publishedAt:
        targetState ===
        'published'
          ? now
          : workflow.publishedAt,
      updatedAt: now,
    });
  }

  publish(
    workflowId: string,
    input: {
      changeSummary?: string;
      requestedBy?: string;
    } = {},
  ): WorkflowOperationResultContract {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    this.validator.assertValid(
      workflow,
    );

    if (
      !this.stateMachine
        .canPublish(
          workflow.state,
        )
    ) {
      throw new Error(
        `Workflow ${workflowId} cannot be published from state ${workflow.state}.`,
      );
    }

    const published =
      this.transition(
        workflowId,
        'published',
      );

    const version =
      this.versioning.createVersion(
        published,
        {
          changeSummary:
            input.changeSummary ??
            'Workflow published.',
          createdBy:
            input.requestedBy,
          published: true,
        },
      );

    const versioned =
      this.saveWorkflow({
        ...published,
        version:
          version.version,
        publishedAt:
          published.publishedAt ??
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      });

    this.versioning.markPublished(
      workflowId,
      version.version,
    );

    return {
      successful: true,
      workflowId,
      state:
        versioned.state,
      message:
        'Workflow published.',
      workflow:
        versioned,
    };
  }

  activate(
    workflowId: string,
  ): WorkflowDefinition {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    if (
      !this.stateMachine
        .canActivate(
          workflow.state,
        )
    ) {
      throw new Error(
        `Workflow ${workflowId} cannot be activated from state ${workflow.state}.`,
      );
    }

    return this.transition(
      workflowId,
      'active',
    );
  }

  pause(
    workflowId: string,
  ): WorkflowDefinition {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    if (
      !this.stateMachine
        .canPauseWorkflow(
          workflow.state,
        )
    ) {
      throw new Error(
        `Workflow ${workflowId} cannot be paused from state ${workflow.state}.`,
      );
    }

    return this.transition(
      workflowId,
      'paused',
    );
  }

  resume(
    workflowId: string,
  ): WorkflowDefinition {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    if (
      !this.stateMachine
        .canResumeWorkflow(
          workflow.state,
        )
    ) {
      throw new Error(
        `Workflow ${workflowId} cannot be resumed from state ${workflow.state}.`,
      );
    }

    return this.transition(
      workflowId,
      'active',
    );
  }

  archive(
    workflowId: string,
  ): WorkflowDefinition {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    if (
      !this.stateMachine
        .canArchive(
          workflow.state,
        )
    ) {
      throw new Error(
        `Workflow ${workflowId} cannot be archived from state ${workflow.state}.`,
      );
    }

    return this.transition(
      workflowId,
      'archived',
    );
  }

  deprecate(
    workflowId: string,
  ): WorkflowDefinition {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    return this.transition(
      workflowId,
      'deprecated',
    );
  }

  createVersion(
    workflowId: string,
    input: {
      changeSummary?: string;
      requestedBy?: string;
    } = {},
  ) {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    return this.versioning
      .createVersion(
        workflow,
        {
          changeSummary:
            input.changeSummary,
          createdBy:
            input.requestedBy,
          published:
            workflow.state ===
            'published',
        },
      );
  }

  restoreVersion(
    workflowId: string,
    version: number,
  ): WorkflowDefinition {
    this.requireWorkflow(
      workflowId,
    );

    const restored =
      this.versioning
        .restoreVersion(
          workflowId,
          version,
        );

    this.validator.assertValid(
      restored,
    );

    return this.saveWorkflow({
      ...restored,
      id:
        workflowId,
      state:
        'draft',
      updatedAt:
        new Date().toISOString(),
    });
  }

  clone(
    workflowId: string,
    input: {
      name?: string;
    } = {},
  ): WorkflowDefinition {
    const source =
      this.requireWorkflow(
        workflowId,
      );

    return this.create({
      name:
        input.name?.trim() ||
        `${source.name} Copy`,
      description:
        source.description,
      type:
        source.type,
      entryStepId:
        source.entryStepId,
      steps:
        source.steps,
      transitions:
        source.transitions,
      triggers:
        source.triggers,
      variables:
        source.variables,
      ownership:
        source.ownership,
      tags:
        source.tags.tags,
      labels:
        source.tags.labels,
    });
  }

  delete(
    workflowId: string,
    force = false,
  ): boolean {
    const workflow =
      this.requireWorkflow(
        workflowId,
      );

    if (
      !force &&
      ![
        'draft',
        'archived',
        'deprecated',
      ].includes(
        workflow.state,
      )
    ) {
      throw new Error(
        `Workflow ${workflowId} must be draft, archived, or deprecated before deletion.`,
      );
    }

    this.versioning
      .deleteVersions(
        workflowId,
      );

    return this.workflows.delete(
      workflowId,
    );
  }

  clear(): void {
    this.workflows.clear();
    this.versioning.clear();
  }

  private saveWorkflow(
    workflow:
      WorkflowDefinition,
  ): WorkflowDefinition {
    const snapshot =
      new WorkflowDefinitionModel(
        workflow,
      ).toContract();

    this.workflows.set(
      workflow.id,
      snapshot,
    );

    return this.cloneWorkflow(
      snapshot,
    );
  }

  private requireWorkflow(
    workflowId: string,
  ): WorkflowDefinition {
    const workflow =
      this.workflows.get(
        workflowId,
      );

    if (!workflow) {
      throw new Error(
        `Workflow ${workflowId} was not found.`,
      );
    }

    return this.cloneWorkflow(
      workflow,
    );
  }

  private sanitizeStep(
    step:
      WorkflowDefinition[
        'steps'
      ][number],
  ) {
    return cloneWorkflowStep({
      ...step,
      name:
        this.requireText(
          step.name,
          'step.name',
        ),
      description:
        this.normalizeText(
          step.description,
        ),
      input:
        this.sanitizeRecord(
          step.input,
        ),
    });
  }

  private sanitizeVariable(
    variable:
      WorkflowDefinition[
        'variables'
      ][number],
  ) {
    return cloneWorkflowVariable({
      ...variable,
      name:
        this.requireText(
          variable.name,
          'variable.name',
        ),
      value:
        variable.secret
          ? '[REDACTED]'
          : typeof variable.value ===
            'string'
            ? this.sanitizeText(
                variable.value,
              )
            : variable.value,
    });
  }

  private sanitizeRecord(
    input:
      Readonly<
        Record<string, unknown>
      >,
  ):
    Readonly<Record<string, unknown>> {
    const output:
      Record<string, unknown> =
        {};

    const sensitive =
      /password|secret|token|authorization|api[-_]?key|database[-_]?url/i;

    for (
      const [key, value]
      of Object.entries(input)
    ) {
      if (
        sensitive.test(key)
      ) {
        output[key] =
          '[REDACTED]';
      } else if (
        typeof value ===
        'string'
      ) {
        output[key] =
          this.sanitizeText(
            value,
          );
      } else {
        output[key] =
          value;
      }
    }

    return output;
  }

  private sanitizeText(
    value: string,
  ): string {
    return value
      .replace(
        /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"']+/gi,
        '[REDACTED_CONNECTION_STRING]',
      )
      .replace(
        /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
        'Bearer [REDACTED]',
      )
      .replace(
        /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[^\s,;]+/gi,
        '$1=[REDACTED]',
      );
  }

  private normalizeTags(
    tags?:
      readonly string[],
  ): readonly string[] {
    return [
      ...new Set(
        (tags ?? [])
          .map(
            (tag) =>
              tag
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ].sort();
  }

  private normalizeLabels(
    labels?:
      Readonly<
        Record<string, string>
      >,
  ):
    Readonly<Record<string, string>> {
    const output:
      Record<string, string> =
        {};

    for (
      const [key, value]
      of Object.entries(
        labels ?? {},
      )
    ) {
      const normalizedKey =
        key.trim();

      const normalizedValue =
        value.trim();

      if (
        normalizedKey &&
        normalizedValue
      ) {
        output[normalizedKey] =
          normalizedValue;
      }
    }

    return output;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value?.trim();

    if (!normalized) {
      throw new Error(
        `Workflow ${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private normalizeText(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized
      ? this.sanitizeText(
          normalized,
        )
      : undefined;
  }

  private normalizeIdentifier(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }

  private cloneWorkflow(
    workflow:
      WorkflowDefinition,
  ): WorkflowDefinition {
    return new WorkflowDefinitionModel(
      workflow,
    ).toContract();
  }
}