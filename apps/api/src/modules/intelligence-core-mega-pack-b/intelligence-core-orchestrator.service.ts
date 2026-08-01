import { Injectable } from '@nestjs/common';
import { KnowledgeFabricService } from './knowledge/knowledge-fabric.service';
import { DataFabricService } from './data/data-fabric.service';
import { AiAgentRuntimeService } from './agents/ai-agent-runtime.service';
import { AiOrganizationOsService } from './organization/ai-organization-os.service';

@Injectable()
export class IntelligenceCoreOrchestratorService {
  constructor(
    private readonly knowledge:
      KnowledgeFabricService,
    private readonly data:
      DataFabricService,
    private readonly runtime:
      AiAgentRuntimeService,
    private readonly organization:
      AiOrganizationOsService,
  ) {}

  bootstrap() {
    this.knowledge.upsert({
      key: 'creatoros-constitution',
      type: 'document',
      title: 'CreatorOS Constitution',
      content:
        'Foundation First, Capability First, Blueprint Driven, Human Final Authority.',
      tags: [
        'constitution',
        'governance',
        'creatoros',
      ],
      source: 'system-bootstrap',
      metadata: {
        authority: 'highest',
      },
    });

    this.knowledge.upsert({
      key: 'creatoros-living-vision',
      type: 'idea',
      title: 'CreatorOS Living Vision',
      content:
        'A continuously evolving strategic intelligence system that preserves, connects, versions, and improves ideas.',
      tags: [
        'living-vision',
        'strategy',
        'knowledge',
      ],
      source: 'system-bootstrap',
    });

    this.data.register({
      key: 'knowledge-records',
      name: 'Knowledge Records',
      domain: 'knowledge',
      schemaVersion: '1.0.0',
      classification: 'internal',
    });

    this.data.register({
      key: 'organization-operations',
      name: 'Organization Operations',
      domain: 'organization',
      schemaVersion: '1.0.0',
      classification: 'internal',
    });

    const agents = [
      {
        key: 'strategy-agent',
        name: 'Strategy Agent',
        specialty: 'strategy',
        team: 'executive-ai-council',
        capabilities: [
          'analyze',
          'prioritize',
          'recommend',
        ],
        memoryKeys: [
          'creatoros-constitution',
          'creatoros-living-vision',
        ],
      },
      {
        key: 'knowledge-agent',
        name: 'Knowledge Agent',
        specialty: 'knowledge',
        team: 'executive-ai-council',
        capabilities: [
          'retrieve',
          'connect',
          'summarize',
        ],
        memoryKeys: [
          'creatoros-living-vision',
        ],
      },
      {
        key: 'architecture-agent',
        name: 'Architecture Agent',
        specialty: 'architecture',
        team: 'executive-ai-council',
        capabilities: [
          'design',
          'validate',
          'govern',
        ],
        memoryKeys: [
          'creatoros-constitution',
        ],
      },
      {
        key: 'operations-agent',
        name: 'Operations Agent',
        specialty: 'operations',
        team: 'execution-team',
        capabilities: [
          'execute',
          'monitor',
          'report',
        ],
        memoryKeys: [
          'creatoros-constitution',
        ],
      },
    ];

    for (const agent of agents) {
      this.runtime.register(agent);
      this.runtime.activate(agent.key);
    }

    this.organization.createTeam({
      key: 'executive-ai-council',
      name: 'Executive AI Council',
      mission:
        'Coordinate strategy, knowledge, and architecture under human final authority.',
      agentKeys: [
        'strategy-agent',
        'knowledge-agent',
        'architecture-agent',
      ],
    });

    this.organization.createTeam({
      key: 'execution-team',
      name: 'AI Execution Team',
      mission:
        'Execute approved operational work.',
      agentKeys: [
        'operations-agent',
      ],
    });

    return this.status();
  }

  async runCouncilMission(input: {
    objective: string;
    context?: Record<string, unknown>;
  }) {
    return this.organization.assignMission({
      teamKey: 'executive-ai-council',
      objective: input.objective,
      context: input.context,
    });
  }

  status() {
    const agents = this.runtime.listAgents();
    const teams =
      this.organization.listTeams();

    return {
      name:
        'CreatorOS Intelligence Core Mega Pack B',
      version: 'IC-MPB-1.0.0',
      status:
        agents.length > 0 &&
        agents.every(
          (item) =>
            item.status === 'active',
        )
          ? 'operational'
          : 'degraded',
      systems: {
        knowledgeFabric: true,
        aiOrganizationOs: true,
        aiAgentRuntime: true,
        dataFabric: true,
      },
      metrics: {
        knowledge:
          this.knowledge.summary(),
        data: this.data.summary(),
        agents: agents.length,
        activeAgents:
          agents.filter(
            (item) =>
              item.status === 'active',
          ).length,
        teams: teams.length,
        tasks:
          this.runtime.listTasks().length,
      },
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },
    };
  }
}