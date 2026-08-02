import "reflect-metadata";

import {
  PATH_METADATA,
  METHOD_METADATA,
} from "@nestjs/common/constants";
import {
  RequestMethod,
} from "@nestjs/common";

import {
  AiTeamExecutionController,
} from "./ai-team-execution.controller";

describe("AiTeamExecutionController", () => {
  let controller: AiTeamExecutionController;

  beforeEach(() => {
    controller = Object.create(
      AiTeamExecutionController.prototype,
    ) as AiTeamExecutionController;
  });

  describe("status", () => {
    it("should return the operational module status", () => {
      expect(controller.getStatus()).toEqual({
        success: true,
        module: "AiTeamExecutionModule",
        controller: "AiTeamExecutionController",
        status: "operational",
      });
    });

    it("should expose the expected controller route", () => {
      const controllerPath = Reflect.getMetadata(
        PATH_METADATA,
        AiTeamExecutionController,
      );

      expect(controllerPath).toBe(
        "enterprise/ai-team-execution",
      );
    });

    it("should expose GET /status", () => {
      const statusMethod =
        AiTeamExecutionController.prototype.getStatus;

      const routePath = Reflect.getMetadata(
        PATH_METADATA,
        statusMethod,
      );

      const requestMethod = Reflect.getMetadata(
        METHOD_METADATA,
        statusMethod,
      );

      expect(routePath).toBe("status");
      expect(requestMethod).toBe(RequestMethod.GET);
    });
  });
});
