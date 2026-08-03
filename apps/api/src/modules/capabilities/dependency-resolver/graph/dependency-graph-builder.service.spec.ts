import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  DependencyGraphBuilderService,
} from './dependency-graph-builder.service';

describe('DependencyGraphBuilderService', () => {
  const manifestFactory =
    new CapabilityManifestFactory();

  const createManifest = (
    id: string,
    dependencies: Array<{
      capabilityId: string;
      versionRange: string;
      type: 'required' | 'optional' | 'peer';
    }> = [],
  ) =>
    manifestFactory.create({
      id,
      name: id,
      version: '1.0.0',
      description:
        `Dependency graph test manifest for ${id}.`,
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

  it('builds graph nodes and required dependency edges', () => {
    const root = createManifest(
      'creatoros.capability.root',
      [
        {
          capabilityId:
            'creatoros.capability.database',
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
    );

    const database = createManifest(
      'creatoros.capability.database',
    );

    const builder =
      new DependencyGraphBuilderService();

    const graph = builder.build({
      rootCapabilityId: root.id,
      catalog: [
        {
          capabilityId: root.id,
          version: root.version,
          manifest: root,
        },
        {
          capabilityId: database.id,
          version: database.version,
          manifest: database,
        },
      ],
    });

    expect(graph.getNodes()).toHaveLength(2);
    expect(graph.getEdges()).toHaveLength(1);

    expect(
      graph.getDependencies(root.id)[0]?.capabilityId,
    ).toBe(database.id);

    expect(
      graph.getDependents(database.id)[0]?.capabilityId,
    ).toBe(root.id);
  });

  it('excludes optional dependencies by default', () => {
    const root = createManifest(
      'creatoros.capability.root',
      [
        {
          capabilityId:
            'creatoros.capability.optional',
          versionRange: '^1.0.0',
          type: 'optional',
        },
      ],
    );

    const optional = createManifest(
      'creatoros.capability.optional',
    );

    const builder =
      new DependencyGraphBuilderService();

    const graph = builder.build({
      rootCapabilityId: root.id,
      catalog: [
        {
          capabilityId: root.id,
          version: root.version,
          manifest: root,
        },
        {
          capabilityId: optional.id,
          version: optional.version,
          manifest: optional,
        },
      ],
    });

    expect(graph.getNodes()).toHaveLength(1);
    expect(graph.getEdges()).toHaveLength(0);
  });

  it('includes optional dependencies when requested', () => {
    const root = createManifest(
      'creatoros.capability.root',
      [
        {
          capabilityId:
            'creatoros.capability.optional',
          versionRange: '^1.0.0',
          type: 'optional',
        },
      ],
    );

    const optional = createManifest(
      'creatoros.capability.optional',
    );

    const builder =
      new DependencyGraphBuilderService();

    const graph = builder.build({
      rootCapabilityId: root.id,
      includeOptional: true,
      catalog: [
        {
          capabilityId: root.id,
          version: root.version,
          manifest: root,
        },
        {
          capabilityId: optional.id,
          version: optional.version,
          manifest: optional,
        },
      ],
    });

    expect(graph.getNodes()).toHaveLength(2);
    expect(graph.getEdges()).toHaveLength(1);
  });

  it('rejects missing root capabilities', () => {
    const builder =
      new DependencyGraphBuilderService();

    expect(() =>
      builder.build({
        rootCapabilityId:
          'creatoros.capability.missing',
        catalog: [],
      }),
    ).toThrow(
      'was not found in the dependency catalog',
    );
  });
});