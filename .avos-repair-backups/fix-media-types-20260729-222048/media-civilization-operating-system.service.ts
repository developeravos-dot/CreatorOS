import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CivilizationCommerceEngineService } from './civilization-commerce-engine.service';
import { CivilizationConstitutionEngineService } from './civilization-constitution-engine.service';
import { CivilizationDiplomacyEngineService } from './civilization-diplomacy-engine.service';
import { CivilizationEconomyEngineService } from './civilization-economy-engine.service';
import { CivilizationExecutionEngineService } from './civilization-execution-engine.service';
import { CivilizationObservabilityEngineService } from './civilization-observability-engine.service';
import { CivilizationResilienceEngineService } from './civilization-resilience-engine.service';
import { CultureCivilizationEngineService } from './culture-civilization-engine.service';
import { DigitalCityEngineService } from './digital-city-engine.service';
import { DigitalIdentityPassportEngineService } from './digital-identity-passport-engine.service';
import { IpCivilizationEngineService } from './ip-civilization-engine.service';
import { KnowledgeCivilizationEngineService } from './knowledge-civilization-engine.service';
import {
  CivilizationProgram,
  CivilizationProgramInput,
  CivilizationProgramStatus,
} from './media-civilization.types';
import { CommunityCivilizationEngineService } from './community-civilization-engine.service';
import { SustainabilityCivilizationEngineService } from './sustainability-civilization-engine.service';

@Injectable()
export class MediaCivilizationOperatingSystemService {
  private readonly programs = new Map<string, CivilizationProgram>();

  constructor(
    private readonly constitutionEngine: CivilizationConstitutionEngineService,
    private readonly cityEngine: DigitalCityEngineService,
    private readonly economyEngine: CivilizationEconomyEngineService,
    private readonly identityEngine: DigitalIdentityPassportEngineService,
    private readonly ipEngine: IpCivilizationEngineService,
    private readonly knowledgeEngine: KnowledgeCivilizationEngineService,
    private readonly cultureEngine: CultureCivilizationEngineService,
    private readonly communityEngine: CommunityCivilizationEngineService,
    private readonly commerceEngine: CivilizationCommerceEngineService,
    private readonly sustainabilityEngine: SustainabilityCivilizationEngineService,
    private readonly resilienceEngine: CivilizationResilienceEngineService,
    private readonly diplomacyEngine: CivilizationDiplomacyEngineService,
    private readonly executionEngine: CivilizationExecutionEngineService,
    private readonly observabilityEngine: CivilizationObservabilityEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Civilization Operating System',
      version: 'MCOS-36-1.0.0',
      operational: true,
      phases: [
        'Civilization Constitution',
        'Human Rights Layer',
        'Digital City Architecture',
        'Knowledge District',
        'Creator District',
        'Commerce District',
        'Innovation District',
        'Culture District',
        'Community District',
        'Governance District',
        'Infrastructure District',
        'Civilization Economy',
        'Creator Economy',
        'IP Economy',
        'Knowledge Economy',
        'Digital Identity',
        'Digital Passport',
        'Trust and Reputation',
        'IP Civilization',
        'Rights Provenance',
        'Knowledge Institutions',
        'Learning Civilization',
        'Cultural Preservation',
        'Cultural Creation',
        'Community Governance',
        'Community Safety',
        'Global Marketplaces',
        'Partner Networks',
        'Sustainability',
        'Civilization Resilience',
        'Digital Diplomacy',
        'Regional Expansion',
        'Execution Orchestration',
        'Civilization Observability',
        'Executive Civilization Command',
        'Human Final Authority',
      ],
      humanFinalAuthority: true,
    };
  }

  create(input: CivilizationProgramInput): CivilizationProgram {
    const now = new Date().toISOString();

    const program: CivilizationProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      input,
      constitution: this.constitutionEngine.build(),
      digitalCity: this.cityEngine.build(input),
      economy: this.economyEngine.build(input),
      identity: this.identityEngine.build(),
      ipCivilization: this.ipEngine.build(input),
      knowledge: this.knowledgeEngine.build(),
      culture: this.cultureEngine.build(input),
      governance: {
        councils: [
          'Human Authority Council',
          'AI Advisory Council',
          'Creator Council',
          'Community Council',
          'Rights and Ethics Council',
          'Economic Council',
        ],
        decisionGates: [
          'constitution-gate',
          'rights-gate',
          'architecture-gate',
          'safety-gate',
          'economic-gate',
          'human-authority-gate',
        ],
        humanApproved: false,
        auditTrail: [`${now}:program-created:${input.owner}`],
      },
      community: this.communityEngine.build(input),
      commerce: this.commerceEngine.build(input),
      sustainability: this.sustainabilityEngine.build(input),
      resilience: this.resilienceEngine.build(),
      diplomacy: this.diplomacyEngine.build(input),
      execution: this.executionEngine.build(),
      observability: this.observabilityEngine.build(),
    };

    program.observability.metrics.economicValue =
      program.economy.projectedEconomicValue;
    program.observability.metrics.inclusionScore =
      program.sustainability.indicators.inclusion;
    program.observability.metrics.sustainabilityScore =
      program.sustainability.indicators.sustainability;
    program.observability.metrics.culturalImpactScore =
      program.sustainability.indicators.culturalImpact;

    this.programs.set(program.id, program);
    return program;
  }

  list(): CivilizationProgram[] {
    return [...this.programs.values()];
  }

  get(id: string): CivilizationProgram {
    const program = this.programs.get(id);

    if (!program) {
      throw new NotFoundException(`Civilization program not found: ${id}`);
    }

    return program;
  }

  approve(id: string, approvedBy: string): CivilizationProgram {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.status = 'approved';
    program.updatedAt = now;
    program.governance.humanApproved = true;
    program.governance.approvedBy = approvedBy;
    program.governance.approvedAt = now;
    program.governance.auditTrail.push(
      `${now}:human-approved:${approvedBy}`,
    );

    return program;
  }

  advance(
    id: string,
    status: CivilizationProgramStatus,
    actor: string,
  ): CivilizationProgram {
    const program = this.get(id);

    if (
      !program.governance.humanApproved &&
      !['draft', 'awaiting-human-approval'].includes(status)
    ) {
      throw new Error('Human approval is required before design or operation.');
    }

    const now = new Date().toISOString();
    program.status = status;
    program.updatedAt = now;
    program.governance.auditTrail.push(
      `${now}:advanced-to-${status}:${actor}`,
    );

    return program;
  }

  activateWorkstreams(
    id: string,
    actor: string,
  ): CivilizationProgram {
    const program = this.get(id);

    if (!program.governance.humanApproved) {
      throw new Error('Human approval is required before workstream activation.');
    }

    program.execution.workstreams = program.execution.workstreams.map(
      (workstream) => ({
        ...workstream,
        status: 'active',
      }),
    );
    program.status = 'designing';
    program.updatedAt = new Date().toISOString();
    program.governance.auditTrail.push(
      `${program.updatedAt}:workstreams-activated:${actor}`,
    );

    return program;
  }

  updateMetric(
    id: string,
    metric: string,
    value: number,
    actor: string,
  ): CivilizationProgram {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.observability.metrics[metric] = value;
    program.updatedAt = now;
    program.governance.auditTrail.push(
      `${now}:metric:${metric}:${value}:${actor}`,
    );

    if (metric === 'trustScore' && value < 0.4) {
      program.observability.alerts.push('trust-score-critical');
      program.status = 'paused';
    }

    if (metric === 'sustainabilityScore' && value < 0.35) {
      program.observability.alerts.push('sustainability-score-critical');
      program.status = 'paused';
    }

    return program;
  }

  addBlocker(
    id: string,
    blocker: string,
    actor: string,
  ): CivilizationProgram {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.execution.blockers.push(blocker);
    program.status = 'paused';
    program.updatedAt = now;
    program.observability.alerts.push(`blocker:${blocker}`);
    program.governance.auditTrail.push(
      `${now}:blocker-added:${blocker}:${actor}`,
    );

    return program;
  }

  addAgreement(
    id: string,
    agreement: string,
    actor: string,
  ): CivilizationProgram {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.diplomacy.agreements.push(agreement);
    program.updatedAt = now;
    program.governance.auditTrail.push(
      `${now}:agreement-added:${agreement}:${actor}`,
    );

    return program;
  }

  dashboard() {
    const programs = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        programs: programs.length,
        approved: programs.filter(
          (program) => program.governance.humanApproved,
        ).length,
        operating: programs.filter(
          (program) => program.status === 'operating',
        ).length,
        scaling: programs.filter(
          (program) => program.status === 'scaling',
        ).length,
        paused: programs.filter(
          (program) => program.status === 'paused',
        ).length,
        projectedEconomicValue: programs.reduce(
          (sum, program) =>
            sum + program.economy.projectedEconomicValue,
          0,
        ),
        alerts: programs.reduce(
          (sum, program) => sum + program.observability.alerts.length,
          0,
        ),
      },
      commandView: programs
        .map((program) => ({
          id: program.id,
          name: program.input.name,
          domain: program.input.civilizationDomain,
          status: program.status,
          regions: program.input.regions ?? [],
          populationTarget: program.input.populationTarget ?? 0,
          projectedEconomicValue:
            program.economy.projectedEconomicValue,
          sustainabilityScore:
            program.sustainability.indicators.sustainability,
          inclusionScore:
            program.sustainability.indicators.inclusion,
          culturalImpactScore:
            program.sustainability.indicators.culturalImpact,
        }))
        .sort(
          (a, b) =>
            b.projectedEconomicValue - a.projectedEconomicValue,
        ),
    };
  }
}