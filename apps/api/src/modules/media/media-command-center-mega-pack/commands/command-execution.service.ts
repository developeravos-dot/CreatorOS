import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CommandRequest } from '../media-command-center.types';

@Injectable()
export class CommandExecutionService {
  create(
    command: string,
    targetSystem: string,
    payload: Record<string, unknown>,
    riskLevel: CommandRequest['riskLevel'],
    requestedBy: string,
  ): CommandRequest {
    const now = new Date().toISOString();

    return {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      command,
      targetSystem,
      payload,
      riskLevel,
      status:
        riskLevel === 'high' || riskLevel === 'critical'
          ? 'awaiting-human-approval'
          : 'queued',
      requestedBy,
    };
  }

  approve(
    command: CommandRequest,
    approvedBy: string,
  ) {
    if (command.status !== 'awaiting-human-approval') {
      throw new Error('Command is not awaiting human approval.');
    }

    command.status = 'approved';
    command.approvedBy = approvedBy;
    command.updatedAt = new Date().toISOString();
    return command;
  }

  execute(command: CommandRequest) {
    if (
      !['queued', 'approved'].includes(command.status)
    ) {
      throw new Error('Command is not ready for execution.');
    }

    if (
      ['high', 'critical'].includes(command.riskLevel) &&
      !command.approvedBy
    ) {
      throw new Error(
        'High-risk commands require human approval.',
      );
    }

    command.status = 'executing';
    command.updatedAt = new Date().toISOString();

    command.result = {
      accepted: true,
      command: command.command,
      targetSystem: command.targetSystem,
      payload: command.payload,
      executionMode: 'controlled-command-center',
    };
    command.status = 'completed';
    command.updatedAt = new Date().toISOString();

    return command;
  }
}