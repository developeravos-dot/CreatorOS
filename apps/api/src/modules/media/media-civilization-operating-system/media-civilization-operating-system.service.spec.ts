import { CivilizationCommerceEngineService } from './civilization-commerce-engine.service';
import { CivilizationConstitutionEngineService } from './civilization-constitution-engine.service';
import { CivilizationDiplomacyEngineService } from './civilization-diplomacy-engine.service';
import { CivilizationEconomyEngineService } from './civilization-economy-engine.service';
import { CivilizationExecutionEngineService } from './civilization-execution-engine.service';
import { CivilizationObservabilityEngineService } from './civilization-observability-engine.service';
import { CivilizationResilienceEngineService } from './civilization-resilience-engine.service';
import { CommunityCivilizationEngineService } from './community-civilization-engine.service';
import { CultureCivilizationEngineService } from './culture-civilization-engine.service';
import { DigitalCityEngineService } from './digital-city-engine.service';
import { DigitalIdentityPassportEngineService } from './digital-identity-passport-engine.service';
import { IpCivilizationEngineService } from './ip-civilization-engine.service';
import { KnowledgeCivilizationEngineService } from './knowledge-civilization-engine.service';
import { MediaCivilizationOperatingSystemService } from './media-civilization-operating-system.service';
import { SustainabilityCivilizationEngineService } from './sustainability-civilization-engine.service';

function createSystem() {
  return new MediaCivilizationOperatingSystemService(
    new CivilizationConstitutionEngineService(),
    new DigitalCityEngineService(),
    new CivilizationEconomyEngineService(),
    new DigitalIdentityPassportEngineService(),
    new IpCivilizationEngineService(),
    new KnowledgeCivilizationEngineService(),
    new CultureCivilizationEngineService(),
    new CommunityCivilizationEngineService(),
    new CivilizationCommerceEngineService(),
    new SustainabilityCivilizationEngineService(),
    new CivilizationResilienceEngineService(),
    new CivilizationDiplomacyEngineService(),
    new CivilizationExecutionEngineService(),
    new CivilizationObservabilityEngineService(),
  );
}

describe('MediaCivilizationOperatingSystemService', () => {
  it('creates a complete 36-phase civilization program', () => {
    const system = createSystem();

    const program = system.create({
      name: 'AVOS Global Media City',
      vision: 'Build a global AI-native media civilization',
      owner: 'AVOS Media',
      civilizationDomain: 'digital-city',
      regions: ['UAE', 'Saudi Arabia', 'Europe', 'United States'],
      languages: ['Arabic', 'English'],
      communities: ['Creators', 'Researchers', 'Businesses'],
      platforms: ['CreatorOS', 'AVOS Media'],
      budget: 5000000,
      populationTarget: 1000000,
      strategicFit: 0.98,
      readiness: 0.78,
      sustainability: 0.85,
      inclusion: 0.9,
      economicPotential: 0.95,
      culturalImpact: 0.92,
      risk: 0.22,
      timeHorizonYears: 10,
    });

    expect(program.constitution.humanFinalAuthority).toBe(true);
    expect(program.digitalCity.districts).toContain('Knowledge District');
    expect(program.economy.projectedEconomicValue).toBeGreaterThan(5000000);
    expect(program.identity.passportModel).toContain('portable');
    expect(program.ipCivilization.assets).toContain('characters');
    expect(program.execution.workstreams).toHaveLength(6);
  });

  it('blocks operation before human approval', () => {
    const system = createSystem();

    const program = system.create({
      name: 'Knowledge Civilization',
      vision: 'Build a global knowledge civilization',
      owner: 'AVOS Media',
      civilizationDomain: 'knowledge',
    });

    expect(() =>
      system.advance(program.id, 'operating', 'AI Council'),
    ).toThrow();

    system.approve(program.id, 'Khalifa');

    expect(
      system.advance(program.id, 'operating', 'Khalifa').status,
    ).toBe('operating');
  });

  it('activates workstreams after approval', () => {
    const system = createSystem();

    const program = system.create({
      name: 'Creator Economy City',
      vision: 'Build a creator-centered digital economy',
      owner: 'AVOS Media',
      civilizationDomain: 'media-economy',
    });

    system.approve(program.id, 'Khalifa');
    system.activateWorkstreams(program.id, 'Khalifa');

    expect(program.execution.workstreams[0]!.status).toBe('active');
    expect(program.status).toBe('designing');
  });

  it('pauses the civilization when trust becomes critical', () => {
    const system = createSystem();

    const program = system.create({
      name: 'Trust Test',
      vision: 'Test trust monitoring',
      owner: 'AVOS Media',
      civilizationDomain: 'identity',
    });

    system.updateMetric(
      program.id,
      'trustScore',
      0.2,
      'Trust Engine',
    );

    expect(program.status).toBe('paused');
    expect(program.observability.alerts).toContain(
      'trust-score-critical',
    );
  });

  it('builds the civilization command dashboard', () => {
    const system = createSystem();

    system.create({
      name: 'Civilization Dashboard Test',
      vision: 'Validate command aggregation',
      owner: 'AVOS Media',
      civilizationDomain: 'governance',
      budget: 1000000,
    });

    const dashboard = system.dashboard();

    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.commandView).toHaveLength(1);
    expect(dashboard.totals.projectedEconomicValue).toBeGreaterThan(0);
  });
});