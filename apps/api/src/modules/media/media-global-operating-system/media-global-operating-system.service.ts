import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AdvertisementIntelligenceEngineService } from './advertisement-intelligence-engine.service';
import { AudienceGrowthEngineService } from './audience-growth-engine.service';
import { GlobalDistributionEngineService } from './global-distribution-engine.service';
import {
  GlobalMediaProgram,
  GlobalMediaProgramInput,
  ProgramStatus,
} from './media-global-operating-system.types';
import { MarketAudienceIntelligenceEngineService } from './market-audience-intelligence-engine.service';
import { MonetizationFinancialEngineService } from './monetization-financial-engine.service';
import { ProductionFactoryEngineService } from './production-factory-engine.service';
import { QualityGovernanceEngineService } from './quality-governance-engine.service';
import { RightsLicensingEngineService } from './rights-licensing-engine.service';
import { RiskComplianceEngineService } from './risk-compliance-engine.service';
import { SecurityResilienceEngineService } from './security-resilience-engine.service';
import { StrategyIntelligenceEngineService } from './strategy-intelligence-engine.service';

@Injectable()
export class MediaGlobalOperatingSystemService {
  private readonly programs = new Map<string, GlobalMediaProgram>();

  constructor(
    private readonly strategyEngine: StrategyIntelligenceEngineService,
    private readonly intelligenceEngine: MarketAudienceIntelligenceEngineService,
    private readonly productionEngine: ProductionFactoryEngineService,
    private readonly distributionEngine: GlobalDistributionEngineService,
    private readonly audienceEngine: AudienceGrowthEngineService,
    private readonly advertisingEngine: AdvertisementIntelligenceEngineService,
    private readonly monetizationEngine: MonetizationFinancialEngineService,
    private readonly rightsEngine: RightsLicensingEngineService,
    private readonly securityEngine: SecurityResilienceEngineService,
    private readonly qualityEngine: QualityGovernanceEngineService,
    private readonly riskEngine: RiskComplianceEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Global Operating System',
      version: 'MGOS-MEGA-1.0.0',
      operational: true,
      phases: [
        'Strategy Intelligence',
        'Market Intelligence',
        'Audience Intelligence',
        'Production Factory',
        'Quality Governance',
        'Global Distribution',
        'Localization',
        'Audience Growth',
        'Community Growth',
        'Advertisement Intelligence',
        'Revenue Intelligence',
        'Financial Forecasting',
        'Rights Management',
        'Licensing',
        'Security',
        'Resilience',
        'Risk Management',
        'Compliance',
        'Learning',
        'Portfolio Command Center',
      ],
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    };
  }

  create(input: GlobalMediaProgramInput): GlobalMediaProgram {
    const now = new Date().toISOString();
    const strategy = this.strategyEngine.build(input);

    const program: GlobalMediaProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: strategy.score >= 0.45 ? 'awaiting-approval' : 'rejected',
      input,
      strategy,
      intelligence: this.intelligenceEngine.build(input),
      production: this.productionEngine.build(),
      distribution: this.distributionEngine.build(input),
      audience: this.audienceEngine.build(input),
      advertising: this.advertisingEngine.build(),
      monetization: this.monetizationEngine.build(input),
      rights: this.rightsEngine.build(input),
      governance: {
        humanApproved: false,
        gates: [
          'strategy-approval',
          'rights-approval',
          'budget-approval',
          'production-approval',
          'distribution-approval',
          'scale-approval',
        ],
      },
      security: this.securityEngine.build(),
      quality: this.qualityEngine.build(input),
      risk: this.riskEngine.build(input),
      learning: [],
      history: [
        {
          at: now,
          actor: input.owner,
          action: 'program-created',
        },
      ],
    };

    this.programs.set(program.id, program);
    return program;
  }

  list(): GlobalMediaProgram[] {
    return [...this.programs.values()];
  }

  get(id: string): GlobalMediaProgram {
    const program = this.programs.get(id);

    if (!program) {
      throw new NotFoundException(`Media program not found: ${id}`);
    }

    return program;
  }

  approve(id: string, approvedBy: string): GlobalMediaProgram {
    const program = this.get(id);

    if (program.status === 'rejected') {
      throw new Error('Rejected program requires reevaluation.');
    }

    const now = new Date().toISOString();
    program.governance = {
      ...program.governance,
      humanApproved: true,
      approvedBy,
      approvedAt: now,
    };
    program.rights.rightsStatus = 'verified';
    program.status = 'approved';
    program.updatedAt = now;
    program.history.push({
      at: now,
      actor: approvedBy,
      action: 'human-approved',
    });

    return program;
  }

  advance(
    id: string,
    status: ProgramStatus,
    actor: string,
  ): GlobalMediaProgram {
    const program = this.get(id);

    if (!program.governance.humanApproved && status !== 'draft') {
      throw new Error('Human approval is required before execution.');
    }

    const now = new Date().toISOString();
    program.status = status;
    program.updatedAt = now;
    program.history.push({
      at: now,
      actor,
      action: `advanced-to-${status}`,
    });

    return program;
  }

  recordMetric(
    id: string,
    metric: string,
    value: number,
    actor: string,
  ): GlobalMediaProgram {
    const program = this.get(id);

    const decision =
      value >= 0.8
        ? 'scale'
        : value >= 0.6
          ? 'continue'
          : value >= 0.4
            ? 'optimize'
            : 'pause-and-review';

    const now = new Date().toISOString();
    program.learning.push({
      at: now,
      metric,
      value,
      decision,
    });
    program.updatedAt = now;
    program.history.push({
      at: now,
      actor,
      action: `metric-recorded:${metric}`,
    });

    return program;
  }

  recordRevenue(
    id: string,
    amount: number,
    actor: string,
  ): GlobalMediaProgram {
    const program = this.get(id);

    if (amount < 0) {
      throw new Error('Revenue amount cannot be negative.');
    }

    program.monetization.realized += amount;
    program.updatedAt = new Date().toISOString();
    program.history.push({
      at: program.updatedAt,
      actor,
      action: `revenue-recorded:${amount}`,
    });

    return program;
  }

  reportIncident(
    id: string,
    incident: string,
    actor: string,
  ): GlobalMediaProgram {
    const program = this.get(id);
    program.security.incidents.push(incident);
    program.status = 'paused';
    program.updatedAt = new Date().toISOString();
    program.history.push({
      at: program.updatedAt,
      actor,
      action: `incident:${incident}`,
    });

    return program;
  }

  dashboard() {
    const programs = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        programs: programs.length,
        approved: programs.filter((item) => item.governance.humanApproved)
          .length,
        inProduction: programs.filter(
          (item) => item.status === 'production',
        ).length,
        distributing: programs.filter(
          (item) => item.status === 'distribution',
        ).length,
        scaling: programs.filter((item) => item.status === 'scaling').length,
        paused: programs.filter((item) => item.status === 'paused').length,
        forecastRevenue: programs.reduce(
          (sum, item) => sum + item.monetization.forecast,
          0,
        ),
        realizedRevenue: programs.reduce(
          (sum, item) => sum + item.monetization.realized,
          0,
        ),
        incidents: programs.reduce(
          (sum, item) => sum + item.security.incidents.length,
          0,
        ),
      },
      priorityPrograms: programs
        .map((item) => ({
          id: item.id,
          name: item.input.name,
          score: item.strategy.score,
          quality: item.quality.score,
          risk: item.risk.score,
          status: item.status,
        }))
        .sort((a, b) => b.score - a.score),
    };
  }
}