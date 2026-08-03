import {
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  archiveProjectAsset,
  createProjectAsset,
  deleteProjectAsset,
  formatProjectAssetSize,
  queryProjectAssets,
  restoreProjectAsset,
  summarizeProjectAssets,
  toggleProjectAssetPinned,
  type ProjectAsset,
  type ProjectAssetKind,
  type ProjectAssetStatus,
} from "./project-assets-engine";

import {
  loadAssetsForProject,
  replaceAssetsForProject,
} from "./project-assets-storage";

interface ProjectAssetsWorkspaceProps {
  project: EnterpriseProject;
}

const KIND_FILTERS:
  readonly ProjectAssetKind[] = [
    "image",
    "video",
    "audio",
    "document",
    "archive",
    "other",
  ];

function createAssetId(
  projectId: string,
  fileName: string,
): string {
  return [
    projectId,
    Date.now(),
    fileName,
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}

function formatUpdatedAt(
  value: string,
): string {
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      dateStyle: "medium",
    },
  ).format(
    new Date(parsed),
  );
}

export default function ProjectAssetsWorkspace({
  project,
}: ProjectAssetsWorkspaceProps) {
  const [
    assets,
    setAssets,
  ] = useState<
    ProjectAsset[]
  >(
    () =>
      loadAssetsForProject(
        project.id,
      ),
  );

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    kind,
    setKind,
  ] = useState<
    ProjectAssetKind | "all"
  >("all");

  const [
    status,
    setStatus,
  ] = useState<
    ProjectAssetStatus | "all"
  >("active");

  const [
    pinnedOnly,
    setPinnedOnly,
  ] = useState(false);

  const visibleAssets =
    useMemo(
      () =>
        queryProjectAssets(
          assets,
          {
            query,
            kinds:
              kind === "all"
                ? []
                : [kind],
            statuses:
              status === "all"
                ? []
                : [status],
            pinnedOnly,
          },
          {
            field: "updatedAt",
            direction: "desc",
          },
        ),
      [
        assets,
        kind,
        pinnedOnly,
        query,
        status,
      ],
    );

  const summary =
    useMemo(
      () =>
        summarizeProjectAssets(
          assets,
        ),
      [assets],
    );

  const persistAssets = (
    nextAssets:
      ProjectAsset[],
  ): void => {
    setAssets(
      nextAssets,
    );

    replaceAssetsForProject(
      project.id,
      nextAssets,
    );
  };

  const updateAsset = (
    assetId: string,
    transform: (
      asset: ProjectAsset,
    ) => ProjectAsset,
  ): void => {
    persistAssets(
      assets.map(
        (asset) =>
          asset.id === assetId
            ? transform(asset)
            : asset,
      ),
    );
  };

  const handleFiles = (
    event:
      ChangeEvent<
        HTMLInputElement
      >,
  ): void => {
    const files =
      event.target.files;

    if (
      !files ||
      files.length === 0
    ) {
      return;
    }

    const uploadedAssets =
      Array.from(
        files,
      ).map(
        (file) =>
          createProjectAsset({
            id:
              createAssetId(
                project.id,
                file.name,
              ),
            projectId:
              project.id,
            name:
              file.name,
            mimeType:
              file.type,
            sizeBytes:
              file.size,
            source:
              "upload",
          }),
      );

    persistAssets([
      ...assets,
      ...uploadedAssets,
    ]);

    event.target.value = "";
  };

  return (
    <section
      className="projects-v2-assets"
      aria-labelledby="project-assets-title"
    >
      <header className="projects-v2-assets__header">
        <div>
          <span>
            Files & assets
          </span>

          <h3 id="project-assets-title">
            Project asset workspace
          </h3>
        </div>

        <label className="projects-v2-assets__upload">
          <input
            type="file"
            multiple
            aria-label="Upload project assets"
            onChange={
              handleFiles
            }
          />

          <span>
            Add files
          </span>
        </label>
      </header>

      <div className="projects-v2-assets__summary">
        <article>
          <strong>
            {summary.total}
          </strong>

          <span>
            Total assets
          </span>
        </article>

        <article>
          <strong>
            {summary.active}
          </strong>

          <span>
            Active
          </span>
        </article>

        <article>
          <strong>
            {summary.pinned}
          </strong>

          <span>
            Pinned
          </span>
        </article>

        <article>
          <strong>
            {formatProjectAssetSize(
              summary.totalSizeBytes,
            )}
          </strong>

          <span>
            Storage
          </span>
        </article>
      </div>

      <div className="projects-v2-assets__controls">
        <input
          type="search"
          aria-label="Search project assets"
          placeholder="Search files, descriptions, or tags"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value,
            )
          }
        />

        <select
          aria-label="Filter asset kind"
          value={kind}
          onChange={(event) =>
            setKind(
              event.target.value as
                ProjectAssetKind |
                "all",
            )
          }
        >
          <option value="all">
            All kinds
          </option>

          {KIND_FILTERS.map(
            (assetKind) => (
              <option
                key={assetKind}
                value={assetKind}
              >
                {assetKind}
              </option>
            ),
          )}
        </select>

        <select
          aria-label="Filter asset status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                ProjectAssetStatus |
                "all",
            )
          }
        >
          <option value="all">
            All statuses
          </option>

          <option value="active">
            Active
          </option>

          <option value="archived">
            Archived
          </option>

          <option value="deleted">
            Deleted
          </option>
        </select>

        <label className="projects-v2-assets__pinned-filter">
          <input
            type="checkbox"
            checked={pinnedOnly}
            onChange={(event) =>
              setPinnedOnly(
                event.target.checked,
              )
            }
          />

          <span>
            Pinned only
          </span>
        </label>
      </div>

      {visibleAssets.length ===
      0 ? (
        <div className="projects-v2-assets__empty">
          <strong>
            No assets found
          </strong>

          <span>
            Upload project files or adjust the current filters.
          </span>
        </div>
      ) : (
        <div className="projects-v2-assets__grid">
          {visibleAssets.map(
            (asset) => (
              <article
                className={[
                  "projects-v2-assets__card",
                  asset.pinned
                    ? "projects-v2-assets__card--pinned"
                    : "",
                  asset.status !==
                  "active"
                    ? "projects-v2-assets__card--muted"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={asset.id}
              >
                <div className="projects-v2-assets__card-top">
                  <span>
                    {asset.kind}
                  </span>

                  <button
                    type="button"
                    aria-label={
                      asset.pinned
                        ? `Unpin ${asset.name}`
                        : `Pin ${asset.name}`
                    }
                    onClick={() =>
                      updateAsset(
                        asset.id,
                        (
                          current,
                        ) =>
                          toggleProjectAssetPinned(
                            current,
                          ),
                      )
                    }
                  >
                    {asset.pinned
                      ? "Pinned"
                      : "Pin"}
                  </button>
                </div>

                <strong>
                  {asset.name}
                </strong>

                <p>
                  {asset.description ||
                    "No asset description."}
                </p>

                <dl>
                  <div>
                    <dt>
                      Size
                    </dt>

                    <dd>
                      {formatProjectAssetSize(
                        asset.sizeBytes,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>
                      Updated
                    </dt>

                    <dd>
                      {formatUpdatedAt(
                        asset.updatedAt,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>
                      Status
                    </dt>

                    <dd>
                      {asset.status}
                    </dd>
                  </div>
                </dl>

                <footer>
                  {asset.status ===
                  "active" ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          updateAsset(
                            asset.id,
                            (
                              current,
                            ) =>
                              archiveProjectAsset(
                                current,
                              ),
                          )
                        }
                      >
                        Archive
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateAsset(
                            asset.id,
                            (
                              current,
                            ) =>
                              deleteProjectAsset(
                                current,
                              ),
                          )
                        }
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateAsset(
                          asset.id,
                          (
                            current,
                          ) =>
                            restoreProjectAsset(
                              current,
                            ),
                        )
                      }
                    >
                      Restore
                    </button>
                  )}
                </footer>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}
