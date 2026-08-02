import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import {
  AiTeamExecutionService,
} from "./ai-team-execution.service";

describe(
  "AiTeamExecutionService",
  () => {
    const repository = {
      findWorkspaceByKey: jest.fn(),
      listSessions: jest.fn(),
      findSessionById: jest.fn(),
      findJobById: jest.fn(),
      findStepById: jest.fn(),
      createSession: jest.fn(),
      createJob: jest.fn(),
      createStep: jest.fn(),
      createResult: jest.fn(),
      updateSessionStatus: jest.fn(),
      updateJobStatus: jest.fn(),
      updateStepStatus: jest.fn(),
    };

    const service =
      new AiTeamExecutionService(
        repository as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("returns execution-domain health", () => {
      expect(service.getHealth()).toEqual({
        status: "operational",
        persistence: "postgresql",
        orm: "prisma",
        runtimeIntegration: "ready",
        humanFinalAuthority: true,
      });
    });

    it("rejects a session without a name", async () => {
      await expect(
        service.createSession({
          workspaceKey: "default",
          name: " ",
        }),
      ).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("rejects a missing workspace", async () => {
      repository.findWorkspaceByKey.mockResolvedValue(
        null,
      );

      await expect(
        service.createSession({
          workspaceKey: "missing",
          name: "Test execution",
        }),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("creates a persistent execution session", async () => {
      repository.findWorkspaceByKey.mockResolvedValue({
        id: "workspace-1",
      });

      repository.createSession.mockResolvedValue({
        id: "session-1",
        name: "YouTube production",
      });

      await expect(
        service.createSession({
          workspaceKey: "default",
          name: "YouTube production",
        }),
      ).resolves.toEqual({
        id: "session-1",
        name: "YouTube production",
      });

      expect(
        repository.createSession,
      ).toHaveBeenCalledWith(
        "workspace-1",
        expect.objectContaining({
          name: "YouTube production",
          sessionKey: expect.stringContaining(
            "execution-session-",
          ),
        }),
      );
    });
  },
);