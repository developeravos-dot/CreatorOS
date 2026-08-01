import { Injectable } from '@nestjs/common';
import { IntelligenceCoreProgram } from '../intelligence-core.types';

@Injectable()
export class IntelligenceCoreQualityService {
  evaluate(program: IntelligenceCoreProgram) {
    const scores = {
      analytics:
        program.analytics.length >= 1 ? 94 : 50,
      learning:
        Array.isArray(program.learnings) ? 92 : 50,
      improvement:
        program.improvements.length >= 1 ? 93 : 50,
      knowledgeGraph:
        program.knowledgeGraph.nodes.length >= 2 ? 95 : 55,
      memory:
        Array.isArray(program.memory) ? 92 : 50,
      digitalDna:
        program.digitalDna.principles.length >= 4 ? 96 : 60,
      protectedAuthority:
        program.digitalDna.principles.includes('human-final-authority')
          ? 100
          : 0,
      governance:
        program.governance.humanApproved ? 100 : 70,
    };

    const failures = Object.entries(scores)
      .filter(([, score]) => score < 80)
      .map(([name]) => `${name}-below-threshold`);

    return {
      scores,
      failures,
      approved:
        failures.length === 0 &&
        program.governance.humanApproved,
    };
  }
}