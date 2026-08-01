import { useEffect, useState } from "react";
import type { EnterpriseScript } from "../../enterprise-api";
import { scriptStatusLabels } from "../../utils/contentLabels";

interface ScriptEditorWorkspaceProps {
  script: EnterpriseScript | null;
  busy: boolean;
  onEdit: (script: EnterpriseScript) => void;
  onStatus: (script: EnterpriseScript) => void;
}

const assistantPrompts = [
  {
    id: "hook",
    title: "Stronger hook",
    text: "Rewrite the opening with a stronger curiosity gap and a clear promise.",
  },
  {
    id: "structure",
    title: "Improve structure",
    text: "Organize the script into hook, setup, escalation, payoff and call to action.",
  },
  {
    id: "retention",
    title: "Retention pass",
    text: "Add pattern interrupts, open loops and pacing changes throughout the script.",
  },
  {
    id: "shorten",
    title: "Make concise",
    text: "Remove repetition and make every sentence advance the story.",
  },
];

export default function ScriptEditorWorkspace({
  script,
  busy,
  onEdit,
  onStatus,
}: ScriptEditorWorkspaceProps) {
  const [workspaceNotes, setWorkspaceNotes] = useState("");

  useEffect(() => {
    setWorkspaceNotes("");
  }, [script?.id]);

  if (!script) {
    return (
      <section className="scripts-v2-editor scripts-v2-editor--empty">
        <div>
          <span>✎</span>
          <h2>Select a script</h2>
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
          <span>SCRIPT WORKSPACE</span>
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
            Change status
          </button>

          <button
            type="button"
            className="primary"
            disabled={busy}
            onClick={() => onEdit(script)}
          >
            Open full editor
          </button>
        </div>
      </header>

      <div className="scripts-v2-editor__body">
        <div className="scripts-v2-document">
          <div className="scripts-v2-document__toolbar">
            <span>Production notes</span>
            <small>Local workspace draft</small>
          </div>

          <textarea
            value={workspaceNotes}
            placeholder="Write production notes, revision instructions, scene ideas or AI-assist prompts here..."
            onChange={(event) => setWorkspaceNotes(event.target.value)}
          />

          <footer>
            <span>
              {workspaceNotes.trim().length} characters
            </span>

            <span>
              Use “Open full editor” to modify the stored script.
            </span>
          </footer>
        </div>

        <aside className="scripts-v2-assistant">
          <header>
            <span>AI ASSIST</span>
            <h3>Writing tools</h3>
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
