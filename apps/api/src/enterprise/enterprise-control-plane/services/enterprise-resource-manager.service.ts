import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseResourceRequest {
  readonly requestId: string;
  readonly workloadId: string;
  readonly cpuUnits: number;
  readonly memoryMb: number;
  readonly priority: number;
  readonly createdAt: Date;
}

export interface EnterpriseResourceAllocation {
  readonly requestId: string;
  readonly nodeId: string;
  readonly cpuUnits: number;
  readonly memoryMb: number;
  readonly allocatedAt: Date;
}

interface ResourceNode {
  readonly nodeId: string;
  readonly cpuCapacity: number;
  readonly memoryCapacityMb: number;
  cpuUsed: number;
  memoryUsedMb: number;
}

@Injectable()
export class EnterpriseResourceManagerService {
  private readonly nodes =
    new Map<string, ResourceNode>();

  private readonly allocations =
    new Map<
      string,
      EnterpriseResourceAllocation
    >();

  registerNode(input: {
    readonly nodeId: string;
    readonly cpuCapacity: number;
    readonly memoryCapacityMb: number;
  }): void {
    const nodeId = input.nodeId.trim();

    if (
      !nodeId ||
      this.nodes.has(nodeId) ||
      !Number.isInteger(
        input.cpuCapacity,
      ) ||
      input.cpuCapacity < 1 ||
      !Number.isInteger(
        input.memoryCapacityMb,
      ) ||
      input.memoryCapacityMb < 1
    ) {
      throw new Error(
        'Valid unique node capacity is required.',
      );
    }

    this.nodes.set(nodeId, {
      nodeId,
      cpuCapacity:
        input.cpuCapacity,
      memoryCapacityMb:
        input.memoryCapacityMb,
      cpuUsed: 0,
      memoryUsedMb: 0,
    });
  }

  allocate(
    request:
      EnterpriseResourceRequest,
    now = new Date(),
  ): EnterpriseResourceAllocation {
    if (
      this.allocations.has(
        request.requestId,
      )
    ) {
      throw new Error(
        `Resource request ${request.requestId} is already allocated.`,
      );
    }

    const candidates =
      [...this.nodes.values()]
        .filter(
          (node) =>
            node.cpuCapacity -
              node.cpuUsed >=
              request.cpuUnits &&
            node.memoryCapacityMb -
              node.memoryUsedMb >=
              request.memoryMb,
        )
        .sort(
          (left, right) => {
            const leftLoad =
              left.cpuUsed /
                left.cpuCapacity +
              left.memoryUsedMb /
                left.memoryCapacityMb;

            const rightLoad =
              right.cpuUsed /
                right.cpuCapacity +
              right.memoryUsedMb /
                right.memoryCapacityMb;

            return leftLoad - rightLoad;
          },
        );

    const selected =
      candidates[0];

    if (!selected) {
      throw new Error(
        'No enterprise resource node can satisfy the request.',
      );
    }

    selected.cpuUsed +=
      request.cpuUnits;

    selected.memoryUsedMb +=
      request.memoryMb;

    const allocation:
      EnterpriseResourceAllocation = {
        requestId:
          request.requestId,
        nodeId:
          selected.nodeId,
        cpuUnits:
          request.cpuUnits,
        memoryMb:
          request.memoryMb,
        allocatedAt:
          new Date(now),
      };

    this.allocations.set(
      request.requestId,
      allocation,
    );

    return {
      ...allocation,
      allocatedAt: new Date(
        allocation.allocatedAt,
      ),
    };
  }

  release(
    requestId: string,
  ): boolean {
    const allocation =
      this.allocations.get(
        requestId,
      );

    if (!allocation) {
      return false;
    }

    const node =
      this.nodes.get(
        allocation.nodeId,
      );

    if (node) {
      node.cpuUsed = Math.max(
        0,
        node.cpuUsed -
          allocation.cpuUnits,
      );

      node.memoryUsedMb = Math.max(
        0,
        node.memoryUsedMb -
          allocation.memoryMb,
      );
    }

    this.allocations.delete(
      requestId,
    );

    return true;
  }

  snapshot() {
    return {
      nodes:
        [...this.nodes.values()]
          .sort(
            (left, right) =>
              left.nodeId.localeCompare(
                right.nodeId,
              ),
          )
          .map((node) => ({
            ...node,
            cpuUtilization:
              node.cpuUsed /
              node.cpuCapacity,
            memoryUtilization:
              node.memoryUsedMb /
              node.memoryCapacityMb,
          })),
      allocations:
        [...this.allocations.values()]
          .map((allocation) => ({
            ...allocation,
            allocatedAt: new Date(
              allocation.allocatedAt,
            ),
          })),
      generatedAt: new Date(),
    };
  }
}
