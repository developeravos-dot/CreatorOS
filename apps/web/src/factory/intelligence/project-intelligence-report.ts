import {
  analyzeProjectSources,
} from "./typescript-source-analyzer";

import {
  buildProjectDependencyGraph,
} from "./project-dependency-graph";

import {
  discoverProjectStructure,
} from "./project-structure-discovery";

import type {
  CreateProjectIntelligenceReportInput,
  ProjectIntelligenceReport,
} from "./project-source-analysis-types";

export function createProjectIntelligenceReport(
  input:
    CreateProjectIntelligenceReportInput,
): ProjectIntelligenceReport {
  const analysis =
    analyzeProjectSources(
      input.inventory,
      input.contents,
      {
        now:
          input.now,
      },
    );

  const dependencyGraph =
    buildProjectDependencyGraph(
      analysis,
      {
        now:
          input.now,
      },
    );

  const discovery =
    discoverProjectStructure(
      input.inventory,
      analysis,
      dependencyGraph,
    );

  return {
    inventory:
      input.inventory,
    analysis,
    dependencyGraph,
    discovery,
    summary: {
      files:
        input.inventory.nodes
          .filter(
            (node) =>
              node.type ===
              "file",
          )
          .length,
      analyzedFiles:
        analysis.files.length,
      imports:
        analysis.files.reduce(
          (
            total,
            file,
          ) =>
            total +
            file.imports.length,
          0,
        ),
      exports:
        analysis.files.reduce(
          (
            total,
            file,
          ) =>
            total +
            file.exports.length,
          0,
        ),
      internalDependencies:
        dependencyGraph.edges
          .filter(
            (edge) =>
              edge.kind ===
              "internal-import",
          )
          .length,
      externalDependencies:
        dependencyGraph.edges
          .filter(
            (edge) =>
              edge.kind ===
              "external-package",
          )
          .length,
      circularDependencies:
        dependencyGraph.cycles
          .length,
      indexModules:
        discovery.indexModules
          .length,
      packages:
        discovery.packages
          .length,
    },
  };
}
