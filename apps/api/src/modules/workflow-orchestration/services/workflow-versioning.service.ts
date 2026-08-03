import {
  Injectable,
} from '@nestjs/common';

import {
  WorkflowDefinitionModel,
  type WorkflowDefinition,
  type WorkflowVersion,
} from '../models';

@Injectable()
export class WorkflowVersioningService {
  private readonly versions =
    new Map<
      string,
      WorkflowVersion[]
    >();

  createVersion(
    workflow:
      WorkflowDefinition,
    input: {
      changeSummary?: string;
      createdBy?: string;
      published?: boolean;
    } = {},
  ): WorkflowVersion {
    const currentVersions =
      this.versions.get(
        workflow.id,
      ) ?? [];

    const nextVersion =
      currentVersions.length > 0
        ? Math.max(
            ...currentVersions.map(
              (item) =>
                item.version,
            ),
          ) + 1
        : workflow.version;

    const now =
      new Date().toISOString();

    const definition =
      new WorkflowDefinitionModel({
        ...workflow,
        version:
          nextVersion,
        updatedAt: now,
      }).toContract();

    const version:
      WorkflowVersion = {
        workflowId:
          workflow.id,
        version:
          nextVersion,
        definition,
        changeSummary:
          this.normalizeText(
            input.changeSummary,
          ),
        createdBy:
          this.normalizeIdentifier(
            input.createdBy,
          ),
        createdAt: now,
        published:
          input.published ??
          false,
      };

    this.versions.set(
      workflow.id,
      [
        ...currentVersions,
        this.cloneVersion(
          version,
        ),
      ],
    );

    return this.cloneVersion(
      version,
    );
  }

  getVersion(
    workflowId: string,
    version: number,
  ): WorkflowVersion | undefined {
    const result =
      this.versions
        .get(workflowId)
        ?.find(
          (item) =>
            item.version ===
            version,
        );

    return result
      ? this.cloneVersion(
          result,
        )
      : undefined;
  }

  getLatestVersion(
    workflowId: string,
  ): WorkflowVersion | undefined {
    const versions =
      this.versions.get(
        workflowId,
      );

    if (
      !versions ||
      versions.length === 0
    ) {
      return undefined;
    }

    const latest =
      [...versions].sort(
        (left, right) =>
          right.version -
          left.version,
      )[0];

    return latest
      ? this.cloneVersion(
          latest,
        )
      : undefined;
  }

  listVersions(
    workflowId: string,
  ): readonly WorkflowVersion[] {
    return [
      ...(
        this.versions.get(
          workflowId,
        ) ?? []
      ),
    ]
      .sort(
        (left, right) =>
          right.version -
          left.version,
      )
      .map(
        (version) =>
          this.cloneVersion(
            version,
          ),
      );
  }

  markPublished(
    workflowId: string,
    version: number,
  ): WorkflowVersion {
    const versions =
      this.versions.get(
        workflowId,
      );

    if (!versions) {
      throw new Error(
        `Workflow ${workflowId} has no versions.`,
      );
    }

    const index =
      versions.findIndex(
        (item) =>
          item.version ===
          version,
      );

    if (index < 0) {
      throw new Error(
        `Workflow ${workflowId} version ${version} was not found.`,
      );
    }

    const updated =
      versions.map(
        (item, itemIndex) => ({
          ...item,
          published:
            itemIndex === index,
        }),
      );

    this.versions.set(
      workflowId,
      updated,
    );

    return this.cloneVersion(
      updated[index]!,
    );
  }

  restoreVersion(
    workflowId: string,
    version: number,
  ): WorkflowDefinition {
    const snapshot =
      this.getVersion(
        workflowId,
        version,
      );

    if (!snapshot) {
      throw new Error(
        `Workflow ${workflowId} version ${version} was not found.`,
      );
    }

    const now =
      new Date().toISOString();

    return new WorkflowDefinitionModel({
      ...snapshot.definition,
      state: 'draft',
      updatedAt: now,
      publishedAt:
        undefined,
    }).toContract();
  }

  deleteVersions(
    workflowId: string,
  ): boolean {
    return this.versions.delete(
      workflowId,
    );
  }

  clear(): void {
    this.versions.clear();
  }

  private cloneVersion(
    version:
      WorkflowVersion,
  ): WorkflowVersion {
    return {
      ...version,
      definition:
        new WorkflowDefinitionModel(
          version.definition,
        ).toContract(),
    };
  }

  private normalizeText(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }

  private normalizeIdentifier(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }
}