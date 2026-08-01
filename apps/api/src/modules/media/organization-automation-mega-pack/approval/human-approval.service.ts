import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ApprovalRequest } from '../organization-automation.types';

@Injectable()
export class HumanApprovalService {
  request(
    category: string,
    targetId: string,
    requestedBy: string,
    reason: string,
  ): ApprovalRequest {
    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      category,
      targetId,
      requestedBy,
      reason,
      status: 'pending',
    };
  }

  decide(
    request: ApprovalRequest,
    approved: boolean,
    decidedBy: string,
  ) {
    if (request.status !== 'pending') {
      throw new Error('Approval request has already been decided.');
    }

    request.status = approved ? 'approved' : 'rejected';
    request.decidedBy = decidedBy;
    request.decidedAt = new Date().toISOString();
    return request;
  }
}