import { randomUUID } from 'node:crypto';

export type BlueprintStatus =
  | 'draft'
  | 'validated'
  | 'approved'
  | 'active'
  | 'superseded'
  | 'archived';

export type BlueprintType =
  | 'platform'
  | 'domain'
  | 'capability'
  | 'system'
  | 'project'
  | 'product'
  | 'workflow'
  | 'custom';

export type BlueprintComponentType =
  | 'domain'
  | 'capability'
  | 'engine'
  | 'agent'
  | 'service'
  | 'api'
  | 'event'
  | 'data'
  | 'workflow'
  | 'ui'
  | 'security'
  | 'integration'
  | 'custom';

export type GovernanceRuleType =
  | 'foundation-first'
  | 'capability-first'
  | 'blueprint-driven'
  | 'human-final-authority'
  | 'approval-required'
  | 'security-gate'
  | 'custom';

export interface BlueprintComponent {
  id: string;
  key: string;
  name: string;
  type: BlueprintComponentType;
  description?: string;
  required: boolean;
  configuration: Record<string, unknown>;
}

export interface BlueprintSection {
  id: string;
  key: string;
  name: string;
  description?: string;
  order: number;
  components: BlueprintComponent[];
}

export interface BlueprintCapabilityMapping {
  id: string;
  capabilityKey: string;
  required: boolean;
  minimumVersion?: string;
  purpose?: string;
}

export interface BlueprintDependencyMapping {
  id: string;
  sourceKey: string;
  targetKey: string;
  type: 'requires' | 'uses' | 'extends' | 'produces' | 'consumes';
  required: boolean;
}

export interface BlueprintGovernanceRule {
  id: string;
  type: GovernanceRuleType;
  name: string;
  description?: string;
  enabled: boolean;
  blocking: boolean;
  configuration: Record<string, unknown>;
}

export interface BlueprintApprovalGate {
  id: string;
  name: string;
  authority: string;
  requiredStatus: BlueprintStatus;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface BlueprintDocument {
  id: string;
  key: string;
  name: string;
  description?: string;
  type: BlueprintType;
  status: BlueprintStatus;
  version: number;
  parentBlueprintId?: string;
  sections: BlueprintSection[];
  capabilityMappings: BlueprintCapabilityMapping[];
  dependencyMappings: BlueprintDependencyMapping[];
  governanceRules: BlueprintGovernanceRule[];
  approvalGates: BlueprintApprovalGate[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  approvedAt?: string;
  activatedAt?: string;
  archivedAt?: string;
}

export interface BlueprintVersion {
  id: string;
  blueprintId: string;
  version: number;
  snapshot: BlueprintDocument;
  changeSummary: string;
  createdAt: string;
}

export interface BlueprintValidationIssue {
  code: string;
  severity: 'error' | 'warning';
  message: string;
  path?: string;
}

export interface BlueprintValidationResult {
  blueprintId: string;
  valid: boolean;
  errors: number;
  warnings: number;
  issues: BlueprintValidationIssue[];
  validatedAt: string;
}

export interface BlueprintExecutionStep {
  id: string;
  order: number;
  name: string;
  componentKey: string;
  componentType: BlueprintComponentType;
  capabilityKeys: string[];
  dependencies: string[];
  requiresHumanApproval: boolean;
  status: 'planned';
}

export interface BlueprintExecutionPlan {
  id: string;
  blueprintId: string;
  blueprintVersion: number;
  status: 'generated';
  steps: BlueprintExecutionStep[];
  generatedAt: string;
}

export interface BlueprintDiff {
  blueprintId: string;
  fromVersion: number;
  toVersion: number;
  addedSections: string[];
  removedSections: string[];
  addedComponents: string[];
  removedComponents: string[];
  changedStatus: boolean;
  generatedAt: string;
}

export interface CreateBlueprintComponentInput {
  key: string;
  name: string;
  type: BlueprintComponentType;
  description?: string;
  required?: boolean;
  configuration?: Record<string, unknown>;
}

export interface CreateBlueprintSectionInput {
  key: string;
  name: string;
  description?: string;
  order?: number;
  components?: CreateBlueprintComponentInput[];
}

export interface CreateBlueprintInput {
  key: string;
  name: string;
  description?: string;
  type: BlueprintType;
  parentBlueprintId?: string;
  sections?: CreateBlueprintSectionInput[];
  capabilityMappings?: Array<{
    capabilityKey: string;
    required?: boolean;
    minimumVersion?: string;
    purpose?: string;
  }>;
  dependencyMappings?: Array<{
    sourceKey: string;
    targetKey: string;
    type: 'requires' | 'uses' | 'extends' | 'produces' | 'consumes';
    required?: boolean;
  }>;
  governanceRules?: Array<{
    type: GovernanceRuleType;
    name: string;
    description?: string;
    enabled?: boolean;
    blocking?: boolean;
    configuration?: Record<string, unknown>;
  }>;
  approvalGates?: Array<{
    name: string;
    authority: string;
    requiredStatus?: BlueprintStatus;
  }>;
  metadata?: Record<string, unknown>;
}

export interface UpdateBlueprintInput {
  name?: string;
  description?: string;
  sections?: CreateBlueprintSectionInput[];
  capabilityMappings?: CreateBlueprintInput['capabilityMappings'];
  dependencyMappings?: CreateBlueprintInput['dependencyMappings'];
  governanceRules?: CreateBlueprintInput['governanceRules'];
  approvalGates?: CreateBlueprintInput['approvalGates'];
  metadata?: Record<string, unknown>;
  changeSummary: string;
}

export interface ApproveBlueprintInput {
  gateId: string;
  approvedBy: string;
  notes?: string;
}

export class BlueprintNotFoundError extends Error {
  constructor(blueprintId: string) {
    super(`Blueprint ${blueprintId} was not found`);
    this.name = 'BlueprintNotFoundError';
  }
}

export class BlueprintValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlueprintValidationError';
  }
}

export class BlueprintLifecycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlueprintLifecycleError';
  }
}

export class InMemoryBlueprintEngine {
  private readonly blueprints =
    new Map<string, BlueprintDocument>();

  private readonly blueprintIdsByKey =
    new Map<string, string>();

  private readonly versions =
    new Map<string, BlueprintVersion[]>();

  private readonly executionPlans =
    new Map<string, BlueprintExecutionPlan>();

  createBlueprint(
    input: CreateBlueprintInput,
  ): BlueprintDocument {
    const key = input.key.trim().toLowerCase();
    const name = input.name.trim();

    if (!key) {
      throw new BlueprintValidationError(
        'Blueprint key is required',
      );
    }

    if (!name) {
      throw new BlueprintValidationError(
        'Blueprint name is required',
      );
    }

    if (this.blueprintIdsByKey.has(key)) {
      throw new BlueprintValidationError(
        `Blueprint key ${key} already exists`,
      );
    }

    if (
      input.parentBlueprintId &&
      !this.blueprints.has(input.parentBlueprintId)
    ) {
      throw new BlueprintValidationError(
        `Parent blueprint ${input.parentBlueprintId} was not found`,
      );
    }

    const timestamp = new Date().toISOString();

    const blueprint: BlueprintDocument = {
      id: randomUUID(),
      key,
      name,
      type: input.type,
      status: 'draft',
      version: 1,
      sections: this.mapSections(input.sections ?? []),
      capabilityMappings: this.mapCapabilities(
        input.capabilityMappings ?? [],
      ),
      dependencyMappings: this.mapDependencies(
        input.dependencyMappings ?? [],
      ),
      governanceRules: this.mapGovernanceRules(
        input.governanceRules ?? [],
      ),
      approvalGates: this.mapApprovalGates(
        input.approvalGates ?? [],
      ),
      metadata: input.metadata ?? {},
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (input.description !== undefined) {
      blueprint.description = input.description;
    }

    if (input.parentBlueprintId !== undefined) {
      blueprint.parentBlueprintId =
        input.parentBlueprintId;
    }

    this.blueprints.set(
      blueprint.id,
      blueprint,
    );

    this.blueprintIdsByKey.set(
      blueprint.key,
      blueprint.id,
    );

    this.saveVersion(
      blueprint,
      'Initial blueprint creation',
    );

    return blueprint;
  }

  updateBlueprint(
    blueprintId: string,
    input: UpdateBlueprintInput,
  ): BlueprintDocument {
    const blueprint =
      this.requireBlueprint(blueprintId);

    if (
      blueprint.status === 'active' ||
      blueprint.status === 'archived'
    ) {
      throw new BlueprintLifecycleError(
        `Blueprint ${blueprint.key} cannot be edited while ${blueprint.status}`,
      );
    }

    if (input.name !== undefined) {
      blueprint.name = input.name.trim();
    }

    if (input.description !== undefined) {
      blueprint.description = input.description;
    }

    if (input.sections !== undefined) {
      blueprint.sections =
        this.mapSections(input.sections);
    }

    if (input.capabilityMappings !== undefined) {
      blueprint.capabilityMappings =
        this.mapCapabilities(
          input.capabilityMappings,
        );
    }

    if (input.dependencyMappings !== undefined) {
      blueprint.dependencyMappings =
        this.mapDependencies(
          input.dependencyMappings,
        );
    }

    if (input.governanceRules !== undefined) {
      blueprint.governanceRules =
        this.mapGovernanceRules(
          input.governanceRules,
        );
    }

    if (input.approvalGates !== undefined) {
      blueprint.approvalGates =
        this.mapApprovalGates(
          input.approvalGates,
        );
    }

    if (input.metadata !== undefined) {
      blueprint.metadata = {
        ...blueprint.metadata,
        ...input.metadata,
      };
    }

    blueprint.status = 'draft';
    blueprint.version += 1;
    blueprint.updatedAt =
      new Date().toISOString();

    delete blueprint.validatedAt;
    delete blueprint.approvedAt;

    this.saveVersion(
      blueprint,
      input.changeSummary,
    );

    return blueprint;
  }

  getBlueprints(): BlueprintDocument[] {
    return Array.from(this.blueprints.values());
  }

  getBlueprintById(
    blueprintId: string,
  ): BlueprintDocument | undefined {
    return this.blueprints.get(blueprintId);
  }

  getBlueprintByKey(
    blueprintKey: string,
  ): BlueprintDocument | undefined {
    const blueprintId =
      this.blueprintIdsByKey.get(
        blueprintKey.trim().toLowerCase(),
      );

    if (!blueprintId) {
      return undefined;
    }

    return this.blueprints.get(blueprintId);
  }

  validateBlueprint(
    blueprintId: string,
  ): BlueprintValidationResult {
    const blueprint =
      this.requireBlueprint(blueprintId);

    if (
      blueprint.status === 'archived'
    ) {
      throw new BlueprintLifecycleError(
        'Archived blueprints cannot be validated',
      );
    }

    const issues: BlueprintValidationIssue[] = [];

    if (blueprint.sections.length === 0) {
      issues.push({
        code: 'BLUEPRINT_NO_SECTIONS',
        severity: 'error',
        message:
          'Blueprint must contain at least one section',
        path: 'sections',
      });
    }

    const sectionKeys =
      blueprint.sections.map(
        (section) => section.key,
      );

    if (
      new Set(sectionKeys).size !==
      sectionKeys.length
    ) {
      issues.push({
        code: 'DUPLICATE_SECTION_KEYS',
        severity: 'error',
        message:
          'Blueprint section keys must be unique',
        path: 'sections',
      });
    }

    const components =
      blueprint.sections.flatMap(
        (section) => section.components,
      );

    const componentKeys =
      components.map(
        (component) => component.key,
      );

    if (
      new Set(componentKeys).size !==
      componentKeys.length
    ) {
      issues.push({
        code: 'DUPLICATE_COMPONENT_KEYS',
        severity: 'error',
        message:
          'Blueprint component keys must be unique',
        path: 'sections.components',
      });
    }

    for (
      const dependency
      of blueprint.dependencyMappings
    ) {
      if (
        dependency.sourceKey ===
        dependency.targetKey
      ) {
        issues.push({
          code: 'SELF_DEPENDENCY',
          severity: 'error',
          message:
            `Component ${dependency.sourceKey} cannot depend on itself`,
          path: 'dependencyMappings',
        });
      }

      if (
        dependency.required &&
        !componentKeys.includes(
          dependency.sourceKey,
        )
      ) {
        issues.push({
          code: 'DEPENDENCY_SOURCE_MISSING',
          severity: 'error',
          message:
            `Dependency source ${dependency.sourceKey} is not defined`,
          path: 'dependencyMappings',
        });
      }
    }

    const hasFoundationFirst =
      blueprint.governanceRules.some(
        (rule) =>
          rule.enabled &&
          rule.type === 'foundation-first',
      );

    const hasCapabilityFirst =
      blueprint.governanceRules.some(
        (rule) =>
          rule.enabled &&
          rule.type === 'capability-first',
      );

    const hasBlueprintDriven =
      blueprint.governanceRules.some(
        (rule) =>
          rule.enabled &&
          rule.type === 'blueprint-driven',
      );

    const hasHumanAuthority =
      blueprint.governanceRules.some(
        (rule) =>
          rule.enabled &&
          rule.type === 'human-final-authority',
      );

    if (!hasFoundationFirst) {
      issues.push({
        code: 'FOUNDATION_FIRST_MISSING',
        severity: 'warning',
        message:
          'Foundation First governance rule is not enabled',
        path: 'governanceRules',
      });
    }

    if (!hasCapabilityFirst) {
      issues.push({
        code: 'CAPABILITY_FIRST_MISSING',
        severity: 'warning',
        message:
          'Capability First governance rule is not enabled',
        path: 'governanceRules',
      });
    }

    if (!hasBlueprintDriven) {
      issues.push({
        code: 'BLUEPRINT_DRIVEN_MISSING',
        severity: 'warning',
        message:
          'Blueprint Driven governance rule is not enabled',
        path: 'governanceRules',
      });
    }

    if (!hasHumanAuthority) {
      issues.push({
        code: 'HUMAN_AUTHORITY_MISSING',
        severity: 'error',
        message:
          'Human Final Authority governance rule is required',
        path: 'governanceRules',
      });
    }

    const errors =
      issues.filter(
        (issue) =>
          issue.severity === 'error',
      ).length;

    const warnings =
      issues.filter(
        (issue) =>
          issue.severity === 'warning',
      ).length;

    const validatedAt =
      new Date().toISOString();

    if (errors === 0) {
      blueprint.status = 'validated';
      blueprint.validatedAt = validatedAt;
      blueprint.updatedAt = validatedAt;
    }

    return {
      blueprintId,
      valid: errors === 0,
      errors,
      warnings,
      issues,
      validatedAt,
    };
  }

  approveGate(
    blueprintId: string,
    input: ApproveBlueprintInput,
  ): BlueprintDocument {
    const blueprint =
      this.requireBlueprint(blueprintId);

    if (
      blueprint.status !== 'validated' &&
      blueprint.status !== 'approved'
    ) {
      throw new BlueprintLifecycleError(
        'Blueprint must be validated before approval',
      );
    }

    const gate =
      blueprint.approvalGates.find(
        (item) => item.id === input.gateId,
      );

    if (!gate) {
      throw new BlueprintValidationError(
        `Approval gate ${input.gateId} was not found`,
      );
    }

    const timestamp =
      new Date().toISOString();

    gate.approved = true;
    gate.approvedBy = input.approvedBy;
    gate.approvedAt = timestamp;

    if (input.notes !== undefined) {
      gate.notes = input.notes;
    }

    const allRequiredApproved =
      blueprint.approvalGates.every(
        (item) => item.approved,
      );

    if (allRequiredApproved) {
      blueprint.status = 'approved';
      blueprint.approvedAt = timestamp;
    }

    blueprint.updatedAt = timestamp;

    return blueprint;
  }

  activateBlueprint(
    blueprintId: string,
  ): BlueprintDocument {
    const blueprint =
      this.requireBlueprint(blueprintId);

    if (blueprint.status !== 'approved') {
      throw new BlueprintLifecycleError(
        'Blueprint must be approved before activation',
      );
    }

    if (
      blueprint.approvalGates.some(
        (gate) => !gate.approved,
      )
    ) {
      throw new BlueprintLifecycleError(
        'All blueprint approval gates must be approved',
      );
    }

    const timestamp =
      new Date().toISOString();

    blueprint.status = 'active';
    blueprint.activatedAt = timestamp;
    blueprint.updatedAt = timestamp;

    return blueprint;
  }

  archiveBlueprint(
    blueprintId: string,
  ): BlueprintDocument {
    const blueprint =
      this.requireBlueprint(blueprintId);

    if (blueprint.status === 'archived') {
      throw new BlueprintLifecycleError(
        'Blueprint is already archived',
      );
    }

    const timestamp =
      new Date().toISOString();

    blueprint.status = 'archived';
    blueprint.archivedAt = timestamp;
    blueprint.updatedAt = timestamp;

    return blueprint;
  }

  generateExecutionPlan(
    blueprintId: string,
  ): BlueprintExecutionPlan {
    const blueprint =
      this.requireBlueprint(blueprintId);

    if (
      blueprint.status !== 'approved' &&
      blueprint.status !== 'active'
    ) {
      throw new BlueprintLifecycleError(
        'Blueprint must be approved before generating an execution plan',
      );
    }

    const components =
      blueprint.sections.flatMap(
        (section) => section.components,
      );

    const requiresHumanApproval =
      blueprint.governanceRules.some(
        (rule) =>
          rule.enabled &&
          (
            rule.type ===
              'human-final-authority' ||
            rule.type ===
              'approval-required'
          ),
      );

    const steps =
      components.map(
        (
          component,
          index,
        ): BlueprintExecutionStep => ({
          id: randomUUID(),
          order: index + 1,
          name:
            `Implement ${component.name}`,
          componentKey:
            component.key,
          componentType:
            component.type,
          capabilityKeys:
            blueprint.capabilityMappings
              .filter(
                (mapping) =>
                  mapping.required,
              )
              .map(
                (mapping) =>
                  mapping.capabilityKey,
              ),
          dependencies:
            blueprint.dependencyMappings
              .filter(
                (dependency) =>
                  dependency.sourceKey ===
                  component.key,
              )
              .map(
                (dependency) =>
                  dependency.targetKey,
              ),
          requiresHumanApproval,
          status: 'planned',
        }),
      );

    const executionPlan: BlueprintExecutionPlan = {
      id: randomUUID(),
      blueprintId:
        blueprint.id,
      blueprintVersion:
        blueprint.version,
      status: 'generated',
      steps,
      generatedAt:
        new Date().toISOString(),
    };

    this.executionPlans.set(
      executionPlan.id,
      executionPlan,
    );

    return executionPlan;
  }

  getExecutionPlans(
    blueprintId?: string,
  ): BlueprintExecutionPlan[] {
    const plans =
      Array.from(
        this.executionPlans.values(),
      );

    if (!blueprintId) {
      return plans;
    }

    return plans.filter(
      (plan) =>
        plan.blueprintId === blueprintId,
    );
  }

  getVersions(
    blueprintId: string,
  ): BlueprintVersion[] {
    this.requireBlueprint(blueprintId);

    return [
      ...(this.versions.get(
        blueprintId,
      ) ?? []),
    ];
  }

  getDiff(
    blueprintId: string,
    fromVersion: number,
    toVersion: number,
  ): BlueprintDiff {
    const versions =
      this.getVersions(blueprintId);

    const from =
      versions.find(
        (version) =>
          version.version ===
          fromVersion,
      );

    const to =
      versions.find(
        (version) =>
          version.version ===
          toVersion,
      );

    if (!from || !to) {
      throw new BlueprintValidationError(
        'Requested blueprint versions were not found',
      );
    }

    const fromSections =
      new Set(
        from.snapshot.sections.map(
          (section) => section.key,
        ),
      );

    const toSections =
      new Set(
        to.snapshot.sections.map(
          (section) => section.key,
        ),
      );

    const fromComponents =
      new Set(
        from.snapshot.sections.flatMap(
          (section) =>
            section.components.map(
              (component) =>
                component.key,
            ),
        ),
      );

    const toComponents =
      new Set(
        to.snapshot.sections.flatMap(
          (section) =>
            section.components.map(
              (component) =>
                component.key,
            ),
        ),
      );

    return {
      blueprintId,
      fromVersion,
      toVersion,
      addedSections:
        [...toSections].filter(
          (key) =>
            !fromSections.has(key),
        ),
      removedSections:
        [...fromSections].filter(
          (key) =>
            !toSections.has(key),
        ),
      addedComponents:
        [...toComponents].filter(
          (key) =>
            !fromComponents.has(key),
        ),
      removedComponents:
        [...fromComponents].filter(
          (key) =>
            !toComponents.has(key),
        ),
      changedStatus:
        from.snapshot.status !==
        to.snapshot.status,
      generatedAt:
        new Date().toISOString(),
    };
  }

  getStatus() {
    const blueprints =
      this.getBlueprints();

    return {
      package: '@creatoros/blueprint',
      provider:
        'InMemoryBlueprintEngine',
      status: 'operational' as const,
      blueprints:
        blueprints.length,
      draft:
        blueprints.filter(
          (item) =>
            item.status === 'draft',
        ).length,
      validated:
        blueprints.filter(
          (item) =>
            item.status ===
            'validated',
        ).length,
      approved:
        blueprints.filter(
          (item) =>
            item.status === 'approved',
        ).length,
      active:
        blueprints.filter(
          (item) =>
            item.status === 'active',
        ).length,
      archived:
        blueprints.filter(
          (item) =>
            item.status === 'archived',
        ).length,
      versions:
        Array.from(
          this.versions.values(),
        ).reduce(
          (total, items) =>
            total + items.length,
          0,
        ),
      executionPlans:
        this.executionPlans.size,
    };
  }

  private requireBlueprint(
    blueprintId: string,
  ): BlueprintDocument {
    const blueprint =
      this.blueprints.get(blueprintId);

    if (!blueprint) {
      throw new BlueprintNotFoundError(
        blueprintId,
      );
    }

    return blueprint;
  }

  private mapSections(
    sections: CreateBlueprintSectionInput[],
  ): BlueprintSection[] {
    return sections
      .map(
        (
          section,
          sectionIndex,
        ): BlueprintSection => {
          const record: BlueprintSection = {
            id: randomUUID(),
            key:
              section.key
                .trim()
                .toLowerCase(),
            name: section.name.trim(),
            order:
              section.order ??
              sectionIndex + 1,
            components:
              (section.components ?? []).map(
                (
                  component,
                ): BlueprintComponent => {
                  const componentRecord:
                    BlueprintComponent = {
                      id: randomUUID(),
                      key:
                        component.key
                          .trim()
                          .toLowerCase(),
                      name:
                        component.name.trim(),
                      type:
                        component.type,
                      required:
                        component.required ??
                        true,
                      configuration:
                        component.configuration ??
                        {},
                    };

                  if (
                    component.description !==
                    undefined
                  ) {
                    componentRecord.description =
                      component.description;
                  }

                  return componentRecord;
                },
              ),
          };

          if (
            section.description !==
            undefined
          ) {
            record.description =
              section.description;
          }

          return record;
        },
      )
      .sort(
        (left, right) =>
          left.order - right.order,
      );
  }

  private mapCapabilities(
    mappings:
      NonNullable<
        CreateBlueprintInput[
          'capabilityMappings'
        ]
      >,
  ): BlueprintCapabilityMapping[] {
    return mappings.map(
      (
        mapping,
      ): BlueprintCapabilityMapping => {
        const record:
          BlueprintCapabilityMapping = {
            id: randomUUID(),
            capabilityKey:
              mapping.capabilityKey
                .trim()
                .toLowerCase(),
            required:
              mapping.required ?? true,
          };

        if (
          mapping.minimumVersion !==
          undefined
        ) {
          record.minimumVersion =
            mapping.minimumVersion;
        }

        if (
          mapping.purpose !== undefined
        ) {
          record.purpose =
            mapping.purpose;
        }

        return record;
      },
    );
  }

  private mapDependencies(
    mappings:
      NonNullable<
        CreateBlueprintInput[
          'dependencyMappings'
        ]
      >,
  ): BlueprintDependencyMapping[] {
    return mappings.map(
      (
        mapping,
      ): BlueprintDependencyMapping => ({
        id: randomUUID(),
        sourceKey:
          mapping.sourceKey
            .trim()
            .toLowerCase(),
        targetKey:
          mapping.targetKey
            .trim()
            .toLowerCase(),
        type: mapping.type,
        required:
          mapping.required ?? true,
      }),
    );
  }

  private mapGovernanceRules(
    rules:
      NonNullable<
        CreateBlueprintInput[
          'governanceRules'
        ]
      >,
  ): BlueprintGovernanceRule[] {
    return rules.map(
      (
        rule,
      ): BlueprintGovernanceRule => {
        const record:
          BlueprintGovernanceRule = {
            id: randomUUID(),
            type: rule.type,
            name: rule.name.trim(),
            enabled:
              rule.enabled ?? true,
            blocking:
              rule.blocking ?? true,
            configuration:
              rule.configuration ?? {},
          };

        if (
          rule.description !==
          undefined
        ) {
          record.description =
            rule.description;
        }

        return record;
      },
    );
  }

  private mapApprovalGates(
    gates:
      NonNullable<
        CreateBlueprintInput[
          'approvalGates'
        ]
      >,
  ): BlueprintApprovalGate[] {
    return gates.map(
      (
        gate,
      ): BlueprintApprovalGate => ({
        id: randomUUID(),
        name: gate.name.trim(),
        authority:
          gate.authority.trim(),
        requiredStatus:
          gate.requiredStatus ??
          'validated',
        approved: false,
      }),
    );
  }

  private saveVersion(
    blueprint: BlueprintDocument,
    changeSummary: string,
  ): void {
    const current =
      this.versions.get(
        blueprint.id,
      ) ?? [];

    current.push({
      id: randomUUID(),
      blueprintId:
        blueprint.id,
      version:
        blueprint.version,
      snapshot:
        structuredClone(
          blueprint,
        ),
      changeSummary,
      createdAt:
        new Date().toISOString(),
    });

    this.versions.set(
      blueprint.id,
      current,
    );
  }
}
