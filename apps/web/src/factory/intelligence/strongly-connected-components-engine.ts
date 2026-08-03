import type {
  CircularDependency,
} from "./project-deep-intelligence-interfaces";

import {
  CircularDependencyDetectionEngine,
} from "./circular-dependency-detection-engine";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface StronglyConnectedComponent {

  readonly id: string;

  readonly nodes:
    readonly string[];

  readonly size:
    number;

  readonly cyclic:
    boolean;

}

export interface StronglyConnectedComponentReport {

  readonly components:
    readonly StronglyConnectedComponent[];

  readonly cyclicComponents:
    readonly StronglyConnectedComponent[];

  readonly largestComponent:
    StronglyConnectedComponent | null;

}

export class StronglyConnectedComponentsEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    StronglyConnectedComponentReport {

    const detector =
      new CircularDependencyDetectionEngine(
        this.graph,
      );

    const analysis =
      detector.analyze();

    const components =
      analysis.cycles.map(
        (
          cycle,
          index,
        ) =>
          this.toComponent(
            cycle,
            index,
          ),
      );

    const largest =
      components
        .slice()
        .sort(
          (
            a,
            b,
          ) =>
            b.size -
            a.size,
        )[0] ??
      null;

    return {

      components,

      cyclicComponents:
        components.filter(
          component =>
            component.cyclic,
        ),

      largestComponent:
        largest,

    };

  }

  private toComponent(
    cycle:
      CircularDependency,
    index:
      number,
  ):
    StronglyConnectedComponent {

    const uniqueNodes =
      [
        ...new Set(
          cycle.nodes,
        ),
      ];

    return {

      id:
        `scc-${index + 1}`,

      nodes:
        uniqueNodes,

      size:
        uniqueNodes.length,

      cyclic:
        uniqueNodes.length >
        1,

    };

  }

}
