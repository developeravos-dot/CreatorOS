import { Injectable } from '@nestjs/common';

export interface ExecutiveCouncilRecommendation {
  council: string[];
  subject: string;
  recommendation: string;
  riskLevel: 'low' | 'medium';
  requiresHumanApproval: true;
}

@Injectable()
export class ExecutiveCouncilService {
  build() {
    return {
      aiCeo: 'Sets mission, portfolio priorities and final executive recommendation',
      aiCoo: 'Coordinates operations, capacity, dependencies and delivery health',
      aiCmo: 'Owns audience, positioning, growth and channel strategy',
      aiCfo: 'Owns budgets, unit economics, revenue quality and investment gates',
      aiCto: 'Owns architecture, model routing, security and platform reliability',
      meetingProtocol: ['context', 'evidence', 'options', 'risks', 'recommendation', 'human decision'],
    };
  }

  recommend(subject: string, evidence: Record<string, unknown>): ExecutiveCouncilRecommendation {
    const riskLevel: 'low' | 'medium' = Object.keys(evidence).length > 4 ? 'medium' : 'low';
    return {
      council: ['AI CEO', 'AI COO', 'AI CMO', 'AI CFO', 'AI CTO'],
      subject,
      recommendation: `Proceed through a controlled pilot for ${subject}`,
      riskLevel,
      requiresHumanApproval: true,
    };
  }
}
