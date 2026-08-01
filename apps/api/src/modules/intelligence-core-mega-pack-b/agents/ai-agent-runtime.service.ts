import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AgentTask,
  AiAgentDefinition,
} from '../intelligence-core.types';
import { KnowledgeFabricService } from '../knowledge/knowledge-fabric.service';
import { DataFabricService } from '../data/data-fabric.service';

@Injectable()
export class AiAgentRuntimeService {
  private readonly agents = new Map<
    string,
    AiAgentDefinition
  >();

  private readonly tasks = new Map<
    string,
    AgentTask
  >();

  constructor(
    private readonly knowledge:
      KnowledgeFabricService,
    private readonly data:
      DataFabricService,
  ) {}

  register(input: {
    key: string;
    name: string;
    specialty: string;
    team: string;
    capabilities: string[];
    memoryKeys?: string[];
  }) {
    const existing = this.agents.get(input.key);

    if (existing) {
      return existing;
    }

    const agent: AiAgentDefinition = {
      id: randomUUID(),
      ...input,
      status: 'registered',
      memoryKeys: input.memoryKeys ?? [],
      createdAt: new Date().toISOString(),
    };

    this.agents.set(agent.key, agent);
    return agent;
  }

  activate(key: string) {
    const agent = this.getAgent(key);
    agent.status = 'active';
    return agent;
  }

  pause(key: string) {
    const agent = this.getAgent(key);
    agent.status = 'paused';
    return agent;
  }

  async execute(input: {
    agentKey: string;
    objective: string;
    input?: Record<string, unknown>;
  }) {
    const agent = this.getAgent(input.agentKey);

    if (agent.status !== 'active') {
      throw new Error(
        `Agent is not active: ${input.agentKey}`,
      );
    }

    const task: AgentTask = {
      id: randomUUID(),
      agentKey: input.agentKey,
      objective: input.objective,
      input: input.input ?? {},
      status: 'running',
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(task.id, task);

    const memory = agent.memoryKeys.flatMap(
      (key) => {
        try {
          return [this.knowledge.get(key)];
        } catch {
          return [];
        }
      },
    );

    const auditAsset =
      this.ensureAuditAsset();

    const result = {
      agent: agent.key,
      specialty: agent.specialty,
      objective: task.objective,
      memoryUsed: memory.map(
        (item) => item.key,
      ),
      decision:
        'completed-under-human-final-authority',
    };

    this.data.append(auditAsset.key, {
      taskId: task.id,
      agentKey: agent.key,
      objective: task.objective,
      result,
      createdAt: new Date().toISOString(),
    });

    task.result = result;
    task.status = 'completed';
    task.completedAt =
      new Date().toISOString();

    return task;
  }

  getAgent(key: string) {
    const agent = this.agents.get(key);

    if (!agent) {
      throw new Error(
        `Agent not found: ${key}`,
      );
    }

    return agent;
  }

  listAgents() {
    return [...this.agents.values()];
  }

  listTasks() {
    return [...this.tasks.values()];
  }

  private ensureAuditAsset() {
    return this.data.register({
      key: 'ai-agent-task-audit',
      name: 'AI Agent Task Audit',
      domain: 'intelligence',
      schemaVersion: '1.0.0',
      classification: 'internal',
    });
  }
}