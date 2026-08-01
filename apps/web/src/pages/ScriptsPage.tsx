import { useEffect, useMemo, useState } from "react";
import type {
  EnterpriseProject,
  EnterpriseScript,
} from "../enterprise-api";
import {
  ScriptEditorWorkspace,
  ScriptInspector,
  ScriptsList,
  ScriptsToolbar,
} from "../features/scripts-v2";
import "../features/scripts-v2/scripts-v2.css";

interface ScriptsPageProps {
  scripts: EnterpriseScript[];
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
  onEdit: (script: EnterpriseScript) => Promise<void>;
  onStatus: (script: EnterpriseScript) => Promise<void>;
}

export default function ScriptsPage({
  scripts,
  projects,
  busy,
  onCreate,
  onEdit,
  onStatus,
}: ScriptsPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedScript, setSelectedScript] =
    useState<EnterpriseScript | null>(scripts[0] ?? null);

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(scripts.map((script) => script.status)),
      ),
    [scripts],
  );

  const filteredScripts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return scripts.filter((script) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        script.title.toLowerCase().includes(normalizedSearch) ||
        script.id.toLowerCase().includes(normalizedSearch) ||
        script.status.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        status === "all" || script.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [scripts, search, status]);

  useEffect(() => {
    if (
      selectedScript &&
      !scripts.some((script) => script.id === selectedScript.id)
    ) {
      setSelectedScript(scripts[0] ?? null);
    }
  }, [scripts, selectedScript]);

  return (
    <div className="scripts-v2">
      <header className="scripts-v2-page-header">
        <div>
          <span>SCRIPTS WORKSPACE</span>
          <h2>Production Scripts</h2>
          <p>
            Write, review and manage every CreatorOS script from one
            focused production environment.
          </p>
        </div>

        <div className="scripts-v2-page-header__stats">
          <div>
            <strong>{scripts.length}</strong>
            <span>Total scripts</span>
          </div>

          <div>
            <strong>{projects.length}</strong>
            <span>Available projects</span>
          </div>
        </div>
      </header>

      <ScriptsToolbar
        search={search}
        status={status}
        statuses={statuses}
        busy={busy}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCreate={() => void onCreate()}
      />

      <div className="scripts-v2-layout">
        <aside className="scripts-v2-library">
          <header>
            <div>
              <span>SCRIPT LIBRARY</span>
              <h3>All scripts</h3>
            </div>

            <small>{filteredScripts.length}</small>
          </header>

          <ScriptsList
            scripts={filteredScripts}
            selectedId={selectedScript?.id}
            onSelect={setSelectedScript}
          />
        </aside>

        <ScriptEditorWorkspace
          script={selectedScript}
          busy={busy}
          onEdit={(script) => void onEdit(script)}
          onStatus={(script) => void onStatus(script)}
        />

        <ScriptInspector script={selectedScript} />
      </div>
    </div>
  );
}
