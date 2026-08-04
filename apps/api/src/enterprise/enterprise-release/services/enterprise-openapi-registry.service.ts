import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseApiOperation {
  readonly operationId: string;
  readonly method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';
  readonly path: string;
  readonly summary: string;
  readonly tags:
    readonly string[];
}

@Injectable()
export class EnterpriseOpenApiRegistryService {
  private readonly operations =
    new Map<
      string,
      EnterpriseApiOperation
    >();

  register(
    operation:
      EnterpriseApiOperation,
  ): EnterpriseApiOperation {
    const operationId =
      operation.operationId.trim();

    if (
      !operationId ||
      !operation.path.trim() ||
      !operation.summary.trim() ||
      this.operations.has(
        operationId,
      )
    ) {
      throw new Error(
        'Valid unique API operation is required.',
      );
    }

    const normalized = {
      ...operation,
      operationId,
      path:
        operation.path.trim(),
      summary:
        operation.summary.trim(),
      tags: [
        ...new Set(
          operation.tags
            .map((tag) =>
              tag.trim(),
            )
            .filter(Boolean),
        ),
      ],
    };

    this.operations.set(
      operationId,
      normalized,
    );

    return this.clone(
      normalized,
    );
  }

  document() {
    const operations =
      [...this.operations.values()]
        .sort(
          (left, right) =>
            left.path.localeCompare(
              right.path,
            ) ||
            left.method.localeCompare(
              right.method,
            ),
        )
        .map((operation) =>
          this.clone(operation),
        );

    return {
      openapi: '3.1.0',
      info: {
        title:
          'CreatorOS Enterprise API',
        version: '1.0.0',
      },
      operations,
    };
  }

  private clone(
    operation:
      EnterpriseApiOperation,
  ): EnterpriseApiOperation {
    return {
      ...operation,
      tags: [
        ...operation.tags,
      ],
    };
  }
}
