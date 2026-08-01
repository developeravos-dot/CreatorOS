import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AgentCatalog,
  AgentInspector,
  PipelineBuilder,
  RunConsole,
  studioAgents,
  type PipelineStep,
  type StudioAgent,
  type StudioRun,
} from "../features/ai-studio-v2";
import "../features/ai-studio-v2/ai-studio-v2.css";

const defaultPipelineAgentIds = [
  "strategist",
  "researcher",
  "idea-director",
  "scriptwriter",
  "story-editor",
  "quality-agent",
];

function createPipelineStep(
  agent: StudioAgent,
  index: number,
): PipelineStep {
  return {
    id: `${agent.id}-${Date.now()}-${index}`,
    agentId: agent.id,
    title: agent.role,
    description: agent.description,
    status: "pending",
    progress: 0,
  };
}

export default function AIContentStudioPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [selectedAgent, setSelectedAgent] =
    useState<StudioAgent | null>(studioAgents[0] ?? null);

  const [steps, setSteps] = useState<PipelineStep[]>(() =>
    defaultPipelineAgentIds
      .map((agentId) =>
        studioAgents.find((agent) => agent.id === agentId),
      )
      .filter((agent): agent is StudioAgent => Boolean(agent))
      .map(createPipelineStep),
  );

  const [activeStep, setActiveStep] =
    useState<PipelineStep | null>(null);

  const [running, setRunning] = useState(false);

  const [run, setRun] = useState<StudioRun>({
    id: "run-1",
    title: "CreatorOS Content Production Workflow",
    status: "draft",
    createdAt: new Date().toISOString(),
    progress: 0,
  });

  const completedSteps = useMemo(
    () =>
      steps.filter((step) => step.status === "completed")
        .length,
    [steps],
  );

  useEffect(() => {
    if (!running || steps.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setSteps((currentSteps) => {
        const activeIndex = currentSteps.findIndex(
          (step) =>
            step.status !== "completed" &&
            step.status !== "failed",
        );

        if (activeIndex === -1) {
          setRunning(false);

          setRun((currentRun) => ({
            ...currentRun,
            status: "completed",
            progress: 100,
          }));

          return currentSteps;
        }

        return currentSteps.map((step, index) => {
          if (index !== activeIndex) {
            return step;
          }

          const nextProgress = Math.min(
            100,
            step.progress + 20,
          );

          return {
            ...step,
            progress: nextProgress,
            status:
              nextProgress >= 100
                ? "completed"
                : "running",
          };
        });
      });
    }, 700);

    return () => {
      window.clearInterval(interval);
    };
  }, [running, steps.length]);

  useEffect(() => {
    const totalProgress =
      steps.length === 0
        ? 0
        : Math.round(
            steps.reduce(
              (total, step) => total + step.progress,
              0,
            ) / steps.length,
          );

    setRun((currentRun) => ({
      ...currentRun,
      progress: totalProgress,
      status:
        totalProgress >= 100
          ? "completed"
          : running
            ? "running"
            : currentRun.status === "stopped"
              ? "stopped"
              : "draft",
    }));
  }, [completedSteps, running, steps]);

  function addAgentToPipeline(agent: StudioAgent) {
    setSteps((current) => [
      ...current,
      createPipelineStep(agent, current.length),
    ]);
  }

  function removeStep(stepId: string) {
    setSteps((current) =>
      current.filter((step) => step.id !== stepId),
    );

    if (activeStep?.id === stepId) {
      setActiveStep(null);
    }
  }

  function moveStep(
    stepId: string,
    direction: "up" | "down",
  ) {
    setSteps((current) => {
      const index = current.findIndex(
        (step) => step.id === stepId,
      );

      if (index === -1) {
        return current;
      }

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }

      const next = [...current];
      const [selected] = next.splice(index, 1);

      if (!selected) {
        return current;
      }

      next.splice(targetIndex, 0, selected);

      return next;
    });
  }

  function startRun() {
    setSteps((current) =>
      current.map((step) => ({
        ...step,
        status: "pending",
        progress: 0,
      })),
    );

    setRun((current) => ({
      ...current,
      status: "running",
      progress: 0,
      createdAt: new Date().toISOString(),
    }));

    setRunning(true);
  }

  function stopRun() {
    setRunning(false);

    setSteps((current) =>
      current.map((step) =>
        step.status === "running"
          ? {
              ...step,
              status: "pending",
            }
          : step,
      ),
    );

    setRun((current) => ({
      ...current,
      status: "stopped",
    }));
  }

  function resetRun() {
    setRunning(false);

    setSteps((current) =>
      current.map((step) => ({
        ...step,
        status: "pending",
        progress: 0,
      })),
    );

    setRun((current) => ({
      ...current,
      status: "draft",
      progress: 0,
    }));
  }

  return (
    <div className="ai-studio-v2">
      <header className="ai-studio-page-header">
        <div>
          <span>AI STUDIO 2.0</span>
          <h2>Intelligent Production Studio</h2>
          <p>
            Configure CreatorOS specialist agents, build production
            workflows and inspect execution progress from one workspace.
          </p>
        </div>

        <div className="ai-studio-page-header__stats">
          <div>
            <strong>{studioAgents.length}</strong>
            <span>Specialist agents</span>
          </div>

          <div>
            <strong>{steps.length}</strong>
            <span>Pipeline steps</span>
          </div>

          <div>
            <strong>{run.progress}%</strong>
            <span>Run progress</span>
          </div>
        </div>
      </header>

      <div className="ai-studio-layout">
        <AgentCatalog
          agents={studioAgents}
          selectedAgentId={selectedAgent?.id}
          search={search}
          category={category}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSelect={setSelectedAgent}
        />

        <main className="ai-studio-main">
          <PipelineBuilder
            steps={steps}
            agents={studioAgents}
            activeStepId={activeStep?.id}
            onRemove={removeStep}
            onMove={moveStep}
            onSelect={setActiveStep}
          />

          <RunConsole
            run={run}
            steps={steps}
            running={running}
            onRun={startRun}
            onStop={stopRun}
            onReset={resetRun}
          />
        </main>

        <AgentInspector
          agent={selectedAgent}
          onAddToPipeline={addAgentToPipeline}
        />
      </div>
    </div>
  );
}
