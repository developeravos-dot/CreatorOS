import {
  Injectable,
} from '@nestjs/common';

import type {
  EnterpriseSignal,
} from '../contracts';
import {
  EnterpriseDecisionEngineService,
} from './enterprise-decision-engine.service';
import {
  EnterprisePredictionEngineService,
} from './enterprise-prediction-engine.service';
import {
  EnterpriseRiskIntelligenceService,
} from './enterprise-risk-intelligence.service';
import {
  EnterpriseStrategyEngineService,
} from './enterprise-strategy-engine.service';

@Injectable()
export class EnterpriseIntelligenceOrchestratorService {
  constructor(
    private readonly prediction:
      EnterprisePredictionEngineService,
    private readonly risk:
      EnterpriseRiskIntelligenceService,
    private readonly strategy:
      EnterpriseStrategyEngineService,
    private readonly decision:
      EnterpriseDecisionEngineService,
  ) {}

  analyze(input: {
    readonly analysisId: string;
    readonly objective: string;
    readonly signals:
      readonly EnterpriseSignal[];
  }) {
    const risk =
      this.risk.assess({
        assessmentId:
          input.analysisId +
          '-risk',
        signals: input.signals,
      });

    const predictions =
      [...new Set(
        input.signals.map(
          (signal) =>
            signal.category,
        ),
      )]
        .map((category) => {
          const categorySignals =
            input.signals.filter(
              (signal) =>
                signal.category ===
                category,
            );

          return categorySignals.length >= 2
            ? this.prediction.predict({
                predictionId:
                  input.analysisId +
                  '-' +
                  category,
                signals:
                  categorySignals,
              })
            : null;
        })
        .filter(
          (
            prediction,
          ): prediction is NonNullable<
            typeof prediction
          > =>
            prediction !== null,
        );

    const strategy =
      this.strategy.create({
        strategyId:
          input.analysisId +
          '-strategy',
        objective:
          input.objective,
        horizon: 'short-term',
        candidateActions: [
          {
            action:
              'maintain-current-state',
            impact:
              50 - risk.score / 2,
            risk:
              risk.score / 2,
          },
          {
            action:
              'apply-targeted-optimization',
            impact: 70,
            risk: risk.score,
          },
          {
            action:
              'enter-protective-mode',
            impact: risk.score,
            risk: 20,
          },
        ],
      });

    const decision =
      this.decision.recommend({
        decisionId:
          input.analysisId +
          '-decision',
        objective:
          input.objective,
        candidates:
          strategy.actions.map(
            (action, index) => ({
              action,
              benefit:
                strategy.expectedImpact -
                index * 5,
              cost:
                index * 10,
              risk:
                strategy.riskScore,
              confidence:
                Math.max(
                  0.5,
                  1 -
                    strategy.riskScore /
                      200,
                ),
            }),
          ),
      });

    return {
      risk,
      predictions,
      strategy,
      decision,
      generatedAt: new Date(),
    };
  }
}
