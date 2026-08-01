import type {
  PipelineStep,
  StudioRun,
} from "./types";

interface RunConsoleProps {
  run: StudioRun;
  steps: PipelineStep[];
  running: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function RunConsole({
  run,
  steps,
  running,
  onRun,
  onStop,
  onReset,
}: RunConsoleProps) {
  return (
    <section className="ai-studio-run-console">
      <header className="ai-studio-section-header">
        <div>
          <span>RUN CONSOLE</span>
          <h3>{run.title}</h3>
        </div>

        <span
          className={`ai-studio-run-status ai-studio-run-status--${run.status}`}
        >
          {run.status}
        </span>
      </header>

      <div className="ai-studio-run-console__progress">
        <div>
          <span style={{ width: `${run.progress}%` }} />
        </div>

        <strong>{run.progress}%</strong>
      </div>

      <div className="ai-studio-run-console__summary">
        <div>
          <strong>{steps.length}</strong>
          <span>Pipeline steps</span>
        </div>

        <div>
          <strong>
            {
              steps.filter(
                (step) => step.status === "completed",
              ).length
            }
          </strong>
          <span>Completed</span>
        </div>

        <div>
          <strong>
            {
              steps.filter(
                (step) => step.status === "running",
              ).length
            }
          </strong>
          <span>Running</span>
        </div>
      </div>

      <div className="ai-studio-run-console__actions">
        {!running ? (
          <button
            type="button"
            className="ai-studio-primary-button"
            disabled={steps.length === 0}
            onClick={onRun}
          >
            ▶ Run workflow
          </button>
        ) : (
          <button
            type="button"
            className="ai-studio-stop-button"
            onClick={onStop}
          >
            ■ Stop
          </button>
        )}

        <button
          type="button"
          className="ai-studio-secondary-button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <p className="ai-studio-integration-note">
        Run progress is simulated locally to validate the workflow
        experience. It does not call external AI providers yet.
      </p>
    </section>
  );
}
