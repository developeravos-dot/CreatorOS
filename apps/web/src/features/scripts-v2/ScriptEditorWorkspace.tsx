import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks";
import type { EnterpriseScript } from "../../enterprise-api";
import { scriptStatusLabels } from "../../utils/contentLabels";

interface ScriptEditorWorkspaceProps {
  script: EnterpriseScript | null;
  busy: boolean;
  onEdit: (script: EnterpriseScript) => void;
  onStatus: (script: EnterpriseScript) => void;
}



export default function ScriptEditorWorkspace({
  script,
  busy,
  onEdit,
  onStatus,
}: ScriptEditorWorkspaceProps) {

  const { t } = useTranslation();
  const assistantPrompts = [
    {
      id: "hook",
      title: t("scripts.aiHookTitle"),
      text: t("scripts.aiHookText"),
    },
    {
      id: "structure",
      title: t("scripts.aiStructureTitle"),
      text: t("scripts.aiStructureText"),
    },
    {
      id: "retention",
      title: t("scripts.aiRetentionTitle"),
      text: t("scripts.aiRetentionText"),
    },
    {
      id: "shorten",
      title: t("scripts.aiConciseTitle"),
      text: t("scripts.aiConciseText"),
    },
  ];
  const [workspaceNotes, setWorkspaceNotes] = useState("");

  useEffect(() => {
    setWorkspaceNotes("");
  }, [script?.id]);

  if (!script) {
    return (
      <section className="scripts-v2-editor scripts-v2-editor--empty">
        <div>
          <span>✎</span>
          <h2>{t("scripts.selectScript")}</h2>
          <p>
            Choose a script from the library to open its production
            workspace.
          </p>
        </div>
      </section>
    );
  }

  function applyAssistantPrompt(text: string) {
    setWorkspaceNotes((current) => {
      const separator = current.trim().length > 0 ? "\n\n" : "";
      return `${current}${separator}${text}`;
    });
  }

  return (
    <section className="scripts-v2-editor">
      <header className="scripts-v2-editor__header">
        <div>
          <span>{t("scripts.workspace")}</span>
          <h2>{script.title}</h2>

          <div className="scripts-v2-editor__status">
            {scriptStatusLabels[script.status] ?? script.status}
          </div>
        </div>

        <div className="scripts-v2-editor__actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatus(script)}
          >
            {t("scripts.changeStatus")}
          </button>

          <button
            type="button"
            className="primary"
            disabled={busy}
            onClick={() => onEdit(script)}
          >
            {t("scripts.openEditor")}
          </button>
        </div>
      </header>

      <div className="scripts-v2-editor__body">
        <div className="scripts-v2-document">
          <div className="scripts-v2-document__toolbar">
            <span>{t("scripts.productionNotes")}</span>
            <small>{t("scripts.localDraft")}</small>
          </div>

          <textarea
            value={workspaceNotes}
            placeholder={t("scripts.notesPlaceholder")}
            onChange={(event) => setWorkspaceNotes(event.target.value)}
          />

          <footer>
            <span>
              {workspaceNotes.trim().length} {t("scripts.characters")}
            </span>

            <span>
              Use “{t("scripts.openEditor")}” to modify the stored script.
            </span>
          </footer>
        </div>

        <aside className="scripts-v2-assistant">
          <header>
            <span>{t("scripts.aiAssist")}</span>
            <h3>{t("scripts.writingTools")}</h3>
          </header>

          <div className="scripts-v2-assistant__actions">
            {assistantPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt.id}
                onClick={() => applyAssistantPrompt(prompt.text)}
              >
                <span>✦</span>

                <div>
                  <strong>{prompt.title}</strong>
                  <small>{prompt.text}</small>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}



