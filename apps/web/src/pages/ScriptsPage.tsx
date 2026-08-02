import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useTranslation,
} from "../hooks";

import type {
  EnterpriseProject,
  EnterpriseScript,
} from "../enterprise-api";

import {
  ScriptEditorWorkspace,
  ScriptInspector,
  ScriptsList,
  ScriptsToolbar,
  useScriptsQuery,
} from "../features/scripts-v2";

import "../features/scripts-v2/scripts-v2.css";

interface ScriptsPageProps {
  scripts: EnterpriseScript[];
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
  onEdit: (
    script: EnterpriseScript,
  ) => Promise<void>;
  onStatus: (
    script: EnterpriseScript,
  ) => Promise<void>;
}

export default function ScriptsPage({
  scripts: initialScripts,
  projects,
  busy,
  onCreate,
  onEdit,
  onStatus,
}: ScriptsPageProps) {
  const { t } = useTranslation();

  const {
    scripts,
    loading,
    refreshing,
    error,
    updatedAt,
    refresh,
  } = useScriptsQuery({
    initialScripts,
  });

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [
    selectedScript,
    setSelectedScript,
  ] = useState<
    EnterpriseScript | null
  >(null);

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          scripts.map(
            (script) =>
              script.status,
          ),
        ),
      ),
    [scripts],
  );

  const filteredScripts =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return scripts.filter(
        (script) => {
          const matchesSearch =
            normalizedSearch.length ===
              0 ||
            script.title
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            script.id
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            script.status
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            script.content
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesStatus =
            status === "all" ||
            script.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      scripts,
      search,
      status,
    ]);

  useEffect(() => {
    if (
      selectedScript &&
      !scripts.some(
        (script) =>
          script.id ===
          selectedScript.id,
      )
    ) {
      setSelectedScript(
        scripts[0] ?? null,
      );
    }
  }, [
    scripts,
    selectedScript,
  ]);

  useEffect(() => {
    if (
      selectedScript === null &&
      scripts.length > 0
    ) {
      setSelectedScript(
        scripts[0] ?? null,
      );
    }
  }, [
    scripts,
    selectedScript,
  ]);

  const disabled =
    busy ||
    loading ||
    refreshing;

  return (
    <div className="scripts-v2">
      <header className="scripts-v2-page-header">
        <div>
          <span>
            {t("scripts.workspace")}
          </span>

          <h2>
            {t("scripts.title")}
          </h2>

          <p>
            Write, review and manage
            every CreatorOS script
            from one focused
            production environment.
          </p>
        </div>

        <div className="scripts-v2-page-header__stats">
          <div>
            <strong>
              {scripts.length}
            </strong>

            <span>
              {t("scripts.total")}
            </span>
          </div>

          <div>
            <strong>
              {projects.length}
            </strong>

            <span>
              {t(
                "scripts.availableProjects",
              )}
            </span>
          </div>
        </div>
      </header>

      <section className="scripts-v2-query-status">
        <div>
          <strong>
            {loading
              ? "Loading scripts..."
              : refreshing
                ? "Refreshing..."
                : "Scripts synchronized"}
          </strong>

          <span>
            {updatedAt > 0
              ? `Last update: ${new Date(
                  updatedAt,
                ).toLocaleTimeString()}`
              : "Waiting for first synchronization"}
          </span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            void refresh()
          }
        >
          Refresh
        </button>
      </section>

      {error ? (
        <div
          className="scripts-v2-query-error"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <ScriptsToolbar
        search={search}
        status={status}
        statuses={statuses}
        busy={disabled}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCreate={() =>
          void onCreate()
        }
      />

      <div className="scripts-v2-layout">
        <aside className="scripts-v2-library">
          <header>
            <div>
              <span>
                {t("scripts.library")}
              </span>

              <h3>
                {t("scripts.allScripts")}
              </h3>
            </div>

            <small>
              {filteredScripts.length}
            </small>
          </header>

          <ScriptsList
            scripts={
              filteredScripts
            }
            selectedId={
              selectedScript?.id
            }
            onSelect={
              setSelectedScript
            }
          />
        </aside>

        <ScriptEditorWorkspace
          script={selectedScript}
          busy={disabled}
          onEdit={(script) =>
            void onEdit(script)
          }
          onStatus={(script) =>
            void onStatus(script)
          }
        />

        <ScriptInspector
          script={selectedScript}
        />
      </div>
    </div>
  );
}
