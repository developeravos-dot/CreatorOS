import {
  Injectable,
} from '@nestjs/common';

import {
  cloneWorkflowContext,
  cloneWorkflowVariable,
  type WorkflowContext,
  type WorkflowCorrelation,
  type WorkflowVariable,
} from '../models';

@Injectable()
export class WorkflowContextService {
  create(
    input: {
      variables?:
        readonly WorkflowVariable[];
      input?:
        Readonly<Record<string, unknown>>;
      output?:
        Readonly<Record<string, unknown>>;
      metadata?:
        Readonly<Record<string, unknown>>;
      correlation?:
        WorkflowCorrelation;
    } = {},
  ): WorkflowContext {
    const variables:
      Record<string, WorkflowVariable> =
        {};

    for (
      const variable
      of input.variables ?? []
    ) {
      const normalized =
        this.normalizeVariable(
          variable,
        );

      if (
        Object.prototype.hasOwnProperty.call(
          variables,
          normalized.name,
        )
      ) {
        throw new Error(
          `Workflow variable ${normalized.name} already exists.`,
        );
      }

      variables[
        normalized.name
      ] = normalized;
    }

    return cloneWorkflowContext({
      variables,
      input:
        this.sanitizeRecord(
          input.input ?? {},
        ),
      output:
        this.sanitizeRecord(
          input.output ?? {},
        ),
      metadata:
        this.sanitizeRecord(
          input.metadata ?? {},
        ),
      correlation: {
        ...input.correlation,
      },
    });
  }

  getVariable(
    context:
      WorkflowContext,
    name: string,
  ): WorkflowVariable | undefined {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      return undefined;
    }

    const variable =
      context.variables[
        normalizedName
      ];

    return variable
      ? cloneWorkflowVariable(
          variable,
        )
      : undefined;
  }

  requireVariable(
    context:
      WorkflowContext,
    name: string,
  ): WorkflowVariable {
    const variable =
      this.getVariable(
        context,
        name,
      );

    if (!variable) {
      throw new Error(
        `Workflow variable ${name} was not found.`,
      );
    }

    return variable;
  }

  setVariable(
    context:
      WorkflowContext,
    variable:
      WorkflowVariable,
  ): WorkflowContext {
    const normalized =
      this.normalizeVariable(
        variable,
      );

    const existing =
      context.variables[
        normalized.name
      ];

    if (
      existing &&
      !existing.mutable
    ) {
      throw new Error(
        `Workflow variable ${normalized.name} is immutable.`,
      );
    }

    return cloneWorkflowContext({
      ...context,
      variables: {
        ...context.variables,
        [normalized.name]:
          normalized,
      },
    });
  }

  setVariables(
    context:
      WorkflowContext,
    variables:
      readonly WorkflowVariable[],
  ): WorkflowContext {
    let updated =
      cloneWorkflowContext(
        context,
      );

    for (
      const variable
      of variables
    ) {
      updated =
        this.setVariable(
          updated,
          variable,
        );
    }

    return updated;
  }

  deleteVariable(
    context:
      WorkflowContext,
    name: string,
  ): WorkflowContext {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      return cloneWorkflowContext(
        context,
      );
    }

    const existing =
      context.variables[
        normalizedName
      ];

    if (!existing) {
      return cloneWorkflowContext(
        context,
      );
    }

    if (!existing.mutable) {
      throw new Error(
        `Workflow variable ${normalizedName} is immutable.`,
      );
    }

    const variables = {
      ...context.variables,
    };

    delete variables[
      normalizedName
    ];

    return cloneWorkflowContext({
      ...context,
      variables,
    });
  }

  mergeInput(
    context:
      WorkflowContext,
    input:
      Readonly<Record<string, unknown>>,
  ): WorkflowContext {
    return cloneWorkflowContext({
      ...context,
      input: {
        ...context.input,
        ...this.sanitizeRecord(
          input,
        ),
      },
    });
  }

  mergeOutput(
    context:
      WorkflowContext,
    output:
      Readonly<Record<string, unknown>>,
  ): WorkflowContext {
    return cloneWorkflowContext({
      ...context,
      output: {
        ...context.output,
        ...this.sanitizeRecord(
          output,
        ),
      },
    });
  }

  mergeMetadata(
    context:
      WorkflowContext,
    metadata:
      Readonly<Record<string, unknown>>,
  ): WorkflowContext {
    return cloneWorkflowContext({
      ...context,
      metadata: {
        ...context.metadata,
        ...this.sanitizeRecord(
          metadata,
        ),
      },
    });
  }

  updateCorrelation(
    context:
      WorkflowContext,
    correlation:
      WorkflowCorrelation,
  ): WorkflowContext {
    return cloneWorkflowContext({
      ...context,
      correlation: {
        ...context.correlation,
        ...correlation,
      },
    });
  }

  resolve(
    context:
      WorkflowContext,
    expression: string,
  ): unknown {
    const normalized =
      expression
        .trim()
        .replace(
          /^\$\{\s*/,
          '',
        )
        .replace(
          /\s*\}$/,
          '',
        );

    if (!normalized) {
      return undefined;
    }

    const path =
      normalized
        .split('.')
        .map(
          (segment) =>
            segment.trim(),
        )
        .filter(Boolean);

    let current:
      unknown = context;

    for (
      const segment
      of path
    ) {
      if (
        current === null ||
        typeof current !==
          'object'
      ) {
        return undefined;
      }

      current =
        (
          current as
            Readonly<
              Record<
                string,
                unknown
              >
            >
        )[segment];
    }

    if (
      current !== null &&
      typeof current ===
        'object' &&
      'value' in current &&
      'type' in current &&
      'mutable' in current &&
      'secret' in current
    ) {
      return (
        current as
          WorkflowVariable
      ).value;
    }

    return current;
  }

  hasVariable(
    context:
      WorkflowContext,
    name: string,
  ): boolean {
    const normalizedName =
      name.trim();

    return Boolean(
      normalizedName &&
      Object.prototype
        .hasOwnProperty.call(
          context.variables,
          normalizedName,
        ),
    );
  }

  listVariables(
    context:
      WorkflowContext,
  ): readonly WorkflowVariable[] {
    return Object.values(
      context.variables,
    )
      .sort(
        (left, right) =>
          left.name.localeCompare(
            right.name,
          ),
      )
      .map(
        (variable) =>
          cloneWorkflowVariable(
            variable,
          ),
      );
  }

  snapshot(
    context:
      WorkflowContext,
  ): WorkflowContext {
    return cloneWorkflowContext(
      context,
    );
  }

  private normalizeVariable(
    variable:
      WorkflowVariable,
  ): WorkflowVariable {
    const name =
      variable.name.trim();

    if (!name) {
      throw new Error(
        'Workflow variable name is required.',
      );
    }

    return cloneWorkflowVariable({
      ...variable,
      name,
      description:
        variable.description
          ?.trim() ||
        undefined,
      value:
        variable.secret
          ? '[REDACTED]'
          : this.sanitizeValue(
              variable.value,
            ),
    });
  }

  private sanitizeValue(
    value: unknown,
  ): unknown {
    if (
      typeof value ===
      'string'
    ) {
      return this.sanitizeText(
        value,
      );
    }

    if (Array.isArray(value)) {
      return value.map(
        (item) =>
          this.sanitizeValue(
            item,
          ),
      );
    }

    if (
      value !== null &&
      typeof value ===
        'object'
    ) {
      return this.sanitizeRecord(
        value as
          Readonly<
            Record<
              string,
              unknown
            >
          >,
      );
    }

    return value;
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

    const sensitiveKey =
      /password|secret|token|authorization|api[-_]?key|database[-_]?url|private[-_]?key/i;

    for (
      const [key, value]
      of Object.entries(input)
    ) {
      if (
        sensitiveKey.test(key)
      ) {
        output[key] =
          '[REDACTED]';

        continue;
      }

      output[key] =
        this.sanitizeValue(
          value,
        );
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
        /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY)\s*[:=]\s*[^\s,;]+/gi,
        '$1=[REDACTED]',
      );
  }
}