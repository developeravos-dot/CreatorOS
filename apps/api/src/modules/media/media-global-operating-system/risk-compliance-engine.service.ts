import { Injectable } from '@nestjs/common';
import { GlobalMediaProgramInput } from './media-global-operating-system.types';

@Injectable()
export class RiskComplianceEngineService {
  build(input: GlobalMediaProgramInput) {
    return {
      score: Math.max(0, Math.min(1, input.risk ?? 0.3)),
      controls: [
        'rights-clearance',
        'privacy-control',
        'market-compliance',
        'platform-policy-control',
        'brand-safety',
        'financial-control',
        'human-escalation',
      ],
    };
  }
}