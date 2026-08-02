import {
  AiTeamExecutionController,
} from "./ai-team-execution.controller";

describe(
  "AiTeamExecutionController",
  () => {
    const service = {};
    const scheduler = {};
    const assignment = {};
    const gateway = {};

    const orchestrator = {
      executeSession: jest.fn(),
    };

    const controller =
      new AiTeamExecutionController(
        service as never,
        scheduler as never,
        assignment as never,
        gateway as never,
        orchestrator as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("executes a complete session through the orchestrator", async () => {
      orchestrator.executeSession.mockResolvedValue({
        sessionId: "session-1",
        status: "COMPLETED",
        progress: 100,
        executedJobs: 1,
        executedSteps: 2,
        failedSteps: 0,
        waitingApproval: false,
        waitingJobId: null,
        waitingStepId: null,
      });

      await expect(
        controller.executeSession(
          "session-1",
        ),
      ).resolves.toEqual({
        sessionId: "session-1",
        status: "COMPLETED",
        progress: 100,
        executedJobs: 1,
        executedSteps: 2,
        failedSteps: 0,
        waitingApproval: false,
        waitingJobId: null,
        waitingStepId: null,
      });

      expect(
        orchestrator.executeSession,
      ).toHaveBeenCalledTimes(1);

      expect(
        orchestrator.executeSession,
      ).toHaveBeenCalledWith(
        "session-1",
      );
    });

    it("passes orchestrator failures to Nest", async () => {
      orchestrator.executeSession.mockRejectedValue(
        new Error(
          "Execution failed.",
        ),
      );

      await expect(
        controller.executeSession(
          "session-failed",
        ),
      ).rejects.toThrow(
        "Execution failed.",
      );
    });
  },
);