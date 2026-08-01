import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  PlatformCapability,
  PlatformCommand,
} from '../platform-integration.types';

@Injectable()
export class PlatformCommandRouterService {
  create(
    command: string,
    targetCapability: string,
    payload: Record<string, unknown>,
    riskLevel: PlatformCommand['riskLevel'],
    requestedBy: string,
  ): PlatformCommand {
    const highRisk =
      riskLevel === 'high' ||
      riskLevel === 'critical';

    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      command,
      targetCapability,
      payload,
      riskLevel,
      status: highRisk
        ? 'awaiting-human-approval'
        : 'queued',
      requestedBy,
    };
  }

  approve(
    command: PlatformCommand,
    approvedBy: string,
  ) {
    if (
      command.status !==
      'awaiting-human-approval'
    ) {
      throw new Error(
        'Command is not awaiting approval.',
      );
    }

    command.status = 'approved';
    command.approvedBy = approvedBy;
    return command;
  }

  execute(
    command: PlatformCommand,
    capability: PlatformCapability,
  ) {
    if (!capability.enabled) {
      throw new Error(
        'Target capability is disabled.',
      );
    }

    if (
      ['high', 'critical'].includes(
        command.riskLevel,
      ) &&
      !command.approvedBy
    ) {
      throw new Error(
        'Human approval is required.',
      );
    }

    if (
      !['queued', 'approved'].includes(
        command.status,
      )
    ) {
      throw new Error(
        'Command is not ready.',
      );
    }

    command.status = 'completed';
    command.result = {
      routed: true,
      capability: capability.key,
      apiRoot: capability.apiRoot,
      command: command.command,
      payload: command.payload,
    };

    return command;
  }
}