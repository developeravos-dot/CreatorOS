import {
  NotFoundException,
} from "@nestjs/common";

import {
  RuntimeDispatcherService,
} from "./runtime-dispatcher.service";

describe(
  "RuntimeDispatcherService",
  () => {
    const registry = {
      discover: jest.fn(),
    };

    const service =
      new RuntimeDispatcherService(
        registry as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("creates a Runtime overview", async () => {
      registry.discover.mockResolvedValue([
        {
          id: "provider-1",
          capability: "agent",
          availability: "available",
          available: true,
          health: 100,
          workload: 20,
          priority: 10,
        },
        {
          id: "provider-2",
          capability: "agent",
          availability: "busy",
          available: false,
          health: 80,
          workload: 70,
          priority: 0,
        },
      ]);

      await expect(
        service.getOverview(),
      ).resolves.toEqual({
        providers: 2,
        available: 1,
        busy: 1,
        degraded: 0,
        offline: 0,
        capabilities: {
          agent: 2,
        },
        averageHealth: 90,
        averageWorkload: 45,
      });
    });

    it("selects the healthiest compatible provider", async () => {
      registry.discover.mockResolvedValue([
        {
          id: "provider-low",
          capability: "agent",
          scope: "default",
          availability: "available",
          available: true,
          health: 70,
          workload: 60,
          priority: 0,
        },
        {
          id: "provider-best",
          capability: "agent",
          scope: "default",
          availability: "available",
          available: true,
          health: 100,
          workload: 10,
          priority: 5,
        },
      ]);

      const decision =
        await service.selectProvider({
          capability: "agent",
        });

      expect(
        decision.selected.provider.id,
      ).toBe("provider-best");

      expect(
        decision.alternatives,
      ).toHaveLength(1);
    });

    it("honors the preferred provider bonus", async () => {
      registry.discover.mockResolvedValue([
        {
          id: "provider-default",
          capability: "agent",
          scope: "default",
          availability: "available",
          available: true,
          health: 95,
          workload: 10,
          priority: 0,
        },
        {
          id: "provider-preferred",
          capability: "agent",
          scope: "default",
          availability: "available",
          available: true,
          health: 80,
          workload: 20,
          priority: 0,
        },
      ]);

      const decision =
        await service.selectProvider({
          capability: "agent",
          preferredProviderId:
            "provider-preferred",
        });

      expect(
        decision.selected.provider.id,
      ).toBe("provider-preferred");
    });

    it("throws when no provider is available", async () => {
      registry.discover.mockResolvedValue([]);

      await expect(
        service.selectProvider({
          capability: "agent",
        }),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  },
);