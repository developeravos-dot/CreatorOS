import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  DependencyCycleDetectorService,
  DependencyTopologicalSortService,
} from './index';
import {
  DependencyGraphEdgeModel,
  DependencyGraphModel,
  DependencyGraphNodeModel,
} from '../models';

describe('Dependency Algorithms', () => {
  const factory = new CapabilityManifestFactory();

  const createManifest = (id: string) =>
    factory.create({
      id,
      name: id,
      version: '1.0.0',
      description:
        `Dependency algorithm test for ${id}.`,
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

  it('sorts dependencies before dependents', () => {
    const dependency = createManifest(
      'creatoros.capability.dependency',
    );

    const root = createManifest(
      'creatoros.capability.root',
    );

    const graph = new DependencyGraphModel();

    for (const manifest of [root, dependency]) {
      graph.addNode(
        new DependencyGraphNodeModel(
          manifest.id,
          manifest.version,
          manifest,
        ),
      );
    }

    graph.addEdge(
      new DependencyGraphEdgeModel(
        root.id,
        dependency.id,
        'required',
        '^1.0.0',
      ),
    );

    const ordered =
      new DependencyTopologicalSortService().sort(
        graph,
      );

    expect(ordered).toEqual([
      dependency.id,
      root.id,
    ]);
  });

  it('detects graph cycles', () => {
    const first = createManifest(
      'creatoros.capability.first',
    );

    const second = createManifest(
      'creatoros.capability.second',
    );

    const graph = new DependencyGraphModel();

    for (const manifest of [first, second]) {
      graph.addNode(
        new DependencyGraphNodeModel(
          manifest.id,
          manifest.version,
          manifest,
        ),
      );
    }

    graph.addEdge(
      new DependencyGraphEdgeModel(
        first.id,
        second.id,
        'required',
        '^1.0.0',
      ),
    );

    graph.addEdge(
      new DependencyGraphEdgeModel(
        second.id,
        first.id,
        'required',
        '^1.0.0',
      ),
    );

    const result =
      new DependencyCycleDetectorService().detect(
        graph,
      );

    expect(result.hasCycle).toBe(true);
    expect(result.cycles).toHaveLength(1);
  });
});