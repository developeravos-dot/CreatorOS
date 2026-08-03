import type {
  AnalyzeProjectSourceOptions,
  ProjectImportSymbol,
  ProjectSourceAnalysis,
  ProjectSourceExport,
  ProjectSourceFileAnalysis,
  ProjectSourceImport,
} from "./project-source-analysis-types";

import type {
  ProjectInventory,
} from "./project-intelligence-types";

import {
  isSourceInventoryNode,
} from "./project-source-analysis-types";

function normalizePath(
  value: string,
): string {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\.\//, "");
}

function dirname(
  path: string,
): string {
  const index =
    path.lastIndexOf("/");

  return index < 0
    ? ""
    : path.slice(0, index);
}

function joinPath(
  left: string,
  right: string,
): string {
  const segments =
    `${left}/${right}`
      .split("/");

  const output:
    string[] = [];

  for (const segment of segments) {
    if (
      !segment ||
      segment === "."
    ) {
      continue;
    }

    if (segment === "..") {
      output.pop();
      continue;
    }

    output.push(segment);
  }

  return output.join("/");
}

function isExternalSource(
  source: string,
): boolean {
  return (
    !source.startsWith(".") &&
    !source.startsWith("/")
  );
}

function resolveInternalSource(
  importerPath: string,
  source: string,
  inventoryPaths:
    ReadonlySet<string>,
  extensions:
    readonly string[],
): string | null {
  if (isExternalSource(source)) {
    return null;
  }

  const base =
    source.startsWith("/")
      ? normalizePath(
          source,
        )
      : joinPath(
          dirname(importerPath),
          source,
        );

  const candidates = [
    base,
    ...extensions.map(
      (extension) =>
        `${base}${extension}`,
    ),
    ...extensions.map(
      (extension) =>
        `${base}/index${extension}`,
    ),
  ];

  return (
    candidates.find(
      (candidate) =>
        inventoryPaths.has(
          normalizePath(
            candidate,
          ),
        ),
    ) ??
    null
  );
}

function parseNamedImportSymbols(
  value: string,
  typeOnly: boolean,
): readonly ProjectImportSymbol[] {
  return value
    .split(",")
    .map(
      (part) =>
        part.trim(),
    )
    .filter(Boolean)
    .map(
      (part) => {
        const normalized =
          part.replace(
            /^type\s+/,
            "",
          );

        const [
          imported,
          local,
        ] =
          normalized.split(
            /\s+as\s+/,
          );

        return {
          imported:
            imported?.trim() ??
            normalized,
          local:
            local?.trim() ??
            imported?.trim() ??
            normalized,
          kind:
            typeOnly ||
            part.startsWith("type ")
              ? "type"
              : "named",
        };
      },
    );
}

function parseStaticImports(
  content: string,
): readonly {
  readonly clause: string;
  readonly source: string;
  readonly typeOnly: boolean;
}[] {
  const imports: {
    clause: string;
    source: string;
    typeOnly: boolean;
  }[] = [];

  const fromPattern =
    /import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']\s*;?/g;

  let match:
    RegExpExecArray | null;

  while (
    (
      match =
        fromPattern.exec(
          content,
        )
    )
  ) {
    imports.push({
      clause:
        match[2]?.trim() ??
        "",
      source:
        match[3] ??
        "",
      typeOnly:
        Boolean(
          match[1],
        ),
    });
  }

  const sideEffectPattern =
    /import\s+["']([^"']+)["']\s*;?/g;

  while (
    (
      match =
        sideEffectPattern.exec(
          content,
        )
    )
  ) {
    imports.push({
      clause: "",
      source:
        match[1] ??
        "",
      typeOnly: false,
    });
  }

  return imports;
}

function parseImportSymbols(
  clause: string,
  typeOnly: boolean,
): readonly ProjectImportSymbol[] {
  if (!clause) {
    return [
      {
        imported: "*",
        local: "*",
        kind:
          "side-effect",
      },
    ];
  }

  const symbols:
    ProjectImportSymbol[] = [];

  const namespace =
    clause.match(
      /\*\s+as\s+([A-Za-z_$][\w$]*)/,
    );

  if (namespace?.[1]) {
    symbols.push({
      imported: "*",
      local:
        namespace[1],
      kind:
        "namespace",
    });
  }

  const named =
    clause.match(
      /\{([\s\S]*?)\}/,
    );

  if (named?.[1]) {
    symbols.push(
      ...parseNamedImportSymbols(
        named[1],
        typeOnly,
      ),
    );
  }

  const defaultPart =
    clause
      .replace(
        /\{[\s\S]*?\}/,
        "",
      )
      .replace(
        /\*\s+as\s+[A-Za-z_$][\w$]*/,
        "",
      )
      .replace(/,/g, "")
      .trim();

  if (defaultPart) {
    symbols.unshift({
      imported:
        "default",
      local:
        defaultPart,
      kind:
        typeOnly
          ? "type"
          : "default",
    });
  }

  return symbols;
}

function parseExports(
  content: string,
): readonly ProjectSourceExport[] {
  const exports:
    ProjectSourceExport[] = [];

  if (
    /export\s+default\b/
      .test(content)
  ) {
    exports.push({
      name: "default",
      kind: "default",
      source: null,
      typeOnly: false,
    });
  }

  const declarationPattern =
    /export\s+(type\s+)?(?:declare\s+)?(?:async\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g;

  let match:
    RegExpExecArray | null;

  while (
    (
      match =
        declarationPattern.exec(
          content,
        )
    )
  ) {
    exports.push({
      name:
        match[2] ??
        "unknown",
      kind:
        match[1]
          ? "type"
          : "named",
      source: null,
      typeOnly:
        Boolean(
          match[1],
        ),
    });
  }

  const namedPattern =
    /export\s+(type\s+)?\{([\s\S]*?)\}(?:\s+from\s+["']([^"']+)["'])?\s*;?/g;

  while (
    (
      match =
        namedPattern.exec(
          content,
        )
    )
  ) {
    const typeOnly =
      Boolean(
        match[1],
      );

    const source =
      match[3] ??
      null;

    for (
      const part of
      (
        match[2] ??
        ""
      )
        .split(",")
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean)
    ) {
      const normalized =
        part.replace(
          /^type\s+/,
          "",
        );

      const [
        original,
        alias,
      ] =
        normalized.split(
          /\s+as\s+/,
        );

      exports.push({
        name:
          alias?.trim() ??
          original?.trim() ??
          normalized,
        kind:
          source
            ? "re-export"
            : typeOnly ||
              part.startsWith(
                "type ",
              )
              ? "type"
              : "named",
        source,
        typeOnly:
          typeOnly ||
          part.startsWith(
            "type ",
          ),
      });
    }
  }

  const wildcardPattern =
    /export\s+\*\s+from\s+["']([^"']+)["']\s*;?/g;

  while (
    (
      match =
        wildcardPattern.exec(
          content,
        )
    )
  ) {
    exports.push({
      name: "*",
      kind: "wildcard",
      source:
        match[1] ??
        null,
      typeOnly: false,
    });
  }

  return exports;
}

function parseDeclaredSymbols(
  content: string,
): readonly string[] {
  const symbols =
    new Set<string>();

  const pattern =
    /(?:export\s+)?(?:declare\s+)?(?:async\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g;

  let match:
    RegExpExecArray | null;

  while (
    (
      match =
        pattern.exec(
          content,
        )
    )
  ) {
    if (match[1]) {
      symbols.add(
        match[1],
      );
    }
  }

  return [
    ...symbols,
  ];
}

export function analyzeTypeScriptSourceFile(
  path: string,
  content: string,
  inventoryPaths:
    ReadonlySet<string>,
  options:
    AnalyzeProjectSourceOptions =
      {},
): ProjectSourceFileAnalysis {
  const extensions =
    options.resolveExtensions ??
    [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
    ];

  const imports:
    ProjectSourceImport[] = [];

  for (
    const parsed of
    parseStaticImports(
      content,
    )
  ) {
    imports.push({
      source:
        parsed.source,
      resolvedPath:
        resolveInternalSource(
          path,
          parsed.source,
          inventoryPaths,
          extensions,
        ),
      external:
        isExternalSource(
          parsed.source,
        ),
      dynamic: false,
      typeOnly:
        parsed.typeOnly,
      symbols:
        parseImportSymbols(
          parsed.clause,
          parsed.typeOnly,
        ),
    });
  }

  const dynamicPattern =
    /import\s*\(\s*["']([^"']+)["']\s*\)/g;

  let dynamicMatch:
    RegExpExecArray | null;

  while (
    (
      dynamicMatch =
        dynamicPattern.exec(
          content,
        )
    )
  ) {
    const source =
      dynamicMatch[1] ??
      "";

    imports.push({
      source,
      resolvedPath:
        resolveInternalSource(
          path,
          source,
          inventoryPaths,
          extensions,
        ),
      external:
        isExternalSource(
          source,
        ),
      dynamic: true,
      typeOnly: false,
      symbols: [],
    });
  }

  const exports =
    parseExports(
      content,
    );

  return {
    path:
      normalizePath(
        path,
      ),
    imports,
    exports,
    declaredSymbols:
      parseDeclaredSymbols(
        content,
      ),
    hasDefaultExport:
      exports.some(
        (item) =>
          item.kind ===
          "default",
      ),
    isIndexModule:
      /(^|\/)index\.[^.]+$/
        .test(
          normalizePath(
            path,
          ),
        ),
    parseWarnings: [],
  };
}

export function analyzeProjectSources(
  inventory:
    ProjectInventory,
  contents:
    Readonly<
      Record<
        string,
        string
      >
    >,
  options:
    AnalyzeProjectSourceOptions =
      {},
): ProjectSourceAnalysis {
  const inventoryPaths =
    new Set(
      inventory.nodes
        .filter(
          (node) =>
            node.type ===
            "file",
        )
        .map(
          (node) =>
            node.path,
        ),
    );

  const files =
    inventory.nodes
      .filter(
        isSourceInventoryNode,
      )
      .map(
        (node) =>
          analyzeTypeScriptSourceFile(
            node.path,
            contents[
              node.path
            ] ??
              "",
            inventoryPaths,
            options,
          ),
      );

  return {
    schema:
      "creatoros.factory.project-source-analysis",
    version:
      "1.0.0",
    files,
    analyzedAt:
      options.now
        ? options.now()
        : new Date()
            .toISOString(),
  };
}
