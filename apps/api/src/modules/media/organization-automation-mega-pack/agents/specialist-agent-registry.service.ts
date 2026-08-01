import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  OrganizationBrief,
  SpecialistAgent,
} from '../organization-automation.types';

@Injectable()
export class SpecialistAgentRegistryService {
  build(brief: OrganizationBrief): SpecialistAgent[] {
    const roles =
      brief.agentRoles ??
      [
        'Creative Strategist',
        'Research Intelligence Specialist',
        'Production Coordinator',
        'Audience Intelligence Specialist',
        'IP and Brand Specialist',
        'Quality and Safety Reviewer',
        'Operations Coordinator',
        'Automation Engineer',
      ];

    const departments =
      brief.departments ??
      [
        'Creative',
        'Research',
        'Production',
        'Audience',
        'IP and Brand',
        'Quality',
        'Operations',
        'Automation',
      ];

    return roles.map((role, index) => ({
      id: randomUUID(),
      name: `${role} Agent`,
      role,
      department: departments[index % departments.length] ?? 'Operations',
      capabilities: this.capabilitiesFor(role),
      status: 'idle',
      authorityLevel:
        role.includes('Coordinator')
          ? 'supervisory'
          : role.includes('Reviewer')
            ? 'advisory'
            : 'operational',
    }));
  }

  assign(agent: SpecialistAgent, taskId: string) {
    if (agent.status === 'disabled') {
      throw new Error('Disabled agents cannot receive tasks.');
    }

    agent.currentTaskId = taskId;
    agent.status = 'assigned';
    return agent;
  }

  complete(agent: SpecialistAgent) {
    agent.currentTaskId = undefined;
    agent.status = 'completed';
    return agent;
  }

  private capabilitiesFor(role: string) {
    const normalized = role.toLowerCase();

    if (normalized.includes('creative')) {
      return ['concept-development', 'story-planning', 'creative-review'];
    }

    if (normalized.includes('research')) {
      return ['research', 'source-validation', 'insight-generation'];
    }

    if (normalized.includes('production')) {
      return ['production-planning', 'resource-coordination', 'delivery'];
    }

    if (normalized.includes('audience')) {
      return ['audience-analysis', 'distribution-planning', 'feedback-learning'];
    }

    if (normalized.includes('ip') || normalized.includes('brand')) {
      return ['ip-protection', 'brand-governance', 'licensing-readiness'];
    }

    if (normalized.includes('quality') || normalized.includes('safety')) {
      return ['quality-gates', 'safety-review', 'compliance-check'];
    }

    if (normalized.includes('automation')) {
      return ['workflow-automation', 'rule-design', 'rollback-control'];
    }

    return ['coordination', 'task-routing', 'escalation'];
  }
}