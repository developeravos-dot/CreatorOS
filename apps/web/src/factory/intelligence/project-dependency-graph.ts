import type {
  BuildProjectDependencyGraphOptions,
  ProjectDependencyCycle,
  ProjectDependencyEdge,
  ProjectDependencyGraph,
  ProjectDependencyNode,
  ProjectSourceAnalysis,
} from "./project-source-analysis-types";

function createEdgeId(
  sourcePath: string,
  target: string,
  index: number,
): string {
  return `${sourcePath}::${target}::${index}`;
}

function normalizePackageName(
  source: string,
): string {
  if (
    source.startsWith("@")
  ) {
    return source
      .split("/")
      .slice(0, 2)
      .join("/");
  }

  return (
    source.split("/")[0] ??
    source
  );
}

function canonicalCycle(
  paths:
    readonly string[],
): readonly string[] {
  if (paths.length === 0) {
    return paths;
  }

  const withoutRepeat =
    paths.at(-1) ===
    paths[0]
      ? paths.slice(0, -1)
      : [...paths];

  let best =
    withoutRepeat;

  for (
    let index = 1;
    index <
    withoutRepeat.length;
    index += 1
  ) {
    const rotated = [
      ...withoutRepeat.slice(
        index,
      ),
      ...withoutRepeat.slice(
        0,
        index,
      ),
    ];

    if (
      rotated.join("\u0000") <
      best.join("\u0000")
    ) {
      best = rotated;
    }
  }

  return [
    ...best,
    best[0]!,
  ];
}

function detectCycles(
  paths:
    readonly string[],
  adjacency:
    ReadonlyMap<
      string,
      readonly string[]
    >,
): readonly ProjectDependencyCycle[] {
  const cycles =
    new Map<
      string,
      readonly string[]
    >();

  function visit(
    current: string,
    stack:
      readonly string[],
  ): void {
    const stackIndex =
      stack.indexOf(
        current,
      );

    if (
      stackIndex >= 0
    ) {
      const cycle =
        canonicalCycle([
          ...stack.slice(
            stackIndex,
          ),
          current,
        ]);

      cycles.set(
        cycle.join(" -> "),
        cycle,
      );

      return;
    }

    if (
      stack.length >
      paths.length
    ) {
      return;
    }

    for (
      const target of
      adjacency.get(
        current,
      ) ??
      []
    ) {
      visit(
        target,
        [
          ...stack,
          current,
        ],
      );
    }
  }

  for (const path of paths) {
    visit(
      path,
      [],
    );
  }

  return [
    ...cycles.entries(),
  ].map(
    (
      [
        id,
        cyclePaths,
      ],
    ) => ({
      id,
      paths:
        cyclePaths,
    }),
  );
}

export function buildProjectDependencyGraph(
  analysis:
    ProjectSourceAnalysis,
  options:
    BuildProjectDependencyGraphOptions =
      {},
): ProjectDependencyGraph {
  const edges:
    ProjectDependencyEdge[] = [];

  for (
    const file of
    analysis.files
  ) {
    file.imports.forEach(
      (
        item,
        index,
      ) => {
        edges.push({
          id:
            createEdgeId(
              file.path,
              item.source,
              index,
            ),
          sourcePath:
            file.path,
          target:
            item.external
              ? normalizePackageName(
                  item.source,
                )
              : item.source,
          resolvedPath:
            item.resolvedPath,
          kind:
            item.dynamic
              ? "dynamic-import"
              : item.external
                ? "external-package"
                : "internal-import",
          typeOnly:
            item.typeOnly,
        });
      },
    );

    file.exports.forEach(
      (
        item,
        index,
      ) => {
        if (!item.source) {
          return;
        }

        edges.push({
          id:
            createEdgeId(
              file.path,
              item.source,
              file.imports.length +
                index,
            ),
          sourcePath:
            file.path,
          target:
            item.source,
          resolvedPath:
            null,
          kind:
            "re-export",
          typeOnly:
            item.typeOnly,
        });
      },
    );
  }

  const sourcePaths =
    analysis.files.map(
      (file) =>
        file.path,
    );

  const nodes:
    ProjectDependencyNode[] =
    sourcePaths.map(
      (path) => {
        const outgoing =
          edges.filter(
            (edge) =>
              edge.sourcePath ===
              path,
          );

        const incoming =
          edges.filter(
            (edge) =>
              edge.resolvedPath ===
              path,
          );

        return {
          path,
          incoming:
            incoming.length,
          outgoing:
            outgoing.length,
          externalDependencies: [
            ...new Set(
              outgoing
                .filter(
                  (edge) =>
                    edge.kind ===
                    "external-package",
                )
                .map(
                  (edge) =>
                    edge.target,
                ),
            ),
          ],
        };
      },
    );

  const adjacency =
    new Map<
      string,
      readonly string[]
    >();

  for (const path of sourcePaths) {
    adjacency.set(
      path,
      edges
        .filter(
          (edge) =>
            edge.sourcePath ===
              path &&
            edge.resolvedPath,
        )
        .map(
          (edge) =>
            edge.resolvedPath!,
        ),
    );
  }

  return {
    schema:
      "creatoros.factory.project-dependency-graph",
    version:
      "1.0.0",
    nodes,
    edges,
    cycles:
      detectCycles(
        sourcePaths,
        adjacency,
      ),
    generatedAt:
      options.now
        ? options.now()
        : new Date()
            .toISOString(),
  };
}

export function getProjectDependencyImpact(
  graph:
    ProjectDependencyGraph,
  changedPaths:
    readonly string[],
): readonly string[] {
  const impacted =
    new Set(
      changedPaths,
    );

  let changed = true;

  while (changed) {
    changed = false;

    for (
      const edge of
      graph.edges
    ) {
      if (
        edge.resolvedPath &&
        impacted.has(
          edge.resolvedPath,
        ) &&
        !impacted.has(
          edge.sourcePath,
        )
      ) {
        impacted.add(
          edge.sourcePath,
        );

        changed = true;
      }
    }
  }

  return [
    ...impacted,
  ].sort();
}
