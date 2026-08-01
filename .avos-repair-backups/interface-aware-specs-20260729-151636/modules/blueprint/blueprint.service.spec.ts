import { BlueprintService } from './blueprint.service';

describe('BlueprintService', () => {
  let service: BlueprintService;

  beforeEach(() => {
    service = new BlueprintService();
  });

  function createValidBlueprint() {
    return service.createBlueprint({
      key:
        'avos.media.master-blueprint',
      name:
        'AVOS Media Master Blueprint',
      type: 'project',
      sections: [
        {
          key: 'foundation',
          name: 'Foundation',
          order: 1,
          components: [
            {
              key:
                'content-intelligence',
              name:
                'Content Intelligence',
              type: 'engine',
            },
            {
              key:
                'human-approval',
              name:
                'Human Approval',
              type: 'workflow',
            },
          ],
        },
      ],
      capabilityMappings: [
        {
          capabilityKey:
            'content.intelligence',
          required: true,
        },
      ],
      dependencyMappings: [
        {
          sourceKey:
            'content-intelligence',
          targetKey:
            'human-approval',
          type: 'uses',
          required: true,
        },
      ],
      governanceRules: [
        {
          type:
            'foundation-first',
          name:
            'Foundation First',
        },
        {
          type:
            'capability-first',
          name:
            'Capability First',
        },
        {
          type:
            'blueprint-driven',
          name:
            'Blueprint Driven',
        },
        {
          type:
            'human-final-authority',
          name:
            'Human Final Authority',
        },
      ],
      approvalGates: [
        {
          name:
            'Strategic Approval',
          authority:
            'Human Final Authority',
        },
      ],
    });
  }

  it('should create a blueprint', () => {
    const blueprint =
      createValidBlueprint();

    expect(blueprint.status)
      .toBe('draft');

    expect(blueprint.version)
      .toBe(1);
  });

  it('should validate a blueprint', () => {
    const blueprint =
      createValidBlueprint();

    const result =
      service.validateBlueprint(
        blueprint.id,
      );

    expect(result.valid)
      .toBe(true);

    expect(result.errors)
      .toBe(0);
  });

  it('should approve and activate a blueprint', () => {
    const blueprint =
      createValidBlueprint();

    service.validateBlueprint(
      blueprint.id,
    );

    const gateId =
      blueprint.approvalGates[0]?.id;

    expect(gateId).toBeDefined();

    service.approveGate(
      blueprint.id,
      {
        gateId: gateId as string,
        approvedBy:
          'AVOS Owner',
      },
    );

    const active =
      service.activateBlueprint(
        blueprint.id,
      );

    expect(active.status)
      .toBe('active');
  });

  it('should generate an execution plan', () => {
    const blueprint =
      createValidBlueprint();

    service.validateBlueprint(
      blueprint.id,
    );

    const gateId =
      blueprint.approvalGates[0]?.id;

    service.approveGate(
      blueprint.id,
      {
        gateId: gateId as string,
        approvedBy:
          'AVOS Owner',
      },
    );

    const plan =
      service.generateExecutionPlan(
        blueprint.id,
      );

    expect(plan.status)
      .toBe('generated');

    expect(plan.steps)
      .toHaveLength(2);
  });

  it('should create blueprint versions', () => {
    const blueprint =
      createValidBlueprint();

    service.updateBlueprint(
      blueprint.id,
      {
        name:
          'Updated AVOS Media Blueprint',
        changeSummary:
          'Updated blueprint name',
      },
    );

    const versions =
      service.getVersions(
        blueprint.id,
      );

    expect(versions.count)
      .toBe(2);
  });

  it('should report operational status', () => {
    expect(service.getStatus())
      .toEqual({
        module: 'blueprint',
        package:
          '@creatoros/blueprint',
        provider:
          'InMemoryBlueprintEngine',
        status: 'operational',
        blueprints: 0,
        draft: 0,
        validated: 0,
        approved: 0,
        active: 0,
        archived: 0,
        versions: 0,
        executionPlans: 0,
      });
  });
});
