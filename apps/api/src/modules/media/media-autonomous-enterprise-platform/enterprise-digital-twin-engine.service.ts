import { Injectable } from '@nestjs/common';
import { AutonomousInitiativeInput } from './media-autonomous-enterprise.types';

@Injectable()
export class EnterpriseDigitalTwinEngineService {
  build(input: AutonomousInitiativeInput) {
    const budget = Math.max(0, input.budget ?? 100000);
    const expectedReturn = Math.max(0, input.expectedReturn ?? 0.65);
    const readiness = Math.max(0, Math.min(1, input.readiness ?? 0.6));
    const risk = Math.max(0, Math.min(1, input.risk ?? 0.35));

    const projectedValue = Math.round(
      budget + budget * expectedReturn * readiness * (1 - risk),
    );

    return {
      baselineValue: budget,
      projectedValue,
      variables: {
        budget,
        expectedReturn,
        readiness,
        risk,
        timeHorizonMonths: input.timeHorizonMonths ?? 12,
      },
    };
  }
}