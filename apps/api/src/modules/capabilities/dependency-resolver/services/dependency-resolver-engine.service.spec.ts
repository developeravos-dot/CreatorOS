import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  DependencyResolverEngineService,
} from './dependency-resolver-engine.service';

describe('DependencyResolverEngineService', () => {
  const factory = new CapabilityManifestFactory();

  const createManifest = (
    id: string,
    version: string,
    dependencies: Array<{
      capabilityId: string;
      versionRange: string;
      type: 'required' | 'optional' | 'peer';
    }> = [],
  ) =>
    factory.create({
      id,
      name: id,
      version,
      description:
        `Dependency resolver test manifest for ${id}.`,
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: `./${id}`,
      },
      dependencies,
      policy: createDefaultCapabilityPolicy(),
    });

  it('resolves dependencies in execution order', () => {
    const database = createManifest(
      'creatoros.capability.database',
      '1.2.0',
    );

    const api = createManifest(
      'creatoros.capability.api',
      '1.0.0',
      [
        {
          capabilityId: database.id,
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const resolver =
      new DependencyResolverEngineService();

    const result = resolver.resolve({
      rootCapabilityId: api.id,
      catalog: [
        {
          capabilityId: api.id,
          version: api.version,
          manifest: api,
        },
        {
          capabilityId: database.id,
          version: database.version,
          manifest: database,
        },
      ],
    });

    expect(result.status).toBe('resolved');
    expect(result.orderedCapabilityIds).toEqual([
      database.id,
      api.id,
    ]);
  });

  it('detects missing required dependencies', () => {
    const api = createManifest(
      'creatoros.capability.api',
      '1.0.0',
      [
        {
          capabilityId:
            'creatoros.capability.missing',
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const resolver =
      new DependencyResolverEngineService();

    const result = resolver.resolve({
      rootCapabilityId: api.id,
      catalog: [
        {
          capabilityId: api.id,
          version: api.version,
          manifest: api,
        },
      ],
    });

    expect(result.status).toBe('incompatible');
    expect(
      result.issues.some(
        (issue) =>
          issue.code === 'DEPENDENCY_MISSING',
      ),
    ).toBe(true);
  });

  it('detects incompatible dependency versions', () => {
    const database = createManifest(
      'creatoros.capability.database',
      '2.0.0',
    );

    const api = createManifest(
      'creatoros.capability.api',
      '1.0.0',
      [
        {
          capabilityId: database.id,
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const resolver =
      new DependencyResolverEngineService();

    const result = resolver.resolve({
      rootCapabilityId: api.id,
      catalog: [
        {
          capabilityId: api.id,
          version: api.version,
          manifest: api,
        },
        {
          capabilityId: database.id,
          version: database.version,
          manifest: database,
        },
      ],
    });

    expect(result.status).toBe('incompatible');
    expect(
      result.issues.some(
        (issue) =>
          issue.code ===
          'DEPENDENCY_VERSION_INCOMPATIBLE',
      ),
    ).toBe(true);
  });

  it('detects circular dependencies', () => {
    const first = createManifest(
      'creatoros.capability.first',
      '1.0.0',
      [
        {
          capabilityId:
            'creatoros.capability.second',
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const second = createManifest(
      'creatoros.capability.second',
      '1.0.0',
      [
        {
          capabilityId: first.id,
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const resolver =
      new DependencyResolverEngineService();

    const result = resolver.resolve({
      rootCapabilityId: first.id,
      catalog: [
        {
          capabilityId: first.id,
          version: first.version,
          manifest: first,
        },
        {
          capabilityId: second.id,
          version: second.version,
          manifest: second,
        },
      ],
    });

    expect(result.status).toBe('circular');
    expect(
      result.issues.some(
        (issue) =>
          issue.code === 'DEPENDENCY_CIRCULAR',
      ),
    ).toBe(true);
  });

  it('creates executable resolution plans', () => {
    const dependency = createManifest(
      'creatoros.capability.dependency',
      '1.0.0',
    );

    const root = createManifest(
      'creatoros.capability.root',
      '1.0.0',
      [
        {
          capabilityId: dependency.id,
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const resolver =
      new DependencyResolverEngineService();

    const plan = resolver.createPlan({
      rootCapabilityId: root.id,
      catalog: [
        {
          capabilityId: root.id,
          version: root.version,
          manifest: root,
        },
        {
          capabilityId: dependency.id,
          version: dependency.version,
          manifest: dependency,
        },
      ],
    });

    expect(plan.executable).toBe(true);
    expect(plan.steps).toHaveLength(8);
    expect(plan.orderedCapabilityIds[0]).toBe(
      dependency.id,
    );
  });
});