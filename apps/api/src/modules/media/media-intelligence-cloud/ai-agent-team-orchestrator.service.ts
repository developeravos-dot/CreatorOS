import { Injectable } from '@nestjs/common';
import { IntelligenceSignalInput } from './media-intelligence-cloud.types';

@Injectable()
export class AiAgentTeamOrchestratorService {
  build(input: IntelligenceSignalInput) {
    const team = [
      'Research Agent',
      'Trend Agent',
      'Market Agent',
      'Audience Agent',
      'Competitor Agent',
      'Strategy Agent',
      'Risk Agent',
      'Finance Agent',
      'Execution Agent',
    ];

    return {
      team,
      assignments: team.map((agent) => ({
        agent,
        task: `${agent.toLowerCase().replaceAll(' ', '-')}:${input.domain}`,
        status: 'queued' as const,
      })),
    };
  }
}