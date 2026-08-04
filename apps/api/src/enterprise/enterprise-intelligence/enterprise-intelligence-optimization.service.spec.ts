import {
  EnterpriseAuditIntelligenceService,
  EnterpriseCapacityIntelligenceService,
  EnterpriseComplianceEngineService,
  EnterpriseCostIntelligenceService,
  EnterpriseFailurePredictionService,
  EnterpriseGovernanceEngineService,
  EnterpriseIntelligenceOptimizationOrchestratorService,
  EnterprisePerformanceIntelligenceService,
  EnterpriseSelfOptimizationService,
} from './services';

describe(
  'Enterprise intelligence optimization',
  () => {
    it(
      'produces autonomous optimization actions',
      () => {
        const orchestrator =
          new EnterpriseIntelligenceOptimizationOrchestratorService(
            new EnterpriseCostIntelligenceService(),
            new EnterprisePerformanceIntelligenceService(),
            new EnterpriseFailurePredictionService(),
            new EnterpriseCapacityIntelligenceService(),
            new EnterpriseSelfOptimizationService(),
          );

        const result =
          orchestrator.analyze({
            costs: [
              {
                sampleId: 'cost-one',
                category: 'runtime',
                amount: 120,
                budget: 100,
                observedAt: new Date(),
              },
            ],
            performance: [
              {
                metricId:
                  'metric-one',
                throughput: 100,
                latencyMs: 800,
                errorRate: 0.03,
                saturation: 0.9,
                observedAt: new Date(),
              },
            ],
            failureSignals: [
              {
                signalId:
                  'failure-one',
                severity: 0.9,
                frequency: 1,
                recencyWeight: 1,
              },
            ],
            capacity: {
              currentCapacity: 100,
              currentDemand: 90,
              predictedDemand: 140,
              targetUtilization: 0.8,
              minimumCapacity: 50,
              maximumCapacity: 300,
            },
          });

        expect(
          result.actions.map(
            (action) =>
              action.actionId,
          ),
        ).toEqual(
          expect.arrayContaining([
            'isolate-risky-dependency',
            'scale-capacity-up',
            'rebalance-workloads',
            'optimize-enterprise-cost',
          ]),
        );
      },
    );

    it(
      'enforces governance precedence',
      () => {
        const governance =
          new EnterpriseGovernanceEngineService();

        governance.register({
          ruleId: 'allow-one',
          category: 'operational',
          condition:
            'runtime.release',
          effect: 'allow',
          priority: 10,
          enabled: true,
        });

        governance.register({
          ruleId: 'approval-one',
          category: 'security',
          condition:
            'runtime.release',
          effect:
            'require-approval',
          priority: 20,
          enabled: true,
        });

        expect(
          governance.evaluate(
            'runtime.release',
          ).outcome,
        ).toBe(
          'require-approval',
        );
      },
    );

    it(
      'assesses compliance and audit anomalies',
      () => {
        const compliance =
          new EnterpriseComplianceEngineService();

        expect(
          compliance.assess({
            controls: [
              {
                controlId: 'control-one',
                framework: 'internal',
                description:
                  'Approval required',
                required: true,
              },
            ],
            evidence: [
              {
                evidenceId:
                  'evidence-one',
                controlId:
                  'control-one',
                valid: true,
                recordedAt:
                  new Date(),
              },
            ],
          }).compliant,
        ).toBe(true);

        const audit =
          new EnterpriseAuditIntelligenceService();

        expect(
          audit.analyze([
            {
              auditId: 'one',
              actor: 'actor-a',
              action: 'execute',
              resource: 'runtime',
              outcome: 'failure',
              occurredAt:
                new Date(),
            },
            {
              auditId: 'two',
              actor: 'actor-a',
              action: 'execute',
              resource: 'runtime',
              outcome: 'failure',
              occurredAt:
                new Date(),
            },
            {
              auditId: 'three',
              actor: 'actor-a',
              action: 'execute',
              resource: 'runtime',
              outcome: 'failure',
              occurredAt:
                new Date(),
            },
          ]).suspiciousActors,
        ).toContain('actor-a');
      },
    );
  },
);
