import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  DependencyGraphEdgeModel,
  DependencyGraphModel,
  DependencyGraphNodeModel,
} from './index';

describe('DependencyGraphModel', () => {
  const factory = new CapabilityManifestFactory();

  const createManifest = (id: string) =>
    factory.create({
      id,
      name: id,
      version: '1.0.0',
      description:
        `Dependency graph model test for ${id}.`,
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: `./${id}`,
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

  it('adds nodes and graph edges', () => {
    const rootManifest = createManifest(
      'creatoros.capability.root',
    );

    const dependencyManifest = createManifest(
      'creatoros.capability.dependency',
    );

    const graph = new DependencyGraphModel();

    graph.addNode(
      new DependencyGraphNodeModel(
        rootManifest.id,
        rootManifest.version,
        rootManifest,
      ),
    );

    graph.addNode(
      new DependencyGraphNodeModel(
        dependencyManifest.id,
        dependencyManifest.version,
        dependencyManifest,
      ),
    );

    graph.addEdge(
      new DependencyGraphEdgeModel(
        rootManifest.id,
        dependencyManifest.id,
        'required',
        '^1.0.0',
      ),
    );

    expect(graph.getNodes()).toHaveLength(2);
    expect(graph.getEdges()).toHaveLength(1);
  });

  it('prevents duplicate graph nodes', () => {
    const manifest = createManifest(
      'creatoros.capability.duplicate',
    );

    const graph = new DependencyGraphModel();

    const node = new DependencyGraphNodeModel(
      manifest.id,
      manifest.version,
      manifest,
    );

    graph.addNode(node);

    expect(() => graph.addNode(node)).toThrow(
      'already exists',
    );
  });

  it('rejects edges when graph nodes are missing', () => {
    const graph = new DependencyGraphModel();

    expect(() =>
      graph.addEdge(
        new DependencyGraphEdgeModel(
          'creatoros.capability.root',
          'creatoros.capability.missing',
          'required',
          '^1.0.0',
        ),
      ),
    ).toThrow('is invalid');
  });

  it('creates graph snapshots', () => {
    const manifest = createManifest(
      'creatoros.capability.snapshot',
    );

    const graph = new DependencyGraphModel();

    graph.addNode(
      new DependencyGraphNodeModel(
        manifest.id,
        manifest.version,
        manifest,
      ),
    );

    const snapshot = graph.snapshot();

    expect(snapshot.nodes).toHaveLength(1);
    expect(snapshot.edges).toHaveLength(0);
    expect(snapshot.nodes[0]?.capabilityId).toBe(
      manifest.id,
    );
  });
});