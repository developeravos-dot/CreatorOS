import type {
  EnterpriseSignal,
} from './contracts';
import {
  EnterpriseDecisionEngineService,
  EnterpriseIntelligenceOrchestratorService,
  EnterprisePredictionEngineService,
  EnterpriseRiskIntelligenceService,
  EnterpriseStrategyEngineService,
} from './services';

describe(
  'Enterprise intelligence foundation',
  () => {
    const signals:
      readonly EnterpriseSignal[] = [
        {
          signalId: 'risk-one',
          category: 'risk',
          value: 40,
          confidence: 0.8,
          observedAt: new Date(
            '2026-08-04T10:00:00.000Z',
          ),
        },
        {
          signalId: 'risk-two',
          category: 'risk',
          value: 60,
          confidence: 0.9,
          observedAt: new Date(
            '2026-08-04T11:00:00.000Z',
          ),
        },
      ];

    it(
      'predicts directional enterprise signals',
      () => {
        const prediction =
          new EnterprisePredictionEngineService();

        expect(
          prediction.predict({
            predictionId:
              'prediction-one',
            signals,
          }).direction,
        ).toBe('increase');
      },
    );

    it(
      'builds strategy and human-governed decisions',
      () => {
        const decision =
          new EnterpriseDecisionEngineService();

        const orchestrator =
          new EnterpriseIntelligenceOrchestratorService(
            new EnterprisePredictionEngineService(),
            new EnterpriseRiskIntelligenceService(),
            new EnterpriseStrategyEngineService(),
            decision,
          );

        const analysis =
          orchestrator.analyze({
            analysisId:
              'analysis-one',
            objective:
              'Protect runtime reliability',
            signals,
          });

        expect(
          analysis.predictions,
        ).toHaveLength(1);

        expect(
          analysis.decision.status,
        ).toBe('recommended');

        const resolved =
          decision.resolve(
            analysis.decision
              .decisionId,
            true,
          );

        expect(resolved.status)
          .toBe('approved');

        expect(
          decision.markExecuted(
            resolved.decisionId,
          ).status,
        ).toBe('executed');
      },
    );

    it(
      'rejects execution before approval',
      () => {
        const decision =
          new EnterpriseDecisionEngineService();

        const recommendation =
          decision.recommend({
            decisionId:
              'decision-one',
            objective:
              'Optimize costs',
            candidates: [
              {
                action:
                  'reduce-capacity',
                benefit: 80,
                cost: 10,
                risk: 60,
                confidence: 0.8,
              },
            ],
          });

        expect(
          recommendation
            .requiresHumanApproval,
        ).toBe(true);

        expect(
          () =>
            decision.markExecuted(
              recommendation
                .decisionId,
            ),
        ).toThrow(
          'Only approved decisions',
        );
      },
    );
  },
);
