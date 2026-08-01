import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecutionOrchestrationEngineService {
  build() {
    return {
      workstreams: [
        'strategy',
        'finance',
        'legal',
        'technology',
        'content',
        'distribution',
        'commercial',
        'risk',
      ],
      milestones: [
        'human-approval',
        'pilot-ready',
        'pilot-launched',
        'evidence-reviewed',
        'scale-decision',
        'scale-executed',
      ],
      blockers: [],
    };
  }
}